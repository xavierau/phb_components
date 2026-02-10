import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, Label, type SelectOption } from '../index';

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

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[280px]">
        <Label>Country</Label>
        <Select
          value={value}
          onChange={setValue}
          searchable
          searchPlaceholder="Search countries..."
          options={[
            { label: 'Australia', value: 'au' },
            { label: 'Brazil', value: 'br' },
            { label: 'Canada', value: 'ca' },
            { label: 'France', value: 'fr' },
            { label: 'Germany', value: 'de' },
            { label: 'Japan', value: 'jp' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'United States', value: 'us' },
          ]}
          placeholder="Select a country"
        />
      </div>
    );
  },
};

export const RemoteSearch: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const allUsers: SelectOption[] = [
      { label: 'Alice Johnson', value: 'alice' },
      { label: 'Bob Smith', value: 'bob' },
      { label: 'Charlie Brown', value: 'charlie' },
      { label: 'Diana Prince', value: 'diana' },
      { label: 'Edward Norton', value: 'edward' },
      { label: 'Fiona Apple', value: 'fiona' },
      { label: 'George Lucas', value: 'george' },
      { label: 'Hannah Montana', value: 'hannah' },
    ];

    const handleSearch = async (query: string): Promise<SelectOption[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return allUsers.filter((u) =>
        u.label.toLowerCase().includes(query.toLowerCase())
      );
    };

    return (
      <div className="w-[280px]">
        <Label>User</Label>
        <Select
          value={value}
          onChange={setValue}
          onSearch={handleSearch}
          searchPlaceholder="Search users..."
          placeholder="Select a user"
        />
      </div>
    );
  },
};

export const RemoteSearchWithInitialOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const popularCities: SelectOption[] = [
      { label: 'New York', value: 'nyc' },
      { label: 'London', value: 'ldn' },
      { label: 'Tokyo', value: 'tky' },
    ];

    const allCities: SelectOption[] = [
      { label: 'New York', value: 'nyc' },
      { label: 'London', value: 'ldn' },
      { label: 'Tokyo', value: 'tky' },
      { label: 'Paris', value: 'par' },
      { label: 'Berlin', value: 'ber' },
      { label: 'Sydney', value: 'syd' },
      { label: 'Toronto', value: 'tor' },
      { label: 'São Paulo', value: 'sao' },
      { label: 'Mumbai', value: 'mum' },
      { label: 'Shanghai', value: 'sha' },
    ];

    const handleSearch = async (query: string): Promise<SelectOption[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return allCities.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      );
    };

    return (
      <div className="w-[280px]">
        <Label>City</Label>
        <Select
          value={value}
          onChange={setValue}
          options={popularCities}
          onSearch={handleSearch}
          searchPlaceholder="Search cities..."
          placeholder="Select a city"
        />
      </div>
    );
  },
};

export const RemoteSearchNoResults: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const handleSearch = async (_query: string): Promise<SelectOption[]> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [];
    };

    return (
      <div className="w-[280px]">
        <Label>Product</Label>
        <Select
          value={value}
          onChange={setValue}
          onSearch={handleSearch}
          searchPlaceholder="Search products..."
          noResultsMessage="No products found"
          placeholder="Select a product"
        />
      </div>
    );
  },
};
