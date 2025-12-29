import { ref } from "vue";

/**
 * useStreamingResponse
 * 一个用于处理 SSE (Server-Sent Events) 流式响应的 Hook
 *
 * @example
 * const { content, isStreaming, error, startStream, stopStream } = useStreamingResponse();
 *
 * // 开始请求
 * startStream('/api/chat', {
 *   method: 'POST',
 *   body: JSON.stringify({ prompt: 'hello' })
 * });
 */
export function useStreamingResponse() {
  const content = ref("");
  const isStreaming = ref(false);
  const error = ref(null);
  let controller = null;

  /**
   * 处理流式数据块
   * 默认假设后端返回的是 text/event-stream 格式，每行以 data: 开头
   * 你可以根据实际后端协议修改此解析逻辑
   */
  const handleChunk = (chunk) => {
    // 简单的文本追加逻辑
    // 如果后端返回的是标准 SSE 格式 (data: ...)，需要进行解析
    // 这里为了通用性，暂且直接追加文本，实际使用时建议根据协议调整

    // 示例：解析标准 SSE
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return; // 结束标志
        try {
          // 如果 data 是 JSON
          const json = JSON.parse(data);
          if (json.content) content.value += json.content;
        } catch (e) {
          // 如果 data 是纯文本
          content.value += data;
        }
      } else {
        // 非 SSE 格式，直接追加（兼容普通流式接口）
        content.value += chunk;
      }
    }
  };

  /**
   * 开始流式请求
   * @param {string} url - 请求地址
   * @param {object} options - fetch 选项
   */
  const startStream = async (url, options = {}) => {
    if (isStreaming.value) return;

    isStreaming.value = true;
    error.value = null;
    content.value = "";
    controller = new AbortController();

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // 直接追加，让外部决定怎么处理格式，或者在这里做简单的处理
        // 为了演示方便，我们这里假设后端直接返回内容片段
        content.value += chunk;
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        error.value = err;
        console.error("Stream error:", err);
      }
    } finally {
      isStreaming.value = false;
      controller = null;
    }
  };

  /**
   * 停止（中断）流式请求
   */
  const stopStream = () => {
    if (controller) {
      controller.abort();
      controller = null;
      isStreaming.value = false;
    }
  };

  return {
    content,
    isStreaming,
    error,
    startStream,
    stopStream,
  };
}
