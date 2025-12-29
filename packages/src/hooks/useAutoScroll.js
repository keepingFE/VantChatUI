// File: packages/src/hooks/useAutoScroll.js
import { watch, nextTick, onMounted, onBeforeUnmount } from "vue";

/**
 * 自动滚动 Hook
 * @param {Ref} scrollRef - DOM 元素引用
 * @param {Ref} dataList - 消息数组的响应式引用
 * @returns {Object} { scrollToBottom: Function, cleanup: Function }
 */
export function useAutoScroll(scrollRef, dataList) {
  // 判断 scrollRef 是 ref 对象还是直接的 DOM 元素
  const isRefObject =
    scrollRef && typeof scrollRef === "object" && "value" in scrollRef;
  // 定时器
  let imgTimer = null;
  let typeTimer = null;
  let longDelayTimer = null;
  let mutationObserver = null;
  let mutationDebounceTimer = null;
  let watchStop = null;

  /**
   * 获取实际的 DOM 元素
   * @returns {HTMLElement|null}
   */
  const getElement = () => {
    if (!scrollRef) return null;
    let el = null;

    // 如果是 ref 对象，取 ref.value
    if (isRefObject) {
      el = scrollRef.value;
    } else if (scrollRef instanceof HTMLElement) {
      // 如果是 DOM 元素，直接使用
      el = scrollRef;
    } else {
      // 其他情况（可能是直接传入的组件实例等）
      el = scrollRef;
    }

    // 处理 Vue 组件实例，取其根 DOM 元素 ($el)
    if (el && el.$el instanceof HTMLElement) {
      return el.$el;
    }

    // 如果本身就是 HTML 元素
    if (el instanceof HTMLElement) {
      return el;
    }

    return null;
  };

  /**
   * 执行滚动到底部的核心逻辑
   * @param {boolean} smooth - 是否平滑滚动
   */
  const performScroll = (smooth = true) => {
    const el = getElement();
    if (!el) {
      return;
    }
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    if (maxScrollTop <= 0) {
      return; // 不需要滚动
    }
    if (smooth) {
      el.scrollTo({ top: maxScrollTop, behavior: "smooth" });
    } else {
      el.scrollTop = maxScrollTop;
    }
  };

  /**
   * 滚动到底部（带多次延迟确保内容加载完成）
   * @param {boolean} smooth - 是否平滑滚动，默认 true
   */
  const scrollToBottom = (smooth = true) => {
    // 立即滚动 - 使用 requestAnimationFrame 确保 DOM 已更新
    nextTick(() => {
      requestAnimationFrame(() => {
        performScroll(smooth);
      });
    });

    // 图片等异步资源加载后再次滚动（150ms）
    if (imgTimer) clearTimeout(imgTimer);
    imgTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          console.log("[useAutoScroll] Delayed scroll (150ms)");
          performScroll(false);
        });
      });
    }, 150);

    // 打字机等更长延迟内容再次滚动（350ms）
    if (typeTimer) clearTimeout(typeTimer);
    typeTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          performScroll(false);
        });
      });
    }, 350);

    // 最后一次确保滚动（600ms）- 处理慢速网络或大图片
    if (longDelayTimer) clearTimeout(longDelayTimer);
    longDelayTimer = setTimeout(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          performScroll(false);
        });
      });
    }, 600);
  };

  /**
   * 清理所有资源
   */
  const cleanup = () => {
    if (imgTimer) {
      clearTimeout(imgTimer);
      imgTimer = null;
    }
    if (typeTimer) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
    if (longDelayTimer) {
      clearTimeout(longDelayTimer);
      longDelayTimer = null;
    }
    if (mutationDebounceTimer) {
      clearTimeout(mutationDebounceTimer);
      mutationDebounceTimer = null;
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    if (watchStop) {
      watchStop();
      watchStop = null;
    }
  };

  /**
   * 初始化 MutationObserver，监听子节点、文本变化等导致的高度变化
   */
  const setupMutationObserver = () => {
    const el = getElement();
    if (!el) {
      return;
    }
    // 创建 MutationObserver 实例（带防抖）
    mutationObserver = new MutationObserver(() => {
      // 防抖处理，避免频繁触发
      if (mutationDebounceTimer) clearTimeout(mutationDebounceTimer);
      mutationDebounceTimer = setTimeout(() => {
        // DOM 发生变化时，自动滚动到底部
        nextTick(() => performScroll(true));
      }, 50); // 50ms 防抖
    });

    // 配置观察选项
    const config = {
      childList: true, // 监听子节点的添加和删除
      subtree: true, // 监听所有后代节点
      attributes: false, // 不监听属性变化
      characterData: true, // 监听文本内容变化（打字机效果）
    };

    // 开始观察
    mutationObserver.observe(el, config);
  };

  // 监听消息列表变化，自动滚动到底部
  watchStop = watch(
    dataList,
    () => {
      scrollToBottom(true);
    },
    { deep: true }
  );

  // 监听页面元素变化，确保在挂载后启动 Observer
  watch(
    () => getElement(),
    (newEl) => {
      if (newEl) {
        // 如果已存在 observer，先清理
        if (mutationObserver) {
          mutationObserver.disconnect();
        }
        setupMutationObserver();
      }
    },
    { immediate: true, flush: "post" } // post 确保 DOM 已更新
  );

  return {
    scrollToBottom,
    cleanup,
  };
}
