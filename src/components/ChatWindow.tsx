import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  chatId: number;
  chatName: string;
  chatAvatar: string;
  onBack: () => void;
  onVibrate: () => void;
}

export default function ChatWindow({ chatId, chatName, chatAvatar, onBack, onVibrate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Как дела?',
      sender: 'other',
      time: '14:20',
      status: 'read'
    },
    {
      id: 2,
      text: 'Отлично! А у тебя?',
      sender: 'me',
      time: '14:21',
      status: 'read'
    },
    {
      id: 3,
      text: 'Тоже хорошо! Играешь сегодня?',
      sender: 'other',
      time: '14:22',
      status: 'read'
    },
    {
      id: 4,
      text: 'Да, в 20:00 буду онлайн 🎮',
      sender: 'me',
      time: '14:23',
      status: 'delivered'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onVibrate();
      const now = new Date();
      const newMsg: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
        status: 'sent'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');

      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: messages.length + 2,
          text: 'Круто! До встречи! 👍',
          sender: 'other',
          time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
          status: 'read'
        };
        setMessages(prev => [...prev, response]);
      }, 2500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="hover-scale"
          onClick={() => {
            onVibrate();
            onBack();
          }}
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
            {chatAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground truncate">{chatName}</h2>
            <p className="text-xs text-muted-foreground">
              {isTyping ? 'печатает...' : 'онлайн'}
            </p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="hover-scale"
          onClick={onVibrate}
        >
          <Icon name="Phone" size={20} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover-scale"
          onClick={onVibrate}
        >
          <Icon name="Video" size={20} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover-scale"
          onClick={onVibrate}
        >
          <Icon name="MoreVertical" size={20} />
        </Button>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground ml-auto'
                      : 'bg-card text-foreground border border-border'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    <span>{message.time}</span>
                    {message.sender === 'me' && (
                      <Icon
                        name={message.status === 'read' ? 'CheckCheck' : 'Check'}
                        size={14}
                        className={message.status === 'read' ? 'text-game-blue' : ''}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-slide-up">
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="bg-card border-t border-border p-3">
        <div className="flex gap-2 items-center">
          <Button
            size="icon"
            variant="ghost"
            className="hover-scale"
            onClick={onVibrate}
          >
            <Icon name="Plus" size={24} />
          </Button>
          
          <div className="flex-1 bg-muted rounded-full flex items-center px-4 py-2 gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Сообщение..."
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button
              size="icon"
              variant="ghost"
              className="hover-scale h-8 w-8"
              onClick={onVibrate}
            >
              <Icon name="Smile" size={20} />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button
              size="icon"
              className="hover-scale bg-gradient-to-r from-primary to-secondary game-glow"
              onClick={handleSend}
            >
              <Icon name="Send" size={20} />
            </Button>
          ) : (
            <Button
              size="icon"
              className="hover-scale bg-gradient-to-r from-secondary to-accent"
              onClick={onVibrate}
            >
              <Icon name="Mic" size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
