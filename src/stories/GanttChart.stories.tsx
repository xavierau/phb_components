import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { GanttChart, GanttTaskData, InjectStyles, Card, CardHeader, CardTitle, CardContent } from '../index';

const meta: Meta<typeof GanttChart> = {
  title: 'Components/GanttChart',
  component: GanttChart,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <InjectStyles />
        <div className="p-4 min-h-screen bg-background">
          <Story />
        </div>
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GanttChart>;

// Helper to create dates relative to today
const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date;
};

const projectTasks: GanttTaskData[] = [
  {
    id: '1',
    name: 'Project Planning',
    startDate: addDays(-5),
    endDate: addDays(0),
    progress: 100,
    color: '#0D5697',
    group: 'Phase 1: Planning',
    assignee: 'John Doe',
  },
  {
    id: '2',
    name: 'Requirements Gathering',
    startDate: addDays(-3),
    endDate: addDays(2),
    progress: 80,
    color: '#0D5697',
    dependencies: ['1'],
    group: 'Phase 1: Planning',
    assignee: 'Jane Smith',
  },
  {
    id: '3',
    name: 'UI/UX Design',
    startDate: addDays(1),
    endDate: addDays(10),
    progress: 40,
    color: '#FFC100',
    dependencies: ['2'],
    group: 'Phase 2: Design',
    assignee: 'Bob Wilson',
  },
  {
    id: '4',
    name: 'Database Schema Design',
    startDate: addDays(3),
    endDate: addDays(8),
    progress: 20,
    color: '#FFC100',
    dependencies: ['2'],
    group: 'Phase 2: Design',
    assignee: 'Alice Brown',
  },
  {
    id: '5',
    name: 'Frontend Development',
    startDate: addDays(11),
    endDate: addDays(25),
    progress: 0,
    color: '#10b981',
    dependencies: ['3'],
    group: 'Phase 3: Development',
    assignee: 'John Doe',
  },
  {
    id: '6',
    name: 'Backend Development',
    startDate: addDays(9),
    endDate: addDays(28),
    progress: 0,
    color: '#10b981',
    dependencies: ['4'],
    group: 'Phase 3: Development',
    assignee: 'Jane Smith',
  },
  {
    id: '7',
    name: 'Integration Testing',
    startDate: addDays(26),
    endDate: addDays(32),
    progress: 0,
    color: '#8b5cf6',
    dependencies: ['5', '6'],
    group: 'Phase 4: Testing',
    assignee: 'Bob Wilson',
  },
  {
    id: '8',
    name: 'User Acceptance Testing',
    startDate: addDays(33),
    endDate: addDays(38),
    progress: 0,
    color: '#8b5cf6',
    dependencies: ['7'],
    group: 'Phase 4: Testing',
    assignee: 'Alice Brown',
  },
  {
    id: '9',
    name: 'Deployment',
    startDate: addDays(39),
    endDate: addDays(42),
    progress: 0,
    color: '#ef4444',
    dependencies: ['8'],
    group: 'Phase 5: Launch',
    assignee: 'John Doe',
  },
];

const simpleTasks: GanttTaskData[] = [
  {
    id: '1',
    name: 'Task A',
    startDate: addDays(0),
    endDate: addDays(5),
    progress: 100,
    color: '#0D5697',
  },
  {
    id: '2',
    name: 'Task B',
    startDate: addDays(3),
    endDate: addDays(10),
    progress: 60,
    color: '#FFC100',
  },
  {
    id: '3',
    name: 'Task C',
    startDate: addDays(8),
    endDate: addDays(15),
    progress: 25,
    color: '#10b981',
  },
  {
    id: '4',
    name: 'Task D',
    startDate: addDays(12),
    endDate: addDays(20),
    progress: 0,
    color: '#8b5cf6',
  },
];

// Interactive story with zoom control
const InteractiveGantt = () => {
  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('day');
  const [selectedTask, setSelectedTask] = useState<GanttTaskData | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Zoom:</span>
        <div className="flex rounded-md border overflow-hidden">
          {(['day', 'week', 'month'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setZoom(level)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                zoom === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        {selectedTask && (
          <div className="ml-auto text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedTask.name}</span>
          </div>
        )}
      </div>
      <GanttChart
        tasks={projectTasks}
        zoom={zoom}
        showDependencies
        onTaskClick={(task) => setSelectedTask(task)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveGantt />,
};

export const Simple: Story = {
  render: () => (
    <GanttChart tasks={simpleTasks} zoom="day" showDependencies={false} />
  ),
};

export const WithDependencies: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline with Dependencies</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <GanttChart tasks={projectTasks} zoom="day" showDependencies />
      </CardContent>
    </Card>
  ),
};

export const WeekView: Story = {
  render: () => (
    <GanttChart tasks={projectTasks} zoom="week" showDependencies />
  ),
};

export const MonthView: Story = {
  render: () => (
    <GanttChart tasks={projectTasks} zoom="month" showDependencies />
  ),
};

export const NoDependencies: Story = {
  render: () => (
    <GanttChart tasks={projectTasks} zoom="day" showDependencies={false} />
  ),
};

export const EmptyChart: Story = {
  render: () => <GanttChart tasks={[]} zoom="day" />,
};

export const SingleTask: Story = {
  render: () => (
    <GanttChart
      tasks={[
        {
          id: '1',
          name: 'Single Important Task',
          startDate: addDays(-2),
          endDate: addDays(5),
          progress: 50,
          color: '#0D5697',
          assignee: 'John Doe',
        },
      ]}
      zoom="day"
    />
  ),
};
