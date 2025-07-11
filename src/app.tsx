import { useRef } from 'react';
import { ChatWindow } from './components/chat-window';
import type { ChatMessage, MessageListMethods } from './components/message-list';

// 模拟从数据库拉取的初始消息
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    user: {
      id: 'assistant-1',
      name: 'AI Assistant',
      avatar: '🤖',
    },
    message: '您好！我是您的 AI 助手，有什么可以帮助您的吗？',
    timestamp: Date.now() - 300000, // 5分钟前
  },
  {
    id: '2',
    user: {
      id: 'user-1',
      name: '用户',
      avatar: 'https://i.pravatar.cc/30?u=user-1',
    },
    message: '你好！我想了解一下你的功能。',
    timestamp: Date.now() - 240000, // 4分钟前
  },
  {
    id: '3',
    user: {
      id: 'assistant-1',
      name: 'AI Assistant',
      avatar: '🤖',
    },
    message:
      '我可以帮助您处理各种任务，包括：\n\n1. 回答问题和提供信息\n2. 协助编程和代码分析\n3. 文本创作和编辑\n4. 数据分析和计算\n5. 语言翻译\n\n请随时告诉我您需要什么帮助！',
    timestamp: Date.now() - 180000, // 3分钟前
  },
];

function App() {
  const chatWindowRef = useRef<MessageListMethods>(null);

  // 模拟流式响应的文本
  const simulateStreamingResponse = async (userMessage: string) => {
    // 使用 receive 方法接收 AI 消息
    const aiMessageId = chatWindowRef.current?.receive({
      user: {
        id: 'ai-assistant',
        name: 'AI Assistant',
        avatar: '🤖',
      },
      message: '',
    });

    if (!aiMessageId) return;

    // 模拟的回复内容
    const responseText = `您好！我收到了您的消息："${userMessage}"。这是一个模拟的流式回复演示。我会逐字显示这段文字，就像真实的大语言模型一样。

让我为您解释一下这个功能：
1. 当您发送消息后，我会立即开始回复
2. 文字会逐个字符出现，模拟打字效果
3. 这种效果让对话感觉更加自然和流畅

希望这个演示对您有所帮助！`;

    // 逐字更新消息
    let currentText = '';
    const updateInterval = setInterval(() => {
      if (currentText.length < responseText.length) {
        currentText = responseText.slice(0, currentText.length + 1);

        // 使用 update API 更新消息
        chatWindowRef.current?.update(aiMessageId, { message: currentText });
      } else {
        clearInterval(updateInterval);
      }
    }, 50); // 每50毫秒更新一次
  };

  const handleSendMessage = async (message: ChatMessage) => {
    // 触发模拟的流式回复
    await simulateStreamingResponse(message.message);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-screen flex flex-col items-center justify-center">
        <div className="h-[80%] w-full">
          <ChatWindow
            ref={chatWindowRef}
            title="AI Assistant Demo"
            placeholder="输入消息，体验流式回复..."
            onSendMessage={handleSendMessage}
            initialMessages={initialMessages}
            currentUserId="user-1"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
