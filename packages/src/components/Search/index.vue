<template>
    <div class="search-wrapper">
        <div class="search-container" :class="{ 'search-disabled': disabled }">
            <!-- 搜索图标 -->
            <div class="search-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path
                        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
            </div>

            <!-- 输入框 -->
            <input ref="inputRef" v-model="inputValue" type="text" class="search-input" :placeholder="placeholder"
                :disabled="disabled" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                @keydown.enter="handleSearch" />

            <!-- 清除按钮 -->
            <div v-if="showClear && inputValue && !disabled" class="search-clear" @click="handleClear">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </div>

            <!-- 搜索按钮 -->
            <button v-if="showButton" class="search-button" :disabled="disabled" @click="handleSearch">
                {{ buttonText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props 定义
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: '请输入搜索关键词'
    },
    // 是否显示清除按钮
    showClear: {
        type: Boolean,
        default: true
    },
    // 是否显示搜索按钮
    showButton: {
        type: Boolean,
        default: false
    },
    // 搜索按钮文本
    buttonText: {
        type: String,
        default: 'Search'
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false
    }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'search', 'clear', 'focus', 'blur', 'input'])

// 输入框内容
const inputValue = ref(props.modelValue)

// 输入框引用
const inputRef = ref(null)

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue
})

// 处理输入
const handleInput = () => {
    emit('update:modelValue', inputValue.value)
    emit('input', inputValue.value)
}

// 处理搜索
const handleSearch = () => {
    if (!props.disabled) {
        emit('search', inputValue.value)
    }
}

// 处理清除
const handleClear = () => {
    inputValue.value = ''
    emit('update:modelValue', '')
    emit('clear')
    emit('input', '')
    // 清除后聚焦输入框
    inputRef.value?.focus()
}

// 处理聚焦
const handleFocus = (event) => {
    emit('focus', event)
}

// 处理失焦
const handleBlur = (event) => {
    emit('blur', event)
}

// 暴露方法
defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur()
})
</script>

<style scoped lang="scss">
.search-wrapper {
    width: 100%;
    padding: 12px 16px;
    background: #ffffff;
}

.search-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f7f8fa;
    border-radius: 8px;
    transition: all 0.3s;

    &:focus-within {
        background: #ffffff;
        box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.2);
    }

    &.search-disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.search-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #969799;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #323233;
    line-height: 20px;

    &::placeholder {
        color: #c8c9cc;
    }

    &:disabled {
        cursor: not-allowed;
    }
}

.search-clear {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: #c8c9cc;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #969799;
    }

    &:active {
        transform: scale(0.9);
    }
}

.search-button {
    flex-shrink: 0;
    padding: 6px 16px;
    background: #1989fa;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
        background: #1677d2;
    }

    &:active {
        transform: scale(0.96);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}
</style>
