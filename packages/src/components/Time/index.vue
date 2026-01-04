<template>
    <span class="chat-time" :title="fullTime">{{ displayTime }}</span>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    time: {
        type: [Number, String, Date],
        required: true
    },
    format: {
        type: String,
        default: 'auto' // auto, relative, full, date, time
    },
    autoUpdate: {
        type: Boolean,
        default: true
    }
});

const now = ref(Date.now());
let timer = null;

const timestamp = computed(() => {
    if (props.time instanceof Date) {
        return props.time.getTime();
    }
    if (typeof props.time === 'string') {
        return new Date(props.time).getTime();
    }
    return props.time;
});

const fullTime = computed(() => {
    const date = new Date(timestamp.value);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
});

const displayTime = computed(() => {
    const date = new Date(timestamp.value);

    if (props.format === 'full') {
        return fullTime.value;
    }

    if (props.format === 'date') {
        return date.toLocaleDateString('zh-CN');
    }

    if (props.format === 'time') {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    if (props.format === 'relative') {
        return getRelativeTime(timestamp.value, now.value);
    }

    // auto format
    const diff = now.value - timestamp.value;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < 60 * 1000) {
        return '刚刚';
    }

    if (diff < oneDay) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    if (diff < 2 * oneDay) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    if (diff < 7 * oneDay) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return '周' + days[date.getDay()] + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    const currentYear = new Date().getFullYear();
    if (date.getFullYear() === currentYear) {
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' +
            date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
});

const getRelativeTime = (time, currentTime) => {
    const diff = currentTime - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    if (months < 12) return `${months}个月前`;
    return `${years}年前`;
};

const startTimer = () => {
    if (props.autoUpdate && props.format !== 'full' && props.format !== 'date') {
        timer = setInterval(() => {
            now.value = Date.now();
        }, 60000); // 每分钟更新一次
    }
};

const stopTimer = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
.chat-time {
    font-size: 12px;
    color: #969799;
    white-space: nowrap;
}
</style>
