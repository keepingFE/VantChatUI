# ChatVant

ChatVant is a lightweight, mobile-first chat UI component library built with **Vue 3** and **Vant 4**. It provides a set of flexible components to help you build chat interfaces quickly, especially suitable for AI chat applications.

## Features

- 🚀 **Vue 3 & Vant 4**: Built on modern tech stack.
- 📱 **Mobile First**: Designed for mobile web applications.
- 💬 **Rich Components**: Includes Chat container, Message bubbles, Composer input, Typing indicators, and more.
- 🤖 **AI Ready**: Built-in `Thinking` and `Typing` components, perfect for LLM chat interfaces.
- 🎨 **Customizable**: Flexible slots and props for deep customization.
- 📜 **Auto Scroll**: Built-in hooks for smooth auto-scrolling behavior.

## Components

- **Chat**: The main container for the chat interface.
- **Message**: Renders chat messages (text, image, etc.) with support for different positions (left/right).
- **Composer**: The input area with support for text input, file uploads, and emoji picker.
- **Typing**: A typing indicator bubble.
- **Thinking**: A "thinking" state indicator, useful for AI processing states.
- **EmojiPicker**: An emoji picker component.

## Getting Started

### Prerequisites

- Node.js >= 16
- Vue >= 3.4
- Vant >= 4.8

### Installation

Currently, this project is set up as a monorepo. To use it, you can clone the repository and build it locally.

```bash
git clone https://github.com/your-username/chatvant.git
cd chatvant
npm install
```

### Running the Demo

To see the components in action, you can run the example project:

```bash
npm run dev
```

This will start a Vite development server where you can preview the chat UI.

## Usage

Here is a basic example of how to use ChatVant components in your Vue 3 application:

```vue
<template>
  <Chat ref="chatRef">
    <!-- Message List -->
    <template #default>
      <Message 
        v-for="msg in messages" 
        :key="msg._id" 
        :msg="msg" 
      />
      <!-- AI Thinking State -->
      <Thinking v-if="isThinking" text="Thinking..." />
    </template>

    <!-- Input Area -->
    <template #composer>
      <Composer @send="handleSend" />
    </template>
  </Chat>
</template>

<script setup>
import { ref } from 'vue'
import { Chat, Message, Composer, Thinking } from 'chatvant' // Adjust import path as needed

const messages = ref([
  {
    _id: '1',
    type: 'text',
    content: 'Hello! How can I help you?',
    position: 'left',
    user: { name: 'AI Assistant', avatar: '...' }
  }
])

const isThinking = ref(false)

const handleSend = (text) => {
  // Add user message
  messages.value.push({
    _id: Date.now(),
    type: 'text',
    content: text,
    position: 'right',
    user: { name: 'Me', avatar: '...' }
  })
  
  // Simulate AI response
  isThinking.value = true
  // ... logic to get response
}
</script>
```

## Project Structure

```
chatvant/
├── examples/          # Demo application using the library
├── packages/          # Library source code
│   └── src/
│       ├── components/  # UI Components (Chat, Message, etc.)
│       └── hooks/       # Composable hooks (useAutoScroll, etc.)
├── package.json       # Project configuration
└── README.md          # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `package.json` for more information.
