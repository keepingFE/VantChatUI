<template>
    <div :class="formMessageClasses" :style="containerStyles">
        <!-- 表单标题 -->
        <div v-if="title" class="chat-form__title">
            <van-icon v-if="titleIcon" :name="titleIcon" :color="themeColor" />
            <span>{{ title }}</span>
        </div>

        <!-- 表单描述 -->
        <div v-if="description" class="chat-form__description">
            {{ description }}
        </div>

        <!-- 表单字段 -->
        <div class="chat-form__fields">
            <!-- 文本输入框 -->
            <div v-for="field in textFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-field v-model="formData[field.name]" :type="field.inputType || 'text'"
                    :placeholder="field.placeholder" :disabled="disabled || field.disabled"
                    :readonly="readonly || field.readonly" :rules="field.rules" :maxlength="field.maxlength" clearable
                    @blur="handleFieldBlur(field)" />
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 多行文本框 -->
            <div v-for="field in textareaFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-field v-model="formData[field.name]" type="textarea" :placeholder="field.placeholder"
                    :disabled="disabled || field.disabled" :readonly="readonly || field.readonly" :rules="field.rules"
                    :maxlength="field.maxlength" :rows="field.rows || 3" autosize @blur="handleFieldBlur(field)" />
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 下拉选择框 -->
            <div v-for="field in selectFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-field v-model="formData[field.name]" is-link readonly :placeholder="field.placeholder"
                    :disabled="disabled || field.disabled" @click="handleSelectClick(field)" />
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 单选框组 -->
            <div v-for="field in radioFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-radio-group v-model="formData[field.name]" :disabled="disabled || field.disabled"
                    direction="horizontal">
                    <van-radio v-for="option in field.options" :key="option.value" :name="option.value">
                        {{ option.label }}
                    </van-radio>
                </van-radio-group>
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 复选框组 -->
            <div v-for="field in checkboxFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-checkbox-group v-model="formData[field.name]" :disabled="disabled || field.disabled">
                    <van-checkbox v-for="option in field.options" :key="option.value" :name="option.value">
                        {{ option.label }}
                    </van-checkbox>
                </van-checkbox-group>
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 日期选择器 -->
            <div v-for="field in dateFields" :key="field.name" :class="getFieldClasses(field)">
                <label v-if="field.label" class="chat-form__label">
                    {{ field.label }}
                    <span v-if="field.required" class="chat-form__required">*</span>
                </label>
                <van-field :model-value="formatDateValue(field)" is-link readonly :placeholder="field.placeholder"
                    :disabled="disabled || field.disabled" @click="handleDateClick(field)" />
                <div v-if="field.error && showError" class="chat-form__error">
                    {{ field.error }}
                </div>
            </div>

            <!-- 自定义字段 -->
            <slot name="custom-field" :form-data="formData" :field-list="fields" />
        </div>

        <!-- 表单操作按钮 -->
        <div v-if="showActions" class="chat-form__actions">
            <van-button v-if="showCancel" plain :disabled="disabled || submitting" @click="handleCancel">
                {{ cancelText }}
            </van-button>
            <van-button type="primary" :loading="submitting" :disabled="disabled || submitting" :color="themeColor"
                @click="handleSubmit">
                {{ submitText }}
            </van-button>
        </div>

        <!-- 下拉选择弹窗 -->
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker :columns="currentPickerOptions" @confirm="handlePickerConfirm" @cancel="showPicker = false" />
        </van-popup>

        <!-- 日期选择弹窗 -->
        <van-popup v-model:show="showDatePicker" position="bottom">
            <van-date-picker v-model="currentDateValue" :title="currentDateField?.placeholder"
                @confirm="handleDateConfirm" @cancel="showDatePicker = false" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
    Field as VanField,
    RadioGroup as VanRadioGroup,
    Radio as VanRadio,
    CheckboxGroup as VanCheckboxGroup,
    Checkbox as VanCheckbox,
    Button as VanButton,
    Popup as VanPopup,
    Picker as VanPicker,
    DatePicker as VanDatePicker,
    Icon as VanIcon,
} from "vant";

const props = defineProps({
    // 表单标题
    title: {
        type: String,
        default: "",
    },
    // 标题图标
    titleIcon: {
        type: String,
        default: "",
    },
    // 表单描述
    description: {
        type: String,
        default: "",
    },
    // 表单字段列表
    fields: {
        type: Array,
        default: () => [],
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否只读
    readonly: {
        type: Boolean,
        default: false,
    },
    // 是否显示操作按钮
    showActions: {
        type: Boolean,
        default: true,
    },
    // 是否显示取消按钮
    showCancel: {
        type: Boolean,
        default: true,
    },
    // 提交按钮文本
    submitText: {
        type: String,
        default: "提交",
    },
    // 取消按钮文本
    cancelText: {
        type: String,
        default: "取消",
    },
    // 主题色
    themeColor: {
        type: String,
        default: "#1989fa",
    },
    // 最大宽度
    maxWidth: {
        type: [String, Number],
        default: "100%",
    },
});

const emit = defineEmits(["submit", "cancel", "field-change", "validate"]);

const formData = reactive({});
const showPicker = ref(false);
const showDatePicker = ref(false);
const currentPickerField = ref(null);
const currentDateField = ref(null);
const currentDateValue = ref([]);
const submitting = ref(false);
const showError = ref(true);

const formMessageClasses = computed(() => {
    return [
        "chat-form",
        {
            "chat-form--disabled": props.disabled,
        },
    ];
});

const containerStyles = computed(() => {
    const styles = {};
    if (props.maxWidth) {
        styles.maxWidth = typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth;
    }
    styles["--theme-color"] = props.themeColor;
    return styles;
});

// 按类型分组字段
const textFields = computed(() => props.fields.filter(f => f.type === 'text'));
const textareaFields = computed(() => props.fields.filter(f => f.type === 'textarea'));
const selectFields = computed(() => props.fields.filter(f => f.type === 'select'));
const radioFields = computed(() => props.fields.filter(f => f.type === 'radio'));
const checkboxFields = computed(() => props.fields.filter(f => f.type === 'checkbox'));
const dateFields = computed(() => props.fields.filter(f => f.type === 'date' || f.type === 'datetime'));

// 当前选择器选项
const currentPickerOptions = computed(() => {
    return currentPickerField.value?.options || [];
});

// 获取字段样式类
const getFieldClasses = (field) => {
    return [
        "chat-form__field",
        {
            "chat-form__field--error": field.error,
            "chat-form__field--required": field.required,
        },
    ];
};

// 初始化表单数据
const initFormData = () => {
    props.fields.forEach(field => {
        if (field.type === 'checkbox') {
            formData[field.name] = field.defaultValue || [];
        } else if (field.type === 'date' || field.type === 'datetime') {
            formData[field.name] = field.defaultValue || null;
        } else {
            formData[field.name] = field.defaultValue || "";
        }
    });
};

// 格式化日期值
const formatDateValue = (field) => {
    const value = formData[field.name];
    if (!value) return "";
    // 如果 value 是 ISO 字符串，转换为日期对象
    if (typeof value === 'string' && value.includes('T')) {
        const date = new Date(value);
        if (field.type === 'datetime') {
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        return date.toLocaleDateString('zh-CN');
    }
    // 如果 value 已经是格式化后的字符串，直接返回
    if (typeof value === 'string') {
        return value;
    }
    return "";
};

// 处理字段失焦
const handleFieldBlur = (field) => {
    if (field.required && !formData[field.name]) {
        field.error = `${field.label || '此字段'}不能为空`;
    } else if (field.rules) {
        for (const rule of field.rules) {
            if (rule.required && !formData[field.name]) {
                field.error = rule.message || `${field.label || '此字段'}不能为空`;
                break;
            }
            if (rule.pattern && !rule.pattern.test(formData[field.name])) {
                field.error = rule.message || '格式不正确';
                break;
            }
        }
    } else {
        field.error = null;
    }
    emit("field-change", { name: field.name, value: formData[field.name], field });
};

// 处理选择点击
const handleSelectClick = (field) => {
    currentPickerField.value = field;
    showPicker.value = true;
};

// 处理选择确认
const handlePickerConfirm = ({ selectedOptions }) => {
    const field = currentPickerField.value;
    if (field) {
        formData[field.name] = selectedOptions[0]?.value || "";
        handleFieldBlur(field);
    }
    showPicker.value = false;
};

// 处理日期点击
const handleDateClick = (field) => {
    currentDateField.value = field;
    const value = formData[field.name];
    if (value) {
        // 如果存储的是 ISO 字符串，转换为数组
        if (typeof value === 'string' && value.includes('T')) {
            const date = new Date(value);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            currentDateValue.value = [year, month, day];
        } else if (typeof value === 'string' && value.includes('-')) {
            // 如果存储的是格式化后的字符串（例如 "2025-01-04"），转换为数组
            const parts = value.split('-');
            if (parts.length >= 3) {
                currentDateValue.value = [parts[0], parts[1].padStart(2, '0'), parts[2].padStart(2, '0')];
            } else {
                currentDateValue.value = [];
            }
        } else {
            currentDateValue.value = [];
        }
    } else {
        currentDateValue.value = [];
    }
    showDatePicker.value = true;
};

// 处理日期确认
const handleDateConfirm = ({ selectedValues }) => {
    const field = currentDateField.value;
    if (field && selectedValues) {
        const [year, month, day] = selectedValues;
        // 转换为 ISO 字符串存储
        const dateStr = `${year}-${month}-${day}`;
        formData[field.name] = dateStr;
        handleFieldBlur(field);
    }
    showDatePicker.value = false;
};

// 提交表单
const handleSubmit = async () => {
    // 验证所有必填字段
    let isValid = true;
    props.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
            field.error = `${field.label || '此字段'}不能为空`;
            isValid = false;
        } else if (field.rules) {
            for (const rule of field.rules) {
                if (rule.required && !formData[field.name]) {
                    field.error = rule.message || `${field.label || '此字段'}不能为空`;
                    isValid = false;
                    break;
                }
                if (rule.pattern && !rule.pattern.test(formData[field.name])) {
                    field.error = rule.message || '格式不正确';
                    isValid = false;
                    break;
                }
            }
        }
    });

    if (!isValid) {
        emit("validate", { valid: false, data: formData });
        return;
    }

    submitting.value = true;
    try {
        emit("submit", { ...formData });
    } finally {
        submitting.value = false;
    }
};

// 取消表单
const handleCancel = () => {
    emit("cancel");
};

// 初始化
initFormData();
</script>

<style scoped lang="scss">
.chat-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    &__title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #323233;
    }

    &__description {
        font-size: 13px;
        color: #969799;
        line-height: 1.5;
    }

    &__fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: all 0.2s;

        &--error {
            :deep(.van-field__control) {
                color: #ee0a24;
            }

            :deep(.van-field) {
                border-color: #ee0a24;
                animation: shake 0.4s ease-in-out;
            }
        }
    }

    &__label {
        font-size: 14px;
        font-weight: 600;
        color: #323233;
        letter-spacing: 0.2px;
    }

    &__required {
        color: #ee0a24;
        margin-left: 2px;
        font-weight: 700;
    }

    &__error {
        font-size: 12px;
        color: #ee0a24;
        margin-top: 4px;
        padding: 4px 8px;
        background: rgba(238, 10, 36, 0.06);
        border-radius: 4px;
        display: inline-block;
        animation: slideIn 0.2s ease-out;
    }

    &__actions {
        display: flex;
        gap: 12px;
        margin-top: 12px;

        >* {
            flex: 1;
            height: 44px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.2s;

            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    &--disabled {
        opacity: 0.6;
        pointer-events: none;
    }
}

// 响应式适配
@media (max-width: 768px) {
    .chat-form {
        padding: 16px;
        gap: 14px;

        &__title {
            font-size: 15px;
        }

        &__description {
            font-size: 12px;
        }

        &__fields {
            gap: 14px;
        }

        &__label {
            font-size: 13px;
        }

        &__error {
            font-size: 11px;
        }

        &__actions {
            gap: 10px;
        }
    }
}

@media (max-width: 480px) {
    .chat-form {
        padding: 14px;
        gap: 12px;
        border-radius: 8px;

        &__title {
            font-size: 14px;
        }

        &__description {
            font-size: 11px;
        }

        &__fields {
            gap: 12px;
        }

        &__label {
            font-size: 12px;
        }

        &__actions {
            gap: 8px;
        }
    }
}

// 深色主题适配
@media (prefers-color-scheme: dark) {
    .chat-form {
        background-color: #2a2a2a;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

        &__title {
            color: #f5f5f5;
        }

        &__description {
            color: #c8c9cc;
        }

        &__label {
            color: #e5e5e5;
        }

        &__error {
            color: #ff6b6b;
        }
    }
}

// 自定义单选框和复选框样式
:deep(.van-radio),
:deep(.van-checkbox) {
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }
}

:deep(.van-radio-group--horizontal),
:deep(.van-checkbox-group) {

    .van-radio,
    .van-checkbox {
        margin-bottom: 0;
        margin-right: 16px;
    }
}

// 动画定义
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-4px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(4px);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
