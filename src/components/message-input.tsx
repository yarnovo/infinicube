import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export interface MessageInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = 'Type a message...',
  onSend,
  disabled = false,
  className,
  maxHeight = 200,
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(0);

  // 自动调整高度的函数
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // 重置高度，让 scrollHeight 重新计算
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // 限制最大高度
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }
  }, [maxHeight]);

  // 监听内容变化，自动调整高度
  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);

  const handleSend = useCallback(() => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-background border rounded-lg overflow-hidden shadow-sm',
        className
      )}
    >
      {/* 上方区域：自适应高度输入框 */}
      <div className="flex-1 min-h-0">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full resize-none border-none outline-none p-3 min-h-[100px]',
            'bg-transparent text-sm',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            textareaHeight >= maxHeight && 'overflow-y-auto'
          )}
          rows={1}
          style={{ height: 'auto' }}
        />
      </div>

      {/* 下方区域：固定高度工具栏 */}
      <div className="h-12 border-t bg-muted/30 flex items-center justify-between px-3 flex-shrink-0">
        {/* 左侧：工具按钮区域（预留） */}
        <div className="flex items-center gap-2">{/* 这里可以放置其他工具按钮 */}</div>

        {/* 右侧：发送按钮 */}
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="sm"
          className="rounded-full w-8 h-8 p-0"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

MessageInput.displayName = 'MessageInput';
