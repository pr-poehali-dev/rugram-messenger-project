import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
}

interface Community {
  id: number;
  name: string;
  avatar: string;
  members: number;
  color: string;
  icon: string;
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    avatar: '👩‍💼',
    lastMessage: 'Привет! Как дела?',
    time: '14:23',
    unread: 3,
    online: true,
    color: 'game-purple'
  },
  {
    id: 2,
    name: 'Игровая команда',
    avatar: '🎮',
    lastMessage: 'Собираемся в 20:00',
    time: '13:45',
    unread: 7,
    online: true,
    color: 'game-pink'
  },
  {
    id: 3,
    name: 'Дмитрий',
    avatar: '👨‍💻',
    lastMessage: 'Отправил файлы',
    time: '11:20',
    unread: 0,
    online: false,
    color: 'game-blue'
  },
  {
    id: 4,
    name: 'Мария',
    avatar: '👩‍🎨',
    lastMessage: 'Супер! Давай встретимся',
    time: 'Вчера',
    unread: 0,
    online: true,
    color: 'game-orange'
  }
];

const mockCommunities: Community[] = [
  {
    id: 1,
    name: 'Геймеры России',
    avatar: '🎮',
    members: 1248,
    color: 'game-purple',
    icon: 'Gamepad2'
  },
  {
    id: 2,
    name: 'Киберспорт',
    avatar: '🏆',
    members: 856,
    color: 'game-orange',
    icon: 'Trophy'
  },
  {
    id: 3,
    name: 'Стримеры',
    avatar: '📹',
    members: 2341,
    color: 'game-pink',
    icon: 'Video'
  },
  {
    id: 4,
    name: 'Разработка игр',
    avatar: '⚙️',
    members: 534,
    color: 'game-blue',
    icon: 'Code'
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'communities'>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const handleVibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTabClick = (tab: 'chats' | 'communities') => {
    handleVibrate();
    setActiveTab(tab);
  };

  const handleChatClick = (id: number) => {
    handleVibrate();
    setSelectedChat(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl">💬</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            РУграм
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="hover-scale"
            onClick={handleVibrate}
          >
            <Icon name="Search" size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover-scale"
            onClick={handleVibrate}
          >
            <Icon name="Settings" size={20} />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex bg-card border-b border-border">
          <button
            onClick={() => handleTabClick('chats')}
            className={`flex-1 py-4 font-semibold text-lg transition-all duration-300 relative hover-scale ${
              activeTab === 'chats'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Чаты
            {activeTab === 'chats' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary animate-slide-up" />
            )}
          </button>
          <button
            onClick={() => handleTabClick('communities')}
            className={`flex-1 py-4 font-semibold text-lg transition-all duration-300 relative hover-scale ${
              activeTab === 'communities'
                ? 'text-secondary'
                : 'text-muted-foreground'
            }`}
          >
            Сообщества
            {activeTab === 'communities' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent animate-slide-up" />
            )}
          </button>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' ? (
            <div className="p-4 space-y-2">
              {mockChats.map((chat, index) => (
                <Card
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-all duration-300 hover-scale border-l-4 animate-slide-up ${
                    selectedChat === chat.id
                      ? 'bg-muted border-l-primary game-glow'
                      : `border-l-${chat.color}`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-game-green rounded-full border-2 border-background animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground animate-bounce-subtle ml-2">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCommunities.map((community, index) => (
                <Card
                  key={community.id}
                  onClick={handleVibrate}
                  className={`p-6 hover:bg-muted/50 cursor-pointer transition-all duration-300 hover-scale border-t-4 border-t-${community.color} animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${community.color}/30 to-${community.color}/10 flex items-center justify-center text-4xl`}>
                      {community.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {community.name}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Users" size={16} />
                        <span className="text-sm">
                          {community.members.toLocaleString()} участников
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 hover-scale bg-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVibrate();
                      }}
                    >
                      <Icon name="Plus" size={16} className="mr-1" />
                      Вступить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover-scale"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVibrate();
                      }}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="bg-card border-t border-border p-2 flex gap-2 items-center">
        <Button
          size="icon"
          variant="ghost"
          className="hover-scale game-glow-purple"
          onClick={handleVibrate}
        >
          <Icon name="MessageSquarePlus" size={24} />
        </Button>
        <Input
          placeholder="Найти чат или сообщество..."
          className="flex-1 bg-muted border-0"
        />
        <Button
          size="icon"
          className="hover-scale bg-gradient-to-r from-primary to-secondary"
          onClick={handleVibrate}
        >
          <Icon name="Mic" size={24} />
        </Button>
        <Button
          size="icon"
          className="hover-scale bg-gradient-to-r from-secondary to-accent"
          onClick={handleVibrate}
        >
          <Icon name="Video" size={24} />
        </Button>
      </div>
    </div>
  );
}
