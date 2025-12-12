# PHB Components

A comprehensive React component library for PHB Solution, styled with Tailwind CSS. This library provides a complete set of UI components including charts, data visualization, project management tools, and form elements.

## Installation

```bash
npm install phb_components
```

## Setup

### 1. Import Styles

Add the stylesheet to your app:

```tsx
import 'phb_components/styles.css';
```

### 2. Configure Tailwind (if using custom Tailwind setup)

The library uses CSS variables for theming. Ensure your Tailwind config includes the PHB color scheme or use the provided styles.

## Components

### Core Components

#### Button

```tsx
import { Button } from 'phb_components';

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'phb_components';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Input, Label, Textarea

```tsx
import { Input, Label, Textarea } from 'phb_components';

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>

<div>
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter message" />
</div>
```

#### Checkbox

```tsx
import { Checkbox } from 'phb_components';

const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked} />
```

#### Select

```tsx
import { Select } from 'phb_components';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select an option"
/>
```

#### Badge

```tsx
import { Badge } from 'phb_components';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Data Table

A powerful, feature-rich data table with sorting, filtering, pagination, selection, and export capabilities.

```tsx
import { DataTable, DataTableColumn } from 'phb_components';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const columns: DataTableColumn<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
  { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];

<DataTable
  data={users}
  columns={columns}
  selectable
  exportable
  pagination={{
    pageIndex: 0,
    pageSize: 10,
    totalRows: 100,
    totalPages: 10,
  }}
  onPaginationChange={handlePaginationChange}
  onSortingChange={handleSortingChange}
  searchValue={search}
  onSearchChange={setSearch}
/>
```

### Chart Components

All charts are SVG-based with no external dependencies.

#### LineChart

```tsx
import { LineChart } from 'phb_components';

// Simple data
<LineChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 200 },
    { label: 'Mar', value: 150 },
  ]}
  height={300}
  showDots
  showArea
  curved
/>

// Multi-series data
<LineChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    series: [
      { name: 'Sales', data: [100, 200, 150, 300], color: '#0D5697' },
      { name: 'Revenue', data: [80, 160, 120, 240], color: '#FFC100' },
    ],
  }}
  height={300}
  showGrid
/>
```

#### BarChart

```tsx
import { BarChart } from 'phb_components';

<BarChart
  data={[
    { label: 'Q1', value: 100 },
    { label: 'Q2', value: 200 },
    { label: 'Q3', value: 150 },
    { label: 'Q4', value: 300 },
  ]}
  height={300}
  showValues
  barRadius={4}
/>

// Horizontal stacked bar chart
<BarChart
  data={{
    labels: ['Product A', 'Product B', 'Product C'],
    series: [
      { name: '2023', data: [100, 200, 150] },
      { name: '2024', data: [120, 180, 200] },
    ],
  }}
  horizontal
  stacked
/>
```

#### PieChart & DoughnutChart

```tsx
import { PieChart, DoughnutChart } from 'phb_components';

<PieChart
  data={[
    { label: 'Desktop', value: 400, color: '#0D5697' },
    { label: 'Mobile', value: 300, color: '#FFC100' },
    { label: 'Tablet', value: 100, color: '#10b981' },
  ]}
  height={300}
  showLabels
  showLegend
/>

<DoughnutChart
  data={[
    { label: 'Completed', value: 75 },
    { label: 'Remaining', value: 25 },
  ]}
  innerRadius={0.6}
/>
```

#### AreaChart

```tsx
import { AreaChart } from 'phb_components';

<AreaChart
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      { name: 'Visitors', data: [100, 150, 120, 200, 180] },
      { name: 'Page Views', data: [300, 400, 350, 500, 450] },
    ],
  }}
  height={300}
  stacked
  gradient
  curved
/>
```

#### ScatterChart

```tsx
import { ScatterChart } from 'phb_components';

<ScatterChart
  data={[
    { x: 10, y: 20, label: 'Point A' },
    { x: 30, y: 40, label: 'Point B' },
    { x: 50, y: 30, label: 'Point C' },
  ]}
  height={300}
  xAxisLabel="X Axis"
  yAxisLabel="Y Axis"
/>

// Multi-series scatter
<ScatterChart
  data={[
    {
      name: 'Group A',
      data: [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ],
      color: '#0D5697',
    },
    {
      name: 'Group B',
      data: [
        { x: 15, y: 25 },
        { x: 35, y: 45 },
      ],
      color: '#FFC100',
    },
  ]}
/>
```

### Kanban Board

A drag-and-drop Kanban board for project management.

```tsx
import { KanbanBoard, KanbanColumnData, KanbanCardData } from 'phb_components';

const columns: KanbanColumnData[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-yellow-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

const cards: KanbanCardData[] = [
  {
    id: '1',
    title: 'Implement login',
    description: 'Add user authentication',
    columnId: 'todo',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe' },
    tags: [{ id: '1', label: 'Frontend', color: '#0D5697' }],
    dueDate: new Date('2024-12-20'),
  },
  // ... more cards
];

<KanbanBoard
  columns={columns}
  cards={cards}
  onCardMove={(cardId, sourceColumnId, targetColumnId) => {
    // Handle card movement
  }}
  onCardAdd={(columnId) => {
    // Handle adding new card
  }}
  onCardEdit={(card) => {
    // Handle card edit
  }}
  onCardDelete={(cardId) => {
    // Handle card delete
  }}
/>
```

**KanbanCard Features:**
- Drag and drop between columns
- Priority indicators (low, medium, high, urgent)
- Assignee avatars
- Tags/labels with custom colors
- Due date with overdue highlighting
- Collapsible columns

### Gantt Chart

A timeline-based project visualization component.

```tsx
import { GanttChart, GanttTaskData } from 'phb_components';

const tasks: GanttTaskData[] = [
  {
    id: '1',
    name: 'Project Planning',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-07'),
    progress: 100,
    color: '#0D5697',
    group: 'Phase 1',
  },
  {
    id: '2',
    name: 'Design',
    startDate: new Date('2024-12-08'),
    endDate: new Date('2024-12-14'),
    progress: 75,
    dependencies: ['1'],
    assignee: 'John Doe',
    group: 'Phase 1',
  },
  {
    id: '3',
    name: 'Development',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-28'),
    progress: 30,
    dependencies: ['2'],
    group: 'Phase 2',
  },
];

<GanttChart
  tasks={tasks}
  zoom="day" // 'day' | 'week' | 'month'
  showDependencies
  onTaskClick={(task) => {
    console.log('Clicked:', task);
  }}
/>
```

**GanttChart Features:**
- Timeline header with day/week/month views
- Task bars with progress indicators
- Dependency arrows between tasks
- Task grouping
- Today marker
- Hover tooltips with task details
- Weekend highlighting
- Click handlers for task selection

### Layout Components

#### AppLayout

A complete application layout with sidebar and navbar.

```tsx
import { AppLayout, SidebarItem } from 'phb_components';

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { id: 'profile', label: 'Profile' },
      { id: 'security', label: 'Security' },
    ],
  },
];

<AppLayout
  sidebarItems={sidebarItems}
  navbarTitle="My App"
  user={{ name: 'John Doe', email: 'john@example.com' }}
  notifications={5}
  onNotificationsClick={() => {}}
  showSearch
  onSearch={(query) => {}}
>
  <div>Page content here</div>
</AppLayout>
```

#### Sidebar

```tsx
import { Sidebar, SidebarItem } from 'phb_components';

<Sidebar
  items={sidebarItems}
  footerItems={footerItems}
  collapsed={isCollapsed}
  onCollapsedChange={setIsCollapsed}
  user={{ name: 'John Doe' }}
  logo={<Logo />}
  logoCollapsed={<LogoSmall />}
/>
```

#### Navbar

```tsx
import { Navbar } from 'phb_components';

<Navbar
  title="Dashboard"
  showSearch
  onSearchChange={handleSearch}
  user={{ name: 'John Doe', email: 'john@example.com' }}
  notifications={3}
  onNotificationsClick={handleNotifications}
  showThemeToggle
  theme={theme}
  onThemeChange={setTheme}
/>
```

### Chat Components

#### AICopilotChat

A modal chat interface for AI assistants.

```tsx
import { AICopilotChat, AICopilotMessage, FloatingChatButton } from 'phb_components';

const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<AICopilotMessage[]>([]);

<>
  <FloatingChatButton onClick={() => setOpen(true)} showPulse />

  <AICopilotChat
    open={open}
    onOpenChange={setOpen}
    messages={messages}
    onSendMessage={(message) => {
      // Handle sending message
    }}
    isTyping={isLoading}
    title="AI Assistant"
    subtitle="Ask me anything"
    suggestions={['Help me with...', 'How do I...']}
  />
</>
```

#### ChatInterface

A simpler inline chat component.

```tsx
import { ChatInterface } from 'phb_components';

<ChatInterface
  initialMessages={[
    { id: 1, sender: 'agent', text: 'Hello!', time: '09:00 AM' },
  ]}
  onSendMessage={(message) => {}}
  title="Support"
  subtitle="Online"
/>
```

## TypeScript Support

All components are fully typed. Import types as needed:

```tsx
import type {
  // Button
  ButtonVariant,
  ButtonSize,
  ButtonProps,

  // Data Table
  DataTableColumn,
  DataTableProps,
  SortingState,
  PaginationState,
  FilterState,

  // Charts
  ChartDataPoint,
  ChartSeries,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  AreaChartProps,
  ScatterChartProps,
  ScatterDataPoint,
  ScatterSeries,

  // Kanban
  KanbanBoardProps,
  KanbanColumnData,
  KanbanCardData,
  KanbanPriority,
  KanbanTag,
  KanbanAssignee,

  // Gantt
  GanttChartProps,
  GanttTaskData,

  // Layout
  AppLayoutProps,
  SidebarProps,
  SidebarItem,
  NavbarProps,

  // Chat
  AICopilotChatProps,
  AICopilotMessage,
  ChatInterfaceProps,
  ChatMessage,
} from 'phb_components';
```

## Theming

The library uses CSS variables for theming. Override these variables to customize colors:

```css
:root {
  --primary: 210 78% 32%;        /* PHB Blue #0D5697 */
  --secondary: 45 100% 50%;      /* PHB Yellow #FFC100 */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 210 78% 32%;
  --radius: 0.5rem;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

## License

MIT
