import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface MessageComposerProps {
  onSend: (body: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function MessageComposer({
  onSend,
  isLoading,
  placeholder = 'Type your message...',
}: MessageComposerProps) {
  const [body, setBody] = useState('');

  const handleSend = () => {
    if (body.trim()) {
      onSend(body.trim());
      setBody('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end p-4 border-t bg-white dark:bg-slate-900">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-12 max-h-32 resize-none"
        disabled={isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={!body.trim() || isLoading}
        size="icon"
        className="bg-blue-600 hover:bg-blue-700 h-12 w-12 flex-shrink-0"
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
