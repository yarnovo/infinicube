import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';
import { useRef, useState } from 'react';
import { ChatWindow } from '../components/chat-window';
import type { MessageListMethods, ChatMessage } from '../components/message-list';
import { getVirtuosoLicenseKey } from '../../.storybook/license';

const meta = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## 简介

ChatWindow 是一个完整的聊天窗口组件，集成了消息列表和输入框功能。它提供了一个开箱即用的聊天界面，适用于各种聊天应用场景，如客服系统、AI 对话界面等。

## 主要职责

- **完整的聊天界面**：包含标题栏、消息列表和输入区域的完整聊天窗口
- **消息管理**：内部集成了 MessageList 组件，提供消息的发送、接收和状态管理功能
- **用户交互**：提供友好的输入界面，支持键盘快捷键（Enter 发送消息）
- **样式美观**：使用 Tailwind CSS 提供现代化的界面设计，支持响应式布局
- **自适应尺寸**：组件高度和宽度自适应父容器，可以轻松撑满各种布局

## 基本用法

\`\`\`tsx
import { ChatWindow } from './components/ChatWindow';

function App() {
  const handleSendMessage = (message: ChatMessage) => {
    console.log('用户发送了消息:', message);
    // 在这里处理消息发送逻辑
    // 例如：发送到服务器、保存到数据库等
  };

  return (
    <ChatWindow
      title="客服支持"
      placeholder="请输入您的问题..."
      currentUserId="user-123"
      onSendMessage={handleSendMessage}
    />
  );
}
\`\`\`

## 高级用法

### 与后端集成

\`\`\`tsx
import { ChatWindow } from './components/ChatWindow';
import { useWebSocket } from './hooks/useWebSocket';

function ChatApp() {
  const { sendMessage, onMessage } = useWebSocket('wss://chat-server.com');
  const chatWindowRef = useRef(null);

  // 监听来自服务器的消息
  useEffect(() => {
    onMessage((message) => {
      // 通过 ref 调用 MessageList 的方法
      // 注意：需要扩展 ChatWindow 组件以暴露内部 MessageList 的 ref
    });
  }, []);

  const handleSendMessage = async (message: ChatMessage) => {
    // 发送消息到服务器
    await sendMessage({
      text: message.message,
      userId: message.user.id,
      timestamp: message.timestamp
    });
  };

  return (
    <ChatWindow
      title="在线聊天"
      currentUserId="user-123"
      onSendMessage={handleSendMessage}
    />
  );
}
\`\`\`

## API 说明

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| **title** | string | "Chat Window" | 聊天窗口的标题 |
| **placeholder** | string | "Type a message..." | 输入框的占位符文本 |
| **onSendMessage** | function | - | 消息发送时的回调函数，接收 ChatMessage 对象 |
| **currentUserId** | string | "user-1" | 当前用户的ID |
| **licenseKey** | string | "" | VirtuosoMessageList 的许可证密钥 |
| **theme** | 'default' | 'borderless' | "default" | 聊天窗口的主题样式 |
| **initialMessages** | ChatMessage[] | - | 初始消息列表，用于展示历史对话 |

### 回调函数

**onSendMessage(message: ChatMessage): void**

当用户发送消息时触发。message 参数包含：
- \`id\`: 消息ID（初始为 null）
- \`localId\`: 本地临时ID
- \`user\`: 发送者信息
- \`message\`: 消息内容
- \`timestamp\`: 时间戳
- \`delivered\`: 发送状态

## 特性说明

### 键盘快捷键

- **Enter**: 发送消息
- **Shift + Enter**: 换行（当前版本输入框为单行，此功能预留）

## 主题系统

ChatWindow 组件支持两种主题样式，通过 \`theme\` 属性进行控制：

### 默认主题 (default)

这是组件的默认主题，具有完整的视觉边界：

\`\`\`tsx
<ChatWindow theme="default" title="默认主题" />
\`\`\`

**特点**：
- 有边框 (\`border\`)
- 圆角 (\`rounded-lg\`)  
- 阴影 (\`shadow-sm\`)
- 适合独立使用
- 具有明确的视觉边界

### 无边框主题 (borderless)

简洁的主题样式，适合嵌入到其他布局中：

\`\`\`tsx
<ChatWindow theme="borderless" title="无边框主题" />
\`\`\`

**特点**：
- 无外边框
- 无圆角
- 无阴影
- 保留头部和输入区域的分割线
- 适合嵌入到其他组件中

### 主题选择建议

- **独立使用**：选择 \`default\` 主题，具有明确的视觉边界
- **嵌入使用**：选择 \`borderless\` 主题，与周围布局更好融合
- **自定义边框**：使用 \`borderless\` 主题并在父容器中添加自定义样式

## 样式定制

组件使用 Tailwind CSS 类名，可以通过以下方式定制样式：

1. **修改颜色主题**：调整标题栏的渐变色、消息气泡颜色等
2. **调整尺寸**：修改窗口高度、宽度限制等
3. **响应式设计**：组件已支持响应式，可根据需要调整断点行为

## 注意事项

- 组件需要在支持 Tailwind CSS 的项目中使用
- MessageList 基于商业许可的 @virtuoso.dev/message-list，生产环境使用需要购买许可证
- **组件尺寸自适应**：组件高度和宽度都是 100%，需要父容器提供确定的尺寸
- **父容器要求**：父容器必须有明确的高度（如 height: 600px 或 height: 100vh）
- **防止溢出**：建议在父容器上设置 overflow: hidden 避免双重滚动条
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '聊天窗口标题',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位符文本',
    },
    currentUserId: {
      control: 'text',
      description: '当前用户ID',
    },
    licenseKey: {
      control: 'text',
      description: 'VirtuosoMessageList 许可证密钥',
    },
    theme: {
      control: 'select',
      options: ['default', 'borderless'],
      description: '聊天窗口主题样式',
    },
    initialMessages: {
      control: 'object',
      description: '初始消息列表',
    },
  },
  args: {
    onSendMessage: fn(),
    licenseKey: getVirtuosoLicenseKey(),
  },
} satisfies Meta<typeof ChatWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认样式',
  args: {
    title: '聊天窗口',
    placeholder: '输入消息...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 查找输入框和发送按钮
    const input = canvas.getByPlaceholderText('输入消息...');
    const sendButton = canvas.getByRole('button');

    // 测试输入和发送消息
    await userEvent.type(input, '你好，这是一条测试消息');
    await userEvent.click(sendButton);

    // 验证输入框已清空
    expect(input).toHaveValue('');

    // 验证 onSendMessage 被调用
    expect(args.onSendMessage).toHaveBeenCalled();

    // 等待消息出现在列表中
    await new Promise((resolve) => setTimeout(resolve, 500));
    const message = await canvas.findByText('你好，这是一条测试消息');
    expect(message).toBeInTheDocument();
  },
};

export const CustomTitle: Story = {
  name: '自定义标题',
  args: {
    title: '客服支持',
    placeholder: '请描述您的问题...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const EnglishVersion: Story = {
  name: '英文版本',
  args: {
    title: 'Chat Support',
    placeholder: 'Type your message here...',
    currentUserId: 'user-en',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 测试使用 Enter 键发送消息
    const input = canvas.getByPlaceholderText('Type your message here...');

    await userEvent.type(input, 'Hello, I need help!');
    await userEvent.keyboard('{Enter}');

    // 验证输入框已清空
    expect(input).toHaveValue('');

    // 验证消息出现
    await new Promise((resolve) => setTimeout(resolve, 500));
    const message = await canvas.findByText('Hello, I need help!');
    expect(message).toBeInTheDocument();
  },
};

export const WithLongTitle: Story = {
  name: '长标题',
  args: {
    title: '这是一个非常长的标题用于测试标题栏的显示效果',
    placeholder: '输入消息...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

const InteractiveChatWindow = () => {
  return (
    <ChatWindow
      title="交互式聊天窗口"
      placeholder="输入消息并查看控制台..."
      licenseKey={getVirtuosoLicenseKey()}
      onSendMessage={(message) => {
        console.log('发送的消息:', message);
        alert(`消息已发送: ${message.message}`);
      }}
    />
  );
};

export const Interactive: Story = {
  name: '交互式窗口',
  render: () => <InteractiveChatWindow />,
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

const AdvancedChatWindow = () => {
  const messageListRef = useRef<MessageListMethods>(null);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  const handleReceiveAndUpdate = () => {
    if (!messageListRef.current) return;

    // 接收一条消息并获取其 ID
    const messageId = messageListRef.current.receive({
      user: {
        id: 'assistant-1',
        name: 'AI Assistant',
        avatar: 'https://i.pravatar.cc/30?u=assistant',
      },
      message: '正在处理您的请求...',
    });

    // 保存消息 ID
    setReceivedMessages((prev) => [...prev, messageId]);

    // 2秒后更新消息内容
    setTimeout(() => {
      messageListRef.current?.update(messageId, {
        message: '✅ 请求已处理完成！这是更新后的消息。',
      });
    }, 2000);

    // 4秒后再次更新，展示更复杂的状态
    setTimeout(() => {
      messageListRef.current?.update(messageId, {
        message: '✅ 请求已处理完成！这是更新后的消息。\n\n📊 处理结果：成功\n⏱️ 耗时：3.5秒',
      });
    }, 4000);
  };

  const handleSimulateTyping = () => {
    if (!messageListRef.current) return;

    // 接收"正在输入"消息
    const typingMessageId = messageListRef.current.receive({
      user: {
        id: 'assistant-2',
        name: 'Support Agent',
        avatar: 'https://i.pravatar.cc/30?u=support',
      },
      message: '正在输入...',
    });

    // 模拟逐字输入效果
    const fullMessage = '您好！我是客服代表，很高兴为您服务。请问有什么可以帮助您的吗？';
    let currentText = '';
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < fullMessage.length) {
        currentText += fullMessage[index];
        messageListRef.current?.update(typingMessageId, {
          message: currentText + '▊',
        });
        index++;
      } else {
        // 输入完成，移除光标
        messageListRef.current?.update(typingMessageId, {
          message: currentText,
        });
        clearInterval(typeInterval);
      }
    }, 50);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2">
        <button
          onClick={handleReceiveAndUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          接收并更新消息
        </button>
        <button
          onClick={handleSimulateTyping}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          模拟打字效果
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          ref={messageListRef}
          title="高级聊天功能演示"
          placeholder="试试发送消息或点击上方按钮..."
          licenseKey={getVirtuosoLicenseKey()}
          onSendMessage={(message) => {
            console.log('发送的消息:', message);
          }}
        />
      </div>
      {receivedMessages.length > 0 && (
        <div className="text-sm text-gray-600">已接收的消息 ID: {receivedMessages.join(', ')}</div>
      )}
    </div>
  );
};

export const AdvancedFeatures: Story = {
  name: '高级功能',
  render: () => <AdvancedChatWindow />,
  decorators: [
    (Story) => (
      <div style={{ height: '700px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示了如何使用 receive 方法的返回值来更新消息：

1. **接收并更新消息**：点击按钮接收一条消息，然后使用返回的 ID 多次更新消息内容
2. **模拟打字效果**：展示如何创建逐字显示的打字动画效果

关键代码：
\`\`\`tsx
// 接收消息并获取 ID
const messageId = messageListRef.current.receive({
  user: { id: 'bot', name: 'Bot' },
  message: '初始消息'
});

// 使用 ID 更新消息
messageListRef.current.update(messageId, {
  message: '更新后的消息'
});
\`\`\`
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 点击"接收并更新消息"按钮
    const receiveUpdateButton = canvas.getByText('接收并更新消息');
    await userEvent.click(receiveUpdateButton);

    // 验证初始消息出现
    await new Promise((resolve) => setTimeout(resolve, 500));
    const initialMessage = await canvas.findByText('正在处理您的请求...');
    expect(initialMessage).toBeInTheDocument();

    // 等待第一次更新
    await new Promise((resolve) => setTimeout(resolve, 2100));
    const updatedMessage = await canvas.findByText('✅ 请求已处理完成！这是更新后的消息。');
    expect(updatedMessage).toBeInTheDocument();

    // 等待第二次更新
    await new Promise((resolve) => setTimeout(resolve, 2100));
    const finalMessage = await canvas.findByText(/处理结果：成功/);
    expect(finalMessage).toBeInTheDocument();

    // 测试打字效果
    const typingButton = canvas.getByText('模拟打字效果');
    await userEvent.click(typingButton);

    // 验证打字开始 - 检查是否有带光标的文本
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 查找包含光标符号的元素
    const typingMessage = await canvas.findByText((content) => {
      return content.includes('▊');
    });
    expect(typingMessage).toBeInTheDocument();

    // 等待打字完成
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const completedMessage = await canvas.findByText(
      '您好！我是客服代表，很高兴为您服务。请问有什么可以帮助您的吗？'
    );
    expect(completedMessage).toBeInTheDocument();
  },
};

// 撑满父容器的示例组件
const FullHeightChatWindow = () => {
  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        border: '2px dashed #999',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        父容器高度: 500px (带虚线边框)
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatWindow
          title="撑满父容器的聊天窗口"
          placeholder="这个聊天窗口会自动撑满父容器..."
          licenseKey={getVirtuosoLicenseKey()}
          onSendMessage={(message) => {
            console.log('发送的消息:', message);
          }}
        />
      </div>
    </div>
  );
};

export const FullHeight: Story = {
  name: '撑满父容器',
  render: () => <FullHeightChatWindow />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `
这个示例展示了如何让 ChatWindow 组件撑满父容器的高度和宽度。

## 关键要点：

1. **父容器必须有明确的高度**
   - 使用固定高度：\`height: '500px'\`
   - 或使用视口单位：\`height: '100vh'\`
   - 或在 flex 布局中使用 \`flex: 1\`

2. **使用 Flex 布局**
   \`\`\`css
   display: flex;
   flex-direction: column;
   \`\`\`

3. **包装 ChatWindow 的容器设置**
   \`\`\`css
   flex: 1;
   overflow: hidden;
   \`\`\`

## 其他布局示例：

### 视口高度布局
\`\`\`tsx
<div style={{ height: '100vh', width: '100vw' }}>
  <ChatWindow />
</div>
\`\`\`

### Grid 布局
\`\`\`tsx
<div style={{
  display: 'grid',
  gridTemplateRows: '60px 1fr 60px',
  height: '100vh'
}}>
  <header>顶部导航</header>
  <main style={{ overflow: 'hidden' }}>
    <ChatWindow />
  </main>
  <footer>底部信息</footer>
</div>
\`\`\`
        `,
      },
    },
  },
};

// 视口高度示例组件
const ViewportHeightChatWindow = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
      <header
        style={{
          height: '60px',
          backgroundColor: '#333',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px' }}>应用头部</h1>
      </header>
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: '20px',
          display: 'flex',
          gap: '20px',
        }}
      >
        <aside
          style={{
            width: '200px',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>侧边栏</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            这是一个典型的应用布局，ChatWindow 在主内容区域撑满剩余空间。
          </p>
        </aside>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ChatWindow
            title="全屏应用中的聊天窗口"
            placeholder="输入消息..."
            licenseKey={getVirtuosoLicenseKey()}
            onSendMessage={(message) => {
              console.log('发送的消息:', message);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export const ViewportHeight: Story = {
  name: '视口高度布局',
  render: () => <ViewportHeightChatWindow />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
这个示例展示了在全屏应用中如何使用 ChatWindow 组件。

## 布局特点：

1. **使用 100vh 高度**：整个应用占满视口高度
2. **Flex 布局**：头部固定高度，主内容区域自适应
3. **侧边栏布局**：典型的三栏布局，ChatWindow 在主内容区域
4. **响应式设计**：组件会自动适应可用空间

## 注意事项：

- 确保父容器设置 \`overflow: hidden\` 避免出现双重滚动条
- 在移动端可能需要考虑虚拟键盘对视口高度的影响
- 可以根据需要调整间距和样式
        `,
      },
    },
  },
};

export const BorderlessTheme: Story = {
  name: '无边框主题',
  args: {
    title: '无边框聊天窗口',
    placeholder: '输入消息...',
    theme: 'borderless',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示了无边框主题的聊天窗口：

## 主题特点：

1. **无外边框**：移除了组件的外边框、圆角和阴影
2. **保留分割线**：头部和输入区域仍保留分割线（border-b 和 border-t）
3. **简洁设计**：适用于需要融入更大布局的场景
4. **完整功能**：所有交互功能与默认主题完全相同

## 适用场景：

- 嵌入到其他组件中
- 需要自定义外部边框的场景
- 简洁风格的设计需求
- 与其他组件组合使用

## 主题对比：

- **默认主题**: 有边框、圆角、阴影 - 适合独立使用
- **无边框主题**: 无边框、无圆角、无阴影 - 适合嵌入使用
        `,
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 查找输入框和发送按钮
    const input = canvas.getByPlaceholderText('输入消息...');
    const sendButton = canvas.getByRole('button');

    // 测试输入和发送消息
    await userEvent.type(input, '测试无边框主题');
    await userEvent.click(sendButton);

    // 验证输入框已清空
    expect(input).toHaveValue('');

    // 验证 onSendMessage 被调用
    expect(args.onSendMessage).toHaveBeenCalled();

    // 等待消息出现在列表中
    await new Promise((resolve) => setTimeout(resolve, 500));
    const message = await canvas.findByText('测试无边框主题');
    expect(message).toBeInTheDocument();
  },
};

export const ThemeComparison: Story = {
  name: '主题对比',
  render: () => (
    <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>默认主题</h3>
        <ChatWindow
          title="默认主题"
          placeholder="输入消息..."
          theme="default"
          licenseKey={getVirtuosoLicenseKey()}
          onSendMessage={(message) => {
            console.log('默认主题消息:', message);
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>无边框主题</h3>
        <ChatWindow
          title="无边框主题"
          placeholder="输入消息..."
          theme="borderless"
          licenseKey={getVirtuosoLicenseKey()}
          onSendMessage={(message) => {
            console.log('无边框主题消息:', message);
          }}
        />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
这个示例并排展示了两种主题的差异：

## 视觉对比：

1. **默认主题（左侧）**：
   - 有边框、圆角、阴影
   - 适合作为独立组件使用
   - 具有明确的视觉边界

2. **无边框主题（右侧）**：
   - 无边框、无圆角、无阴影
   - 适合嵌入到其他布局中
   - 简洁的视觉效果

## 功能特点：

- 两种主题功能完全相同
- 都保留了头部和输入区域的分割线
- 可以根据设计需求选择合适的主题
- 支持所有相同的 Props 和回调函数

## 使用建议：

- **独立使用**：选择默认主题
- **嵌入使用**：选择无边框主题
- **自定义边框**：使用无边框主题并在父容器中添加样式
        `,
      },
    },
  },
};

// 带有初始消息的示例组件
const ChatWithInitialMessages = () => {
  // 初始消息列表
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      user: {
        id: 'assistant-1',
        name: 'AI Assistant',
        avatar: '🤖',
      },
      message: '您好！欢迎使用 AI 智能助手。我可以帮助您解答各种问题。',
      timestamp: Date.now() - 3600000, // 1小时前
    },
    {
      id: '2',
      user: {
        id: 'user-1',
        name: '用户',
        avatar: 'https://i.pravatar.cc/30?u=user-1',
      },
      message: '你好！我想了解一下天气预报功能。',
      timestamp: Date.now() - 3000000, // 50分钟前
    },
    {
      id: '3',
      user: {
        id: 'assistant-1',
        name: 'AI Assistant',
        avatar: '🤖',
      },
      message:
        '当然可以！我可以为您提供以下天气服务：\n\n1. 查询当前天气\n2. 未来7天天气预报\n3. 天气预警信息\n4. 空气质量指数\n\n请问您想查询哪个城市的天气呢？',
      timestamp: Date.now() - 2400000, // 40分钟前
    },
    {
      id: '4',
      user: {
        id: 'user-1',
        name: '用户',
        avatar: 'https://i.pravatar.cc/30?u=user-1',
      },
      message: '我想查询北京的天气。',
      timestamp: Date.now() - 1800000, // 30分钟前
    },
    {
      id: '5',
      user: {
        id: 'assistant-1',
        name: 'AI Assistant',
        avatar: '🤖',
      },
      message:
        '北京今日天气：\n\n🌤 晴天\n🌡️ 温度：18°C ~ 28°C\n💨 风力：微风 2级\n💧 湿度：45%\n🌈 空气质量：良好 (AQI: 75)\n\n建议：天气晴朗，适合外出活动。紫外线较强，请注意防晒。',
      timestamp: Date.now() - 1200000, // 20分钟前
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const chatWindowRef = useRef<MessageListMethods>(null);

  const handleSendMessage = (message: ChatMessage) => {
    // 添加用户消息到状态
    setMessages((prev) => [...prev, message]);

    // 模拟 AI 回复
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: Date.now().toString(),
        user: {
          id: 'assistant-1',
          name: 'AI Assistant',
          avatar: '🤖',
        },
        message: '收到您的消息！我正在处理您的请求...',
        timestamp: Date.now(),
      };

      if (chatWindowRef.current) {
        chatWindowRef.current.receive({
          user: aiReply.user,
          message: aiReply.message,
        });
      }
    }, 1000);
  };

  return (
    <ChatWindow
      ref={chatWindowRef}
      title="带有历史对话的聊天窗口"
      placeholder="继续对话..."
      initialMessages={messages}
      currentUserId="user-1"
      licenseKey={getVirtuosoLicenseKey()}
      onSendMessage={handleSendMessage}
    />
  );
};

export const WithInitialMessages: Story = {
  name: '带有初始消息',
  render: () => <ChatWithInitialMessages />,
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
这个示例展示了如何使用 \`initialMessages\` 属性加载历史对话记录。

## 功能特点：

1. **历史消息展示**：组件加载时显示预设的对话历史
2. **不同时间戳**：消息显示不同的时间，模拟真实对话场景
3. **多用户对话**：展示用户和 AI 助手之间的对话
4. **继续对话**：用户可以在历史对话基础上继续交流

## 使用场景：

- **恢复会话**：用户重新打开聊天窗口时加载之前的对话
- **客服系统**：显示历史工单记录
- **AI 对话**：展示之前的问答历史
- **教学演示**：预设对话内容进行功能展示

## 代码示例：

\`\`\`tsx
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    user: {
      id: 'assistant-1',
      name: 'AI Assistant',
      avatar: '🤖',
    },
    message: '您好！欢迎使用 AI 智能助手。',
    timestamp: Date.now() - 3600000,
  },
  // ... 更多历史消息
];

<ChatWindow
  initialMessages={initialMessages}
  currentUserId="user-1"
  onSendMessage={handleSendMessage}
/>
\`\`\`

## 注意事项：

- 初始消息会在组件首次渲染时加载
- 消息列表会自动滚动到最底部（最新消息）
- 支持与 MessageList 组件的所有交互功能
- 可以结合 ref 方法动态添加更多消息
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 验证可见的历史消息显示（虚拟滚动会自动滚动到最底部）
    const weatherQuery = await canvas.findByText('我想查询北京的天气。');
    expect(weatherQuery).toBeInTheDocument();

    const weatherInfo = await canvas.findByText(/北京今日天气/);
    expect(weatherInfo).toBeInTheDocument();

    // 测试发送新消息
    const input = canvas.getByPlaceholderText('继续对话...');
    const sendButton = canvas.getByRole('button');

    await userEvent.type(input, '还有其他功能吗？');
    await userEvent.click(sendButton);

    // 验证新消息发送
    expect(input).toHaveValue('');

    // 等待新消息出现
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newMessage = await canvas.findByText('还有其他功能吗？');
    expect(newMessage).toBeInTheDocument();

    // 等待 AI 回复
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const aiReply = await canvas.findByText('收到您的消息！我正在处理您的请求...');
    expect(aiReply).toBeInTheDocument();
  },
};
