import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

// 自定义 iframe 视频扩展
export const IframeVideo = Node.create({
  name: 'iframeVideo',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      frameborder: { default: '0' },
      allowfullscreen: { default: true },
    };
  },
  parseHTML() {
    return [{ tag: 'iframe[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'video-wrapper' }, ['iframe', mergeAttributes(HTMLAttributes)]];
  },
  addCommands() {
    return {
      setIframeVideo: (options) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: options });
      },
    };
  },
});

// 自定义本地视频扩展
export const NativeVideo = Node.create({
  name: 'nativeVideo',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      poster: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: 'video[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'video-wrapper native-video' },
      ['video', mergeAttributes(HTMLAttributes, { controls: true })],
    ];
  },
  addCommands() {
    return {
      setNativeVideo: (options) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: options });
      },
    };
  },
});

// 创建编辑器扩展配置
export function createExtensions(placeholder) {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
    }),
    IframeVideo,
    NativeVideo,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder }),
    Typography,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ];
}
