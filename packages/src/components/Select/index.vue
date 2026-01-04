<template>
    <van-field v-model="displayValue" :label="label" :placeholder="placeholder" :disabled="disabled" :readonly="true"
        :required="required" :label-width="labelWidth" :label-align="labelAlign" :error="error"
        :error-message="errorMessage" :right-icon="rightIcon" is-link @click="handleClick">
        <template v-if="$slots.label" #label>
            <slot name="label"></slot>
        </template>
    </van-field>

    <van-popup v-model:show="showPicker" position="bottom" :round="round" :close-on-click-overlay="closeOnClickOverlay">
        <van-picker :columns="columns" :title="pickerTitle" :confirm-button-text="confirmButtonText"
            :cancel-button-text="cancelButtonText" @confirm="handleConfirm" @cancel="handleCancel" />
    </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    // v-model 绑定值
    modelValue: {
        type: [String, Number],
        default: '',
    },
    // 标签文本
    label: {
        type: String,
        default: '',
    },
    // 占位提示文字
    placeholder: {
        type: String,
        default: '请选择',
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否必填
    required: {
        type: Boolean,
        default: false,
    },
    // 标签宽度
    labelWidth: {
        type: [String, Number],
        default: '6.2em',
    },
    // 标签对齐方式
    labelAlign: {
        type: String,
        default: 'left',
        validator: (value) => ['left', 'center', 'right'].includes(value),
    },
    // 是否显示错误状态
    error: {
        type: Boolean,
        default: false,
    },
    // 错误提示文本
    errorMessage: {
        type: String,
        default: '',
    },
    // 右侧图标
    rightIcon: {
        type: String,
        default: 'arrow-down',
    },
    // 选项列表
    options: {
        type: Array,
        default: () => [],
    },
    // 选项的文本字段名
    labelField: {
        type: String,
        default: 'text',
    },
    // 选项的值字段名
    valueField: {
        type: String,
        default: 'value',
    },
    // 选择器标题
    pickerTitle: {
        type: String,
        default: '请选择',
    },
    // 确认按钮文字
    confirmButtonText: {
        type: String,
        default: '确认',
    },
    // 取消按钮文字
    cancelButtonText: {
        type: String,
        default: '取消',
    },
    // 是否显示圆角弹窗
    round: {
        type: Boolean,
        default: true,
    },
    // 是否在点击遮罩层后关闭
    closeOnClickOverlay: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue', 'change', 'confirm', 'cancel']);

const showPicker = ref(false);

const columns = computed(() => {
    return props.options.map((option) => {
        if (typeof option === 'string' || typeof option === 'number') {
            return { text: option, value: option };
        }
        return {
            text: option[props.labelField],
            value: option[props.valueField],
        };
    });
});

const displayValue = computed(() => {
    if (!props.modelValue) return '';

    const selectedOption = columns.value.find(
        (item) => item.value === props.modelValue
    );

    return selectedOption ? selectedOption.text : '';
});

const handleClick = () => {
    if (!props.disabled) {
        showPicker.value = true;
    }
};

const handleConfirm = ({ selectedOptions }) => {
    const value = selectedOptions[0].value;
    emit('update:modelValue', value);
    emit('change', value);
    emit('confirm', value);
    showPicker.value = false;
};

const handleCancel = () => {
    emit('cancel');
    showPicker.value = false;
};
</script>
