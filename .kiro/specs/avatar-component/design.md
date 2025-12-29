# Design Document: Avatar Component

## Overview

Avatar 组件是一个用于展示用户或 AI 助手头像的 Vue 3 组件。该组件基于 Vant UI 的 Image 组件构建，提供图片头像、文字头像、图标头像三种展示形式，支持多种尺寸、形状配置，以及状态指示器和头像组功能。

组件将分为两个独立组件：

- `Avatar` - 单个头像组件
- `AvatarGroup` - 头像组组件

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Avatar Component                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              Avatar Container                    │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │         Content Layer                    │   │   │
│  │  │  - Image (van-image)                    │   │   │
│  │  │  - Text Fallback                        │   │   │
│  │  │  - Icon Fallback                        │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │      Status Indicator (optional)         │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  AvatarGroup Component                   │
├─────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ Avatar │ │ Avatar │ │ Avatar │ │  +N    │           │
│  │   1    │ │   2    │ │   3    │ │ count  │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
│       ←─ overlap spacing ─→                             │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Avatar Component Props

```typescript
interface AvatarProps {
  // 图片地址
  src?: string;
  // 替代文本
  alt?: string;
  // 用户名称（用于生成文字头像）
  name?: string;
  // 尺寸：预设值或自定义数字
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  // 形状
  shape?: "circle" | "square";
  // 方形时的圆角大小
  radius?: number | string;
  // 在线状态
  status?: "online" | "offline" | "busy" | "away";
  // 是否可点击
  clickable?: boolean;
  // 自定义图标（当无图片和名称时）
  icon?: string;
  // 背景色（文字头像时）
  bgColor?: string;
  // 文字颜色
  textColor?: string;
}
```

### Avatar Component Events

```typescript
interface AvatarEvents {
  // 点击事件
  click: (event: MouseEvent) => void;
  // 图片加载失败
  error: (event: Event) => void;
  // 图片加载成功
  load: (event: Event) => void;
}
```

### AvatarGroup Component Props

```typescript
interface AvatarGroupProps {
  // 最大显示数量
  max?: number;
  // 头像尺寸（统一设置）
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  // 头像形状（统一设置）
  shape?: "circle" | "square";
  // 重叠间距（负值表示重叠）
  spacing?: number;
  // 溢出数字的背景色
  overflowBgColor?: string;
}
```

### AvatarGroup Slots

```typescript
interface AvatarGroupSlots {
  // 默认插槽，放置 Avatar 组件
  default: () => VNode[];
}
```

## Data Models

### Size Mapping

```typescript
const SIZE_MAP: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};
```

### Status Color Mapping

```typescript
const STATUS_COLOR_MAP: Record<string, string> = {
  online: "#52c41a", // 绿色
  offline: "#d9d9d9", // 灰色
  busy: "#ff4d4f", // 红色
  away: "#faad14", // 黄色
};
```

### Default Background Colors (for text avatars)

```typescript
const DEFAULT_BG_COLORS: string[] = [
  "#1890ff", // 蓝色
  "#52c41a", // 绿色
  "#faad14", // 黄色
  "#ff4d4f", // 红色
  "#722ed1", // 紫色
  "#13c2c2", // 青色
  "#eb2f96", // 粉色
  "#fa8c16", // 橙色
];

// 根据名称生成一致的背景色
function getColorByName(name: string): string {
  const index = name.charCodeAt(0) % DEFAULT_BG_COLORS.length;
  return DEFAULT_BG_COLORS[index];
}
```

### Initials Generation

```typescript
// 从名称生成缩写（支持中英文）
function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return "";

  // 中文：取前两个字符
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(0, maxLength);
  }

  // 英文：取每个单词首字母
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, maxLength)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Size Computation Consistency

_For any_ size value (predefined string like 'xs'/'sm'/'md'/'lg'/'xl' or custom number), the computed pixel size should match the expected value from SIZE_MAP for strings, or equal the number directly for custom sizes.

**Validates: Requirements 2.1, 2.2**

### Property 2: Aspect Ratio Invariant

_For any_ avatar regardless of size configuration, the rendered width should always equal the rendered height (1:1 aspect ratio).

**Validates: Requirements 2.3**

### Property 3: Initials Generation

_For any_ non-empty name string, the getInitials function should return:

- For Chinese names: the first N characters (where N ≤ maxLength)
- For English names: the uppercase first letter of each word (up to maxLength words)

**Validates: Requirements 1.3**

### Property 4: Status Indicator Color Mapping

_For any_ valid status value ('online', 'offline', 'busy', 'away'), the status indicator should render with the corresponding color from STATUS_COLOR_MAP.

**Validates: Requirements 4.1, 4.2**

### Property 5: Status Indicator Proportional Sizing

_For any_ avatar size, the status indicator size should be proportional to the avatar size (approximately 25-30% of avatar diameter).

**Validates: Requirements 4.4**

### Property 6: Avatar Group Overflow Calculation

_For any_ list of N avatars with max count M where N > M, the AvatarGroup should:

- Render exactly M avatar components
- Display an overflow indicator showing "+(N-M)"

**Validates: Requirements 5.2, 5.4**

### Property 7: Accessibility Attributes

_For any_ avatar configuration:

- Image avatars should have alt attribute (from alt or name prop)
- Text/icon avatars should have aria-label attribute
- Clickable avatars should have appropriate role and tabindex

**Validates: Requirements 7.1, 7.2**

### Property 8: Background Color Consistency

_For any_ given name string, the getColorByName function should always return the same color (deterministic based on first character code).

**Validates: Requirements 1.3**

## Error Handling

### Image Load Failure

```typescript
// 图片加载失败时的处理逻辑
const handleImageError = (event: Event) => {
  imageLoadFailed.value = true;
  emit("error", event);
};

// 显示优先级：
// 1. 图片（如果 src 存在且未失败）
// 2. 文字头像（如果 name 存在）
// 3. 图标（默认或自定义 icon）
const showImage = computed(() => props.src && !imageLoadFailed.value);
const showText = computed(() => !showImage.value && props.name);
const showIcon = computed(() => !showImage.value && !showText.value);
```

### Invalid Props Handling

```typescript
// 尺寸验证
const computedSize = computed(() => {
  if (typeof props.size === "number") {
    return Math.max(16, props.size); // 最小 16px
  }
  return SIZE_MAP[props.size] || SIZE_MAP.md;
});

// 状态验证
const validStatus = computed(() => {
  const validStatuses = ["online", "offline", "busy", "away"];
  return validStatuses.includes(props.status) ? props.status : null;
});
```

## Testing Strategy

### Unit Tests

单元测试用于验证特定示例和边界情况：

1. **默认渲染测试**

   - 无 props 时显示默认图标
   - 仅有 src 时显示图片
   - 仅有 name 时显示文字头像

2. **边界情况测试**

   - 空字符串 name
   - 图片加载失败回退
   - 无效的 size/status 值

3. **交互测试**
   - clickable=true 时点击触发事件
   - clickable=false 时点击不触发事件
   - 键盘 Enter/Space 激活

### Property-Based Tests

属性测试用于验证通用属性在所有输入下都成立：

1. **Size Computation Property Test**

   - 生成随机的 size 值（预设字符串或正整数）
   - 验证计算出的像素值符合预期

2. **Initials Generation Property Test**

   - 生成随机的中英文名称
   - 验证 getInitials 输出符合规则

3. **Status Color Mapping Property Test**

   - 遍历所有有效 status 值
   - 验证颜色映射正确

4. **Overflow Calculation Property Test**
   - 生成随机数量的头像和 max 值
   - 验证溢出计算正确

### Testing Framework

- 使用 Vitest 作为测试框架
- 使用 @vue/test-utils 进行组件测试
- 使用 fast-check 进行属性测试
- 每个属性测试运行至少 100 次迭代
