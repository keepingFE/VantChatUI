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
    margin: 16px 0;
    color: #969799;
    font-size: 14px;
    line-height: 24px;
}

.vant-chatui-divider--horizontal {
    width: 100%;
}

.vant-chatui-divider--horizontal::before,
.vant-chatui-divider--horizontal::after {
    content: '';
    flex: 1;
    border-top: 1px solid #ebedf0;
}

.vant-chatui-divider--dashed::before,
.vant-chatui-divider--dashed::after {
    border-top-style: dashed;
}

.vant-chatui-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0 8px;
    background-color: #ebedf0;
    vertical-align: middle;
}

.vant-chatui-divider__text {
    padding: 0 16px;
    white-space: nowrap;
}

.vant-chatui-divider--horizontal:not(:empty)::before {
    margin-right: 16px;
}

.vant-chatui-divider--horizontal:not(:empty)::after {
    margin-left: 16px;
}
</style>
