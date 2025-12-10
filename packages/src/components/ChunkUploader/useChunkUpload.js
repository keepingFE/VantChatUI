// 分片上传核心逻辑

import { ref, computed } from 'vue'
import { isIndexedDBSupported, saveTask, getTask, deleteTask, getPendingTasks as getStoredTasks } from './storage.js'

export const UploadStatus = {
  IDLE: 'idle',
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PAUSED: 'paused',
  SUCCESS: 'success',
  ERROR: 'error'
}

// 持久化文件大小限制（100MB），超过此大小不存储文件内容
const PERSIST_FILE_LIMIT = 100 * 1024 * 1024
// 持久化节流：每上传 N 个分片才写一次 IndexedDB
const PERSIST_THROTTLE = 5

const generateFileId = (file) => `${file.name}-${file.size}-${file.lastModified}`

// 按需创建单个分片
const createChunk = (file, index, chunkSize) => ({
  index,
  blob: file.slice(index * chunkSize, Math.min((index + 1) * chunkSize, file.size))
})

const getTotalChunks = (fileSize, chunkSize) => Math.ceil(fileSize / chunkSize)

// 检测是否为移动端
const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

// 检测是否为微信环境
const isWechat = () => /MicroMessenger/i.test(navigator.userAgent)

// 让出主线程，防止卡死 UI（微信环境延长间隔）
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, isWechat() ? 10 : 0))

// 获取环境适配的配置
const getEnvConfig = (baseConcurrency) => {
  if (isWechat()) {
    // 微信环境：最低并发，更保守
    return { concurrency: 1, retries: 3 }
  }
  if (isMobile()) {
    // 移动端：降低并发
    return { concurrency: Math.min(baseConcurrency, 2), retries: 2 }
  }
  // PC端
  return { concurrency: baseConcurrency, retries: 1 }
}

export function useChunkUpload(options = {}) {
  const {
    action = '',
    checkAction = '',
    mergeAction = '',
    chunkSize = 2 * 1024 * 1024,
    concurrency = 3,
    headers = {},
    data = {},
    persistent = false
  } = options

  const status = ref(UploadStatus.IDLE)
  const progress = ref(0)
  const currentFile = ref(null)
  const currentFileId = ref('')
  const uploadedChunks = ref([])
  const totalChunks = ref(0)
  const errorMessage = ref('')
  // 标记是否需要用户重新选择文件（大文件刷新后）
  const needReselect = ref(false)

  let isPaused = false

  const isUploading = computed(() => status.value === UploadStatus.UPLOADING)
  const isPausedState = computed(() => status.value === UploadStatus.PAUSED)
  const isSuccess = computed(() => status.value === UploadStatus.SUCCESS)
  const isError = computed(() => status.value === UploadStatus.ERROR)

  const canPersist = () => persistent && isIndexedDBSupported()

  const updateProgress = () => {
    progress.value = Math.round((uploadedChunks.value.length / totalChunks.value) * 100)
  }

  // 持久化任务（大文件只存元信息，小文件存内容）
  async function persistTask(file, fileId, newStatus) {
    if (!canPersist()) return

    const isSmallFile = file.size <= PERSIST_FILE_LIMIT

    if (newStatus) {
      const task = await getTask(fileId)
      if (task) {
        await saveTask({ ...task, status: newStatus, uploadedChunks: uploadedChunks.value })
      }
    } else {
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
        hasFileContent: isSmallFile
      }

      // 只有小文件才存储内容
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

  async function uploadChunk(chunk, opts) {
    const formData = new FormData()
    formData.append('file', chunk.blob)
    formData.append('fileId', opts.fileId)
    formData.append('fileName', opts.fileName)
    formData.append('chunkIndex', chunk.index)
    formData.append('totalChunks', opts.totalChunks)
    Object.entries(data).forEach(([k, v]) => formData.append(k, v))

    const res = await fetch(action, { method: 'POST', headers, body: formData })
    if (!res.ok) throw new Error(`Chunk ${chunk.index} failed`)
    return res.json()
  }

  async function checkUploaded(fileId) {
    if (!checkAction) return []
    try {
      const res = await fetch(`${checkAction}?fileId=${fileId}`)
      return res.ok ? (await res.json()).uploadedChunks || [] : []
    } catch {
      return []
    }
  }

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

  // 带重试的分片上传
  async function uploadChunkWithRetry(chunk, opts, maxRetries) {
    let lastError
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await uploadChunk(chunk, opts)
      } catch (e) {
        lastError = e
        if (i < maxRetries) {
          // 重试前等待，指数退避
          await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
        }
      }
    }
    throw lastError
  }

  // 并发上传（按需创建分片，避免内存占用）
  async function doUpload(file, fileId, pendingIndexes) {
    isPaused = false
    status.value = UploadStatus.UPLOADING
    const queue = [...pendingIndexes]
    const errors = []
    const opts = { fileId, fileName: file.name, totalChunks: totalChunks.value }

    // 根据环境调整并发和重试
    const envConfig = getEnvConfig(concurrency)
    let uploadCount = 0

    const worker = async () => {
      while (queue.length && !isPaused && !errors.length) {
        const index = queue.shift()
        if (index === undefined) break

        // 让出主线程，防止 UI 卡死
        await yieldToMain()

        const chunk = createChunk(file, index, chunkSize)
        try {
          await uploadChunkWithRetry(chunk, opts, envConfig.retries)
          uploadedChunks.value.push(index)
          uploadCount++
          updateProgress()

          // 节流持久化：每 N 个分片写一次
          if (canPersist() && uploadCount % PERSIST_THROTTLE === 0) {
            await persistTask(file, fileId, UploadStatus.UPLOADING)
          }
        } catch (e) {
          errors.push(e)
        }
      }
    }

    await Promise.all(Array(Math.min(envConfig.concurrency, queue.length || 1)).fill().map(worker))

    // 最后确保持久化一次
    if (canPersist() && uploadCount % PERSIST_THROTTLE !== 0) {
      await persistTask(file, fileId, UploadStatus.UPLOADING)
    }

    if (errors.length) throw errors[0]
  }

  async function finishUpload(file, fileId) {
    const result = await merge(fileId, file.name)
    status.value = UploadStatus.SUCCESS
    progress.value = 100
    if (canPersist()) await deleteTask(fileId)
    return result
  }

  async function startUpload(file) {
    if (!file || !action) return

    try {
      currentFile.value = file
      currentFileId.value = generateFileId(file)
      status.value = UploadStatus.PENDING
      progress.value = 0
      errorMessage.value = ''
      needReselect.value = false

      totalChunks.value = getTotalChunks(file.size, chunkSize)

      const uploaded = await checkUploaded(currentFileId.value)
      uploadedChunks.value = [...uploaded]

      // 获取待上传的分片索引
      const allIndexes = Array.from({ length: totalChunks.value }, (_, i) => i)
      const pendingIndexes = allIndexes.filter((i) => !uploaded.includes(i))

      if (!pendingIndexes.length) {
        progress.value = 100
        return await finishUpload(file, currentFileId.value)
      }

      await persistTask(file, currentFileId.value)
      updateProgress()
      await doUpload(file, currentFileId.value, pendingIndexes)

      if (isPaused) {
        status.value = UploadStatus.PAUSED
        await persistTask(file, currentFileId.value, UploadStatus.PAUSED)
        return { paused: true }
      }

      return await finishUpload(file, currentFileId.value)
    } catch (e) {
      status.value = UploadStatus.ERROR
      errorMessage.value = e.message
      if (currentFile.value && currentFileId.value) {
        await persistTask(currentFile.value, currentFileId.value, UploadStatus.ERROR)
      }
      throw e
    }
  }

  function pause() {
    if (status.value === UploadStatus.UPLOADING) {
      isPaused = true
      status.value = UploadStatus.PAUSED
    }
  }

  async function resume() {
    if (status.value !== UploadStatus.PAUSED || !currentFile.value) return

    const file = currentFile.value
    const allIndexes = Array.from({ length: totalChunks.value }, (_, i) => i)
    const pendingIndexes = allIndexes.filter((i) => !uploadedChunks.value.includes(i))

    if (!pendingIndexes.length) return await finishUpload(file, currentFileId.value)

    try {
      await doUpload(file, currentFileId.value, pendingIndexes)
      if (!isPaused) return await finishUpload(file, currentFileId.value)
    } catch (e) {
      status.value = UploadStatus.ERROR
      errorMessage.value = e.message
      throw e
    }
  }

  async function cancel() {
    isPaused = true
    if (canPersist() && currentFileId.value) await deleteTask(currentFileId.value)

    status.value = UploadStatus.IDLE
    progress.value = 0
    currentFile.value = null
    currentFileId.value = ''
    uploadedChunks.value = []
    totalChunks.value = 0
    errorMessage.value = ''
    needReselect.value = false
  }

  async function retry() {
    if (currentFile.value) {
      return startUpload(currentFile.value)
    }
    return null
  }

  // 从存储恢复（大文件需要用户重新选择）
  async function resumeFromStorage(taskId) {
    if (!canPersist()) return

    const task = await getTask(taskId)
    if (!task) throw new Error('Task not found')

    currentFileId.value = task.id
    uploadedChunks.value = task.uploadedChunks || []
    totalChunks.value = task.totalChunks
    updateProgress()

    if (task.hasFileContent && task.fileBuffer) {
      // 小文件：直接恢复
      const blob = new Blob([task.fileBuffer], { type: task.fileType })
      currentFile.value = new File([blob], task.fileName, { type: task.fileType })
      status.value = UploadStatus.PAUSED
      return resume()
    } else {
      // 大文件：需要用户重新选择
      needReselect.value = true
      status.value = UploadStatus.PAUSED
      return { needReselect: true, fileName: task.fileName, fileSize: task.fileSize }
    }
  }

  // 用户重新选择文件后继续上传
  async function continueWithFile(file) {
    if (!needReselect.value) return

    const fileId = generateFileId(file)
    if (fileId !== currentFileId.value) {
      throw new Error('文件不匹配，请选择相同的文件')
    }

    currentFile.value = file
    needReselect.value = false
    return resume()
  }

  async function getPendingTasks() {
    if (!canPersist()) return []
    const tasks = await getStoredTasks()
    return tasks.map((t) => ({
      id: t.id,
      fileName: t.fileName,
      fileSize: t.fileSize,
      progress: Math.round((t.uploadedChunks.length / t.totalChunks) * 100),
      status: t.status,
      createdAt: t.createdAt,
      hasFileContent: t.hasFileContent
    }))
  }

  return {
    status, progress, currentFile, errorMessage, needReselect,
    isUploading, isPausedState, isSuccess, isError,
    startUpload, pause, resume, cancel, retry,
    resumeFromStorage, continueWithFile, getPendingTasks
  }
}
