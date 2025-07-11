import React, { useRef, useCallback } from 'react';
import MessageList from './message-list';
import type { MessageListMethods, ChatMessage } from './message-list';
import { MessageInput } from './message-input';

export type ChatWindowTheme = 'default' | 'borderless';

export interface ChatWindowProps {
  title?: string;
  placeholder?: string;
  onSendMessage?: (message: ChatMessage) => void;
  currentUserId?: string;
  licenseKey?: string;
  theme?: ChatWindowTheme;
  initialMessages?: ChatMessage[];
}

export const ChatWindow = React.forwardRef<MessageListMethods, ChatWindowProps>(
  (
    {
      title = 'Chat Window',
      placeholder = 'Type a message...',
      onSendMessage,
      currentUserId = 'user-1',
      licenseKey = '',
      theme = 'default',
      initialMessages,
    },
    ref
  ) => {
    const messageListRef = useRef<MessageListMethods>(null);

    // 将内部的 messageListRef 暴露给外部
    React.useImperativeHandle(ref, () => messageListRef.current!, []);

    const handleSend = useCallback((message: string) => {
      if (messageListRef.current) {
        messageListRef.current.send(message);
      }
    }, []);

    const handleMessageSent = useCallback(
      (message: ChatMessage) => {
        onSendMessage?.(message);
      },
      [onSendMessage]
    );

    const handleRetry = useCallback((messageId: string) => {
      if (messageListRef.current) {
        messageListRef.current.update(messageId, { failed: false });
      }
    }, []);

    // 主题样式定义
    const themeStyles = {
      default: {
        container:
          'flex flex-col h-full w-full bg-background rounded-lg border shadow-sm overflow-hidden',
        header: 'px-6 py-4 border-b bg-muted/50 flex-shrink-0',
        messagesContainer: 'flex-1 min-h-0 overflow-hidden bg-background',
        inputContainer: 'px-4 pb-4 pt-0 flex-shrink-0',
      },
      borderless: {
        container: 'flex flex-col h-full w-full bg-background overflow-hidden',
        header: 'px-6 py-4 border-b bg-muted/50 flex-shrink-0',
        messagesContainer: 'flex-1 min-h-0 overflow-hidden bg-background',
        inputContainer: 'px-4 pb-4 pt-0 flex-shrink-0',
      },
    };

    const currentTheme = themeStyles[theme];

    return (
      <div className={currentTheme.container}>
        {/* Header */}
        <div className={currentTheme.header}>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* Messages Container */}
        <div className={currentTheme.messagesContainer}>
          <MessageList
            ref={messageListRef}
            currentUserId={currentUserId}
            licenseKey={licenseKey}
            initialMessages={initialMessages}
            onSend={handleMessageSent}
            onRetry={handleRetry}
          />
        </div>

        {/* Input Container */}
        <div className={currentTheme.inputContainer}>
          <MessageInput placeholder={placeholder} onSend={handleSend} maxHeight={300} />
        </div>
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';
