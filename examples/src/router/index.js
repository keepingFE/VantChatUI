import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import FullDemo from "../views/FullDemo.vue";
import BasicDemo from "../views/BasicDemo.vue";
import TypingDemo from "../views/TypingDemo.vue";
import FileDemo from "../views/FileDemo.vue";
import EmojiDemo from "../views/EmojiDemo.vue";
import SystemMessageDemo from "../views/SystemMessageDemo.vue";
import MessageStatusDemo from "../views/MessageStatusDemo.vue";
import FileCardDemo from "../views/FileCardDemo.vue";
import CardDemo from "../views/CardDemo.vue";
import SearchDemo from "../views/SearchDemo.vue";
import ButtonDemo from "../views/ButtonDemo.vue";
import FlexDemo from "../views/FlexDemo.vue";
import ImageDemo from "../views/ImageDemo.vue";
import CheckboxDemo from "../views/CheckboxDemo.vue";
import InputDemo from "../views/InputDemo.vue";
import RichEditorDemo from "../views/RichEditorDemo.vue";
import ChunkUploaderDemo from "../views/ChunkUploaderDemo.vue";
import LoadingDemo from "../views/LoadingDemo.vue";
import WaterfallDemo from "../views/WaterfallDemo.vue";
import SleepChartDemo from "../views/SleepChartDemo.vue";
import SleepRingChartDemo from "../views/SleepRingChartDemo.vue";
import HeartRateChartDemo from "../views/HeartRateChartDemo.vue";
import StepsChartDemo from "../views/StepsChartDemo.vue";
import BloodOxygenChartDemo from "../views/BloodOxygenChartDemo.vue";
import ActivityRingChartDemo from "../views/ActivityRingChartDemo.vue";
import WeeklyStatCardDemo from "../views/WeeklyStatCardDemo.vue";
import BodyWeightChartDemo from "../views/BodyWeightChartDemo.vue";
import BloodPressureChartDemo from "../views/BloodPressureChartDemo.vue";
import WaterIntakeChartDemo from "../views/WaterIntakeChartDemo.vue";
import CalorieBalanceChartDemo from "../views/CalorieBalanceChartDemo.vue";
import NutritionPieChartDemo from "../views/NutritionPieChartDemo.vue";
import BloodSugarChartDemo from "../views/BloodSugarChartDemo.vue";
import MoodTrackerDemo from "../views/MoodTrackerDemo.vue";
import MedicationReminderDemo from "../views/MedicationReminderDemo.vue";
import MenstrualCycleChartDemo from "../views/MenstrualCycleChartDemo.vue";
import TemperatureChartDemo from "../views/TemperatureChartDemo.vue";
import ExerciseDetailCardDemo from "../views/ExerciseDetailCardDemo.vue";
import HealthScoreCardDemo from "../views/HealthScoreCardDemo.vue";
import StressLevelChartDemo from "../views/StressLevelChartDemo.vue";
import HRVChartDemo from "../views/HRVChartDemo.vue";
import BreathingGuideDemo from "../views/BreathingGuideDemo.vue";
import BodyFatScaleDemo from "../views/BodyFatScaleDemo.vue";
import RunningDashboardDemo from "../views/RunningDashboardDemo.vue";
import FastingTimerDemo from "../views/FastingTimerDemo.vue";
import HabitTrackerDemo from "../views/HabitTrackerDemo.vue";
import FoodLogListDemo from "../views/FoodLogListDemo.vue";
import BodyMeasurementsDemo from "../views/BodyMeasurementsDemo.vue";
import WorkoutPaceChartDemo from "../views/WorkoutPaceChartDemo.vue";
import SportRouteViewDemo from "../views/SportRouteViewDemo.vue";
import ECGChartDemo from "../views/ECGChartDemo.vue";
import MarkdownRendererDemo from "../views/MarkdownRendererDemo.vue";
import MessageActionsDemo from "../views/MessageActionsDemo.vue";
import QuickRepliesDemo from "../views/QuickRepliesDemo.vue";
import ErrorMessageDemo from "../views/ErrorMessageDemo.vue";
import AIChatDemo from "../views/AIChatDemo.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/full",
    name: "FullDemo",
    component: FullDemo,
  },
  {
    path: "/basic",
    name: "BasicDemo",
    component: BasicDemo,
  },
  {
    path: "/typing",
    name: "TypingDemo",
    component: TypingDemo,
  },
  {
    path: "/file",
    name: "FileDemo",
    component: FileDemo,
  },
  {
    path: "/emoji",
    name: "EmojiDemo",
    component: EmojiDemo,
  },
  {
    path: "/system-message",
    name: "SystemMessageDemo",
    component: SystemMessageDemo,
  },
  {
    path: "/message-status",
    name: "MessageStatusDemo",
    component: MessageStatusDemo,
  },
  {
    path: "/file-card",
    name: "FileCardDemo",
    component: FileCardDemo,
  },
  {
    path: "/card",
    name: "CardDemo",
    component: CardDemo,
  },
  {
    path: "/search",
    name: "SearchDemo",
    component: SearchDemo,
  },
  {
    path: "/button",
    name: "ButtonDemo",
    component: ButtonDemo,
  },
  {
    path: "/flex",
    name: "FlexDemo",
    component: FlexDemo,
  },
  {
    path: "/image",
    name: "ImageDemo",
    component: ImageDemo,
  },
  {
    path: "/checkbox",
    name: "CheckboxDemo",
    component: CheckboxDemo,
  },
  {
    path: "/input",
    name: "InputDemo",
    component: InputDemo,
  },
  {
    path: "/rich-editor",
    name: "RichEditorDemo",
    component: RichEditorDemo,
  },
  {
    path: "/chunk-uploader",
    name: "ChunkUploaderDemo",
    component: ChunkUploaderDemo,
  },
  {
    path: "/loading",
    name: "LoadingDemo",
    component: LoadingDemo,
  },
  {
    path: "/waterfall",
    name: "WaterfallDemo",
    component: WaterfallDemo,
  },
  {
    path: "/sleep-chart",
    name: "SleepChartDemo",
    component: SleepChartDemo,
  },
  {
    path: "/sleep-ring-chart",
    name: "SleepRingChartDemo",
    component: SleepRingChartDemo,
  },
  {
    path: "/heart-rate-chart",
    name: "HeartRateChartDemo",
    component: HeartRateChartDemo,
  },
  {
    path: "/steps-chart",
    name: "StepsChartDemo",
    component: StepsChartDemo,
  },
  {
    path: "/blood-oxygen-chart",
    name: "BloodOxygenChartDemo",
    component: BloodOxygenChartDemo,
  },
  {
    path: "/activity-ring-chart",
    name: "ActivityRingChartDemo",
    component: ActivityRingChartDemo,
  },
  {
    path: "/weekly-stat-card",
    name: "WeeklyStatCardDemo",
    component: WeeklyStatCardDemo,
  },
  {
    path: "/body-weight-chart",
    name: "BodyWeightChartDemo",
    component: BodyWeightChartDemo,
  },
  {
    path: "/blood-pressure-chart",
    name: "BloodPressureChartDemo",
    component: BloodPressureChartDemo,
  },
  {
    path: "/water-intake-chart",
    name: "WaterIntakeChartDemo",
    component: WaterIntakeChartDemo,
  },
  {
    path: "/calorie-balance-chart",
    name: "CalorieBalanceChartDemo",
    component: CalorieBalanceChartDemo,
  },
  {
    path: "/nutrition-pie-chart",
    name: "NutritionPieChartDemo",
    component: NutritionPieChartDemo,
  },
  {
    path: "/blood-sugar-chart",
    name: "BloodSugarChartDemo",
    component: BloodSugarChartDemo,
  },
  {
    path: "/mood-tracker",
    name: "MoodTrackerDemo",
    component: MoodTrackerDemo,
  },
  {
    path: "/medication-reminder",
    name: "MedicationReminderDemo",
    component: MedicationReminderDemo,
  },
  {
    path: "/menstrual-cycle-chart",
    name: "MenstrualCycleChartDemo",
    component: MenstrualCycleChartDemo,
  },
  {
    path: "/temperature-chart",
    name: "TemperatureChartDemo",
    component: TemperatureChartDemo,
  },
  {
    path: "/exercise-detail-card",
    name: "ExerciseDetailCardDemo",
    component: ExerciseDetailCardDemo,
  },
  {
    path: "/health-score-card",
    name: "HealthScoreCardDemo",
    component: HealthScoreCardDemo,
  },
  {
    path: "/stress-level-chart",
    name: "StressLevelChartDemo",
    component: StressLevelChartDemo,
  },
  {
    path: "/hrv-chart",
    name: "HRVChartDemo",
    component: HRVChartDemo,
  },
  {
    path: "/breathing-guide",
    name: "BreathingGuideDemo",
    component: BreathingGuideDemo,
  },
  {
    path: "/body-fat-scale",
    name: "BodyFatScaleDemo",
    component: BodyFatScaleDemo,
  },
  {
    path: "/running-dashboard",
    name: "RunningDashboardDemo",
    component: RunningDashboardDemo,
  },
  {
    path: "/fasting-timer",
    name: "FastingTimerDemo",
    component: FastingTimerDemo,
  },
  {
    path: "/habit-tracker",
    name: "HabitTrackerDemo",
    component: HabitTrackerDemo,
  },
  {
    path: "/food-log-list",
    name: "FoodLogListDemo",
    component: FoodLogListDemo,
  },
  {
    path: "/body-measurements",
    name: "BodyMeasurementsDemo",
    component: BodyMeasurementsDemo,
  },
  {
    path: "/workout-pace-chart",
    name: "WorkoutPaceChartDemo",
    component: WorkoutPaceChartDemo,
  },
  {
    path: "/sport-route-view",
    name: "SportRouteViewDemo",
    component: SportRouteViewDemo,
  },
  {
    path: "/ecg-chart",
    name: "ECGChartDemo",
    component: ECGChartDemo,
  },
  {
    path: "/markdown-renderer",
    name: "MarkdownRendererDemo",
    component: MarkdownRendererDemo,
  },
  {
    path: "/message-actions",
    name: "MessageActionsDemo",
    component: MessageActionsDemo,
  },
  {
    path: "/quick-replies",
    name: "QuickRepliesDemo",
    component: QuickRepliesDemo,
  },
  {
    path: "/error-message",
    name: "ErrorMessageDemo",
    component: ErrorMessageDemo,
  },
  {
    path: "/ai-chat",
    name: "AIChatDemo",
    component: AIChatDemo,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
