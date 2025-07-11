import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';
import { useRef, useEffect } from 'react';
import MessageList from '../components/message-list';
import type { MessageListMethods, ChatMessage } from '../components/message-list';
import { getVirtuosoLicenseKey } from '../../.storybook/license';

const meta = {
  title: 'Components/MessageList',
  component: MessageList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## 简介

MessageList 是一个高性能的消息列表组件，专为聊天应用设计。它基于 @virtuoso.dev/message-list 构建，提供了虚拟滚动功能，能够流畅地处理大量消息。

## 主要职责

- **虚拟滚动渲染**：使用虚拟滚动技术，即使有数千条消息也能保持流畅的性能
- **消息状态管理**：支持消息的发送、接收和更新状态（包括失败状态）
- **自动滚动控制**：智能处理新消息到达时的滚动行为
- **消息区分显示**：根据发送者身份区分显示不同样式的消息气泡
- **失败重试机制**：支持消息发送失败后的重试功能

## 组件尺寸使用方式

**尺寸特点**：
- **高度**：使用 \`h-full\` (100%)，需要父容器提供确定的高度
- **宽度**：自适应内容宽度，不会自动撑满父容器宽度

**父容器要求**：
- 必须有明确的高度（如 \`height: 600px\` 或 \`height: 100vh\`）
- 如需控制宽度，应在父容器中设置 \`width\` 或使用 flex 布局

**与 ChatWindow 的差异**：
- **ChatWindow**：\`h-full w-full\` - 高度和宽度都是 100%
- **MessageList**：\`h-full\` - 仅高度是 100%，宽度自适应

## 基本用法

\`\`\`tsx
import { useRef } from 'react';
import MessageList from './components/MessageList';
import type { MessageListMethods } from './components/MessageList';

function App() {
  const messageListRef = useRef<MessageListMethods>(null);

  // 发送消息（返回消息ID）
  const handleSend = (text: string) => {
    const messageId = messageListRef.current?.send(text);
    console.log('发送的消息ID:', messageId);
  };

  // 接收消息（返回消息ID）
  const handleReceive = () => {
    const messageId = messageListRef.current?.receive({
      user: {
        id: 'user-2',
        name: 'Other User',
        avatar: 'https://example.com/avatar.jpg'
      },
      message: 'Hello!'
    });
    console.log('接收的消息ID:', messageId);
  };

  // 更新消息状态（如标记为失败）
  const markMessageFailed = (messageId: string) => {
    messageListRef.current?.update(messageId, { failed: true });
  };

  // 处理重试
  const handleRetry = (messageId: string) => {
    // 先更新状态为成功
    messageListRef.current?.update(messageId, { failed: false });
    // 然后重新发送到服务器
    console.log('重试发送消息:', messageId);
  };

  return (
    <MessageList
      ref={messageListRef}
      currentUserId="user-1"
      initialMessages={[
        {
          id: '1',
          user: {
            id: 'assistant-1',
            name: 'Assistant',
            avatar: 'https://i.pravatar.cc/30?u=assistant',
          },
          message: '你好！欢迎使用聊天窗口组件。',
          timestamp: Date.now() - 60000,
        },
      ]}
      onSend={(message) => {
        console.log('Message sent:', message);
        // 发送到服务器
      }}
      onRetry={handleRetry}
    />
  );
}
\`\`\`

## API 说明

### Props

- **currentUserId** (string): 当前用户的ID，用于区分消息是自己发送的还是他人发送的
- **licenseKey** (string, 可选): VirtuosoMessageList 的许可证密钥
- **initialMessages** (ChatMessage[], 可选): 初始化时显示的消息列表，用于加载历史消息
- **onSend** (function, 可选): 消息发送时的回调函数，接收发送的消息对象作为参数
- **onRetry** (function, 可选): 重试发送消息的回调函数，接收消息ID作为参数

### Ref Methods

通过 ref 可以访问以下方法：

- **send(message: string): string** - 发送一条消息，返回消息ID
- **receive(message: Omit<ChatMessage, 'id' | 'timestamp'>): string** - 接收一条消息，返回消息ID
- **update(messageId: string, updates: Partial<ChatMessage>): void** - 更新指定消息的状态

### 数据类型

\`\`\`typescript
interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

interface ChatMessage {
  id: string;
  user: ChatUser;
  message: string;
  timestamp: number;
  failed?: boolean;
}
\`\`\`

## 新特性

### 乐观更新

消息发送时立即显示在界面上，无需等待服务器响应。如果发送失败，可以通过 update 方法标记消息为失败状态。

### 失败重试

当消息发送失败时，用户可以点击重试按钮重新发送。通过 onRetry 回调处理重试逻辑。
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentUserId: {
      control: 'text',
      description: '当前用户ID，用于区分消息发送者',
    },
    licenseKey: {
      control: 'text',
      description: 'VirtuosoMessageList 许可证密钥',
    },
    initialMessages: {
      control: 'object',
      description: '初始化时显示的消息列表',
    },
  },
  args: {
    onSend: fn(),
    onRetry: fn(),
    licenseKey: getVirtuosoLicenseKey(),
  },
} satisfies Meta<typeof MessageList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 用于测试的 MessageList 包装组件
interface TestMessageListProps {
  currentUserId: string;
  licenseKey?: string;
  initialMessages?: ChatMessage[];
  onSend?: (message: ChatMessage) => void;
  onRetry?: (messageId: string) => void;
  exposeRef?: (ref: React.RefObject<MessageListMethods | null>) => void;
}

const TestMessageList = ({
  onSend = fn(),
  onRetry = fn(),
  exposeRef,
  ...props
}: TestMessageListProps) => {
  const messageListRef = useRef<MessageListMethods>(null);

  // 通过 prop 回调暴露 ref，而不是挂载到 window
  useEffect(() => {
    if (exposeRef) {
      exposeRef(messageListRef);
    }
  }, [exposeRef]);

  return <MessageList ref={messageListRef} onSend={onSend} onRetry={onRetry} {...props} />;
};

// 创建一个用于存储 ref 的容器
let testMessageListRef: React.RefObject<MessageListMethods | null> | null = null;

export const Default: Story = {
  name: '默认样式',
  args: {
    currentUserId: 'user-1',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  name: '交互式演示',
  args: {
    currentUserId: 'user-1',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TestMessageList
      {...args}
      exposeRef={(ref) => {
        testMessageListRef = ref;
      }}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染和 ref 设置
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 使用闭包中的 ref
    const messageListRef = testMessageListRef;
    if (!messageListRef?.current) {
      throw new Error('MessageList ref not available');
    }

    // 接收第一条消息
    await new Promise((resolve) => setTimeout(resolve, 500));
    messageListRef.current.receive({
      user: {
        id: 'assistant-1',
        name: 'Assistant',
        avatar: 'https://i.pravatar.cc/30?u=assistant',
      },
      message: '你好！欢迎使用聊天窗口组件。',
    });

    // 验证消息出现
    const welcomeMessage = await canvas.findByText('你好！欢迎使用聊天窗口组件。');
    expect(welcomeMessage).toBeInTheDocument();

    // 发送一条消息
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.send('谢谢！这个组件看起来很不错。');

    // 验证发送的消息出现
    const sentMessage = await canvas.findByText('谢谢！这个组件看起来很不错。');
    expect(sentMessage).toBeInTheDocument();

    // 验证 onSend 回调被调用
    expect(args.onSend).toHaveBeenCalled();

    // 接收回复消息
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.receive({
      user: {
        id: 'assistant-1',
        name: 'Assistant',
        avatar: 'https://i.pravatar.cc/30?u=assistant',
      },
      message: '是的，它支持流畅的滚动和消息状态管理。',
    });

    // 验证回复消息出现
    const replyMessage = await canvas.findByText('是的，它支持流畅的滚动和消息状态管理。');
    expect(replyMessage).toBeInTheDocument();

    // 发送一条会失败的消息
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const id4 = messageListRef.current.send('这条消息会发送失败');

    // 标记消息为失败
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.update(id4, { failed: true });

    // 验证失败消息显示重试按钮
    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryButton = await canvas.findByTitle('重新发送');
    expect(retryButton).toBeInTheDocument();
  },
};

export const WithDifferentUser: Story = {
  name: '不同用户视角',
  args: {
    currentUserId: 'user-2',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TestMessageList
      {...args}
      exposeRef={(ref) => {
        testMessageListRef = ref;
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 获取 messageListRef
    const messageListRef = testMessageListRef;
    if (!messageListRef?.current) {
      throw new Error('MessageList ref not available');
    }

    // 从 user-2 视角接收消息
    await new Promise((resolve) => setTimeout(resolve, 500));
    messageListRef.current.receive({
      user: {
        id: 'assistant-1',
        name: 'Assistant',
        avatar: 'https://i.pravatar.cc/30?u=assistant',
      },
      message: '你好！欢迎使用聊天窗口组件。',
    });

    // 从 user-2 视角发送消息（应该显示在右侧）
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.send('谢谢！这个组件看起来很不错。');

    // 从其他用户接收消息（应该显示在左侧）
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.receive({
      user: {
        id: 'user-1',
        name: 'User 1',
        avatar: 'https://i.pravatar.cc/30?u=user1',
      },
      message: '是的，它支持流畅的滚动和消息状态管理。',
    });

    // 验证所有消息都出现了
    await new Promise((resolve) => setTimeout(resolve, 500));
    const message1 = await canvas.findByText('你好！欢迎使用聊天窗口组件。');
    const message2 = await canvas.findByText('谢谢！这个组件看起来很不错。');
    const message3 = await canvas.findByText('是的，它支持流畅的滚动和消息状态管理。');

    expect(message1).toBeInTheDocument();
    expect(message2).toBeInTheDocument();
    expect(message3).toBeInTheDocument();
  },
};

export const WithInitialMessages: Story = {
  name: '带有初始消息',
  args: {
    currentUserId: 'user-1',
    initialMessages: [
      {
        id: '1',
        user: {
          id: 'assistant-1',
          name: 'Assistant',
          avatar: 'https://i.pravatar.cc/30?u=assistant',
        },
        message: '你好！欢迎使用聊天窗口组件。',
        timestamp: Date.now() - 60000,
      },
      {
        id: '2',
        user: {
          id: 'user-1',
          name: 'Current User',
          avatar: 'https://i.pravatar.cc/30?u=user1',
        },
        message: '谢谢！这个组件看起来很不错。',
        timestamp: Date.now() - 30000,
      },
      {
        id: '3',
        user: {
          id: 'assistant-1',
          name: 'Assistant',
          avatar: 'https://i.pravatar.cc/30?u=assistant',
        },
        message: '是的，它支持流畅的滚动和消息状态管理。',
        timestamp: Date.now() - 10000,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TestMessageList
      {...args}
      exposeRef={(ref) => {
        testMessageListRef = ref;
      }}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 验证初始消息显示
    const message1 = await canvas.findByText('你好！欢迎使用聊天窗口组件。');
    const message2 = await canvas.findByText('谢谢！这个组件看起来很不错。');
    const message3 = await canvas.findByText('是的，它支持流畅的滚动和消息状态管理。');

    expect(message1).toBeInTheDocument();
    expect(message2).toBeInTheDocument();
    expect(message3).toBeInTheDocument();

    // 获取 messageListRef
    const messageListRef = testMessageListRef;
    if (!messageListRef?.current) {
      throw new Error('MessageList ref not available');
    }

    // 添加新消息
    await new Promise((resolve) => setTimeout(resolve, 1000));
    messageListRef.current.send('这是一条新消息');

    // 验证新消息出现
    const newMessage = await canvas.findByText('这是一条新消息');
    expect(newMessage).toBeInTheDocument();

    // 验证 onSend 回调被调用
    expect(args.onSend).toHaveBeenCalled();
  },
};

export const WithFailedMessages: Story = {
  name: '包含失败消息',
  args: {
    currentUserId: 'user-1',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TestMessageList
      {...args}
      exposeRef={(ref) => {
        testMessageListRef = ref;
      }}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 获取 messageListRef
    const messageListRef = testMessageListRef;
    if (!messageListRef?.current) {
      throw new Error('MessageList ref not available');
    }

    // 添加一些成功的消息
    messageListRef.current.receive({
      user: {
        id: 'user-2',
        name: 'John',
        avatar: 'https://i.pravatar.cc/30?u=john',
      },
      message: '这是一条正常的消息',
    });

    // 添加一条失败的消息
    await new Promise((resolve) => setTimeout(resolve, 500));
    const failedId = messageListRef.current.send('这条消息发送失败了');

    // 标记为失败
    await new Promise((resolve) => setTimeout(resolve, 100));
    messageListRef.current.update(failedId, { failed: true });

    // 再添加一条正常消息
    await new Promise((resolve) => setTimeout(resolve, 500));
    messageListRef.current.receive({
      user: {
        id: 'user-2',
        name: 'John',
        avatar: 'https://i.pravatar.cc/30?u=john',
      },
      message: '后续的消息正常显示',
    });

    // 验证失败消息的重试按钮
    const retryButton = await canvas.findByTitle('重新发送');
    expect(retryButton).toBeInTheDocument();

    // 点击重试按钮
    await userEvent.click(retryButton);

    // 验证 onRetry 回调被调用
    expect(args.onRetry).toHaveBeenCalledWith(failedId);

    // 模拟重试成功
    await new Promise((resolve) => setTimeout(resolve, 500));
    messageListRef.current.update(failedId, { failed: false });

    // 验证重试按钮消失
    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryButtons = canvas.queryAllByTitle('重新发送');
    expect(retryButtons).toHaveLength(0);
  },
};
