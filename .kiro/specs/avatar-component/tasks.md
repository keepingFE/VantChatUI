# Implementation Plan: Avatar Component

## Overview

按照设计文档实现 Avatar 和 AvatarGroup 两个 Vue 3 组件，遵循现有组件库的代码风格（基于 Vant UI），包含完整的 Props、Events、Slots 支持以及属性测试。

## Tasks

- [x] 1. 创建 Avatar 组件基础结构

  - [x] 1.1 创建 Avatar 组件文件和基础模板

    - 创建 `packages/src/components/Avatar/index.vue`
    - 实现基础 Props 定义（src, alt, name, size, shape, radius）
    - 实现图片头像渲染（使用 van-image）
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 1.2 实现工具函数

    - 实现 SIZE_MAP 常量
    - 实现 getInitials 函数（支持中英文）
    - 实现 getColorByName 函数
    - _Requirements: 1.3, 2.1_

  - [ ]\* 1.3 编写 getInitials 属性测试

    - **Property 3: Initials Generation**
    - **Validates: Requirements 1.3**

  - [ ]\* 1.4 编写 getColorByName 属性测试
    - **Property 8: Background Color Consistency**
    - **Validates: Requirements 1.3**

- [ ] 2. 实现头像内容渲染逻辑

  - [ ] 2.1 实现文字头像和图标头像

    - 实现 showImage/showText/showIcon 计算属性
    - 实现文字头像渲染（背景色 + 缩写文字）
    - 实现默认图标头像渲染
    - 实现图片加载失败回退逻辑
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ] 2.2 实现尺寸计算逻辑

    - 实现 computedSize 计算属性
    - 支持预设尺寸和自定义数字尺寸
    - 确保宽高相等（1:1 比例）
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]\* 2.3 编写尺寸计算属性测试
    - **Property 1: Size Computation Consistency**
    - **Property 2: Aspect Ratio Invariant**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [ ] 3. 实现状态指示器

  - [ ] 3.1 添加状态指示器功能

    - 添加 status prop
    - 实现 STATUS_COLOR_MAP 常量
    - 实现状态指示器渲染和定位
    - 实现指示器尺寸与头像尺寸的比例计算
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]\* 3.2 编写状态指示器属性测试
    - **Property 4: Status Indicator Color Mapping**
    - **Property 5: Status Indicator Proportional Sizing**
    - **Validates: Requirements 4.1, 4.2, 4.4**

- [ ] 4. 实现交互和无障碍支持

  - [ ] 4.1 实现点击交互

    - 添加 clickable prop
    - 实现 click 事件发射
    - 添加 hover 样式和 cursor 样式
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 4.2 实现无障碍支持

    - 添加 alt 属性支持
    - 添加 aria-label 支持
    - 实现键盘焦点和激活（tabindex, Enter/Space）
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]\* 4.3 编写无障碍属性测试
    - **Property 7: Accessibility Attributes**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 5. Checkpoint - 确保 Avatar 组件测试通过

  - 确保所有测试通过，如有问题请询问用户

- [ ] 6. 创建 AvatarGroup 组件

  - [ ] 6.1 创建 AvatarGroup 组件文件

    - 创建 `packages/src/components/AvatarGroup/index.vue`
    - 实现 Props 定义（max, size, shape, spacing, overflowBgColor）
    - 实现默认插槽接收 Avatar 组件
    - _Requirements: 5.1, 5.3_

  - [ ] 6.2 实现溢出计算和显示

    - 实现子组件数量统计
    - 实现 max 限制逻辑
    - 实现 "+N" 溢出指示器
    - _Requirements: 5.2, 5.4_

  - [ ]\* 6.3 编写溢出计算属性测试
    - **Property 6: Avatar Group Overflow Calculation**
    - **Validates: Requirements 5.2, 5.4**

- [ ] 7. 导出组件和创建示例

  - [ ] 7.1 更新组件库导出

    - 在 `packages/src/index.js` 中添加 Avatar 和 AvatarGroup 导出
    - _Requirements: All_

  - [ ] 7.2 创建示例页面
    - 创建 `examples/src/views/AvatarDemo.vue`
    - 展示各种头像配置示例
    - 展示头像组示例
    - _Requirements: All_

- [ ] 8. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
