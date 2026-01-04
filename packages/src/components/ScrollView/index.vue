<template>
    <div ref="scrollViewRef" class="vant-chatui-scroll-view" @scroll="handleScroll">
        <div v-if="pullRefresh" class="vant-chatui-scroll-view__pull-refresh" :style="{ height: pullDistance + 'px' }">
            <div class="vant-chatui-scroll-view__pull-refresh-content">
                <span v-if="pullStatus === 'pulling'">下拉刷新</span>
                <span v-else-if="pullStatus === 'loosing'">释放刷新</span>
                <span v-else-if="pullStatus === 'loading'">加载中...</span>
            </div>
        </div>

        <div class="vant-chatui-scroll-view__content">
            <slot></slot>
        </div>

        <div v-if="loadMore && hasMore" class="vant-chatui-scroll-view__load-more">
            <span v-if="!loading">{{ loadMoreText }}</span>
            <span v-else>加载中...</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VantChatUIScrollView',
    props: {
        pullRefresh: {
            type: Boolean,
            default: false
        },
        loadMore: {
            type: Boolean,
            default: false
        },
        hasMore: {
            type: Boolean,
            default: true
        },
        loadMoreText: {
            type: String,
            default: '上拉加载更多'
        },
        threshold: {
            type: Number,
            default: 50
        }
    },
    data() {
        return {
            loading: false,
            pullDistance: 0,
            pullStatus: 'normal', // normal, pulling, loosing, loading
            startY: 0,
            isPulling: false
        }
    },
    mounted() {
        if (this.pullRefresh) {
            this.initPullRefresh()
        }
    },
    methods: {
        handleScroll(e) {
            const { scrollTop, scrollHeight, clientHeight } = e.target

            // 触底加载更多
            if (this.loadMore && !this.loading && this.hasMore) {
                if (scrollHeight - scrollTop - clientHeight < this.threshold) {
                    this.handleLoadMore()
                }
            }

            this.$emit('scroll', { scrollTop, scrollHeight, clientHeight })
        },

        initPullRefresh() {
            const el = this.$refs.scrollViewRef

            el.addEventListener('touchstart', (e) => {
                if (el.scrollTop === 0) {
                    this.startY = e.touches[0].clientY
                    this.isPulling = true
                }
            })

            el.addEventListener('touchmove', (e) => {
                if (!this.isPulling) return

                const distance = e.touches[0].clientY - this.startY
                if (distance > 0) {
                    e.preventDefault()
                    this.pullDistance = Math.min(distance * 0.5, 80)
                    this.pullStatus = this.pullDistance > 50 ? 'loosing' : 'pulling'
                }
            })

            el.addEventListener('touchend', () => {
                if (this.isPulling && this.pullStatus === 'loosing') {
                    this.handleRefresh()
                } else {
                    this.pullDistance = 0
                    this.pullStatus = 'normal'
                }
                this.isPulling = false
            })
        },

        async handleRefresh() {
            this.pullStatus = 'loading'
            this.loading = true

            try {
                await this.$emit('refresh')
            } finally {
                this.loading = false
                this.pullDistance = 0
                this.pullStatus = 'normal'
            }
        },

        async handleLoadMore() {
            this.loading = true

            try {
                await this.$emit('load-more')
            } finally {
                this.loading = false
            }
        },

        scrollTo(options) {
            this.$refs.scrollViewRef?.scrollTo(options)
        },

        scrollToBottom() {
            const el = this.$refs.scrollViewRef
            if (el) {
                el.scrollTop = el.scrollHeight
            }
        }
    }
}
</script>

<style scoped>
.vant-chatui-scroll-view {
    position: relative;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.vant-chatui-scroll-view__pull-refresh {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -80px;
    transition: height 0.3s;
}

.vant-chatui-scroll-view__pull-refresh-content {
    color: #969799;
    font-size: 14px;
}

.vant-chatui-scroll-view__content {
    min-height: 100%;
}

.vant-chatui-scroll-view__load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    color: #969799;
    font-size: 14px;
}
</style>
