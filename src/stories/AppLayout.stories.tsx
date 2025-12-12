import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout, SidebarItem, Card, CardHeader, CardTitle, CardContent, Button } from '../index';
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  HelpCircle,
} from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample navigation items
const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Dashboard', icon: <Home size={20} />, active: true },
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

// Logo components
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
      P
    </div>
    <span className="font-semibold text-lg">PHB App</span>
  </div>
);

const LogoSmall = () => (
  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
    P
  </div>
);

// Sample content component
const DashboardContent = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, John! Here's what's happening.</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
        { title: 'Subscriptions', value: '+2350', change: '+180.1%' },
        { title: 'Sales', value: '+12,234', change: '+19%' },
        { title: 'Active Now', value: '+573', change: '+201' },
      ].map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Activity item {i}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start">Create New Project</Button>
          <Button variant="outline" className="w-full justify-start">
            Invite Team Member
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Generate Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            View Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Default layout
export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayout
        sidebarItems={sidebarItems}
        sidebarFooterItems={footerItems}
        sidebarLogo={<Logo />}
        sidebarLogoCollapsed={<LogoSmall />}
        navbarTitle="Dashboard"
        showSearch
        user={sampleUser}
      >
        <DashboardContent />
      </AppLayout>
    </div>
  ),
};

// Collapsed sidebar by default
export const CollapsedSidebar: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayout
        sidebarItems={sidebarItems}
        sidebarFooterItems={footerItems}
        sidebarLogo={<Logo />}
        sidebarLogoCollapsed={<LogoSmall />}
        navbarTitle="Dashboard"
        showSearch
        user={sampleUser}
        defaultCollapsed
      >
        <DashboardContent />
      </AppLayout>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayout
        sidebarItems={sidebarItems}
        sidebarFooterItems={footerItems}
        sidebarLogo={<Logo />}
        sidebarLogoCollapsed={<LogoSmall />}
        navbarTitle="Dashboard"
        showSearch
        user={sampleUser}
        defaultTheme="dark"
      >
        <DashboardContent />
      </AppLayout>
    </div>
  ),
};

// Minimal layout (no search, no footer items)
export const Minimal: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayout
        sidebarItems={sidebarItems.slice(0, 4)}
        sidebarLogo={<Logo />}
        sidebarLogoCollapsed={<LogoSmall />}
        navbarTitle="PHB App"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Simple Content</h1>
          <p className="text-muted-foreground">
            This is a minimal layout without search, user profile, or footer navigation items.
          </p>
        </div>
      </AppLayout>
    </div>
  ),
};

// Long content (scrollable)
export const ScrollableContent: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayout
        sidebarItems={sidebarItems}
        sidebarFooterItems={footerItems}
        sidebarLogo={<Logo />}
        sidebarLogoCollapsed={<LogoSmall />}
        navbarTitle="Long Content"
        showSearch
        user={sampleUser}
      >
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Scrollable Content Demo</h1>
          {Array.from({ length: 20 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Section {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is content section {i + 1}. The main content area scrolls independently
                  while the sidebar and navbar remain fixed in place.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppLayout>
    </div>
  ),
};
