// IndexedDB 存储封装

const DB_NAME = 'ChunkUploaderDB'
const DB_VERSION = 1
const STORE_NAME = 'uploadTasks'

let db = null

// 打开数据库
async function openDB() {
  if (db) return db

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve((db = req.result))
    req.onupgradeneeded = (e) => {
      const database = e.target.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// 执行事务操作
async function withStore(mode, callback) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const req = callback(store)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export const isIndexedDBSupported = () => {
  try {
    return !!window.indexedDB
  } catch {
    return false
  }
}

export const saveTask = (task) => withStore('readwrite', (s) => s.put(task))
export const getTask = (id) => withStore('readonly', (s) => s.get(id))
export const deleteTask = (id) => withStore('readwrite', (s) => s.delete(id))

export async function getPendingTasks() {
  const all = await withStore('readonly', (s) => s.getAll())
  return all.filter((t) => t.status === 'pending' || t.status === 'paused' || t.status === 'uploading')
}
