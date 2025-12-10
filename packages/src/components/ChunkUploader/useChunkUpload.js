/**
 * 分片上传核心逻辑
 * 实现大文件分片上传、断点续传、暂停恢复等功能
 */

import { ref, computed } from 'vue'
import { isIndexedDBSupported, saveTask, getTask, deleteTask, getPendingTasks as getStoredTasks } from './storage.js'

/**
 * 上传状态枚举
 */
export const UploadStatus = {
  IDLE: 'idle',           // 空闲状态，等待选择文件
  PENDING: 'pending',     // 准备中，正在检查已上传分片
  UPLOADING: 'uploading', // 上传中
  PAUSED: 'paused',       // 已暂停
  SUCCESS: 'success',     // 上传成功
  ERROR: 'error'          // 上传失败
}

/**
 * 持久化文件大小限制（100MB）
 * 超过此大小的文件不存储文件内容到 IndexedDB，只存储元信息
 * 避免占用过多浏览器存储空间
 */
const PERSIST_FILE_LIMIT = 100 * 1024 * 1024

/**
 * 持久化节流阈值
 * 每上传 N 个分片才写一次 IndexedDB，减少 I/O 操作
 */
const PERSIST_THROTTLE = 5

/**
 * 生成文件唯一标识
 * 基于文件名、大小和最后修改时间生成，确保同一文件的唯一性
 * @param {File} file - 文件对象
 * @returns {string} 文件 ID
 */
const generateFileId = (file) => `${file.name}-${file.size}-${file.lastModified}`

/**
 * 按需创建单个分片
 * 使用 Blob.slice 方法切割文件，避免一次性加载所有分片到内存
 * @param {File} file - 文件对象
 * @param {number} index - 分片索引
 * @param {number} chunkSize - 分片大小
 * @returns {Object} 包含索引和 Blob 的分片对象
 */
const createChunk = (file, index, chunkSize) => ({
  index,
  blob: file.slice(index * chunkSize, Math.min((index + 1) * chunkSize, file.size))
})

/**
 * 计算文件总分片数
 * @param {number} fileSize - 文件大小（字节）
 * @param {number} chunkSize - 分片大小（字节）
 * @returns {number} 总分片数
 */
const getTotalChunks = (fileSize, chunkSize) => Math.ceil(fileSize / chunkSize)

/**
 * 检测是否为移动端设备
 * @returns {boolean} 是否为移动端
 */
const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

/**
 * 检测是否为微信浏览器环境
 * @returns {boolean} 是否为微信环境
 */
const isWechat = () => /MicroMessenger/i.test(navigator.userAgent)

/**
 * 让出主线程控制权
 * 在微信环境中延长间隔，防止 UI 卡死
 * @returns {Promise<void>}
 */
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, isWechat() ? 10 : 0))

/**
 * 根据运行环境获取适配的配置
 * 不同环境下调整并发数和重试次数，优化上传体验
 * @param {number} baseConcurrency - 基础并发数
 * @returns {Object} 包含 concurrency 和 retries 的配置对象
 */
const getEnvConfig = (baseConcurrency) => {
  if (isWechat()) {
    // 微信环境：最低并发（1），更多重试（3次）
    // 微信浏览器对并发请求限制较严格
    return { concurrency: 1, retries: 3 }
  }
  if (isMobile()) {
    // 移动端：降低并发（最多2），适中重试（2次）
    // 移动网络不稳定，降低并发避免失败
    return { concurrency: Math.min(baseConcurrency, 2), retries: 2 }
  }
  // PC端：使用基础并发，最少重试（1次）
  return { concurrency: baseConcurrency, retries: 1 }
}

/**
 * 分片上传 Composition API
 * @param {Object} options - 配置选项
 * @param {string} options.action - 分片上传接口地址（必填）
 * @param {string} options.checkAction - 检查已上传分片接口地址（可选）
 * @param {string} options.mergeAction - 合并分片接口地址（可选）
 * @param {number} options.chunkSize - 分片大小，默认 2MB
 * @param {number} options.concurrency - 并发上传数，默认 3
 * @param {Object} options.headers - 请求头
 * @param {Object} options.data - 额外的表单数据
 * @param {boolean} options.persistent - 是否启用持久化（断点续传）
 * @returns {Object} 上传控制对象
 */
export function useChunkUpload(options = {}) {
  const {
    action = '',                      // 分片上传接口
    checkAction = '',                 // 检查已上传分片接口
    mergeAction = '',                 // 合并分片接口
    chunkSize = 2 * 1024 * 1024,     // 默认 2MB 分片
    concurrency = 3,                  // 默认并发 3 个
    headers = {},                     // 自定义请求头
    data = {},                        // 额外的表单数据
    persistent = false                // 是否启用持久化
  } = options

  // ========== 响应式状态 ==========
  
  /** 当前上传状态 */
  const status = ref(UploadStatus.IDLE)
  
  /** 上传进度（0-100） */
  const progress = ref(0)
  
  /** 当前上传的文件对象 */
  const currentFile = ref(null)
  
  /** 当前文件的唯一标识 */
  const currentFileId = ref('')
  
  /** 已上传的分片索引数组 */
  const uploadedChunks = ref([])
  
  /** 文件总分片数 */
  const totalChunks = ref(0)
  
  /** 错误信息 */
  const errorMessage = ref('')
  
  /** 标记是否需要用户重新选择文件（大文件刷新后） */
  const needReselect = ref(false)

  /** 暂停标志（非响应式，用于控制上传流程） */
  let isPaused = false

  // ========== 计算属性 ==========
  
  /** 是否正在上传 */
  const isUploading = computed(() => status.value === UploadStatus.UPLOADING)
  
  /** 是否已暂停 */
  const isPausedState = computed(() => status.value === UploadStatus.PAUSED)
  
  /** 是否上传成功 */
  const isSuccess = computed(() => status.value === UploadStatus.SUCCESS)
  
  /** 是否上传失败 */
  const isError = computed(() => status.value === UploadStatus.ERROR)

  /**
   * 检查是否可以持久化
   * 需要同时满足：启用持久化配置 && 浏览器支持 IndexedDB
   * @returns {boolean}
   */
  const canPersist = () => persistent && isIndexedDBSupported()

  /**
   * 更新上传进度
   * 根据已上传分片数计算百分比
   */
  const updateProgress = () => {
    progress.value = Math.round((uploadedChunks.value.length / totalChunks.value) * 100)
  }

  /**
   * 持久化任务到 IndexedDB
   * 大文件只存元信息，小文件存储完整内容
   * @param {File} file - 文件对象
   * @param {string} fileId - 文件 ID
   * @param {string} newStatus - 新状态（可选，用于更新状态）
   */
  async function persistTask(file, fileId, newStatus) {
    if (!canPersist()) return

    const isSmallFile = file.size <= PERSIST_FILE_LIMIT

    if (newStatus) {
      // 只更新状态和已上传分片
      const task = await getTask(fileId)
      if (task) {
        await saveTask({ ...task, status: newStatus, uploadedChunks: uploadedChunks.value })
      }
    } else {
      // 创建新任务
      const taskData = {
        id: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedChunks: uploadedChunks.value,
        totalChunks: totalChunks.value,
        chunkSize,
        status: status.value,
        createdAt: Date.now(),
        hasFileContent: isSmallFile  // 标记是否包含文件内容
      }

      // 只有小文件才存储完整内容
      if (isSmallFile) {
        taskData.fileBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsArrayBuffer(file)
        })
      }

      await saveTask(taskData)
    }
  }

  /**
   * 上传单个分片
   * @param {Object} chunk - 分片对象 { index, blob }
   * @param {Object} opts - 上传选项 { fileId, fileName, totalChunks }
   * @returns {Promise<Object>} 服务器响应
   */
  async function uploadChunk(chunk, opts) {
    const formData = new FormData()
    formData.append('file', chunk.blob)           // 分片文件
    formData.append('fileId', opts.fileId)        // 文件唯一标识
    formData.append('fileName', opts.fileName)    // 文件名
    formData.append('chunkIndex', chunk.index)    // 分片索引
    formData.append('totalChunks', opts.totalChunks) // 总分片数
    
    // 添加额外的表单数据
    Object.entries(data).forEach(([k, v]) => formData.append(k, v))

    const res = await fetch(action, { method: 'POST', headers, body: formData })
    if (!res.ok) throw new Error(`Chunk ${chunk.index} failed`)
    return res.json()
  }

  /**
   * 检查已上传的分片
   * 用于断点续传，避免重复上传
   * @param {string} fileId - 文件 ID
   * @returns {Promise<Array>} 已上传的分片索引数组
   */
  async function checkUploaded(fileId) {
    if (!checkAction) return []
    try {
      const res = await fetch(`${checkAction}?fileId=${fileId}`)
      return res.ok ? (await res.json()).uploadedChunks || [] : []
    } catch {
      return []
    }
  }

  /**
   * 合并所有分片
   * 所有分片上传完成后调用，服务器端合并成完整文件
   * @param {string} fileId - 文件 ID
   * @param {string} fileName - 文件名
   * @returns {Promise<Object>} 合并结果
   */
  async function merge(fileId, fileName) {
    if (!mergeAction) return { success: true }
    const res = await fetch(mergeAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ fileId, fileName, totalChunks: totalChunks.value, ...data })
    })
    if (!res.ok) throw new Error('Merge failed')
    return res.json()
  }

  /**
   * 带重试机制的分片上传
   * 失败后自动重试，使用指数退避策略
   * @param {Object} chunk - 分片对象
   * @param {Object} opts - 上传选项
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<Object>} 上传结果
   */
  async function uploadChunkWithRetry(chunk, opts, maxRetries) {
    let lastError
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await uploadChunk(chunk, opts)
      } catch (e) {
        lastError = e
        if (i < maxRetries) {
          // 重试前等待，指数退避：1s, 2s, 3s...
          await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
        }
      }
    }
    throw lastError
  }

  /**
   * 并发上传分片
   * 使用工作队列模式，按需创建分片，避免内存占用
   * @param {File} file - 文件对象
   * @param {string} fileId - 文件 ID
   * @param {Array<number>} pendingIndexes - 待上传的分片索引数组
   */
  async function doUpload(file, fileId, pendingIndexes) {
    isPaused = false
    status.value = UploadStatus.UPLOADING
    const queue = [...pendingIndexes]  // 复制队列，避免修改原数组
    const errors = []                   // 收集错误
    const opts = { fileId, fileName: file.name, totalChunks: totalChunks.value }

    // 根据运行环境调整并发数和重试次数
    const envConfig = getEnvConfig(concurrency)
    let uploadCount = 0  // 已上传计数，用于节流持久化

    /**
     * 工作线程函数
     * 从队列中取出分片索引并上传，直到队列为空或被暂停/出错
     */
    const worker = async () => {
      while (queue.length && !isPaused && !errors.length) {
        const index = queue.shift()  // 取出一个分片索引
        if (index === undefined) break

        // 让出主线程，防止 UI 卡死（特别是在微信环境）
        await yieldToMain()

        // 按需创建分片，避免一次性加载所有分片到内存
        const chunk = createChunk(file, index, chunkSize)
        try {
          // 上传分片，带重试机制
          await uploadChunkWithRetry(chunk, opts, envConfig.retries)
          uploadedChunks.value.push(index)
          uploadCount++
          updateProgress()

          // 节流持久化：每 N 个分片写一次 IndexedDB
          // 避免频繁 I/O 操作影响性能
          if (canPersist() && uploadCount % PERSIST_THROTTLE === 0) {
            await persistTask(file, fileId, UploadStatus.UPLOADING)
          }
        } catch (e) {
          errors.push(e)  // 收集错误，停止所有工作线程
        }
      }
    }

    // 创建多个工作线程并发上传
    // 工作线程数 = min(配置的并发数, 待上传分片数)
    await Promise.all(Array(Math.min(envConfig.concurrency, queue.length || 1)).fill().map(worker))

    // 最后确保持久化一次（如果有剩余未持久化的分片）
    if (canPersist() && uploadCount % PERSIST_THROTTLE !== 0) {
      await persistTask(file, fileId, UploadStatus.UPLOADING)
    }

    // 如果有错误，抛出第一个错误
    if (errors.length) throw errors[0]
  }

  /**
   * 完成上传
   * 合并所有分片，更新状态，清理持久化数据
   * @param {File} file - 文件对象
   * @param {string} fileId - 文件 ID
   * @returns {Promise<Object>} 合并结果
   */
  async function finishUpload(file, fileId) {
    const result = await merge(fileId, file.name)
    status.value = UploadStatus.SUCCESS
    progress.value = 100
    // 上传成功后删除持久化数据
    if (canPersist()) await deleteTask(fileId)
    return result
  }

  /**
   * 开始上传文件
   * 主流程：检查已上传分片 -> 持久化任务 -> 并发上传 -> 合并分片
   * @param {File} file - 要上传的文件
   * @returns {Promise<Object>} 上传结果或暂停标记
   */
  async function startUpload(file) {
    if (!file || !action) return

    try {
      // 初始化状态
      currentFile.value = file
      currentFileId.value = generateFileId(file)
      status.value = UploadStatus.PENDING
      progress.value = 0
      errorMessage.value = ''
      needReselect.value = false

      // 计算总分片数
      totalChunks.value = getTotalChunks(file.size, chunkSize)

      // 检查服务器已上传的分片（断点续传）
      const uploaded = await checkUploaded(currentFileId.value)
      uploadedChunks.value = [...uploaded]

      // 获取待上传的分片索引
      const allIndexes = Array.from({ length: totalChunks.value }, (_, i) => i)
      const pendingIndexes = allIndexes.filter((i) => !uploaded.includes(i))

      // 如果所有分片都已上传，直接合并
      if (!pendingIndexes.length) {
        progress.value = 100
        return await finishUpload(file, currentFileId.value)
      }

      // 持久化任务（用于断点续传）
      await persistTask(file, currentFileId.value)
      updateProgress()
      
      // 并发上传待上传的分片
      await doUpload(file, currentFileId.value, pendingIndexes)

      // 如果被暂停，保存状态并返回
      if (isPaused) {
        status.value = UploadStatus.PAUSED
        await persistTask(file, currentFileId.value, UploadStatus.PAUSED)
        return { paused: true }
      }

      // 上传完成，合并分片
      return await finishUpload(file, currentFileId.value)
    } catch (e) {
      // 上传失败，保存错误状态
      status.value = UploadStatus.ERROR
      errorMessage.value = e.message
      if (currentFile.value && currentFileId.value) {
        await persistTask(currentFile.value, currentFileId.value, UploadStatus.ERROR)
      }
      throw e
    }
  }

  /**
   * 暂停上传
   * 设置暂停标志，工作线程会检测并停止上传
   */
  function pause() {
    if (status.value === UploadStatus.UPLOADING) {
      isPaused = true
      status.value = UploadStatus.PAUSED
    }
  }

  /**
   * 恢复上传
   * 继续上传剩余的分片
   * @returns {Promise<Object>} 上传结果
   */
  async function resume() {
    if (status.value !== UploadStatus.PAUSED || !currentFile.value) return

    const file = currentFile.value
    // 计算剩余待上传的分片
    const allIndexes = Array.from({ length: totalChunks.value }, (_, i) => i)
    const pendingIndexes = allIndexes.filter((i) => !uploadedChunks.value.includes(i))

    // 如果没有剩余分片，直接合并
    if (!pendingIndexes.length) return await finishUpload(file, currentFileId.value)

    try {
      // 继续上传剩余分片
      await doUpload(file, currentFileId.value, pendingIndexes)
      // 如果没有被再次暂停，完成上传
      if (!isPaused) return await finishUpload(file, currentFileId.value)
    } catch (e) {
      status.value = UploadStatus.ERROR
      errorMessage.value = e.message
      throw e
    }
  }

  /**
   * 取消上传
   * 清理所有状态和持久化数据
   */
  async function cancel() {
    isPaused = true
    // 删除持久化数据
    if (canPersist() && currentFileId.value) await deleteTask(currentFileId.value)

    // 重置所有状态
    status.value = UploadStatus.IDLE
    progress.value = 0
    currentFile.value = null
    currentFileId.value = ''
    uploadedChunks.value = []
    totalChunks.value = 0
    errorMessage.value = ''
    needReselect.value = false
  }

  /**
   * 重试上传
   * 使用当前文件重新开始上传
   * @returns {Promise<Object>} 上传结果
   */
  async function retry() {
    if (currentFile.value) {
      return startUpload(currentFile.value)
    }
    return null
  }

  /**
   * 从 IndexedDB 恢复上传任务
   * 小文件直接恢复，大文件需要用户重新选择
   * @param {string} taskId - 任务 ID
   * @returns {Promise<Object>} 恢复结果
   */
  async function resumeFromStorage(taskId) {
    if (!canPersist()) return

    const task = await getTask(taskId)
    if (!task) throw new Error('Task not found')

    // 恢复任务状态
    currentFileId.value = task.id
    uploadedChunks.value = task.uploadedChunks || []
    totalChunks.value = task.totalChunks
    updateProgress()

    if (task.hasFileContent && task.fileBuffer) {
      // 小文件：直接从 IndexedDB 恢复文件内容
      const blob = new Blob([task.fileBuffer], { type: task.fileType })
      currentFile.value = new File([blob], task.fileName, { type: task.fileType })
      status.value = UploadStatus.PAUSED
      return resume()
    } else {
      // 大文件：只存储了元信息，需要用户重新选择文件
      needReselect.value = true
      status.value = UploadStatus.PAUSED
      return { needReselect: true, fileName: task.fileName, fileSize: task.fileSize }
    }
  }

  /**
   * 用户重新选择文件后继续上传
   * 验证文件是否匹配，然后继续上传
   * @param {File} file - 用户选择的文件
   * @returns {Promise<Object>} 上传结果
   */
  async function continueWithFile(file) {
    if (!needReselect.value) return

    const fileId = generateFileId(file)
    // 验证文件是否与之前的任务匹配
    if (fileId !== currentFileId.value) {
      throw new Error('文件不匹配，请选择相同的文件')
    }

    currentFile.value = file
    needReselect.value = false
    return resume()
  }

  /**
   * 获取所有待处理的上传任务
   * 用于展示未完成的上传列表
   * @returns {Promise<Array>} 任务列表
   */
  async function getPendingTasks() {
    if (!canPersist()) return []
    const tasks = await getStoredTasks()
    // 转换为简化的任务信息
    return tasks.map((t) => ({
      id: t.id,
      fileName: t.fileName,
      fileSize: t.fileSize,
      progress: Math.round((t.uploadedChunks.length / t.totalChunks) * 100),
      status: t.status,
      createdAt: t.createdAt,
      hasFileContent: t.hasFileContent  // 标记是否可以直接恢复
    }))
  }

  // ========== 返回公开的 API ==========
  return {
    // 响应式状态
    status,           // 当前上传状态
    progress,         // 上传进度（0-100）
    currentFile,      // 当前文件对象
    errorMessage,     // 错误信息
    needReselect,     // 是否需要重新选择文件
    
    // 计算属性
    isUploading,      // 是否正在上传
    isPausedState,    // 是否已暂停
    isSuccess,        // 是否上传成功
    isError,          // 是否上传失败
    
    // 方法
    startUpload,      // 开始上传
    pause,            // 暂停上传
    resume,           // 恢复上传
    cancel,           // 取消上传
    retry,            // 重试上传
    resumeFromStorage,   // 从存储恢复
    continueWithFile,    // 继续上传（大文件）
    getPendingTasks      // 获取待处理任务
  }
}
