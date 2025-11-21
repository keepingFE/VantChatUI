// File: packages/src/hooks/useAutoScroll.js
import { watch, nextTick } from 'vue'

/**
 * 自动滚动 Hook
 * @param {Ref} scrollRef - DOM 元素引用
 * @param {Ref} dataList - 消息数组的响应式引用
 * @returns {Object} { scrollToBottom: Function, cleanup: Function }
 */
export function useAutoScroll(scrollRef, dataList) {
  // 判断 scrollRef 是 ref 对象还是直接的 DOM 元素
  const isRefObject = scrollRef && typeof scrollRef === 'object' && 'value' in scrollRef

  console.log('[useAutoScroll] Initialized with', {
    scrollRef,
    scrollRefValue: scrollRef?.value,
    scrollRefType: typeof scrollRef,
    isRefObject,
    isDOMElement: scrollRef instanceof HTMLElement,
    dataList: dataList?.value?.length || 0
  })

  // 定时器
  let imgTimer = null
  let typeTimer = null
  let longDelayTimer = null
  let mutationObserver = null
  let mutationDebounceTimer = null
  let watchStop = null

  /**
   * 获取实际的 DOM 元素
   * @returns {HTMLElement|null}
   */
  const getElement = () => {
    if (!scrollRef) return null
    // 如果是 ref 对象，返回 ref.value
    if (isRefObject) {
      return scrollRef.value
    }
    // 如果是 DOM 元素，直接返回
    if (scrollRef instanceof HTMLElement) {
      return scrollRef
    }
    return null
  }

  /**
   * 执行滚动到底部的核心逻辑
   * @param {boolean} smooth - 是否平滑滚动
   */
  const performScroll = (smooth = true) => {
    const el = getElement()

    console.log('[useAutoScroll] performScroll - checking element', {
      el,
      hasElement: !!el,
      scrollHeight: el?.scrollHeight,
      clientHeight: el?.clientHeight
    })

    if (!el) {
      console.warn('[useAutoScroll] DOM element is null')
      return
    }
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const currentScrollTop = el.scrollTop
    const maxScrollTop = scrollHeight - clientHeight

    console.log('[useAutoScroll] performScroll details', {
      smooth,
      scrollHeight,
      clientHeight,
      currentScrollTop,
      maxScrollTop,
      needScroll: maxScrollTop > 0
    })

    if (maxScrollTop <= 0) {
      console.log('[useAutoScroll] No need to scroll, content fits in viewport')
      return // 不需要滚动
    }

    if (smooth) {
      el.scrollTo({ top: maxScrollTop, behavior: 'smooth' })
    } else {
      el.scrollTop = maxScrollTop
    }

    console.log('[useAutoScroll] ✅ Scrolled to', el.scrollTop, '/', maxScrollTop)
  }

  /**
   * 滚动到底部（带多次延迟确保内容加载完成）
   * @param {boolean} smooth - 是否平滑滚动，默认 true
   */
  const scrollToBottom = (smooth = true) => {
    console.log('[useAutoScroll] scrollToBottom called')

    // 立即滚动 - 使用 requestAnimationFrame 确保 DOM 已更新
    nextTick(() => {
      requestAnimationFrame(() => {
        console.log('[useAutoScroll] Immediate scroll (nextTick + rAF)')
        performScroll(smooth)
      })
    })

    // 图片等异步资源加载后再次滚动（150ms）
    if (imgTimer) clearTimeout(imgTimer)
    imgTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          console.log('[useAutoScroll] Delayed scroll (150ms)')
          performScroll(false)
        })
      })
    }, 150)

    // 打字机等更长延迟内容再次滚动（350ms）
    if (typeTimer) clearTimeout(typeTimer)
    typeTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          console.log('[useAutoScroll] Delayed scroll (350ms)')
          performScroll(false)
        })
      })
    }, 350)

    // 最后一次确保滚动（600ms）- 处理慢速网络或大图片
    if (longDelayTimer) clearTimeout(longDelayTimer)
    longDelayTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          console.log('[useAutoScroll] Delayed scroll (600ms)')
          performScroll(false)
        })
      })
    }, 600)
  }

  /**
   * 清理所有资源
   */
  const cleanup = () => {
    if (imgTimer) {
      clearTimeout(imgTimer)
      imgTimer = null
    }
    if (typeTimer) {
      clearTimeout(typeTimer)
      typeTimer = null
    }
    if (longDelayTimer) {
      clearTimeout(longDelayTimer)
      longDelayTimer = null
    }
    if (mutationDebounceTimer) {
      clearTimeout(mutationDebounceTimer)
      mutationDebounceTimer = null
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
      mutationObserver = null
    }
    if (watchStop) {
      watchStop()
      watchStop = null
    }
  }

  /**
   * 初始化 MutationObserver，监听子节点、文本变化等导致的高度变化
   */
  const setupMutationObserver = () => {
    const el = getElement()
    if (!el) {
      console.warn('[useAutoScroll] Cannot setup MutationObserver, element is null')
      return
    }

    console.log('[useAutoScroll] Setting up MutationObserver on', el)

    // 创建 MutationObserver 实例（带防抖）
    mutationObserver = new MutationObserver(() => {
      // 防抖处理，避免频繁触发
      if (mutationDebounceTimer) clearTimeout(mutationDebounceTimer)
      mutationDebounceTimer = setTimeout(() => {
        // DOM 发生变化时，自动滚动到底部
        nextTick(() => performScroll(true))
      }, 50) // 50ms 防抖
    })

    // 配置观察选项
    const config = {
      childList: true,      // 监听子节点的添加和删除
      subtree: true,        // 监听所有后代节点
      attributes: false,    // 不监听属性变化
      characterData: true   // 监听文本内容变化（打字机效果）
    }

    // 开始观察
    mutationObserver.observe(el, config)
    console.log('[useAutoScroll] MutationObserver started')
  }

  // 监听消息列表变化，自动滚动到底部
  watchStop = watch(
    dataList,
    () => {
      console.debug('[useAutoScroll] dataList changed, scrolling to bottom')
      scrollToBottom(true)
    },
    { deep: true }
  )

  // 初始化 MutationObserver
  nextTick(() => {
    setupMutationObserver()
  })

  return {
    scrollToBottom,
    cleanup
  }
}

