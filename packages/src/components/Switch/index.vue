<template>
    <div class="chat-switch" :class="{
        'chat-switch--on': isChecked,
        'chat-switch--disabled': disabled,
        'chat-switch--loading': loading,
        [`chat-switch--${size}`]: size !== 'default'
    }" :style="switchStyle" @click="handleClick">
        <div class="chat-switch__node">
            <span v-if="loading" class="chat-switch__loading"></span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: [Boolean, String, Number],
        default: false
    },
    activeValue: {
        type: [Boolean, String, Number],
        default: true
    },
    inactiveValue: {
        type: [Boolean, String, Number],
        default: false
    },
    activeColor: {
        type: String,
        default: '#1989fa'
    },
    inactiveColor: {
        type: String,
        default: '#dcdee0'
    },
    size: {
        type: String,
        default: 'default' // large | default | small
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isChecked = computed(() => {
    return props.modelValue === props.activeValue;
});

const switchStyle = computed(() => {
    const bgColor = isChecked.value ? props.activeColor : props.inactiveColor;
    return {
        backgroundColor: bgColor
    };
});

const handleClick = async () => {
    if (props.disabled || props.loading) return;

    const newValue = isChecked.value ? props.inactiveValue : props.activeValue;
    emit('update:modelValue', newValue);
    emit('change', newValue);
};
</script>

<style scoped>
.chat-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.chat-switch--large {
    width: 52px;
    height: 28px;
    border-radius: 14px;
}

.chat-switch--small {
    width: 36px;
    height: 20px;
    border-radius: 10px;
}

.chat-switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.chat-switch--loading {
    cursor: not-allowed;
}

.chat-switch__node {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-switch--large .chat-switch__node {
    width: 24px;
    height: 24px;
}

.chat-switch--small .chat-switch__node {
    width: 16px;
    height: 16px;
}

.chat-switch--on .chat-switch__node {
    transform: translateX(20px);
}

.chat-switch--large.chat-switch--on .chat-switch__node {
    transform: translateX(24px);
}

.chat-switch--small.chat-switch--on .chat-switch__node {
    transform: translateX(16px);
}

.chat-switch__loading {
    width: 12px;
    height: 12px;
    border: 2px solid #c8c9cc;
    border-top-color: transparent;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
