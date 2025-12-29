# Requirements Document

## Introduction

Avatar（头像）组件是 AI 交互组件库中的基础组件，用于展示用户或 AI 助手的头像。该组件支持图片头像、文字头像、图标头像等多种形式，并提供尺寸、形状、状态指示器等配置选项，适用于聊天消息、用户列表、会话列表等场景。

## Glossary

- **Avatar**: 头像组件，用于展示用户或实体的视觉标识
- **Fallback**: 当图片加载失败时显示的备用内容（如文字或图标）
- **Status_Indicator**: 状态指示器，显示用户在线/离线/忙碌等状态的小圆点
- **Avatar_Group**: 头像组，用于展示多个头像的堆叠效果

## Requirements

### Requirement 1: 基础头像展示

**User Story:** As a developer, I want to display user avatars with images, so that users can visually identify message senders.

#### Acceptance Criteria

1. WHEN an image URL is provided, THE Avatar SHALL display the image as a circular or square avatar
2. WHEN the image fails to load, THE Avatar SHALL display a fallback content (text or icon)
3. WHEN no image URL is provided but a name is given, THE Avatar SHALL display the first character(s) of the name as text avatar
4. WHEN neither image nor name is provided, THE Avatar SHALL display a default user icon

### Requirement 2: 尺寸配置

**User Story:** As a developer, I want to configure avatar sizes, so that I can use avatars in different contexts (message list, user profile, etc.).

#### Acceptance Criteria

1. THE Avatar SHALL support predefined sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
2. WHEN a custom size number is provided, THE Avatar SHALL render with that exact pixel size
3. THE Avatar SHALL maintain aspect ratio (1:1) regardless of size

### Requirement 3: 形状配置

**User Story:** As a developer, I want to configure avatar shapes, so that I can match different design requirements.

#### Acceptance Criteria

1. THE Avatar SHALL support circle shape (default)
2. THE Avatar SHALL support square shape with configurable border-radius
3. WHEN shape is set to circle, THE Avatar SHALL render as a perfect circle

### Requirement 4: 状态指示器

**User Story:** As a developer, I want to show user online status, so that users can see who is available.

#### Acceptance Criteria

1. WHEN status prop is provided, THE Avatar SHALL display a status indicator dot
2. THE Avatar SHALL support status values: online (green), offline (gray), busy (red), away (yellow)
3. THE Status_Indicator SHALL be positioned at the bottom-right corner of the avatar
4. THE Status_Indicator size SHALL scale proportionally with avatar size

### Requirement 5: 头像组展示

**User Story:** As a developer, I want to display multiple avatars in a stacked group, so that I can show participants in a conversation.

#### Acceptance Criteria

1. WHEN multiple avatars are provided to Avatar_Group, THE component SHALL display them in an overlapping stack
2. THE Avatar_Group SHALL support configurable max count with "+N" overflow indicator
3. THE Avatar_Group SHALL support configurable overlap spacing
4. WHEN avatars exceed max count, THE Avatar_Group SHALL show remaining count as "+N"

### Requirement 6: 交互支持

**User Story:** As a developer, I want avatars to support click interactions, so that users can view profiles or perform actions.

#### Acceptance Criteria

1. WHEN clickable prop is true, THE Avatar SHALL show pointer cursor on hover
2. WHEN Avatar is clicked and clickable is true, THE Avatar SHALL emit a click event
3. THE Avatar SHALL support hover state with subtle visual feedback

### Requirement 7: 无障碍支持

**User Story:** As a developer, I want avatars to be accessible, so that all users can understand the content.

#### Acceptance Criteria

1. THE Avatar SHALL include appropriate alt text for image avatars
2. THE Avatar SHALL include aria-label for text/icon avatars
3. WHEN Avatar is clickable, THE Avatar SHALL be keyboard focusable and activatable
