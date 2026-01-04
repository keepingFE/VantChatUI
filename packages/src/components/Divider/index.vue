<template>
    <div :class="['vant-chatui-divider', `vant-chatui-divider--${type}`]">
        <span v-if="$slots.default || text" class="vant-chatui-divider__text">
            <slot>{{ text }}</slot>
        </span>
    </div>
</template>

<script>
export default {
    name: 'VantChatUIDivider',
    props: {
        text: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'horizontal', // horizontal, vertical, dashed
            validator: (value) => ['horizontal', 'vertical', 'dashed'].includes(value)
        }
    }
}
</script>

<style scoped>
.vant-chatui-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: #8c8c8c;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
}

.vant-chatui-divider--horizontal {
    width: 100%;
}

.vant-chatui-divider--horizontal::before,
.vant-chatui-divider--horizontal::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #dee2e6, transparent);
}

.vant-chatui-divider--dashed::before,
.vant-chatui-divider--dashed::after {
    background: repeating-linear-gradient(90deg,
            #dee2e6 0,
            #dee2e6 4px,
            transparent 4px,
            transparent 8px);
}

.vant-chatui-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 1.2em;
    margin: 0 12px;
    background: linear-gradient(180deg, transparent, #dee2e6, transparent);
    vertical-align: middle;
}

.vant-chatui-divider__text {
    padding: 0 20px;
    white-space: nowrap;
    letter-spacing: 0.5px;
    position: relative;
}

.vant-chatui-divider__text::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    border-radius: 50%;
    transform: translateY(-50%);
}

.vant-chatui-divider__text::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    border-radius: 50%;
    transform: translateY(-50%);
}

.vant-chatui-divider--horizontal:not(:empty)::before {
    margin-right: 20px;
}

.vant-chatui-divider--horizontal:not(:empty)::after {
    margin-left: 20px;
}
</style>
