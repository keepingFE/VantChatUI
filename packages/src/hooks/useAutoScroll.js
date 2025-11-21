// File: packages/src/hooks/useAutoScroll.js
import { watch, nextTick } from 'vue'

/**
 * 自动滚动 Hook
 * @param {Ref} scrollRef - DOM 元素引用
 * @param {Ref} dataList - 消息数组的响应式引用
 * @returns {Object} { scrollToBottom: Function }
 */
export function useAutoScroll(scrollRef, dataList) {
  /**
   * 滚动到底部的方法
   * @param {boolean} smooth - 是否平滑滚动，默认 true
   */
  const scrollToBottom = (smooth = true) => {
    nextTick(() => {
      if (scrollRef.value) {
        // 使用 scrollTop 方式，更可靠
        const scrollHeight = scrollRef.value.scrollHeight
        const clientHeight = scrollRef.value.clientHeight
        const maxScrollTop = scrollHeight - clientHeight

        if (smooth) {
          scrollRef.value.scrollTo({
            top: maxScrollTop,
            behavior: 'smooth'
          })
        } else {
          scrollRef.value.scrollTop = maxScrollTop
        }

        // 额外延迟确保图片等资源加载完成后再次滚动
        setTimeout(() => {
          if (scrollRef.value) {
            const newScrollHeight = scrollRef.value.scrollHeight
            const newClientHeight = scrollRef.value.clientHeight
            const newMaxScrollTop = newScrollHeight - newClientHeight
            scrollRef.value.scrollTop = newMaxScrollTop
          }
        }, 200)

        // 再次延迟确保打字机效果等动态内容完全渲染
        setTimeout(() => {
          if (scrollRef.value) {
            const finalScrollHeight = scrollRef.value.scrollHeight
            const finalClientHeight = scrollRef.value.clientHeight
            const finalMaxScrollTop = finalScrollHeight - finalClientHeight
            scrollRef.value.scrollTop = finalMaxScrollTop
          }
        }, 500)
      }
    })
  }

  // 监听数据变化，自动滚动到底部
  watch(
    dataList,
    () => {
      scrollToBottom()
    },
    { deep: true }
  )

  return {
    scrollToBottom
  }
}

