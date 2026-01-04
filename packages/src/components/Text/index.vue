<template>
    <div :class="textMessageClasses" :style="containerStyles">
        <template v-for="(segment, index) in parsedSegments" :key="index">
            <!-- 普通文本 -->
            <span v-if="segment.type === 'text'" class="chat-text__segment">
                {{ segment.content }}
            </span>

            <!-- 链接 -->
            <a
                v-else-if="segment.type === 'link'"
                :href="segment.url"
                :target="linkTarget"
                :rel="linkRel"
                class="chat-text__link"
                @click="handleLinkClick(segment)"
            >
                {{ segment.content }}
            </a>

            <!-- @提及 -->
            <span
                v-else-if="segment.type === 'mention'"
                class="chat-text__mention"
                @click="handleMentionClick(segment)"
            >
                @{{ segment.content }}
            </span>

            <!-- 话题标签 -->
            <span
                v-else-if="segment.type === 'hashtag'"
                class="chat-text__hashtag"
                @click="handleHashtagClick(segment)"
            >
                #{{ segment.content }}#
            </span>

            <!-- 换行 -->
            <br v-else-if="segment.type === 'newline'" />

            <!-- 自定义渲染 -->
            <slot
                v-else-if="segment.type === 'custom'"
                name="custom"
                :segment="segment"
                :index="index"
            />
        </template>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    // 文本内容
    text: {
        type: String,
        required: true,
    },
    // 是否识别链接
    detectLinks: {
        type: Boolean,
        default: true,
    },
    // 是否识别 @提及
    detectMentions: {
        type: Boolean,
        default: true,
    },
    // 是否识别话题标签
    detectHashtags: {
        type: Boolean,
        default: true,
    },
    // 链接打开方式
    linkTarget: {
        type: String,
        default: "_blank",
    },
    // 链接 rel 属性
    linkRel: {
        type: String,
        default: "noopener noreferrer",
    },
    // 最大宽度
    maxWidth: {
        type: [String, Number],
        default: "100%",
    },
    // 行数限制（0 表示不限制）
    maxLines: {
        type: Number,
        default: 0,
    },
    // 文本颜色
    color: {
        type: String,
        default: "",
    },
    // 字体大小
    fontSize: {
        type: String,
        default: "",
    },
    // 行高
    lineHeight: {
        type: String,
        default: "1.6",
    },
    // 自定义解析规则
    customParsers: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["link-click", "mention-click", "hashtag-click", "custom-click"]);

const textMessageClasses = computed(() => {
    return [
        "chat-text",
        {
            "chat-text--multiline": props.maxLines === 0,
            "chat-text--single-line": props.maxLines === 1,
            "chat-text--limited": props.maxLines > 1,
        },
    ];
});

const containerStyles = computed(() => {
    const styles = {};
    if (props.maxWidth) {
        styles.maxWidth = typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth;
    }
    if (props.color) {
        styles.color = props.color;
    }
    if (props.fontSize) {
        styles.fontSize = props.fontSize;
    }
    if (props.lineHeight) {
        styles.lineHeight = props.lineHeight;
    }
    if (props.maxLines > 1) {
        styles.display = "-webkit-box";
        styles.webkitLineClamp = props.maxLines;
        styles.webkitBoxOrient = "vertical";
        styles.overflow = "hidden";
        styles.textOverflow = "ellipsis";
    }
    return styles;
});

// 解析文本为多个片段
const parsedSegments = computed(() => {
    const text = props.text || "";
    let segments = [{ type: 'text', content: text }];

    // 应用自定义解析器
    if (props.customParsers && props.customParsers.length > 0) {
        props.customParsers.forEach(parser => {
            segments = parser(segments);
        });
    }

    // 识别链接
    if (props.detectLinks) {
        segments = parseLinks(segments);
    }

    // 识别 @提及
    if (props.detectMentions) {
        segments = parseMentions(segments);
    }

    // 识别话题标签
    if (props.detectHashtags) {
        segments = parseHashtags(segments);
    }

    // 识别换行
    segments = parseNewlines(segments);

    // 过滤空片段
    segments = segments.filter(seg => seg.content || seg.type === 'newline');

    return segments;
});

// 解析链接
const parseLinks = (segments) => {
    const linkRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g;
    const result = [];

    segments.forEach(segment => {
        if (segment.type !== 'text') {
            result.push(segment);
            return;
        }

        const parts = segment.content.split(linkRegex);
        parts.forEach(part => {
            if (part === '') return;

            if (linkRegex.test(part)) {
                result.push({
                    type: 'link',
                    content: part,
                    url: part,
                });
            } else {
                result.push({
                    type: 'text',
                    content: part,
                });
            }
        });
    });

    return result;
};

// 解析 @提及
const parseMentions = (segments) => {
    const mentionRegex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g;
    const result = [];

    segments.forEach(segment => {
        if (segment.type !== 'text') {
            result.push(segment);
            return;
        }

        const parts = segment.content.split(mentionRegex);
        parts.forEach((part, index) => {
            if (part === '') return;

            if (index % 2 === 1) {
                result.push({
                    type: 'mention',
                    content: part,
                });
            } else {
                result.push({
                    type: 'text',
                    content: part,
                });
            }
        });
    });

    return result;
};

// 解析话题标签
const parseHashtags = (segments) => {
    const hashtagRegex = /#([^#\s]+)#/g;
    const result = [];

    segments.forEach(segment => {
        if (segment.type !== 'text') {
            result.push(segment);
            return;
        }

        const parts = segment.content.split(hashtagRegex);
        parts.forEach((part, index) => {
            if (part === '') return;

            if (index % 2 === 1) {
                result.push({
                    type: 'hashtag',
                    content: part,
                });
            } else {
                result.push({
                    type: 'text',
                    content: part,
                });
            }
        });
    });

    return result;
};

// 解析换行
const parseNewlines = (segments) => {
    const result = [];

    segments.forEach(segment => {
        if (segment.type !== 'text') {
            result.push(segment);
            return;
        }

        const parts = segment.content.split('\n');
        parts.forEach((part, index) => {
            if (index > 0) {
                result.push({
                    type: 'newline',
                });
            }

            if (part) {
                result.push({
                    type: 'text',
                    content: part,
                });
            }
        });
    });

    return result;
};

// 事件处理
const handleLinkClick = (segment) => {
    emit('link-click', segment);
};

const handleMentionClick = (segment) => {
    emit('mention-click', segment);
};

const handleHashtagClick = (segment) => {
    emit('hashtag-click', segment);
};
</script>

<style scoped lang="scss">
.chat-text {
    display: inline;
    word-wrap: break-word;
    word-break: break-word;

    &__segment {
        display: inline;
    }

    &__link {
        color: #1989fa;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 0;
            height: 1px;
            background: currentColor;
            transition: width 0.2s;
        }

        &:hover {
            color: #1a73e8;

            &::after {
                width: 100%;
            }
        }

        &:active {
            color: #1557b0;
        }
    }

    &__mention {
        color: #1989fa;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        padding: 2px 6px;
        margin: -2px -6px;
        border-radius: 4px;

        &:hover {
            color: #1a73e8;
            background-color: rgba(25, 137, 250, 0.08);
            box-shadow: 0 1px 4px rgba(25, 137, 250, 0.15);
        }
    }

    &__hashtag {
        color: #07c160;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        padding: 2px 6px;
        margin: -2px -6px;
        border-radius: 4px;

        &:hover {
            color: #06ad56;
            background-color: rgba(7, 193, 96, 0.08);
            box-shadow: 0 1px 4px rgba(7, 193, 96, 0.15);
        }
    }

    &--multiline {
        white-space: pre-wrap;
    }

    &--single-line {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &--limited {
        white-space: pre-wrap;
    }
}

// 响应式适配
@media (max-width: 768px) {
    .chat-text {
        &__link,
        &__mention,
        &__hashtag {
            transition: none;
        }
    }
}

// 深色主题适配
@media (prefers-color-scheme: dark) {
    .chat-text {
        &__link {
            color: #4dabf7;

            &:hover {
                color: #74c0fc;
            }

            &:active {
                color: #339af0;
            }
        }

        &__mention {
            color: #4dabf7;

            &:hover {
                color: #74c0fc;
                background-color: rgba(77, 171, 247, 0.1);
            }
        }

        &__hashtag {
            color: #51cf66;

            &:hover {
                color: #69db7c;
                background-color: rgba(81, 207, 102, 0.1);
            }
        }
    }
}

// 打印样式
@media print {
    .chat-text {
        &__link {
            color: #1989fa;
            text-decoration: underline;
        }
    }
}
</style>
