import type { Meta, StoryObj } from '@storybook/react-vite';
import MessageBubble from '../components/message-bubble';

const meta = {
  title: 'Components/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OwnerMessage: Story = {
  name: '发送方消息',
  args: {
    message: '你好，这是一条普通消息。',
    isOwn: true,
    userName: '用户',
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=user',
    timestamp: Date.now(),
  },
};

export const ReceiverMessage: Story = {
  name: '接收方消息',
  args: {
    message: '你好，我是接收方。这条消息没有背景色，也没有头像。',
    isOwn: false,
    userName: 'Assistant',
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=assistant',
    timestamp: Date.now(),
  },
};

export const FailedMessage: Story = {
  name: '发送失败消息',
  args: {
    message: '这条消息发送失败了',
    isOwn: true,
    userName: '用户',
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=user',
    timestamp: Date.now(),
    failed: true,
    onRetry: () => console.log('重试发送'),
  },
};

export const LongMessage: Story = {
  name: '长文本消息',
  args: {
    message: `这是一条很长的消息，用来测试消息气泡在处理长文本时的表现。当消息内容很长时，气泡应该能够正确地换行显示，并保持良好的可读性。这条消息包含了足够多的文字，可以用来验证组件的文本换行和布局功能是否正常工作。`,
    isOwn: false,
    timestamp: Date.now(),
  },
};
