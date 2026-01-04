// File: examples/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'chatvant': resolve(__dirname, '../packages/src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          hoistStatic: false
        }
      }
    }),
    Components({
      resolvers: [VantResolver()],
      dts: false
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true
    },
    sourcemap: false,
    target: 'es2015',
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) return 'vue-vendor';
            if (id.includes('vant')) return 'vant-vendor';
            if (id.includes('@tiptap')) return 'tiptap-vendor';
            if (id.includes('echarts')) return 'echarts-vendor';
            if (id.includes('markdown-it') || id.includes('highlight.js')) return 'markdown-vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) return `img/[name]-[hash].[ext]`;
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) return `fonts/[name]-[hash].[ext]`;
          return `css/[name]-[hash].[ext]`;
        },
        compact: true,
        generatedCode: {
          constBindings: true
        }
      },
      maxParallelFileOps: 50,
      cache: true,
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    reportCompressedSize: false,
    cssCodeSplit: true
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vant'],
    exclude: ['@tiptap/vue-3'],
    force: false
  }
})

