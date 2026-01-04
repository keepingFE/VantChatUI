<template>
    <div :class="[
        'vant-chatui-bubble',
        `vant-chatui-bubble--${type}`,
        { 'vant-chatui-bubble--has-arrow': arrow }
    ]" :style="bubbleStyle">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'VantChatUIBubble',
    props: {
        type: {
            type: String,
            default: 'text', // text, image, card, custom
            validator: (value) => ['text', 'image', 'card', 'custom'].includes(value)
        },
        position: {
            type: String,
            default: 'left', // left, right
            validator: (value) => ['left', 'right'].includes(value)
        },
        arrow: {
            type: Boolean,
            default: true
        },
        bgColor: {
            type: String,
            default: ''
        },
        textColor: {
            type: String,
            default: ''
        }
    },
    computed: {
        bubbleStyle() {
            const style = {}
            if (this.bgColor) {
                style.backgroundColor = this.bgColor
            }
            if (this.textColor) {
                style.color = this.textColor
            }
            return style
        }
    }
}
</script>

<style scoped>
.vant-chatui-bubble {
    position: relative;
    display: inline-block;
    max-width: 70%;
    padding: 10px 12px;
    border-radius: 8px;
    word-wrap: break-word;
    word-break: break-word;
}

.vant-chatui-bubble--text {
    background-color: #f7f8fa;
    color: #323233;
}

.vant-chatui-bubble--image {
    padding: 4px;
    background-color: transparent;
}

.vant-chatui-bubble--card {
    padding: 12px;
    background-color: #fff;
    border: 1px solid #ebedf0;
}

.vant-chatui-bubble--custom {
    padding: 0;
    background-color: transparent;
}

/* 气泡箭头 */
.vant-chatui-bubble--has-arrow::before {
    content: '';
    position: absolute;
    top: 12px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
}

.vant-chatui-bubble--has-arrow.vant-chatui-bubble--text::before {
    border-right-color: #f7f8fa;
    left: -12px;
}

/* 右侧气泡样式 */
.vant-chatui-bubble[data-position="right"] {
    background-color: #07c160;
    color: #fff;
}

.vant-chatui-bubble[data-position="right"].vant-chatui-bubble--has-arrow::before {
    left: auto;
    right: -12px;
    border-left-color: #07c160;
    border-right-color: transparent;
}
</style>
