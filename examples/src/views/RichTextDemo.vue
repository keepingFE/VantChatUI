<template>
  <div class="demo-page">
    <Navbar title="RichText 富文本" @back="$router.back()" />

    <div class="demo-content">
      <div class="demo-section">
        <h3>基础 HTML</h3>
        <RichText :content="basicHtml" />
      </div>

      <div class="demo-section">
        <h3>标题和段落</h3>
        <RichText :content="headingHtml" />
      </div>

      <div class="demo-section">
        <h3>列表</h3>
        <RichText :content="listHtml" />
      </div>

      <div class="demo-section">
        <h3>链接和图片</h3>
        <RichText :content="mediaHtml" />
      </div>

      <div class="demo-section">
        <h3>代码块</h3>
        <RichText :content="codeHtml" />
      </div>

      <div class="demo-section">
        <h3>引用</h3>
        <RichText :content="quoteHtml" />
      </div>

      <div class="demo-section">
        <h3>表格</h3>
        <RichText :content="tableHtml" />
      </div>

      <div class="demo-section">
        <h3>文本样式</h3>
        <RichText :content="styleHtml" />
      </div>

      <div class="demo-section">
        <h3>安全过滤（移除脚本）</h3>
        <p style="color: #999; font-size: 14px; margin-bottom: 8px;">
          以下内容包含 script 标签，会被自动过滤
        </p>
        <RichText :content="dangerousHtml" />
      </div>

      <div class="demo-section">
        <h3>长度限制</h3>
        <RichText :content="longHtml" :max-length="100" />
      </div>

      <div class="demo-section">
        <h3>聊天消息示例</h3>
        <div class="message-bubble">
          <RichText :content="chatMessageHtml" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RichText, Navbar } from '../../../packages/src/index.js'
import { useRouter } from 'vue-router'

export default {
  name: 'RichTextDemo',
  components: {
    RichText,
    Navbar
  },
  setup() {
    const $router = useRouter();
    return { $router };
  },
  data() {
    return {
      basicHtml: '<p>这是一段<strong>加粗</strong>的文本，还有<em>斜体</em>和<u>下划线</u>。</p>',

      headingHtml: `
        <h1>一级标题</h1>
        <h2>二级标题</h2>
        <h3>三级标题</h3>
        <p>这是一段普通文本。</p>
      `,

      listHtml: `
        <h4>无序列表：</h4>
        <ul>
          <li>列表项 1</li>
          <li>列表项 2</li>
          <li>列表项 3</li>
        </ul>
        <h4>有序列表：</h4>
        <ol>
          <li>第一步</li>
          <li>第二步</li>
          <li>第三步</li>
        </ol>
      `,

      mediaHtml: `
        <p>这是一个链接：<a href="https://example.com">点击访问</a></p>
        <p>这是一张图片：</p>
        <img src="https://via.placeholder.com/300x200" alt="示例图片">
      `,

      codeHtml: `
        <p>行内代码：<code>const message = 'Hello World'</code></p>
        <p>代码块：</p>
        <pre><code>function greet(name) {
  return 'Hello, ' + name;
}

console.log(greet('World'));</code></pre>
      `,

      quoteHtml: `
        <blockquote>
          这是一段引用文本。可以用来引用他人的话语或重要的信息。
        </blockquote>
        <p>引用后的正文内容。</p>
      `,

      tableHtml: `
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>年龄</th>
              <th>城市</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张三</td>
              <td>25</td>
              <td>北京</td>
            </tr>
            <tr>
              <td>李四</td>
              <td>30</td>
              <td>上海</td>
            </tr>
          </tbody>
        </table>
      `,

      styleHtml: `
        <p>
          <strong>加粗文本</strong>
          <em>斜体文本</em>
          <u>下划线文本</u>
          <s>删除线文本</s>
        </p>
      `,

      dangerousHtml: `
        <p>这是安全的内容</p>
        <p onclick="alert('危险')">这个 onclick 属性会被移除</p>
        <a href="javascript:alert('危险')">这个危险链接会被清理</a>
      `,

      longHtml: '<p>这是一段很长的文本内容，用于测试长度限制功能。当文本超过指定长度时，会被截断并添加省略号。这样可以避免显示过长的内容影响页面布局。</p>',

      chatMessageHtml: `
        <p>你好！我想咨询一下产品信息。</p>
        <p>我们的产品特点：</p>
        <ul>
          <li><strong>高性能</strong>：处理速度快</li>
          <li><strong>易用性</strong>：界面友好</li>
          <li><strong>安全性</strong>：数据加密</li>
        </ul>
        <p>详情请访问：<a href="https://example.com">产品页面</a></p>
      `
    }
  }
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.demo-content {
  padding: 56px 20px 40px;
  max-width: 800px;
  margin: 0 auto;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}

.demo-content::-webkit-scrollbar {
  width: 6px;
}

.demo-content::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
}

.demo-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.demo-section {
  margin-bottom: 30px;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
}

.demo-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #323233;
}

.message-bubble {
  max-width: 80%;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
