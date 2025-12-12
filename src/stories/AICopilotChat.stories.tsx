import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  AICopilotChat,
  FloatingChatButton,
  AICopilotMessage,
  AppLayout,
  SidebarItem,
} from '../index';
import { Home, Users, FileText, Settings, BarChart3 } from 'lucide-react';

const meta: Meta<typeof AICopilotChat> = {
  title: 'AI/AICopilotChat',
  component: AICopilotChat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample messages
const sampleMessages: AICopilotMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! I'm your AI assistant. How can I help you today? I can help with:\n\n- Answering questions about your data\n- Generating reports\n- Analyzing trends\n- And much more!",
    timestamp: new Date(Date.now() - 60000 * 5),
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you show me the sales report for last month?',
    timestamp: new Date(Date.now() - 60000 * 4),
  },
  {
    id: '3',
    role: 'assistant',
    content:
      "I'd be happy to help you with the sales report! Here's a summary for last month:\n\n**Total Sales:** $125,430\n**Growth:** +15.2% from previous month\n**Top Product:** Premium Plan (42% of sales)\n\nWould you like me to break this down by region or product category?",
    timestamp: new Date(Date.now() - 60000 * 3),
  },
  {
    id: '4',
    role: 'user',
    content: 'Yes, please break it down by region.',
    timestamp: new Date(Date.now() - 60000 * 2),
  },
  {
    id: '5',
    role: 'assistant',
    content:
      "Here's the regional breakdown:\n\n| Region | Sales | Growth |\n|--------|-------|--------|\n| North America | $52,180 | +18% |\n| Europe | $38,920 | +12% |\n| Asia Pacific | $24,330 | +22% |\n| Other | $10,000 | +8% |\n\nAsia Pacific shows the strongest growth momentum!",
    timestamp: new Date(Date.now() - 60000),
  },
];

const suggestions = [
  'Show me this week\'s analytics',
  'Generate a performance report',
  'What are the top trends?',
  'Help me create a dashboard',
];

// Basic chat dialog
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState<AICopilotMessage[]>(sampleMessages);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = (content: string) => {
      const userMessage: AICopilotMessage = {
        id: String(Date.now()),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: AICopilotMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `I received your message: "${content}"\n\nThis is a simulated response. In a real application, this would be connected to an AI backend.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    };

    return (
      <div className="h-screen bg-muted/30">
        <AICopilotChat
          open={open}
          onOpenChange={setOpen}
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          suggestions={suggestions}
          onSuggestionClick={handleSendMessage}
        />
        {!open && (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Open Chat
            </button>
          </div>
        )}
      </div>
    );
  },
};

// Empty state (new conversation)
export const EmptyState: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState<AICopilotMessage[]>([]);

    const handleSendMessage = (content: string) => {
      const userMessage: AICopilotMessage = {
        id: String(Date.now()),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    };

    return (
      <div className="h-screen bg-muted/30">
        <AICopilotChat
          open={open}
          onOpenChange={setOpen}
          messages={messages}
          onSendMessage={handleSendMessage}
          suggestions={suggestions}
          onSuggestionClick={handleSendMessage}
          title="AI Assistant"
          subtitle="Start a conversation to get help"
          placeholder="Ask me anything..."
        />
      </div>
    );
  },
};

// With typing indicator
export const TypingIndicator: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div className="h-screen bg-muted/30">
        <AICopilotChat
          open={open}
          onOpenChange={setOpen}
          messages={sampleMessages.slice(0, 2)}
          onSendMessage={() => {}}
          isTyping={true}
        />
      </div>
    );
  },
};

// Floating button demo
export const FloatingButton: Story = {
  render: () => {
    return (
      <div className="h-screen bg-muted/30 relative">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">Floating Chat Button Demo</h2>
          <p className="text-muted-foreground mb-8">
            The floating button appears in the bottom-right corner with a badge showing unread
            messages.
          </p>
        </div>
        <FloatingChatButton onClick={() => alert('Open chat!')} unreadCount={3} showPulse />
      </div>
    );
  },
};

// Floating button positions
export const FloatingButtonPositions: Story = {
  render: () => {
    return (
      <div className="h-screen bg-muted/30 relative">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">Button Position Options</h2>
          <p className="text-muted-foreground">
            The button can be positioned in bottom-right (default) or bottom-left.
          </p>
        </div>
        <FloatingChatButton
          onClick={() => alert('Bottom left!')}
          position="bottom-left"
          unreadCount={5}
        />
        <FloatingChatButton onClick={() => alert('Bottom right!')} position="bottom-right" />
      </div>
    );
  },
};

// Full integration with AppLayout
export const FullIntegration: Story = {
  render: () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<AICopilotMessage[]>([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);

    const handleSendMessage = (content: string) => {
      const userMessage: AICopilotMessage = {
        id: String(Date.now()),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiMessage: AICopilotMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Thanks for your message! Here's my response to: "${content}"`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    };

    const handleOpenChat = () => {
      setChatOpen(true);
      setUnreadCount(0);
    };

    const sidebarItems: SidebarItem[] = [
      { id: 'home', label: 'Dashboard', icon: <Home size={20} />, active: true },
      { id: 'users', label: 'Users', icon: <Users size={20} /> },
      { id: 'docs', label: 'Documents', icon: <FileText size={20} /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const Logo = () => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          P
        </div>
        <span className="font-semibold">PHB App</span>
      </div>
    );

    const LogoSmall = () => (
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
        P
      </div>
    );

    return (
      <div className="h-screen">
        <AppLayout
          sidebarItems={sidebarItems}
          sidebarLogo={<Logo />}
          sidebarLogoCollapsed={<LogoSmall />}
          navbarTitle="Dashboard"
          showSearch
          user={{
            name: 'John Doe',
            email: 'john@example.com',
          }}
        >
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
            <p className="text-muted-foreground">
              Click the floating chat button in the bottom right corner to open the AI assistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">Card {i}</h3>
                  <p className="text-sm text-muted-foreground">
                    Sample content for demonstration purposes.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AppLayout>

        {/* Floating Chat Button */}
        <FloatingChatButton
          onClick={handleOpenChat}
          unreadCount={unreadCount}
          showPulse={unreadCount > 0}
        />

        {/* AI Chat Modal */}
        <AICopilotChat
          open={chatOpen}
          onOpenChange={setChatOpen}
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          suggestions={suggestions}
          onSuggestionClick={handleSendMessage}
        />
      </div>
    );
  },
};

// Custom styling
export const CustomStyling: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div className="h-screen bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        <AICopilotChat
          open={open}
          onOpenChange={setOpen}
          messages={sampleMessages}
          onSendMessage={() => {}}
          title="Custom AI Chat"
          subtitle="With custom styling"
          className="max-w-lg"
        />
      </div>
    );
  },
};
