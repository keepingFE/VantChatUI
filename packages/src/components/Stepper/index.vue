<template>
    <div class="chat-stepper" :class="{ 'chat-stepper--disabled': disabled }">
        <button class="chat-stepper__minus" :class="{ 'chat-stepper__button--disabled': minusDisabled }"
            :disabled="minusDisabled" @click="handleMinus">
            <span class="chat-stepper__icon">−</span>
        </button>
        <input v-if="!disableInput" class="chat-stepper__input" type="number" :value="currentValue"
            :disabled="disabled || disableInput" :readonly="disableInput" @input="handleInput" @blur="handleBlur" />
        <div v-else class="chat-stepper__input chat-stepper__input--readonly">
            {{ currentValue }}
        </div>
        <button class="chat-stepper__plus" :class="{ 'chat-stepper__button--disabled': plusDisabled }"
            :disabled="plusDisabled" @click="handlePlus">
            <span class="chat-stepper__icon">+</span>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: 0
    },
    min: {
        type: [Number, String],
        default: 0
    },
    max: {
        type: [Number, String],
        default: Infinity
    },
    step: {
        type: [Number, String],
        default: 1
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disableInput: {
        type: Boolean,
        default: false
    },
    decimalLength: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'change', 'plus', 'minus']);

const currentValue = ref(Number(props.modelValue));

const minusDisabled = computed(() => {
    return props.disabled || currentValue.value <= Number(props.min);
});

const plusDisabled = computed(() => {
    return props.disabled || currentValue.value >= Number(props.max);
});

const formatValue = (value) => {
    value = Number(value);
    if (isNaN(value)) return Number(props.min);

    value = Math.max(Number(props.min), Math.min(Number(props.max), value));

    if (props.decimalLength !== null) {
        value = Number(value.toFixed(props.decimalLength));
    }

    return value;
};

const handleMinus = () => {
    if (minusDisabled.value) return;
    const newValue = formatValue(currentValue.value - Number(props.step));
    updateValue(newValue);
    emit('minus');
};

const handlePlus = () => {
    if (plusDisabled.value) return;
    const newValue = formatValue(currentValue.value + Number(props.step));
    updateValue(newValue);
    emit('plus');
};

const handleInput = (e) => {
    const value = e.target.value;
    currentValue.value = value === '' ? Number(props.min) : Number(value);
};

const handleBlur = () => {
    const newValue = formatValue(currentValue.value);
    updateValue(newValue);
};

const updateValue = (value) => {
    currentValue.value = value;
    emit('update:modelValue', value);
    emit('change', value);
};

watch(() => props.modelValue, (val) => {
    currentValue.value = formatValue(val);
});
</script>

<style scoped>
.chat-stepper {
    display: inline-flex;
    align-items: center;
    user-select: none;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.chat-stepper__minus,
.chat-stepper__plus {
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: #1989fa;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.chat-stepper__minus::before,
.chat-stepper__plus::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.chat-stepper__minus:active::before,
.chat-stepper__plus:active::before {
    width: 100px;
    height: 100px;
}

.chat-stepper__minus {
    border-radius: 6px 0 0 6px;
}

.chat-stepper__plus {
    border-radius: 0 6px 6px 0;
}

.chat-stepper__minus:hover,
.chat-stepper__plus:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);
}

.chat-stepper__minus:active,
.chat-stepper__plus:active {
    transform: scale(0.95);
}

.chat-stepper__button--disabled {
    background: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    box-shadow: none;
}

.chat-stepper__button--disabled:hover {
    transform: none;
    box-shadow: none;
}

.chat-stepper__button--disabled:active {
    transform: none;
}

.chat-stepper__input {
    width: 40px;
    height: 28px;
    margin: 0;
    padding: 0 6px;
    border: none;
    background-color: #fff;
    color: #2c3e50;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    -moz-appearance: textfield;
    transition: all 0.3s;
}

.chat-stepper__input:focus {
    outline: none;
    background: #f8f9fa;
}

.chat-stepper__input::-webkit-outer-spin-button,
.chat-stepper__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.chat-stepper__input--readonly {
    cursor: default;
}

.chat-stepper--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.chat-stepper__icon {
    display: inline-block;
    line-height: 1;
    position: relative;
    z-index: 1;
}
</style>
