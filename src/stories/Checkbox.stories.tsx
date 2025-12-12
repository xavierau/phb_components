import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, Label } from '../index';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const Group: Story = {
  render: () => {
    const [items, setItems] = useState({
      item1: false,
      item2: true,
      item3: false,
    });

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={items.item1}
            onCheckedChange={(checked) => setItems({ ...items, item1: checked })}
          />
          <Label>Item 1</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={items.item2}
            onCheckedChange={(checked) => setItems({ ...items, item2: checked })}
          />
          <Label>Item 2</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={items.item3}
            onCheckedChange={(checked) => setItems({ ...items, item3: checked })}
          />
          <Label>Item 3</Label>
        </div>
      </div>
    );
  },
};
