// File: packages/src/hooks/useTypewriter.js
// 打字机效果 Hook

import { ref, watch } from 'vue'

/**
 * 打字机效果 Hook
 * @param {String} fullText - 完整文本
 * @param {Number} speed - 打字速度（毫秒/字符）
 * @returns {Object} { displayText, isTyping, startTyping, stopTyping }
 */
export function useTypewriter(fullText = '', speed = 50) {
  const displayText = ref('')
  const isTyping = ref(false)
  let currentIndex = 0
  let timer = null

  // 开始打字
  const startTyping = (text = fullText) => {
    // 重置状态
    displayText.value = ''
    currentIndex = 0
    isTyping.value = true

    // 清除之前的定时器
    if (timer) {
      clearInterval(timer)
    }

    // 开始逐字显示
    timer = setInterval(() => {
      if (currentIndex < text.length) {
        displayText.value += text[currentIndex]
        currentIndex++
      } else {
        // 打字完成
        clearInterval(timer)
        timer = null
        isTyping.value = false
      }
    }, speed)
  }

  // 停止打字
  const stopTyping = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isTyping.value = false
  }

  // 立即显示全部文本
  const showAll = (text = fullText) => {
    stopTyping()
    displayText.value = text
  }

  return {
    displayText,
    isTyping,
    startTyping,
    stopTyping,
    showAll
  }
}

