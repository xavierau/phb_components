import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar, SidebarItem } from '../index';
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  HelpCircle,
  CreditCard,
  Bell,
} from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample navigation items
const sampleItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, active: true },
  { id: 'users', label: 'Users', icon: <Users size={20} />, badge: 5 },
  { id: 'documents', label: 'Documents', icon: <FileText size={20} /> },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'reports', label: 'Reports', badge: 'New' },
      { id: 'realtime', label: 'Realtime' },
    ],
    defaultOpen: true,
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <Mail size={20} />,
    children: [
      { id: 'inbox', label: 'Inbox', badge: 12 },
      { id: 'sent', label: 'Sent' },
      { id: 'drafts', label: 'Drafts' },
    ],
  },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
];

const footerItems: SidebarItem[] = [
  { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const sampleUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
};

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
      P
    </div>
    <span className="font-semibold text-lg">PHB App</span>
  </div>
);

const LogoCollapsed = () => (
  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
    P
  </div>
);

// Basic sidebar
export const Default: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="h-screen">
        <Sidebar
          items={sampleItems}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          logo={<Logo />}
          logoCollapsed={<LogoCollapsed />}
        />
      </div>
    );
  },
};

// With user profile
export const WithUserProfile: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="h-screen">
        <Sidebar
          items={sampleItems}
          footerItems={footerItems}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          logo={<Logo />}
          logoCollapsed={<LogoCollapsed />}
          user={sampleUser}
          onUserClick={() => alert('User clicked!')}
        />
      </div>
    );
  },
};

// Collapsed state
export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div className="h-screen">
        <Sidebar
          items={sampleItems}
          footerItems={footerItems}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          logo={<Logo />}
          logoCollapsed={<LogoCollapsed />}
          user={sampleUser}
        />
      </div>
    );
  },
};

// With many items (scrollable)
export const Scrollable: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const manyItems: SidebarItem[] = [
      ...sampleItems,
      { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, badge: 99 },
      {
        id: 'projects',
        label: 'Projects',
        icon: <FileText size={20} />,
        children: [
          { id: 'project1', label: 'Project Alpha' },
          { id: 'project2', label: 'Project Beta' },
          { id: 'project3', label: 'Project Gamma' },
          { id: 'project4', label: 'Project Delta' },
        ],
      },
      {
        id: 'teams',
        label: 'Teams',
        icon: <Users size={20} />,
        children: [
          { id: 'team1', label: 'Engineering' },
          { id: 'team2', label: 'Design' },
          { id: 'team3', label: 'Marketing' },
        ],
      },
    ];

    return (
      <div className="h-screen">
        <Sidebar
          items={manyItems}
          footerItems={footerItems}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          logo={<Logo />}
          logoCollapsed={<LogoCollapsed />}
          user={sampleUser}
        />
      </div>
    );
  },
};

// Interactive with click handlers
export const Interactive: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeId, setActiveId] = useState('home');

    const interactiveItems: SidebarItem[] = sampleItems.map((item) => ({
      ...item,
      active: item.id === activeId,
      onClick: () => {
        setActiveId(item.id);
        alert(`Navigating to ${item.label}`);
      },
      children: item.children?.map((child) => ({
        ...child,
        active: child.id === activeId,
        onClick: () => {
          setActiveId(child.id);
          alert(`Navigating to ${child.label}`);
        },
      })),
    }));

    return (
      <div className="h-screen">
        <Sidebar
          items={interactiveItems}
          footerItems={footerItems.map((item) => ({
            ...item,
            onClick: () => alert(`Clicked ${item.label}`),
          }))}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          logo={<Logo />}
          logoCollapsed={<LogoCollapsed />}
          user={sampleUser}
          onUserClick={() => alert('Opening user profile...')}
        />
      </div>
    );
  },
};
