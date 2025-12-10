// File: packages/src/index.js
// 组件库统一导出入口

// 导出组件
export { default as Chat } from "./components/Chat/index.vue";
export { default as Message } from "./components/Message/index.vue";
export { default as Composer } from "./components/Composer/index.vue";
export { default as Typing } from "./components/Typing/index.vue";
export { default as Thinking } from "./components/Thinking/index.vue";
export { default as EmojiPicker } from "./components/EmojiPicker/index.vue";
export { default as SystemMessage } from "./components/SystemMessage/index.vue";
export { default as MessageStatus } from "./components/MessageStatus/index.vue";
export { default as FileCard } from "./components/FileCard/index.vue";
export { default as Card } from "./components/Card/index.vue";
export { default as Search } from "./components/Search/index.vue";
export { default as Button } from "./components/Button/index.vue";
export { default as ButtonGroup } from "./components/ButtonGroup/index.vue";
export { default as Flex } from "./components/Flex/index.vue";
export { default as FlexItem } from "./components/FlexItem/index.vue";
export { default as Image } from "./components/Image/index.vue";
export { default as Checkbox } from "./components/Checkbox/index.vue";
export { default as CheckboxGroup } from "./components/CheckboxGroup/index.vue";
export { default as Input } from "./components/Input/index.vue";
export { default as RichEditor } from "./components/RichEditor/index.vue";
export { default as ChunkUploader } from "./components/ChunkUploader/index.vue";

// 导出 Hooks
export { useAutoScroll } from "./hooks/useAutoScroll.js";
export { useTypewriter } from "./hooks/useTypewriter.js";
