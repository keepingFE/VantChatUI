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
    padding: 12px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    word-break: break-word;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: bubble-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vant-chatui-bubble:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
}

.vant-chatui-bubble--text {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    color: #2c3e50;
    font-size: 15px;
    line-height: 1.6;
}

.vant-chatui-bubble--image {
    padding: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 16px;
}

.vant-chatui-bubble--card {
    padding: 14px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.vant-chatui-bubble--custom {
    padding: 0;
    background-color: transparent;
    box-shadow: none;
}

/* 气泡箭头 - 更精致的三角形 */
.vant-chatui-bubble--has-arrow::before {
    content: '';
    position: absolute;
    top: 14px;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06));
}

.vant-chatui-bubble--has-arrow.vant-chatui-bubble--text::before {
    border-right-color: #f8f9fa;
    left: -14px;
}

/* 右侧气泡样式 - 渐变背景 */
.vant-chatui-bubble[data-position="right"] {
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.vant-chatui-bubble[data-position="right"]:hover {
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.vant-chatui-bubble[data-position="right"].vant-chatui-bubble--has-arrow::before {
    left: auto;
    right: -14px;
    border-left-color: #0e6ecd;
    border-right-color: transparent;
}

@keyframes bubble-in {
    0% {
        opacity: 0;
        transform: scale(0.8) translateY(10px);
    }

    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>
