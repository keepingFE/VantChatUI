/**
 * IndexedDB 存储封装
 * 用于持久化上传任务，支持断点续传和页面刷新后恢复
 */

// 数据库名称
const DB_NAME = 'ChunkUploaderDB'
// 数据库版本号
const DB_VERSION = 1
// 对象存储名称（类似表名）
const STORE_NAME = 'uploadTasks'

// 数据库实例缓存
let db = null

/**
 * 打开 IndexedDB 数据库
 * @returns {Promise<IDBDatabase>} 数据库实例
 */
async function openDB() {
  // 如果已经打开，直接返回缓存的实例
  if (db) return db

  return new Promise((resolve, reject) => {
    // 打开数据库，如果不存在会自动创建
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    
    // 打开失败
    req.onerror = () => reject(req.error)
    
    // 打开成功
    req.onsuccess = () => resolve((db = req.result))
    
    // 数据库升级（首次创建或版本号变更时触发）
    req.onupgradeneeded = (e) => {
      const database = e.target.result
      // 如果对象存储不存在，则创建
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        // 创建对象存储，使用 'id' 作为主键
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * 执行数据库事务操作的通用方法
 * @param {string} mode - 事务模式：'readonly' 或 'readwrite'
 * @param {Function} callback - 回调函数，接收 store 对象并返回请求
 * @returns {Promise<any>} 操作结果
 */
async function withStore(mode, callback) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    // 创建事务
    const tx = database.transaction(STORE_NAME, mode)
    // 获取对象存储
    const store = tx.objectStore(STORE_NAME)
    // 执行回调获取请求
    const req = callback(store)
    // 请求成功
    req.onsuccess = () => resolve(req.result)
    // 请求失败
    req.onerror = () => reject(req.error)
  })
}

/**
 * 检测浏览器是否支持 IndexedDB
 * @returns {boolean} 是否支持
 */
export const isIndexedDBSupported = () => {
  try {
    return !!window.indexedDB
  } catch {
    return false
  }
}

/**
 * 保存或更新上传任务
 * @param {Object} task - 任务对象
 * @returns {Promise<any>} 操作结果
 */
export const saveTask = (task) => withStore('readwrite', (s) => s.put(task))

/**
 * 根据 ID 获取上传任务
 * @param {string} id - 任务 ID
 * @returns {Promise<Object|undefined>} 任务对象或 undefined
 */
export const getTask = (id) => withStore('readonly', (s) => s.get(id))

/**
 * 根据 ID 删除上传任务
 * @param {string} id - 任务 ID
 * @returns {Promise<any>} 操作结果
 */
export const deleteTask = (id) => withStore('readwrite', (s) => s.delete(id))

/**
 * 获取所有待处理的上传任务（未完成的任务）
 * @returns {Promise<Array>} 待处理任务列表
 */
export async function getPendingTasks() {
  // 获取所有任务
  const all = await withStore('readonly', (s) => s.getAll())
  // 过滤出未完成的任务
  return all.filter((t) => t.status === 'pending' || t.status === 'paused' || t.status === 'uploading')
}
