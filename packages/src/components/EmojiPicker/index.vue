<template>
    <div class="chat-emoji-picker">
        <div class="chat-emoji-picker__tabs">
            <div v-for="category in categories" :key="category.key" class="chat-emoji-picker__tab"
                :class="{ 'chat-emoji-picker__tab--active': activeCategory === category.key }"
                @click="activeCategory = category.key">
                {{ category.icon }}
            </div>
        </div>

        <div class="chat-emoji-picker__content">
            <div class="chat-emoji-picker__grid">
                <div v-for="emoji in currentEmojis" :key="emoji" class="chat-emoji-picker__item"
                    @click="handleSelect(emoji)">
                    {{ emoji }}
                </div>
            </div>
        </div>

        <div v-if="showRecent && recentEmojis.length" class="chat-emoji-picker__recent">
            <div class="chat-emoji-picker__recent-title">最近使用</div>
            <div class="chat-emoji-picker__grid">
                <div v-for="emoji in recentEmojis" :key="emoji" class="chat-emoji-picker__item"
                    @click="handleSelect(emoji)">
                    {{ emoji }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    showRecent: {
        type: Boolean,
        default: true
    },
    maxRecent: {
        type: Number,
        default: 24
    }
});

const emit = defineEmits(['select']);

const activeCategory = ref('smileys');
const recentEmojis = ref([]);

const categories = [
    { key: 'smileys', icon: '😀', label: '表情' },
    { key: 'gestures', icon: '👋', label: '手势' },
    { key: 'animals', icon: '🐶', label: '动物' },
    { key: 'food', icon: '🍎', label: '食物' },
    { key: 'travel', icon: '🚗', label: '旅行' },
    { key: 'objects', icon: '⚽', label: '物品' },
    { key: 'symbols', icon: '❤️', label: '符号' }
];

const emojiData = {
    smileys: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
        '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
        '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕'
    ],
    gestures: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️',
        '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕',
        '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜',
        '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪'
    ],
    animals: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
        '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
        '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞'
    ],
    food: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈',
        '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
        '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔',
        '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚'
    ],
    travel: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
        '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵',
        '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡',
        '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅'
    ],
    objects: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
        '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
        '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊',
        '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️'
    ],
    symbols: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
        '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
        '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈'
    ]
};

const currentEmojis = computed(() => {
    return emojiData[activeCategory.value] || [];
});

const handleSelect = (emoji) => {
    emit('select', emoji);
    addToRecent(emoji);
};

const addToRecent = (emoji) => {
    const index = recentEmojis.value.indexOf(emoji);
    if (index > -1) {
        recentEmojis.value.splice(index, 1);
    }
    recentEmojis.value.unshift(emoji);
    if (recentEmojis.value.length > props.maxRecent) {
        recentEmojis.value = recentEmojis.value.slice(0, props.maxRecent);
    }
    saveRecent();
};

const loadRecent = () => {
    try {
        const saved = localStorage.getItem('chat-recent-emojis');
        if (saved) {
            recentEmojis.value = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load recent emojis:', error);
    }
};

const saveRecent = () => {
    try {
        localStorage.setItem('chat-recent-emojis', JSON.stringify(recentEmojis.value));
    } catch (error) {
        console.error('Failed to save recent emojis:', error);
    }
};

onMounted(() => {
    loadRecent();
});
</script>

<style scoped>
.chat-emoji-picker {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.chat-emoji-picker__tabs {
    display: flex;
    border-bottom: 1px solid #ebedf0;
    padding: 8px;
    gap: 4px;
    overflow-x: auto;
}

.chat-emoji-picker__tab {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.chat-emoji-picker__tab:hover {
    background-color: #f7f8fa;
}

.chat-emoji-picker__tab--active {
    background-color: #e8f3ff;
}

.chat-emoji-picker__content {
    padding: 12px;
    max-height: 240px;
    overflow-y: auto;
}

.chat-emoji-picker__grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
}

.chat-emoji-picker__item {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.chat-emoji-picker__item:hover {
    background-color: #f7f8fa;
    transform: scale(1.2);
}

.chat-emoji-picker__recent {
    border-top: 1px solid #ebedf0;
    padding: 12px;
}

.chat-emoji-picker__recent-title {
    font-size: 12px;
    color: #969799;
    margin-bottom: 8px;
}

@media (max-width: 768px) {
    .chat-emoji-picker__grid {
        grid-template-columns: repeat(7, 1fr);
    }
}
</style>
