<template>
  <div class="markdown-renderer" :class="{ 'is-streaming': streaming }">
    <div
      class="markdown-content"
      v-html="renderedContent"
      ref="contentRef"
      @click="handleContentClick"
    ></div>
    <div v-if="streaming" class="streaming-cursor"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // 或者其他主题
import { showToast } from "vant";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  streaming: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const contentRef = ref(null);

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs-container" data-lang="${lang}">
                  <div class="code-header">
                    <span class="code-lang">${lang}</span>
                    <button class="copy-btn" data-code="${encodeURIComponent(
                      str
                    )}">复制</button>
                  </div>
                  <code class="hljs">${
                    hljs.highlight(str, {
                      language: lang,
                      ignoreIllegals: true,
                    }).value
                  }</code>
                </pre>`;
      } catch (__) {}
    }

    return `<pre class="hljs-container">
              <div class="code-header">
                <button class="copy-btn" data-code="${encodeURIComponent(
                  str
                )}">复制</button>
              </div>
              <code class="hljs">${md.utils.escapeHtml(str)}</code>
            </pre>`;
  },
  ...props.options,
});

const renderedContent = computed(() => {
  return md.render(props.content || "");
});

// 处理点击事件（主要用于复制按钮）
const handleContentClick = (e) => {
  const target = e.target;
  if (target.classList.contains("copy-btn")) {
    const code = decodeURIComponent(target.dataset.code);
    copyToClipboard(code);
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast("复制成功");
  } catch (err) {
    console.error("Failed to copy:", err);
    showToast("复制失败");
  }
};
</script>

<style lang="scss">
.markdown-renderer {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  width: 100%;
  overflow-wrap: break-word;

  &.is-streaming {
    .markdown-content > *:last-child::after {
      content: "";
      display: inline-block;
      width: 8px;
      height: 16px;
      background: #3b82f6;
      margin-left: 4px;
      vertical-align: middle;
      animation: blink 1s step-end infinite;
    }
  }
}

.streaming-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #3b82f6;
  margin-left: 4px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
  display: none; // 通过伪元素实现通常更好，这里备用
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Markdown Styles */
.markdown-content {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 1.8em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.25em;
  }

  p {
    margin-bottom: 1em;
  }

  ul,
  ol {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }

  li {
    margin-bottom: 0.25em;
  }

  blockquote {
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
    margin: 0 0 1em 0;
  }

  a {
    color: #0969da;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
    overflow-x: auto;
    display: block;

    th,
    td {
      border: 1px solid #d0d7de;
      padding: 6px 13px;
    }

    th {
      font-weight: 600;
      background-color: #f6f8fa;
    }

    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace;
  }

  pre {
    margin-bottom: 1em;

    code {
      padding: 0;
      background-color: transparent;
    }
  }

  /* Code Block Container */
  .hljs-container {
    position: relative;
    background: #1e1e1e; // Github Dark Bg
    border-radius: 8px;
    margin: 1em 0;
    overflow: hidden;

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      background: #2d2d2d;
      color: #b0b0b0;
      font-size: 12px;

      .code-lang {
        font-weight: bold;
        text-transform: uppercase;
      }

      .copy-btn {
        background: transparent;
        border: none;
        color: #b0b0b0;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
      }
    }

    .hljs {
      display: block;
      overflow-x: auto;
      padding: 12px;
      color: #e6edf3;
      font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
        Liberation Mono, monospace;
      font-size: 13px;
      line-height: 1.5;
    }
  }
}
</style>
