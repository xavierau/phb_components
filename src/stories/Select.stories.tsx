import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, Label } from '../index';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[200px]">
        <Select
          value={value}
          onChange={setValue}
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
          placeholder="Select an option"
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[200px] space-y-2">
        <Label>Role</Label>
        <Select
          value={value}
          onChange={setValue}
          options={[
            { label: 'Administrator', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ]}
          placeholder="Select a role"
        />
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [value, setValue] = useState('editor');
    return (
      <div className="w-[200px]">
        <Select
          value={value}
          onChange={setValue}
          options={[
            { label: 'Administrator', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ]}
          placeholder="Select a role"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    placeholder: 'Disabled select',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};
