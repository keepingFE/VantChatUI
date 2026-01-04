import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ChatVant',
      formats: ['es', 'umd'],
      fileName: (format) => `chatvant.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vant', 'vue-router', '@tiptap/vue-3', '@tiptap/starter-kit', '@tiptap/extension-placeholder', '@tiptap/extension-link', '@tiptap/extension-image', '@tiptap/extension-underline', '@tiptap/extension-text-style', '@tiptap/extension-color', '@tiptap/extension-text-align', '@tiptap/extension-table', '@tiptap/extension-table-row', '@tiptap/extension-table-cell', '@tiptap/extension-table-header', '@tiptap/extension-typography', 'echarts', 'markdown-it', 'highlight.js'],
      output: {
        globals: {
          vue: 'Vue',
          vant: 'Vant',
          '@tiptap/vue-3': 'TiptapVue3',
          '@tiptap/starter-kit': 'TiptapStarterKit',
          '@tiptap/extension-underline': 'TiptapUnderline',
          '@tiptap/extension-link': 'TiptapLink',
          '@tiptap/extension-image': 'TiptapImage',
          '@tiptap/extension-text-align': 'TiptapTextAlign',
          '@tiptap/extension-placeholder': 'TiptapPlaceholder',
          '@tiptap/extension-typography': 'TiptapTypography',
          '@tiptap/extension-table': 'TiptapTable',
          '@tiptap/extension-table-row': 'TiptapTableRow',
          '@tiptap/extension-table-cell': 'TiptapTableCell',
          '@tiptap/extension-table-header': 'TiptapTableHeader',
          '@tiptap/extension-text-style': 'TiptapTextStyle',
          '@tiptap/extension-color': 'TiptapColor',
          'echarts': 'echarts',
          'markdown-it': 'markdownit',
          'highlight.js': 'hljs'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'chatvant.css';
          return assetInfo.name;
        }
      },
      maxParallelFileOps: 30
    },
    outDir: 'dist',
    cssCodeSplit: false,
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2015',
    // 关闭报告压缩大小，节省时间
    reportCompressedSize: false,
    // 减少 CSS 处理时间
    cssMinify: 'esbuild'
  }
});
