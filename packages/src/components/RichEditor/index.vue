<!-- File: packages/src/components/RichEditor/index.vue -->
<template>
  <div
    class="rich-editor"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
  >
    <!-- 工具栏 -->
    <div v-if="showToolbar && !readonly" class="editor-toolbar">
      <div class="toolbar-inner">
        <template v-for="(item, index) in toolbarItems" :key="index">
          <span v-if="item === '|'" class="toolbar-divider"></span>
          <button
            v-else
            class="toolbar-btn"
            :class="{ 'is-active': isActive(item) }"
            :title="getTitle(item)"
            :disabled="disabled"
            @click="execCommand(item)"
          >
            <span class="toolbar-icon" v-html="getIcon(item)"></span>
          </button>
        </template>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <editor-content
      class="editor-content"
      :editor="editor"
      :style="{ minHeight, maxHeight }"
    />

    <!-- 链接弹窗 -->
    <van-dialog
      v-model:show="linkDialog.show"
      title="插入链接"
      show-cancel-button
      @confirm="confirmLink"
    >
      <van-field
        v-model="linkDialog.url"
        label="链接"
        placeholder="请输入链接地址"
      />
      <van-field
        v-model="linkDialog.text"
        label="文本"
        placeholder="请输入显示文本"
      />
    </van-dialog>

    <!-- 图片弹窗 -->
    <van-dialog
      v-model:show="imageDialog.show"
      title="插入图片"
      show-cancel-button
      @confirm="confirmImage"
    >
      <van-tabs v-model:active="imageDialog.tab">
        <van-tab title="上传图片">
          <div class="upload-area">
            <van-uploader
              v-model="imageDialog.fileList"
              :max-count="1"
              :after-read="handleImageUpload"
              accept="image/*"
            >
              <div class="upload-trigger">
                <van-icon name="photograph" size="32" />
                <span>点击上传图片</span>
              </div>
            </van-uploader>
            <div v-if="imageDialog.uploading" class="upload-loading">
              <van-loading size="24" />
              <span>上传中...</span>
            </div>
          </div>
        </van-tab>
        <van-tab title="图片链接">
          <van-field
            v-model="imageDialog.url"
            label="图片地址"
            placeholder="请输入图片URL"
          />
        </van-tab>
      </van-tabs>
    </van-dialog>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- 视频弹窗 -->
    <van-dialog
      v-model:show="videoDialog.show"
      title="插入视频"
      show-cancel-button
      @confirm="confirmVideo"
    >
      <van-tabs v-model:active="videoDialog.tab">
        <van-tab title="上传视频">
          <div class="upload-area">
            <van-uploader
              v-model="videoDialog.fileList"
              :max-count="1"
              :after-read="handleVideoUpload"
              accept="video/*"
            >
              <div class="upload-trigger">
                <van-icon name="video-o" size="32" />
                <span>点击上传视频</span>
              </div>
            </van-uploader>
            <div v-if="videoDialog.uploading" class="upload-loading">
              <van-loading size="24" />
              <span>上传中...</span>
            </div>
          </div>
        </van-tab>
        <van-tab title="视频链接/嵌入码">
          <van-field
            v-model="videoDialog.code"
            type="textarea"
            rows="4"
            label="视频"
            placeholder="请粘贴视频嵌入代码（iframe）或视频URL"
          />
        </van-tab>
      </van-tabs>
    </van-dialog>

    <!-- 表格弹窗 -->
    <van-dialog
      v-model:show="tableDialog.show"
      title="插入表格"
      show-cancel-button
      @confirm="confirmTable"
    >
      <div class="table-config">
        <van-field
          v-model="tableDialog.rows"
          type="digit"
          label="行数"
          placeholder="请输入行数"
        />
        <van-field
          v-model="tableDialog.cols"
          type="digit"
          label="列数"
          placeholder="请输入列数"
        />
        <van-checkbox v-model="tableDialog.withHeader" shape="square">
          包含表头
        </van-checkbox>
        <van-field
          v-if="tableDialog.withHeader"
          v-model="tableDialog.headers"
          label="表头"
          placeholder="逗号分隔，如：姓名,年龄"
        />
        <van-field
          v-model="tableDialog.defaultContent"
          label="默认值"
          placeholder="单元格默认内容"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Node, mergeAttributes } from "@tiptap/core";

// 自定义 iframe 视频扩展（用于嵌入代码）
const IframeVideo = Node.create({
  name: "iframeVideo",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      frameborder: { default: "0" },
      allowfullscreen: { default: true },
    };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "video-wrapper" },
      ["iframe", mergeAttributes(HTMLAttributes)],
    ];
  },
  addCommands() {
    return {
      setIframeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});

// 自定义本地视频扩展（用于上传的视频）
const NativeVideo = Node.create({
  name: "nativeVideo",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      poster: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "video-wrapper native-video" },
      ["video", mergeAttributes(HTMLAttributes, { controls: true })],
    ];
  },
  addCommands() {
    return {
      setNativeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "请输入内容..." },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  minHeight: { type: String, default: "120px" },
  maxHeight: { type: String, default: "400px" },
  showToolbar: { type: Boolean, default: true },
  autofocus: { type: Boolean, default: false },
  // 图片上传函数，返回 Promise<string> (图片URL)
  uploadImage: { type: Function, default: null },
  // 视频上传函数，返回 Promise<string> (视频URL)
  uploadVideo: { type: Function, default: null },
  toolbar: {
    type: Array,
    default: () => [
      "bold",
      "italic",
      "underline",
      "strike",
      "|",
      "heading",
      "bulletList",
      "orderedList",
      "|",
      "link",
      "image",
      "video",
      "table",
      "|",
      "alignLeft",
      "alignCenter",
      "alignRight",
      "|",
      "undo",
      "redo",
    ],
  },
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "ready"]);

const toolbarItems = computed(() => props.toolbar);

// 弹窗状态
const linkDialog = ref({ show: false, url: "", text: "" });
const imageDialog = ref({
  show: false,
  url: "",
  tab: 0,
  fileList: [],
  uploading: false,
});
const videoDialog = ref({
  show: false,
  code: "",
  tab: 0,
  fileList: [],
  uploading: false,
});
const tableDialog = ref({
  show: false,
  rows: 3,
  cols: 3,
  withHeader: true,
  headers: "",
  defaultContent: "",
});

// 图标映射
const icons = {
  bold: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z"/></svg>',
  italic:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z"/></svg>',
  underline:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2ZM4 20h16v2H4v-2Z"/></svg>',
  strike:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846ZM12 7c-1.837 0-2.755.673-2.755 2.02 0 .467.168.858.503 1.172l.166.149H6.012A4.054 4.054 0 0 1 5.8 9.02C5.8 6.34 7.73 5 11.59 5c1.499 0 2.988.318 4.47.954v2.182A9.382 9.382 0 0 0 12 7Z"/></svg>',
  heading:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16Zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21Z"/></svg>',
  bulletList:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z"/></svg>',
  orderedList:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h3.5v1H4v1h1.5v1H3v-4Zm2 9v1H3v-1h1v-1H3v-1h3v4H4v-1h1Zm3-6h13v2H8v-2Zm0 7h13v2H8v-2Z"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-7.071-7.071L9.879 7.05 8.464 5.636l1.414-1.414a7 7 0 1 1 9.9 9.9l-1.414 1.414Zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414Zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07Z"/></svg>',
  image:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828ZM20 15V5H4v14L14 9l6 6Zm0 2.828-6-6L6.828 19H20v-1.172ZM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>',
  alignLeft:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 4h18v2H3V4Zm0 8h18v2H3v-2Zm0 8h18v2H3v-2Zm0-12h12v2H3V8Zm0 8h12v2H3v-2Z"/></svg>',
  alignCenter:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 4h18v2H3V4Zm2 4h14v2H5V8Zm-2 4h18v2H3v-2Zm2 4h14v2H5v-2Zm-2 4h18v2H3v-2Z"/></svg>',
  alignRight:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 4h18v2H3V4Zm6 4h12v2H9V8Zm-6 4h18v2H3v-2Zm6 4h12v2H9v-2Zm-6 4h18v2H3v-2Z"/></svg>',
  undo: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828Z"/></svg>',
  redo: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7Z"/></svg>',
  video:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993ZM4 5v14h16V5H4Zm6.622 3.415 4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252A.4.4 0 0 1 10 15.253V8.747a.4.4 0 0 1 .622-.332Z"/></svg>',
  table:
    '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v4h6V5H5Zm8 0v4h6V5h-6Zm6 6h-6v4h6v-4Zm0 6h-6v4h6v-4ZM11 19v-4H5v4h6Zm-6-6h6v-4H5v4Z"/></svg>',
};

const titles = {
  bold: "粗体",
  italic: "斜体",
  underline: "下划线",
  strike: "删除线",
  heading: "标题",
  bulletList: "无序列表",
  orderedList: "有序列表",
  link: "链接",
  image: "图片",
  video: "视频",
  table: "表格",
  alignLeft: "左对齐",
  alignCenter: "居中",
  alignRight: "右对齐",
  undo: "撤销",
  redo: "重做",
};

const getIcon = (name) => icons[name] || "";
const getTitle = (name) => titles[name] || "";

// 创建编辑器
const editor = useEditor({
  content: props.modelValue,
  editable: !props.readonly && !props.disabled,
  autofocus: props.autofocus,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
    }),
    IframeVideo,
    NativeVideo,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Typography,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  onFocus: ({ event }) => emit("focus", event),
  onBlur: ({ event }) => emit("blur", event),
});

// 判断当前状态
const isActive = (name) => {
  if (!editor.value) return false;
  const map = {
    bold: () => editor.value.isActive("bold"),
    italic: () => editor.value.isActive("italic"),
    underline: () => editor.value.isActive("underline"),
    strike: () => editor.value.isActive("strike"),
    heading: () => editor.value.isActive("heading"),
    bulletList: () => editor.value.isActive("bulletList"),
    orderedList: () => editor.value.isActive("orderedList"),
    link: () => editor.value.isActive("link"),
    alignLeft: () => editor.value.isActive({ textAlign: "left" }),
    alignCenter: () => editor.value.isActive({ textAlign: "center" }),
    alignRight: () => editor.value.isActive({ textAlign: "right" }),
  };
  return map[name]?.() || false;
};

// 执行命令
const execCommand = (name) => {
  if (!editor.value) return;
  const commands = {
    bold: () => editor.value.chain().focus().toggleBold().run(),
    italic: () => editor.value.chain().focus().toggleItalic().run(),
    underline: () => editor.value.chain().focus().toggleUnderline().run(),
    strike: () => editor.value.chain().focus().toggleStrike().run(),
    heading: () =>
      editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    bulletList: () => editor.value.chain().focus().toggleBulletList().run(),
    orderedList: () => editor.value.chain().focus().toggleOrderedList().run(),
    link: () => {
      linkDialog.value = { show: true, url: "", text: "" };
    },
    image: () => {
      imageDialog.value = {
        show: true,
        url: "",
        tab: 0,
        fileList: [],
        uploading: false,
      };
    },
    video: () => {
      videoDialog.value = {
        show: true,
        code: "",
        tab: 0,
        fileList: [],
        uploading: false,
      };
    },
    table: () => {
      tableDialog.value = {
        show: true,
        rows: 3,
        cols: 3,
        withHeader: true,
        headers: "",
        defaultContent: "",
      };
    },
    alignLeft: () => editor.value.chain().focus().setTextAlign("left").run(),
    alignCenter: () =>
      editor.value.chain().focus().setTextAlign("center").run(),
    alignRight: () => editor.value.chain().focus().setTextAlign("right").run(),
    undo: () => editor.value.chain().focus().undo().run(),
    redo: () => editor.value.chain().focus().redo().run(),
  };
  commands[name]?.();
};

const confirmLink = () => {
  if (linkDialog.value.url) {
    editor.value.chain().focus().setLink({ href: linkDialog.value.url }).run();
  }
};

const confirmImage = () => {
  if (imageDialog.value.url) {
    editor.value.chain().focus().setImage({ src: imageDialog.value.url }).run();
    imageDialog.value = {
      show: false,
      url: "",
      tab: 0,
      fileList: [],
      uploading: false,
    };
  }
};

// 处理图片上传
const handleImageUpload = async (file) => {
  if (!props.uploadImage) {
    // 没有上传函数，使用 base64
    editor.value.chain().focus().setImage({ src: file.content }).run();
    imageDialog.value = {
      show: false,
      url: "",
      tab: 0,
      fileList: [],
      uploading: false,
    };
    return;
  }

  try {
    imageDialog.value.uploading = true;
    const url = await props.uploadImage(file.file);
    if (url) {
      editor.value.chain().focus().setImage({ src: url }).run();
    }
    imageDialog.value = {
      show: false,
      url: "",
      tab: 0,
      fileList: [],
      uploading: false,
    };
  } catch (e) {
    console.error("图片上传失败:", e);
    imageDialog.value.uploading = false;
  }
};

// 处理文件选择（用于拖拽或粘贴）
const handleFileSelect = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (props.uploadImage) {
    try {
      const url = await props.uploadImage(file);
      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run();
      }
    } catch (err) {
      console.error("图片上传失败:", err);
    }
  } else {
    // 转为 base64
    const reader = new FileReader();
    reader.onload = () => {
      editor.value.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  }
  e.target.value = "";
};

const confirmVideo = () => {
  const code = videoDialog.value.code.trim();
  if (!code) return;

  // 从 iframe 代码中提取 src
  const srcMatch = code.match(/src=["']([^"']+)["']/);
  if (srcMatch) {
    editor.value.chain().focus().setIframeVideo({ src: srcMatch[1] }).run();
  } else if (code.startsWith("http")) {
    // 直接是 URL，转换为嵌入格式
    let embedUrl = code;
    let isNativeVideo = false;

    // 检查是否是直接视频文件
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(code)) {
      isNativeVideo = true;
    }
    // YouTube
    else if (code.includes("youtube.com/watch")) {
      const videoId = code.match(/v=([^&]+)/)?.[1];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (code.includes("youtu.be/")) {
      const videoId = code.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // Bilibili
    else if (code.includes("bilibili.com/video/")) {
      const bvMatch = code.match(/video\/(BV[^/?]+)/);
      if (bvMatch)
        embedUrl = `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}`;
    }

    if (isNativeVideo) {
      editor.value.chain().focus().setNativeVideo({ src: embedUrl }).run();
    } else {
      editor.value.chain().focus().setIframeVideo({ src: embedUrl }).run();
    }
  }
  videoDialog.value = {
    show: false,
    code: "",
    tab: 0,
    fileList: [],
    uploading: false,
  };
};

// 确认插入表格
const confirmTable = () => {
  const rows = Math.max(1, Math.min(parseInt(tableDialog.value.rows) || 3, 20));
  const cols = Math.max(1, Math.min(parseInt(tableDialog.value.cols) || 3, 10));
  const withHeader = tableDialog.value.withHeader;
  const headers = tableDialog.value.headers
    .split(/[,，]/)
    .map((h) => h.trim())
    .filter(Boolean);
  const defaultContent = tableDialog.value.defaultContent || "";

  // 构建表格 HTML
  let tableHtml = "<table>";

  // 表头行
  if (withHeader) {
    tableHtml += "<tr>";
    for (let c = 0; c < cols; c++) {
      const content = headers[c] || `列${c + 1}`;
      tableHtml += `<th><p>${content}</p></th>`;
    }
    tableHtml += "</tr>";
  }

  // 数据行
  const dataRows = withHeader ? rows - 1 : rows;
  for (let r = 0; r < dataRows; r++) {
    tableHtml += "<tr>";
    for (let c = 0; c < cols; c++) {
      tableHtml += `<td><p>${defaultContent}</p></td>`;
    }
    tableHtml += "</tr>";
  }

  tableHtml += "</table>";

  editor.value.chain().focus().insertContent(tableHtml).run();

  tableDialog.value = {
    show: false,
    rows: 3,
    cols: 3,
    withHeader: true,
    headers: "",
    defaultContent: "",
  };
};

// 处理视频上传
const handleVideoUpload = async (file) => {
  if (!props.uploadVideo) {
    // 没有上传函数，使用 Object URL（比 base64 更高效）
    const objectUrl = URL.createObjectURL(file.file);
    editor.value.chain().focus().setNativeVideo({ src: objectUrl }).run();
    videoDialog.value = {
      show: false,
      code: "",
      tab: 0,
      fileList: [],
      uploading: false,
    };
    return;
  }

  try {
    videoDialog.value.uploading = true;
    const url = await props.uploadVideo(file.file);
    if (url) {
      editor.value.chain().focus().setNativeVideo({ src: url }).run();
    }
    videoDialog.value = {
      show: false,
      code: "",
      tab: 0,
      fileList: [],
      uploading: false,
    };
  } catch (e) {
    console.error("视频上传失败:", e);
    videoDialog.value.uploading = false;
  }
};

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val, false);
    }
  }
);

watch(
  () => props.readonly,
  (val) => {
    editor.value?.setEditable(!val && !props.disabled);
  }
);

watch(
  () => props.disabled,
  (val) => {
    editor.value?.setEditable(!val && !props.readonly);
  }
);

onMounted(() => {
  if (editor.value) emit("ready", editor.value);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

defineExpose({ editor });
</script>

<style lang="scss" scoped>
.upload-area {
  padding: 16px;
  text-align: center;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ff6600;
    color: #ff6600;
  }

  span {
    margin-top: 8px;
    font-size: 12px;
  }
}

.upload-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.table-config {
  padding: 16px;

  .van-checkbox {
    margin-top: 12px;
  }
}

.rich-editor {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;

  &.is-disabled {
    opacity: 0.6;
    background: #f5f5f5;

    .editor-content {
      pointer-events: none;

      :deep(a) {
        pointer-events: none;
        cursor: default;
        color: #999;
      }
    }
  }

  &.is-readonly {
    .editor-content {
      background: #fafafa;

      :deep(a) {
        pointer-events: none;
        cursor: default;
      }
    }
  }
}

.editor-toolbar {
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.toolbar-inner {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 4px;
  min-width: max-content;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #e5e5e5;
    color: #333;
  }

  &:active {
    transform: scale(0.95);
  }

  &.is-active {
    background: #ff6600;
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.toolbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #ddd;
  margin: 0 4px;
  flex-shrink: 0;
}

.editor-content {
  padding: 12px 16px;
  overflow-y: auto;

  :deep(.tiptap) {
    outline: none;
    min-height: 100%;

    > * + * {
      margin-top: 0.75em;
    }

    p {
      margin: 0;
      line-height: 1.6;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.4;
      margin: 0;
      font-weight: 600;
    }

    h1 {
      font-size: 1.75em;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.25em;
    }

    ul,
    ol {
      padding-left: 1.5em;
      margin: 0;
    }

    li {
      margin: 0.25em 0;
    }

    a {
      color: #ff6600;
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; // 16:9
      margin: 0.5em 0;
      border-radius: 8px;
      overflow: hidden;
      background: #000;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      }

      &.native-video {
        padding-bottom: 0;

        video {
          width: 100%;
          max-height: 400px;
          display: block;
        }
      }
    }

    blockquote {
      border-left: 3px solid #ff6600;
      padding-left: 1em;
      margin: 0;
      color: #666;
    }

    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }

    pre {
      background: #1a1a1a;
      color: #fff;
      padding: 1em;
      border-radius: 8px;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
        color: inherit;
      }
    }

    hr {
      border: none;
      border-top: 1px solid #e5e5e5;
      margin: 1em 0;
    }

    // Placeholder 样式
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
    }

    // 表格样式
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5em 0;
      overflow: hidden;
      table-layout: fixed;

      td,
      th {
        border: 1px solid #e5e5e5;
        padding: 8px 12px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        min-width: 50px;

        > * {
          margin: 0;
        }
      }

      th {
        background: #f7f8fa;
        font-weight: 600;
        text-align: left;
      }

      // 表格对齐样式
      .cell-align-left {
        text-align: left !important;
      }

      .cell-align-center {
        text-align: center !important;
      }

      .cell-align-right {
        text-align: right !important;
      }

      &.table-align-center {
        td,
        th {
          text-align: center;
        }
      }

      &.table-align-right {
        td,
        th {
          text-align: right;
        }
      }

      .selectedCell {
        background: #fff3e0;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background: #ff6600;
        pointer-events: none;
      }
    }

    .tableWrapper {
      overflow-x: auto;
      margin: 0.5em 0;
    }
  }
}

// 响应式布局 - 平板
@media screen and (max-width: 768px) {
  .toolbar-inner {
    padding: 6px;
    gap: 2px;
  }

  .toolbar-btn {
    width: 32px;
    height: 32px;

    .toolbar-icon svg {
      width: 16px;
      height: 16px;
    }
  }

  .toolbar-divider {
    height: 16px;
    margin: 0 2px;
  }

  .editor-content {
    padding: 10px 12px;

    :deep(.tiptap) {
      font-size: 15px;

      h1 {
        font-size: 1.5em;
      }
      h2 {
        font-size: 1.3em;
      }
      h3 {
        font-size: 1.15em;
      }

      table {
        td,
        th {
          padding: 6px 8px;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式布局 - 手机
@media screen and (max-width: 480px) {
  .toolbar-inner {
    padding: 4px;
    gap: 1px;
  }

  .toolbar-btn {
    width: 28px;
    height: 28px;
    border-radius: 4px;

    .toolbar-icon svg {
      width: 14px;
      height: 14px;
    }
  }

  .toolbar-divider {
    height: 14px;
    margin: 0 1px;
  }

  .editor-content {
    padding: 8px 10px;

    :deep(.tiptap) {
      font-size: 14px;
      line-height: 1.5;

      h1 {
        font-size: 1.4em;
      }
      h2 {
        font-size: 1.2em;
      }
      h3 {
        font-size: 1.1em;
      }

      ul,
      ol {
        padding-left: 1.2em;
      }

      table {
        td,
        th {
          padding: 4px 6px;
          font-size: 13px;
          min-width: 40px;
        }
      }

      .video-wrapper {
        border-radius: 4px;
      }

      blockquote {
        padding-left: 0.8em;
      }

      pre {
        padding: 0.8em;
        border-radius: 6px;
        font-size: 12px;
      }
    }
  }
}

// 超小屏幕
@media screen and (max-width: 360px) {
  .toolbar-btn {
    width: 26px;
    height: 26px;

    .toolbar-icon svg {
      width: 12px;
      height: 12px;
    }
  }

  .editor-content {
    padding: 6px 8px;

    :deep(.tiptap) {
      font-size: 13px;
    }
  }
}
</style>
