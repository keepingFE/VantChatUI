<template>
    <div class="vant-chatui-rich-text" v-html="sanitizedHtml"></div>
</template>

<script>
export default {
    name: 'VantChatUIRichText',
    props: {
        content: {
            type: String,
            required: true
        },
        sanitize: {
            type: Boolean,
            default: true
        },
        allowedTags: {
            type: Array,
            default: () => [
                'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'a', 'img',
                'blockquote', 'code', 'pre',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'div', 'span'
            ]
        },
        maxLength: {
            type: Number,
            default: 0
        }
    },
    computed: {
        sanitizedHtml() {
            let html = this.content

            // 长度限制
            if (this.maxLength > 0 && html.length > this.maxLength) {
                html = html.substring(0, this.maxLength) + '...'
            }

            // 安全过滤
            if (this.sanitize) {
                html = this.sanitizeHtml(html)
            }

            return html
        }
    },
    methods: {
        sanitizeHtml(html) {
            // 创建临时 DOM 元素
            const temp = document.createElement('div')
            temp.innerHTML = html

            // 递归清理节点
            this.cleanNode(temp)

            return temp.innerHTML
        },

        cleanNode(node) {
            // 移除脚本和样式标签
            const scripts = node.querySelectorAll('script, style')
            scripts.forEach(script => script.remove())

            // 检查所有元素
            const elements = node.querySelectorAll('*')
            elements.forEach(el => {
                // 检查标签是否允许
                if (!this.allowedTags.includes(el.tagName.toLowerCase())) {
                    // 保留内容，移除标签
                    const parent = el.parentNode
                    while (el.firstChild) {
                        parent.insertBefore(el.firstChild, el)
                    }
                    parent.removeChild(el)
                    return
                }

                // 移除危险属性
                const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover']
                dangerousAttrs.forEach(attr => {
                    if (el.hasAttribute(attr)) {
                        el.removeAttribute(attr)
                    }
                })

                // 清理 href 和 src
                if (el.hasAttribute('href')) {
                    const href = el.getAttribute('href')
                    if (href.startsWith('javascript:')) {
                        el.removeAttribute('href')
                    }
                }

                if (el.hasAttribute('src')) {
                    const src = el.getAttribute('src')
                    if (src.startsWith('javascript:')) {
                        el.removeAttribute('src')
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.vant-chatui-rich-text {
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.6;
}

.vant-chatui-rich-text :deep(p) {
    margin: 0 0 12px;
}

.vant-chatui-rich-text :deep(p:last-child) {
    margin-bottom: 0;
}

.vant-chatui-rich-text :deep(h1),
.vant-chatui-rich-text :deep(h2),
.vant-chatui-rich-text :deep(h3),
.vant-chatui-rich-text :deep(h4),
.vant-chatui-rich-text :deep(h5),
.vant-chatui-rich-text :deep(h6) {
    margin: 16px 0 8px;
    font-weight: 600;
}

.vant-chatui-rich-text :deep(h1) {
    font-size: 24px;
}

.vant-chatui-rich-text :deep(h2) {
    font-size: 20px;
}

.vant-chatui-rich-text :deep(h3) {
    font-size: 18px;
}

.vant-chatui-rich-text :deep(h4) {
    font-size: 16px;
}

.vant-chatui-rich-text :deep(h5) {
    font-size: 14px;
}

.vant-chatui-rich-text :deep(h6) {
    font-size: 12px;
}

.vant-chatui-rich-text :deep(ul),
.vant-chatui-rich-text :deep(ol) {
    margin: 8px 0;
    padding-left: 24px;
}

.vant-chatui-rich-text :deep(li) {
    margin: 4px 0;
}

.vant-chatui-rich-text :deep(a) {
    color: #1989fa;
    text-decoration: none;
}

.vant-chatui-rich-text :deep(a:hover) {
    text-decoration: underline;
}

.vant-chatui-rich-text :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

.vant-chatui-rich-text :deep(blockquote) {
    margin: 12px 0;
    padding: 8px 12px;
    border-left: 4px solid #ebedf0;
    background-color: #f7f8fa;
    color: #646566;
}

.vant-chatui-rich-text :deep(code) {
    padding: 2px 6px;
    background-color: #f7f8fa;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

.vant-chatui-rich-text :deep(pre) {
    margin: 12px 0;
    padding: 12px;
    background-color: #f7f8fa;
    border-radius: 4px;
    overflow-x: auto;
}

.vant-chatui-rich-text :deep(pre code) {
    padding: 0;
    background-color: transparent;
}

.vant-chatui-rich-text :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
}

.vant-chatui-rich-text :deep(th),
.vant-chatui-rich-text :deep(td) {
    padding: 8px;
    border: 1px solid #ebedf0;
    text-align: left;
}

.vant-chatui-rich-text :deep(th) {
    background-color: #f7f8fa;
    font-weight: 600;
}

.vant-chatui-rich-text :deep(strong) {
    font-weight: 600;
}

.vant-chatui-rich-text :deep(em) {
    font-style: italic;
}

.vant-chatui-rich-text :deep(u) {
    text-decoration: underline;
}

.vant-chatui-rich-text :deep(s),
.vant-chatui-rich-text :deep(del) {
    text-decoration: line-through;
}
</style>
