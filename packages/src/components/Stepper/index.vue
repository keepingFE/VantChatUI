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
}

.chat-stepper__minus,
.chat-stepper__plus {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid #ebedf0;
    background-color: #fff;
    color: #323233;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
}

.chat-stepper__minus {
    border-radius: 4px 0 0 4px;
}

.chat-stepper__plus {
    border-radius: 0 4px 4px 0;
}

.chat-stepper__minus:active,
.chat-stepper__plus:active {
    background-color: #f2f3f5;
}

.chat-stepper__button--disabled {
    color: #c8c9cc;
    background-color: #f7f8fa;
    cursor: not-allowed;
}

.chat-stepper__button--disabled:active {
    background-color: #f7f8fa;
}

.chat-stepper__input {
    width: 40px;
    height: 32px;
    margin: 0;
    padding: 0;
    border: 1px solid #ebedf0;
    border-left: none;
    border-right: none;
    background-color: #fff;
    color: #323233;
    font-size: 14px;
    text-align: center;
    -moz-appearance: textfield;
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
    opacity: 0.5;
    cursor: not-allowed;
}

.chat-stepper__icon {
    display: inline-block;
    line-height: 1;
}
</style>
