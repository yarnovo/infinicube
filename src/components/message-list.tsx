import * as React from 'react';
import { VirtuosoMessageList, VirtuosoMessageListLicense } from '@virtuoso.dev/message-list';
import type {
  VirtuosoMessageListProps,
  VirtuosoMessageListMethods,
} from '@virtuoso.dev/message-list';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from './message-bubble';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  message: string;
  timestamp: number;
  failed?: boolean;
}

interface MessageListContext {
  currentUserId: string;
  onRetry?: (messageId: string) => void;
}

type VirtuosoProps = VirtuosoMessageListProps<ChatMessage, MessageListContext>;

const ItemContent: VirtuosoProps['ItemContent'] = ({ data: message, context }) => {
  const isOwn = context.currentUserId === message.user.id;

  return (
    <MessageBubble
      message={message.message}
      isOwn={isOwn}
      userName={message.user.name}
      userAvatar={message.user.avatar}
      timestamp={message.timestamp}
      failed={message.failed}
      onRetry={() => context.onRetry?.(message.id)}
    />
  );
};

const EmptyPlaceholder: VirtuosoProps['EmptyPlaceholder'] = () => (
  <div className="flex items-center justify-center py-16 text-gray-500">暂无消息</div>
);

const Header: VirtuosoProps['Header'] = () => {
  return <div className="h-8" />;
};

export interface MessageListMethods {
  send: (message: string) => string;
  receive: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  update: (messageId: string, updates: Partial<ChatMessage>) => void;
}

export interface MessageListProps {
  currentUserId: string;
  licenseKey?: string;
  initialMessages?: ChatMessage[];
  onSend?: (message: ChatMessage) => void;
  onRetry?: (messageId: string) => void;
}

const MessageList = React.forwardRef<MessageListMethods, MessageListProps>(
  ({ currentUserId, licenseKey = '', initialMessages = [], onSend, onRetry }, ref) => {
    const messageListRef = React.useRef<VirtuosoMessageListMethods<ChatMessage>>(null);

    React.useImperativeHandle(ref, () => ({
      send: (messageText: string) => {
        const messageId = uuidv4();

        const newMessage: ChatMessage = {
          id: messageId,
          user: {
            id: currentUserId,
            name: 'Current User',
            avatar: `https://i.pravatar.cc/30?u=${currentUserId}`,
          },
          message: messageText,
          timestamp: Date.now(),
        };

        messageListRef.current?.data.append([newMessage], ({ atBottom, scrollInProgress }) => {
          if (atBottom || scrollInProgress) {
            return 'smooth';
          }
          return false;
        });

        onSend?.(newMessage);
        return messageId;
      },

      receive: (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const messageId = uuidv4();
        const newMessage: ChatMessage = {
          ...messageData,
          id: messageId,
          timestamp: Date.now(),
        };

        messageListRef.current?.data.append([newMessage], ({ atBottom, scrollInProgress }) => {
          if (atBottom || scrollInProgress) {
            return 'smooth';
          }
          return false;
        });

        return messageId;
      },

      update: (messageId: string, updates: Partial<ChatMessage>) => {
        messageListRef.current?.data.map((item) => {
          if (item.id === messageId) {
            return { ...item, ...updates };
          }
          return item;
        });
      },
    }));

    return (
      <VirtuosoMessageListLicense licenseKey={licenseKey}>
        <VirtuosoMessageList<ChatMessage, MessageListContext>
          context={{ currentUserId, onRetry }}
          initialData={initialMessages}
          shortSizeAlign="bottom-smooth"
          initialLocation={{ index: 'LAST', align: 'end' }}
          EmptyPlaceholder={EmptyPlaceholder}
          computeItemKey={({ data }) => data.id}
          Header={Header}
          className="h-full"
          ItemContent={ItemContent}
          ref={messageListRef}
        />
      </VirtuosoMessageListLicense>
    );
  }
);

MessageList.displayName = 'MessageList';

export default MessageList;
