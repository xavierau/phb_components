import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanColumnData,
  KanbanCardData,
  InjectStyles,
} from '../index';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
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

type Story = StoryObj<typeof KanbanBoard>;

const defaultColumns: KanbanColumnData[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-yellow-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

const defaultCards: KanbanCardData[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new marketing landing page',
    columnId: 'todo',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe' },
    tags: [
      { id: '1', label: 'Design', color: '#8b5cf6' },
      { id: '2', label: 'Marketing', color: '#10b981' },
    ],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login, signup, and password reset functionality',
    columnId: 'in-progress',
    priority: 'urgent',
    assignee: { id: '2', name: 'Jane Smith' },
    tags: [{ id: '3', label: 'Backend', color: '#0D5697' }],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    columnId: 'in-progress',
    priority: 'medium',
    assignee: { id: '3', name: 'Bob Wilson' },
    tags: [{ id: '4', label: 'Documentation', color: '#f59e0b' }],
  },
  {
    id: '4',
    title: 'Fix mobile responsive issues',
    description: 'Address layout problems on smaller screens',
    columnId: 'review',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe' },
    tags: [{ id: '5', label: 'Bug', color: '#ef4444' }],
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday (overdue)
  },
  {
    id: '5',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    columnId: 'done',
    priority: 'low',
    assignee: { id: '2', name: 'Jane Smith' },
    tags: [{ id: '6', label: 'DevOps', color: '#06b6d4' }],
  },
  {
    id: '6',
    title: 'Database optimization',
    description: 'Improve query performance and add indexes',
    columnId: 'todo',
    priority: 'medium',
    tags: [{ id: '3', label: 'Backend', color: '#0D5697' }],
  },
];

// Interactive story with state management
const InteractiveKanban = () => {
  const [cards, setCards] = useState<KanbanCardData[]>(defaultCards);

  const handleCardMove = (cardId: string, _sourceColumnId: string, targetColumnId: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, columnId: targetColumnId } : card))
    );
  };

  const handleCardAdd = (columnId: string) => {
    const newCard: KanbanCardData = {
      id: `new-${Date.now()}`,
      title: 'New Task',
      description: 'Click to edit this task',
      columnId,
      priority: 'low',
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleCardDelete = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  return (
    <KanbanBoard
      columns={defaultColumns}
      cards={cards}
      onCardMove={handleCardMove}
      onCardAdd={handleCardAdd}
      onCardDelete={handleCardDelete}
      onCardEdit={(card) => console.log('Edit card:', card)}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveKanban />,
};

export const EmptyBoard: Story = {
  render: () => (
    <KanbanBoard
      columns={defaultColumns}
      cards={[]}
      onCardAdd={(columnId) => console.log('Add card to:', columnId)}
    />
  ),
};

export const SingleColumn: Story = {
  render: () => (
    <KanbanColumn
      column={{ id: 'backlog', title: 'Backlog', color: 'bg-purple-500' }}
      cards={defaultCards.slice(0, 3).map((c) => ({ ...c, columnId: 'backlog' }))}
      onAddCard={() => console.log('Add card')}
      onCardEdit={(card) => console.log('Edit:', card)}
      onCardDelete={(id) => console.log('Delete:', id)}
    />
  ),
};

export const SingleCard: Story = {
  render: () => (
    <div className="max-w-sm">
      <KanbanCard
        card={{
          id: '1',
          title: 'Example Task',
          description: 'This is a sample task card with all features displayed',
          columnId: 'todo',
          priority: 'high',
          assignee: { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
          tags: [
            { id: '1', label: 'Feature', color: '#0D5697' },
            { id: '2', label: 'Frontend', color: '#FFC100' },
          ],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        }}
        onEdit={(card) => console.log('Edit:', card)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  ),
};

export const CardPriorities: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <KanbanCard
        card={{
          id: '1',
          title: 'Low Priority Task',
          columnId: 'todo',
          priority: 'low',
        }}
      />
      <KanbanCard
        card={{
          id: '2',
          title: 'Medium Priority Task',
          columnId: 'todo',
          priority: 'medium',
        }}
      />
      <KanbanCard
        card={{
          id: '3',
          title: 'High Priority Task',
          columnId: 'todo',
          priority: 'high',
        }}
      />
      <KanbanCard
        card={{
          id: '4',
          title: 'Urgent Priority Task',
          columnId: 'todo',
          priority: 'urgent',
        }}
      />
    </div>
  ),
};
