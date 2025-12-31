<template>
    <div class="workout-calendar">
        <div class="calendar-header">
            <van-icon name="arrow-left" @click="prevMonth" />
            <div class="header-center">
                <div class="month-title">{{ currentMonthTitle }}</div>
                <van-button type="primary" size="mini" round @click="goToToday" v-if="!isCurrentMonth"
                    class="today-btn">
                    今
                </van-button>
            </div>
            <van-icon name="arrow" @click="nextMonth" />
        </div>

        <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
        </div>

        <div class="calendar-grid">
            <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day" :class="{
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-workout': day.workout,
                'selected': day.date === selectedDate,
                'holiday': day.holiday,
                'weekend': day.isWeekend
            }" @click="selectDay(day)">
                <div class="day-number">{{ day.day }}</div>
                <div class="lunar-info">
                    <span v-if="day.holiday" class="holiday-name">{{ day.holiday }}</span>
                    <span v-else-if="day.lunarFestival" class="festival-name">{{ day.lunarFestival }}</span>
                    <span v-else class="lunar-day">{{ day.lunarDay }}</span>
                </div>
                <div v-if="day.workout" class="workout-indicator">
                    <div class="workout-dot" :style="{ background: getWorkoutColor(day.workout.type) }"></div>
                </div>
            </div>
        </div>

        <div v-if="selectedWorkout" class="workout-detail">
            <div class="detail-header">
                <div class="workout-type">
                    <span class="type-icon">{{ getWorkoutIcon(selectedWorkout.type) }}</span>
                    <span class="type-name">{{ getWorkoutName(selectedWorkout.type) }}</span>
                </div>
                <div class="workout-duration">{{ selectedWorkout.duration }}分钟</div>
            </div>
            <div class="detail-stats">
                <div class="stat-item" v-if="selectedWorkout.distance">
                    <span class="label">距离</span>
                    <span class="value">{{ selectedWorkout.distance }}km</span>
                </div>
                <div class="stat-item" v-if="selectedWorkout.calories">
                    <span class="label">卡路里</span>
                    <span class="value">{{ selectedWorkout.calories }}</span>
                </div>
                <div class="stat-item" v-if="selectedWorkout.heartRate">
                    <span class="label">平均心率</span>
                    <span class="value">{{ selectedWorkout.heartRate }}bpm</span>
                </div>
            </div>
            <div v-if="selectedWorkout.notes" class="workout-notes">
                {{ selectedWorkout.notes }}
            </div>
        </div>

        <div class="monthly-summary">
            <div class="summary-title">本月统计</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">{{ monthlySummary.workouts }}</div>
                    <div class="summary-label">训练次数</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">{{ monthlySummary.duration }}</div>
                    <div class="summary-label">总时长(分钟)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">{{ monthlySummary.calories }}</div>
                    <div class="summary-label">总卡路里</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    workouts: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['dayClick', 'workoutClick'])

const currentDate = ref(new Date())
const selectedDate = ref(null)
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 农历数据（简化版）
const lunarMonthDays = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]
const lunarMonthNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
const lunarDayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

// 节假日数据（2024-2025年）
const holidays = {
    '2024-01-01': '元旦',
    '2024-02-10': '春节',
    '2024-02-11': '春节',
    '2024-02-12': '春节',
    '2024-04-04': '清明',
    '2024-04-05': '清明',
    '2024-04-06': '清明',
    '2024-05-01': '劳动节',
    '2024-05-02': '劳动节',
    '2024-05-03': '劳动节',
    '2024-06-10': '端午',
    '2024-09-15': '中秋',
    '2024-09-16': '中秋',
    '2024-09-17': '中秋',
    '2024-10-01': '国庆',
    '2024-10-02': '国庆',
    '2024-10-03': '国庆',
    '2024-10-04': '国庆',
    '2024-10-05': '国庆',
    '2024-10-06': '国庆',
    '2024-10-07': '国庆',
    '2025-01-01': '元旦',
    '2025-01-28': '春节',
    '2025-01-29': '春节',
    '2025-01-30': '春节',
    '2025-01-31': '春节',
    '2025-02-01': '春节',
    '2025-04-04': '清明',
    '2025-04-05': '清明',
    '2025-04-06': '清明',
    '2025-05-01': '劳动节',
    '2025-05-02': '劳动节',
    '2025-05-03': '劳动节',
    '2025-06-02': '端午',
    '2025-10-01': '国庆',
    '2025-10-02': '国庆',
    '2025-10-03': '国庆',
    '2025-10-04': '国庆',
    '2025-10-05': '国庆',
    '2025-10-06': '国庆',
    '2025-10-07': '国庆',
    '2025-10-08': '国庆'
}

// 农历节日
const lunarFestivals = {
    '1-1': '春节',
    '1-15': '元宵',
    '5-5': '端午',
    '7-7': '七夕',
    '8-15': '中秋',
    '9-9': '重阳',
    '12-8': '腊八',
    '12-23': '小年'
}

// 简化的农历计算（基于2024年春节）
const getLunarDate = (date) => {
    const baseDate = new Date(2024, 1, 10) // 2024年春节
    const diff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24))

    let lunarMonth = 0
    let lunarDay = diff % 30 + 1

    if (lunarDay > 30) lunarDay = 1
    if (lunarDay < 1) lunarDay = 30

    lunarMonth = Math.floor(diff / 30) % 12
    if (lunarMonth < 0) lunarMonth += 12

    const lunarMonthName = lunarMonthNames[lunarMonth]
    const lunarDayName = lunarDay === 1 ? lunarMonthName : lunarDayNames[lunarDay - 1]

    const festivalKey = `${lunarMonth + 1}-${lunarDay}`
    const festival = lunarFestivals[festivalKey]

    return {
        month: lunarMonth + 1,
        day: lunarDay,
        monthName: lunarMonthName,
        dayName: lunarDayName,
        festival
    }
}

const currentMonthTitle = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    return `${year}年${month}月`
})

const isCurrentMonth = computed(() => {
    const today = new Date()
    return currentDate.value.getFullYear() === today.getFullYear() &&
        currentDate.value.getMonth() === today.getMonth()
})

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const prevLastDay = new Date(year, month, 0)

    const firstDayWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const prevDaysInMonth = prevLastDay.getDate()

    const days = []

    // 上个月的日期
    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevDaysInMonth - i
        const date = new Date(year, month - 1, day)
        const dateStr = formatDate(date)
        const lunar = getLunarDate(date)

        days.push({
            day,
            date: dateStr,
            isCurrentMonth: false,
            isToday: false,
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            workout: null,
            holiday: holidays[dateStr],
            lunarDay: lunar.dayName,
            lunarFestival: lunar.festival
        })
    }

    // 当前月的日期
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        const dateStr = formatDate(date)
        const workout = props.workouts.find(w => w.date === dateStr)
        const lunar = getLunarDate(date)

        days.push({
            day: i,
            date: dateStr,
            isCurrentMonth: true,
            isToday: isSameDay(date, today),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            workout,
            holiday: holidays[dateStr],
            lunarDay: lunar.dayName,
            lunarFestival: lunar.festival
        })
    }

    // 下个月的日期
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i)
        const dateStr = formatDate(date)
        const lunar = getLunarDate(date)

        days.push({
            day: i,
            date: dateStr,
            isCurrentMonth: false,
            isToday: false,
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            workout: null,
            holiday: holidays[dateStr],
            lunarDay: lunar.dayName,
            lunarFestival: lunar.festival
        })
    }

    return days
})

const selectedWorkout = computed(() => {
    if (!selectedDate.value) return null
    return props.workouts.find(w => w.date === selectedDate.value)
})

const monthlySummary = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const monthWorkouts = props.workouts.filter(w => {
        const workoutDate = new Date(w.date)
        return workoutDate.getFullYear() === year && workoutDate.getMonth() === month
    })

    return {
        workouts: monthWorkouts.length,
        duration: monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
        calories: monthWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)
    }
})

const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
}

const prevMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    )
}

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    )
}

const goToToday = () => {
    const today = new Date()
    currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
    selectedDate.value = formatDate(today)
}

const selectDay = (day) => {
    if (!day.isCurrentMonth) return

    selectedDate.value = day.date
    emit('dayClick', day)

    if (day.workout) {
        emit('workoutClick', day.workout)
    }
}

const getWorkoutIcon = (type) => {
    const icons = {
        running: '🏃',
        cycling: '🚴',
        swimming: '🏊',
        gym: '💪',
        yoga: '🧘',
        walking: '🚶',
        hiking: '🥾',
        basketball: '🏀',
        football: '⚽',
        tennis: '🎾'
    }
    return icons[type] || '🏃'
}

const getWorkoutName = (type) => {
    const names = {
        running: '跑步',
        cycling: '骑行',
        swimming: '游泳',
        gym: '健身',
        yoga: '瑜伽',
        walking: '步行',
        hiking: '徒步',
        basketball: '篮球',
        football: '足球',
        tennis: '网球'
    }
    return names[type] || type
}

const getWorkoutColor = (type) => {
    const colors = {
        running: '#1890ff',
        cycling: '#52c41a',
        swimming: '#13c2c2',
        gym: '#f5222d',
        yoga: '#722ed1',
        walking: '#faad14',
        hiking: '#fa8c16',
        basketball: '#eb2f96',
        football: '#2f54eb',
        tennis: '#a0d911'
    }
    return colors[type] || '#1890ff'
}
</script>

<style scoped lang="scss">
.workout-calendar {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-center {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .month-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }

    .today-btn {
        min-width: 32px;
        height: 24px;
        padding: 0 8px;
        font-size: 13px;
    }

    .van-icon {
        font-size: 20px;
        color: #8c8c8c;
        cursor: pointer;

        &:active {
            color: #1890ff;
        }
    }
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 8px;
}

.weekday {
    text-align: center;
    font-size: 14px;
    color: #8c8c8c;
    padding: 8px 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    padding: 4px 2px;

    &.other-month {
        opacity: 0.3;
    }

    &.today {
        background: #e6f7ff;

        .day-number {
            color: #1890ff;
            font-weight: 600;
        }
    }

    &.weekend {
        .day-number {
            color: #ff7875;
        }
    }

    &.holiday {
        background: #fff1f0;

        .day-number {
            color: #f5222d;
            font-weight: 600;
        }

        .holiday-name {
            color: #f5222d;
        }
    }

    &.has-workout {
        background: #f0f0f0;
    }

    &.selected {
        background: #1890ff;

        .day-number,
        .lunar-info,
        .holiday-name,
        .festival-name,
        .lunar-day {
            color: #fff !important;
        }
    }

    &:active {
        transform: scale(0.95);
    }

    .day-number {
        font-size: 16px;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 1.2;
        margin-bottom: 2px;
    }

    .lunar-info {
        font-size: 10px;
        color: #8c8c8c;
        line-height: 1;
        text-align: center;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .holiday-name {
            color: #f5222d;
            font-weight: 500;
        }

        .festival-name {
            color: #ff7875;
            font-weight: 500;
        }

        .lunar-day {
            color: #8c8c8c;
        }
    }

    .workout-indicator {
        position: absolute;
        top: 2px;
        right: 2px;
    }

    .workout-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }
}

.workout-detail {
    margin-top: 20px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 12px;

    .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .workout-type {
            display: flex;
            align-items: center;
            gap: 8px;

            .type-icon {
                font-size: 24px;
            }

            .type-name {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
            }
        }

        .workout-duration {
            font-size: 14px;
            color: #8c8c8c;
        }
    }

    .detail-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 12px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
            font-size: 12px;
            color: #8c8c8c;
        }

        .value {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }
    }

    .workout-notes {
        padding: 12px;
        background: #fff;
        border-radius: 8px;
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
    }
}

.monthly-summary {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;

    .summary-title {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 12px;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }

    .summary-item {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        color: #fff;

        &:nth-child(2) {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &:nth-child(3) {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .summary-value {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .summary-label {
            font-size: 12px;
            opacity: 0.9;
        }
    }
}
</style>
