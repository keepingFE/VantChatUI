<template>
    <div :class="['vant-chatui-toolbar', `vant-chatui-toolbar--${position}`]">
        <div class="vant-chatui-toolbar__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VantChatUIToolbar',
    props: {
        position: {
            type: String,
            default: 'bottom', // top, bottom
            validator: (value) => ['top', 'bottom'].includes(value)
        },
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>
.vant-chatui-toolbar {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: #fff;
    border-top: 1px solid #ebedf0;
}

.vant-chatui-toolbar--top {
    top: 0;
    border-top: none;
    border-bottom: 1px solid #ebedf0;
}

.vant-chatui-toolbar--bottom {
    bottom: 0;
}

.vant-chatui-toolbar__content {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    min-height: 50px;
}

.vant-chatui-toolbar--bottom[safe-area-inset-bottom] {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
