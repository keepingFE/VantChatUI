<template>
  <Popup v-model:show="visible" position="bottom" round>
    <div style="height: 300px; background: white; padding: 20px;">
      <h3>表情选择</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <span v-for="(emoji, index) in emojiList" :key="index" style="font-size: 24px; cursor: pointer;"
          @click="handleEmojiClick(emoji)">
          {{ emoji }}
        </span>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Popup } from 'vant'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'select'])

const visible = ref(props.show)

watch(() => props.show, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:show', newVal)
})

const emojiList = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
  '👍', '👎', '👌', '✌️', '🤞', '❤️', '🧡', '💛',
]

const handleEmojiClick = (emoji) => {
  emit('select', emoji)
  visible.value = false
}
</script>
