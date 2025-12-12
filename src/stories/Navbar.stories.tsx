import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Navbar } from '../index';
import { Settings, User, LogOut, CreditCard } from 'lucide-react';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
};

const userMenuItems = [
  { label: 'Profile', icon: <User size={16} />, onClick: () => alert('Profile') },
  { label: 'Billing', icon: <CreditCard size={16} />, onClick: () => alert('Billing') },
  { label: 'Settings', icon: <Settings size={16} />, onClick: () => alert('Settings') },
  { label: 'Log out', icon: <LogOut size={16} />, onClick: () => alert('Logging out...') },
];

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
      P
    </div>
  </div>
);

// Basic navbar
export const Default: Story = {
  render: () => (
    <Navbar title="PHB Application" logo={<Logo />} />
  ),
};

// With search
export const WithSearch: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    return (
      <Navbar
        title="PHB Application"
        logo={<Logo />}
        showSearch
        searchPlaceholder="Search anything..."
        searchValue={search}
        onSearchChange={setSearch}
      />
    );
  },
};

// With notifications
export const WithNotifications: Story = {
  render: () => (
    <Navbar
      title="PHB Application"
      logo={<Logo />}
      notifications={5}
      onNotificationsClick={() => alert('Opening notifications...')}
    />
  ),
};

// With user menu
export const WithUserMenu: Story = {
  render: () => (
    <Navbar
      title="PHB Application"
      logo={<Logo />}
      user={sampleUser}
      userMenuItems={userMenuItems}
    />
  ),
};

// With theme toggle
export const WithThemeToggle: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Navbar
          title="PHB Application"
          logo={<Logo />}
          showThemeToggle
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    );
  },
};

// Full featured
export const FullFeatured: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Navbar
          title="PHB Application"
          logo={<Logo />}
          showSearch
          searchPlaceholder="Search..."
          searchValue={search}
          onSearchChange={setSearch}
          notifications={12}
          onNotificationsClick={() => alert('Opening notifications...')}
          user={sampleUser}
          userMenuItems={userMenuItems}
          showThemeToggle
          theme={theme}
          onThemeChange={setTheme}
          onMenuClick={() => alert('Toggle sidebar')}
        />
      </div>
    );
  },
};

// Mobile view with menu button
export const MobileView: Story = {
  render: () => (
    <div className="max-w-md mx-auto border">
      <Navbar
        title="PHB App"
        showSearch={false}
        notifications={3}
        onNotificationsClick={() => alert('Notifications')}
        user={sampleUser}
        userMenuItems={userMenuItems}
        onMenuClick={() => alert('Toggle mobile sidebar')}
      />
    </div>
  ),
};

// Without title (logo only)
export const LogoOnly: Story = {
  render: () => (
    <Navbar
      logo={
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            P
          </div>
          <span className="font-semibold">PHB Solutions</span>
        </div>
      }
      user={sampleUser}
      userMenuItems={userMenuItems}
    />
  ),
};
