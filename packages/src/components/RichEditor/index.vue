<template>
  <div class="rich-editor" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <!-- 工具栏 -->
    <div v-if="showToolbar && !readonly" class="editor-toolbar">
      <div class="toolbar-inner">
        <template v-for="(item, index) in toolbarItems" :key="index">
          <span v-if="item === '|'" class="toolbar-divider"></span>
          <button v-else class="toolbar-btn" :class="{ 'is-active': isActive(item) }" :title="TITLES[item]"
            :disabled="disabled" @click="execCommand(item)">
            <span class="toolbar-icon" v-html="ICONS[item]"></span>
          </button>
        </template>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <editor-content class="editor-content" :editor="editor" :style="{ minHeight, maxHeight }" />

    <!-- 链接弹窗 -->
    <van-dialog v-model:show="linkDialog.show" title="插入链接" show-cancel-button @confirm="confirmLink">
      <van-field v-model="linkDialog.url" label="链接" placeholder="请输入链接地址" />
      <van-field v-model="linkDialog.text" label="文本" placeholder="请输入显示文本" />
    </van-dialog>

    <!-- 图片弹窗 -->
    <van-dialog v-model:show="imageDialog.show" title="插入图片" show-cancel-button @confirm="confirmImage">
      <van-tabs v-model:active="imageDialog.tab">
        <van-tab title="上传图片">
          <div class="upload-area">
            <van-uploader v-model="imageDialog.fileList" :max-count="1" :after-read="handleImageUpload"
              accept="image/*">
              <div class="upload-trigger">
                <van-icon name="photograph" size="32" />
                <span>点击上传图片</span>
              </div>
            </van-uploader>
            <div v-if="imageDialog.uploading" class="upload-loading">
              <van-loading size="24" />
              <div class="upload-info">
                <span>上传中... {{ imageDialog.progress || 0 }}%</span>
                <van-button size="small" type="danger" plain @click="cancelUpload">取消</van-button>
              </div>
              <van-progress v-if="imageDialog.progress" :percentage="imageDialog.progress" stroke-width="4" />
            </div>
          </div>
        </van-tab>
        <van-tab title="图片链接">
          <van-field v-model="imageDialog.url" label="图片地址" placeholder="请输入图片URL" />
        </van-tab>
      </van-tabs>
    </van-dialog>

    <!-- 视频弹窗 -->
    <van-dialog v-model:show="videoDialog.show" title="插入视频" show-cancel-button @confirm="confirmVideo">
      <van-tabs v-model:active="videoDialog.tab">
        <van-tab title="上传视频">
          <div class="upload-area">
            <van-uploader v-model="videoDialog.fileList" :max-count="1" :after-read="handleVideoUpload"
              accept="video/*">
              <div class="upload-trigger">
                <van-icon name="video-o" size="32" />
                <span>点击上传视频</span>
              </div>
            </van-uploader>
            <div v-if="videoDialog.uploading" class="upload-loading">
              <van-loading size="24" />
              <div class="upload-info">
                <span>上传中... {{ videoDialog.progress || 0 }}%</span>
                <van-button size="small" type="danger" plain @click="cancelUpload">取消</van-button>
              </div>
              <van-progress v-if="videoDialog.progress" :percentage="videoDialog.progress" stroke-width="4" />
            </div>
          </div>
        </van-tab>
        <van-tab title="视频链接/嵌入码">
          <van-field v-model="videoDialog.code" type="textarea" rows="4" label="视频"
            placeholder="请粘贴视频嵌入代码（iframe）或视频URL" />
        </van-tab>
      </van-tabs>
    </van-dialog>

    <!-- 文件弹窗 -->
    <van-dialog v-model:show="fileDialog.show" title="插入文件" :show-cancel-button="false" :show-confirm-button="false">
      <div class="upload-area">
        <van-uploader v-model="fileDialog.fileList" :max-count="1" :after-read="handleFileUpload"
          accept=".txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z">
          <div class="upload-trigger">
            <van-icon name="description" size="32" />
            <span>点击上传文件</span>
            <p class="upload-hint">支持文档、压缩包等格式</p>
          </div>
        </van-uploader>
        <div v-if="fileDialog.uploading" class="upload-loading">
          <van-loading size="24" />
          <div class="upload-info">
            <span>上传中... {{ fileDialog.progress || 0 }}%</span>
            <van-button size="small" type="danger" plain @click="cancelUpload">取消</van-button>
          </div>
          <van-progress v-if="fileDialog.progress" :percentage="fileDialog.progress" stroke-width="4" />
        </div>
      </div>
    </van-dialog>

    <!-- 表格弹窗 -->
    <van-dialog v-model:show="tableDialog.show" title="插入表格" show-cancel-button @confirm="confirmTable">
      <div class="table-config">
        <van-field v-model="tableDialog.rows" type="digit" label="行数" placeholder="请输入行数" />
        <van-field v-model="tableDialog.cols" type="digit" label="列数" placeholder="请输入列数" />
        <van-checkbox v-model="tableDialog.withHeader" shape="square">包含表头</van-checkbox>
        <van-field v-if="tableDialog.withHeader" v-model="tableDialog.headers" label="表头" placeholder="逗号分隔，如：姓名,年龄" />
        <van-field v-model="tableDialog.defaultContent" label="默认值" placeholder="单元格默认内容" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { ICONS, TITLES, DEFAULT_TOOLBAR } from './constants';
import { createExtensions } from './extensions';
import { useCommands } from './useCommands';
import { useUpload } from './useUpload';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入内容...' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  minHeight: { type: String, default: '120px' },
  maxHeight: { type: String, default: '400px' },
  showToolbar: { type: Boolean, default: true },
  autofocus: { type: Boolean, default: false },
  uploadImage: { type: Function, default: null },
  uploadVideo: { type: Function, default: null },
  uploadFile: { type: Function, default: null },
  maxImageSize: { type: Number, default: null }, // 图片最大文件大小（字节）
  maxVideoSize: { type: Number, default: null }, // 视频最大文件大小（字节）
  maxFileSize: { type: Number, default: null }, // 文件最大文件大小（字节）
  toolbar: { type: Array, default: () => DEFAULT_TOOLBAR },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'ready']);

const toolbarItems = computed(() => props.toolbar);

// 创建编辑器
const editor = useEditor({
  content: props.modelValue,
  editable: !props.readonly && !props.disabled,
  autofocus: props.autofocus,
  extensions: createExtensions(props.placeholder),
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
  onFocus: ({ event }) => emit('focus', event),
  onBlur: ({ event }) => emit('blur', event),
});

// 使用命令钩子
const {
  linkDialog,
  imageDialog,
  videoDialog,
  fileDialog,
  tableDialog,
  isActive,
  execCommand,
  confirmLink,
  confirmImage,
  confirmVideo,
  confirmTable,
} = useCommands(editor);

// 使用上传钩子
const { handleImageUpload, handleVideoUpload, handleFileUpload, cancelUpload } = useUpload(editor, props, imageDialog, videoDialog, fileDialog);

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, false);
  }
});

watch(() => props.readonly, (val) => {
  editor.value?.setEditable(!val && !props.disabled);
});

watch(() => props.disabled, (val) => {
  editor.value?.setEditable(!val && !props.readonly);
});

onMounted(() => {
  if (editor.value) emit('ready', editor.value);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

defineExpose({ editor });
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
