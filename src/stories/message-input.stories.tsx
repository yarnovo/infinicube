import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';
import { MessageInput } from '../components/message-input';

const meta = {
  title: 'Components/MessageInput',
  component: MessageInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## 简介

MessageInput 是一个专为聊天应用设计的消息输入组件。它采用上下布局结构，上方是响应式的输入区域，下方是固定高度的工具栏。

## 主要特点

- **上下布局结构**：上方输入框 + 下方工具栏的布局设计
- **响应式输入**：上方输入框会撑满所有可用空间
- **固定工具栏**：下方 48px 高度的工具栏，包含发送按钮
- **边框样式**：整体有边框和圆角，符合现代设计风格
- **键盘支持**：支持 Enter 键发送消息
- **扩展性强**：工具栏左侧预留空间，可添加其他功能按钮

## 布局说明

### 上方区域（输入区域）
- **作用**：用户输入消息的主要区域
- **特点**：flex-1 布局，撑满剩余空间
- **样式**：无内边距，使用 textarea 实现多行输入

### 下方区域（工具栏）
- **作用**：放置功能按钮
- **高度**：固定 48px (h-12)
- **布局**：左侧预留工具按钮区域，右侧放置发送按钮
- **样式**：浅灰背景，顶部有分割线

## 设计理念

这种布局设计相比传统的左右布局有以下优势：

1. **更好的空间利用**：上方区域可以充分利用垂直空间
2. **更清晰的功能分区**：输入和工具按钮分离，界面更清晰
3. **更好的扩展性**：工具栏可以容纳更多功能按钮
4. **更符合现代设计**：类似于主流聊天应用的设计风格

## 基本用法

\`\`\`tsx
import { MessageInput } from './components/MessageInput';

function App() {
  const handleSend = (message: string) => {
    console.log('发送消息:', message);
    // 处理消息发送逻辑
  };

  return (
    <div style={{ height: '120px', width: '400px' }}>
      <MessageInput
        placeholder="输入消息..."
        onSend={handleSend}
      />
    </div>
  );
}
\`\`\`

## API 说明

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| **placeholder** | string | "Type a message..." | 输入框的占位符文本 |
| **onSend** | function | - | 消息发送时的回调函数，接收消息内容字符串 |
| **disabled** | boolean | false | 是否禁用组件 |
| **className** | string | - | 自定义 CSS 类名 |

### 回调函数

**onSend(message: string): void**

当用户发送消息时触发，message 参数为用户输入的消息内容。

## 特性说明

### 键盘快捷键

- **Enter**: 发送消息
- **Shift + Enter**: 换行（在 textarea 中正常工作）

### 组件尺寸

- **高度**：组件本身不设固定高度，由父容器控制
- **宽度**：默认撑满父容器宽度
- **建议高度**：96px (h-24) 或更高，确保有足够的输入空间

### 工具栏扩展

工具栏左侧预留了工具按钮区域，可以通过自定义来添加更多功能：

\`\`\`tsx
// 未来可以扩展为：
<MessageInput
  placeholder="输入消息..."
  onSend={handleSend}
  toolbarActions={[
    <AttachmentButton key="attachment" />,
    <EmojiButton key="emoji" />,
    <VoiceButton key="voice" />
  ]}
/>
\`\`\`

## 样式定制

组件使用 Tailwind CSS 类名，可以通过以下方式定制样式：

1. **整体尺寸**：通过父容器或 className 属性控制
2. **边框颜色**：修改 border 相关类名
3. **背景色**：调整 bg-background 等背景类名
4. **工具栏样式**：修改 bg-muted/30 等工具栏背景

## 注意事项

- 组件需要在支持 Tailwind CSS 的项目中使用
- 建议给组件设置合适的高度（至少 96px）
- 父容器需要提供确定的尺寸约束
- 工具栏区域目前为预留设计，可根据需要扩展功能
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '输入框占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用组件',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    onSend: fn(),
  },
} satisfies Meta<typeof MessageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认样式',
  args: {
    placeholder: '输入消息...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '120px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 查找输入框和发送按钮
    const textarea = canvas.getByPlaceholderText('输入消息...');
    const sendButton = canvas.getByRole('button');

    // 测试输入和发送消息
    await userEvent.type(textarea, '这是一条测试消息');
    await userEvent.click(sendButton);

    // 验证输入框已清空
    expect(textarea).toHaveValue('');

    // 验证 onSend 被调用
    expect(args.onSend).toHaveBeenCalledWith('这是一条测试消息');
  },
};

export const LargeSize: Story = {
  name: '大尺寸',
  args: {
    placeholder: '在这里输入更长的消息...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '200px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示了更大尺寸的 MessageInput 组件：

## 特点：

1. **更大的输入区域**：200px 高度提供更多输入空间
2. **更宽的宽度**：500px 宽度适合更长的消息
3. **更好的用户体验**：适合需要输入长文本的场景

## 适用场景：

- 论坛回复
- 邮件编写
- 长文档编辑
- 详细描述输入
        `,
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 测试多行输入
    const textarea = canvas.getByPlaceholderText('在这里输入更长的消息...');

    const longMessage =
      '这是一条很长的测试消息，\\n用来测试多行输入的效果。\\n它包含了换行符，\\n可以验证组件的多行输入功能。';

    await userEvent.type(textarea, longMessage);

    // 验证文本已输入
    expect(textarea).toHaveValue(longMessage);

    // 测试发送
    const sendButton = canvas.getByRole('button');
    await userEvent.click(sendButton);

    // 验证回调被调用
    expect(args.onSend).toHaveBeenCalledWith(longMessage);
  },
};

export const Disabled: Story = {
  name: '禁用状态',
  args: {
    placeholder: '组件已禁用...',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '120px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示了禁用状态的 MessageInput 组件：

## 禁用效果：

1. **输入框禁用**：无法输入文本
2. **按钮禁用**：发送按钮变为不可点击状态
3. **视觉反馈**：组件呈现禁用的视觉样式
4. **鼠标样式**：鼠标悬停时显示禁用光标

## 使用场景：

- 网络断开时
- 权限不足时
- 加载过程中
- 表单验证失败时
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 验证输入框和按钮都被禁用
    const textarea = canvas.getByPlaceholderText('组件已禁用...');
    const sendButton = canvas.getByRole('button');

    expect(textarea).toBeDisabled();
    expect(sendButton).toBeDisabled();
  },
};

export const KeyboardInteraction: Story = {
  name: '键盘交互',
  args: {
    placeholder: '试试按 Enter 发送消息...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '120px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例演示键盘交互功能：

## 键盘快捷键：

1. **Enter**: 发送消息并清空输入框
2. **Shift + Enter**: 在输入框中换行
3. **Tab**: 在输入框和发送按钮之间切换焦点

## 交互体验：

- 输入文本后按 Enter 键可以快速发送
- 需要换行时使用 Shift + Enter
- 空白消息不会被发送
- 发送后自动清空输入框
        `,
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('试试按 Enter 发送消息...');

    // 测试键盘输入
    await userEvent.type(textarea, 'Hello World');

    // 测试 Enter 键发送
    await userEvent.keyboard('{Enter}');

    // 验证消息被发送且输入框清空
    expect(args.onSend).toHaveBeenCalledWith('Hello World');
    expect(textarea).toHaveValue('');

    // 测试空消息不发送
    await userEvent.keyboard('{Enter}');

    // 验证空消息没有触发 onSend（仍然只调用了一次）
    expect(args.onSend).toHaveBeenCalledTimes(1);
  },
};

export const CustomSize: Story = {
  name: '自定义尺寸',
  args: {
    placeholder: '自定义高度的输入框...',
    className: 'h-32',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150px', width: '450px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示如何通过 className 属性自定义组件尺寸：

## 自定义方法：

\`\`\`tsx
<MessageInput 
  className="h-32"  // 128px 高度
  placeholder="自定义高度的输入框..."
/>
\`\`\`

## 常用尺寸类：

- \`h-20\` (80px) - 紧凑型
- \`h-24\` (96px) - 标准型  
- \`h-32\` (128px) - 舒适型
- \`h-40\` (160px) - 宽松型

## 注意事项：

- 确保父容器有足够的高度
- 最小建议高度为 80px
- 过小的高度可能影响工具栏显示
        `,
      },
    },
  },
};
