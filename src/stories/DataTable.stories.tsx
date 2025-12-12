import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect, useCallback } from 'react';
import {
  DataTable,
  DataTableColumn,
  SortingState,
  PaginationState,
  RowSelectionState,
  FilterState,
  ExportOptions,
  Badge,
  Button,
} from '../index';

// Sample data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
  joined: string;
  amount: number;
}

// Generate sample data
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'Editor', 'Viewer', 'Manager'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'Support', 'HR'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length]!,
    status: statuses[i % statuses.length]!,
    department: departments[i % departments.length]!,
    joined: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0]!,
    amount: Math.floor(Math.random() * 10000) + 1000,
  }));
};

const sampleData = generateUsers(50);

// Basic columns
const basicColumns: DataTableColumn<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
  { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },
  { id: 'role', header: 'Role', accessorKey: 'role', sortable: true },
  { id: 'department', header: 'Department', accessorKey: 'department', sortable: true },
];

// Columns with custom cell rendering
const columnsWithCustomCells: DataTableColumn<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, minWidth: 150 },
  { id: 'email', header: 'Email', accessorKey: 'email', sortable: true, minWidth: 200 },
  {
    id: 'status',
    header: 'Status',
    sortable: true,
    cell: (row) => {
      const variants: Record<User['status'], 'default' | 'secondary' | 'destructive'> = {
        active: 'default',
        pending: 'secondary',
        inactive: 'destructive',
      };
      return <Badge variant={variants[row.status]}>{row.status}</Badge>;
    },
  },
  { id: 'role', header: 'Role', accessorKey: 'role', sortable: true },
  {
    id: 'amount',
    header: 'Amount',
    align: 'right',
    sortable: true,
    cell: (row) => `$${row.amount.toLocaleString()}`,
  },
  {
    id: 'actions',
    header: 'Actions',
    align: 'center',
    cell: (row) => (
      <div className="flex gap-2 justify-center">
        <Button variant="ghost" size="sm" onClick={() => alert(`Edit ${row.name}`)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => alert(`Delete ${row.name}`)}>
          Delete
        </Button>
      </div>
    ),
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic table
export const Default: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={basicColumns} />
  ),
};

// With sorting
export const WithSorting: Story = {
  render: () => {
    const [sorting, setSorting] = useState<SortingState | null>(null);
    const [data, setData] = useState(sampleData.slice(0, 10));

    useEffect(() => {
      if (!sorting) {
        setData(sampleData.slice(0, 10));
        return;
      }

      const sorted = [...sampleData.slice(0, 10)].sort((a, b) => {
        const aVal = a[sorting.column as keyof User];
        const bVal = b[sorting.column as keyof User];
        const modifier = sorting.direction === 'asc' ? 1 : -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * modifier;
        }
        return ((aVal as number) - (bVal as number)) * modifier;
      });

      setData(sorted);
    }, [sorting]);

    return (
      <DataTable
        data={data}
        columns={basicColumns}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    );
  },
};

// With pagination
export const WithPagination: Story = {
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
      totalRows: sampleData.length,
      totalPages: Math.ceil(sampleData.length / 10),
    });

    const paginatedData = sampleData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

    const handlePaginationChange = ({
      pageIndex,
      pageSize,
    }: {
      pageIndex: number;
      pageSize: number;
    }) => {
      setPagination({
        pageIndex,
        pageSize,
        totalRows: sampleData.length,
        totalPages: Math.ceil(sampleData.length / pageSize),
      });
    };

    return (
      <DataTable
        data={paginatedData}
        columns={basicColumns}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
    );
  },
};

// With selection
export const WithSelection: Story = {
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    return (
      <DataTable
        data={sampleData.slice(0, 10)}
        columns={basicColumns}
        selectable
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    );
  },
};

// With search
export const WithSearch: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const filteredData = sampleData.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <DataTable
        data={filteredData.slice(0, 10)}
        columns={basicColumns}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
      />
    );
  },
};

// Custom cell rendering
export const CustomCells: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={columnsWithCustomCells} />
  ),
};

// Full featured
export const FullFeatured: Story = {
  render: () => {
    const [sorting, setSorting] = useState<SortingState | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
      totalRows: sampleData.length,
      totalPages: Math.ceil(sampleData.length / 10),
    });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [search, setSearch] = useState('');

    // Filter data
    const filteredData = sampleData.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    // Sort data
    const sortedData = sorting
      ? [...filteredData].sort((a, b) => {
          const aVal = a[sorting.column as keyof User];
          const bVal = b[sorting.column as keyof User];
          const modifier = sorting.direction === 'asc' ? 1 : -1;

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * modifier;
          }
          return ((aVal as number) - (bVal as number)) * modifier;
        })
      : filteredData;

    // Paginate data
    const paginatedData = sortedData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

    const handlePaginationChange = ({
      pageIndex,
      pageSize,
    }: {
      pageIndex: number;
      pageSize: number;
    }) => {
      setPagination({
        pageIndex,
        pageSize,
        totalRows: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
      });
    };

    // Update pagination when search changes
    useEffect(() => {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        totalRows: filteredData.length,
        totalPages: Math.ceil(filteredData.length / prev.pageSize),
      }));
    }, [search, filteredData.length]);

    return (
      <DataTable
        data={paginatedData}
        columns={columnsWithCustomCells}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        selectable
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
      />
    );
  },
};

// Loading state
export const Loading: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={basicColumns} loading />
  ),
};

// Empty state
export const Empty: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={basicColumns}
      emptyMessage="No users found. Try adjusting your search."
    />
  ),
};

// Striped variant
export const Striped: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={basicColumns} striped />
  ),
};

// Bordered variant
export const Bordered: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={basicColumns} bordered />
  ),
};

// Compact variant
export const Compact: Story = {
  render: () => (
    <DataTable data={sampleData.slice(0, 10)} columns={basicColumns} compact />
  ),
};

// Server-side simulation
export const ServerSide: Story = {
  render: () => {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
      totalRows: 0,
      totalPages: 0,
    });
    const [search, setSearch] = useState('');

    // Simulated API fetch
    const fetchData = useCallback(async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter
      let result = sampleData.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );

      // Sort
      if (sorting) {
        result = [...result].sort((a, b) => {
          const aVal = a[sorting.column as keyof User];
          const bVal = b[sorting.column as keyof User];
          const modifier = sorting.direction === 'asc' ? 1 : -1;

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * modifier;
          }
          return ((aVal as number) - (bVal as number)) * modifier;
        });
      }

      const totalRows = result.length;
      const totalPages = Math.ceil(totalRows / pagination.pageSize);

      // Paginate
      const paginatedResult = result.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      );

      setData(paginatedResult);
      setPagination((prev) => ({ ...prev, totalRows, totalPages }));
      setLoading(false);
    }, [sorting, pagination.pageIndex, pagination.pageSize, search]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const handlePaginationChange = ({
      pageIndex,
      pageSize,
    }: {
      pageIndex: number;
      pageSize: number;
    }) => {
      setPagination((prev) => ({ ...prev, pageIndex, pageSize }));
    };

    const handleSearchChange = (value: string) => {
      setSearch(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This example simulates server-side data fetching with a 500ms delay.
        </p>
        <DataTable
          data={data}
          columns={columnsWithCustomCells}
          loading={loading}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users (server-side)..."
        />
      </div>
    );
  },
};

// Row click handler
export const ClickableRows: Story = {
  render: () => {
    return (
      <DataTable
        data={sampleData.slice(0, 10)}
        columns={basicColumns}
        onRowClick={(row) => alert(`Clicked on ${row.name}`)}
      />
    );
  },
};

// Columns with filter options
const columnsWithFilters: DataTableColumn<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
    filterType: 'text',
    filterPlaceholder: 'Filter name...',
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
    filterable: true,
    filterType: 'text',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
    cell: (row) => {
      const variants: Record<User['status'], 'default' | 'secondary' | 'destructive'> = {
        active: 'default',
        pending: 'secondary',
        inactive: 'destructive',
      };
      return <Badge variant={variants[row.status]}>{row.status}</Badge>;
    },
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'Admin' },
      { label: 'Editor', value: 'Editor' },
      { label: 'Viewer', value: 'Viewer' },
      { label: 'Manager', value: 'Manager' },
    ],
  },
  {
    id: 'department',
    header: 'Department',
    accessorKey: 'department',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Support', value: 'Support' },
      { label: 'HR', value: 'HR' },
    ],
  },
];

// With column filters
export const WithFilters: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterState>({});

    // Apply filters to data
    const filteredData = sampleData.filter((user) => {
      for (const filter of Object.values(filters)) {
        const value = user[filter.columnId as keyof User];
        if (filter.type === 'text') {
          if (!String(value).toLowerCase().includes(String(filter.value).toLowerCase())) {
            return false;
          }
        } else if (filter.type === 'select') {
          if (value !== filter.value) {
            return false;
          }
        }
      }
      return true;
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the &quot;Filters&quot; button to show column filters. Text columns have text inputs,
          while Status, Role, and Department have dropdown selects.
        </p>
        <DataTable
          data={filteredData.slice(0, 20)}
          columns={columnsWithFilters}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    );
  },
};

// With export functionality
export const WithExport: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the &quot;Export&quot; button to download the table data as CSV or Excel.
        </p>
        <DataTable
          data={sampleData.slice(0, 20)}
          columns={basicColumns}
          exportable
          exportFilename="users-export"
        />
      </div>
    );
  },
};

// With filters and export together
export const WithFiltersAndExport: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterState>({});
    const [sorting, setSorting] = useState<SortingState | null>(null);

    // Apply filters to data
    let processedData = sampleData.filter((user) => {
      for (const filter of Object.values(filters)) {
        const value = user[filter.columnId as keyof User];
        if (filter.type === 'text') {
          if (!String(value).toLowerCase().includes(String(filter.value).toLowerCase())) {
            return false;
          }
        } else if (filter.type === 'select') {
          if (value !== filter.value) {
            return false;
          }
        }
      }
      return true;
    });

    // Apply sorting
    if (sorting) {
      processedData = [...processedData].sort((a, b) => {
        const aVal = a[sorting.column as keyof User];
        const bVal = b[sorting.column as keyof User];
        const modifier = sorting.direction === 'asc' ? 1 : -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * modifier;
        }
        return ((aVal as number) - (bVal as number)) * modifier;
      });
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This example combines column filters, sorting, and export functionality.
          The export will include all filtered data.
        </p>
        <DataTable
          data={processedData}
          columns={columnsWithFilters}
          sorting={sorting}
          onSortingChange={setSorting}
          filters={filters}
          onFiltersChange={setFilters}
          exportable
          exportFilename="filtered-users"
        />
      </div>
    );
  },
};

// Server-side filters and export
export const ServerSideFiltersAndExport: Story = {
  render: () => {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
      totalRows: 0,
      totalPages: 0,
    });
    const [filters, setFilters] = useState<FilterState>({});
    const [search, setSearch] = useState('');

    // Simulated server-side filter function
    const applyFilters = useCallback((sourceData: User[]) => {
      return sourceData.filter((user) => {
        // Apply search
        if (search) {
          const searchLower = search.toLowerCase();
          if (
            !user.name.toLowerCase().includes(searchLower) &&
            !user.email.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        // Apply column filters
        for (const filter of Object.values(filters)) {
          const value = user[filter.columnId as keyof User];
          if (filter.type === 'text') {
            if (!String(value).toLowerCase().includes(String(filter.value).toLowerCase())) {
              return false;
            }
          } else if (filter.type === 'select') {
            if (value !== filter.value) {
              return false;
            }
          }
        }
        return true;
      });
    }, [search, filters]);

    // Simulated API fetch
    const fetchData = useCallback(async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter
      let result = applyFilters(sampleData);

      // Sort
      if (sorting) {
        result = [...result].sort((a, b) => {
          const aVal = a[sorting.column as keyof User];
          const bVal = b[sorting.column as keyof User];
          const modifier = sorting.direction === 'asc' ? 1 : -1;

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * modifier;
          }
          return ((aVal as number) - (bVal as number)) * modifier;
        });
      }

      const totalRows = result.length;
      const totalPages = Math.ceil(totalRows / pagination.pageSize);

      // Paginate
      const paginatedResult = result.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      );

      setData(paginatedResult);
      setPagination((prev) => ({ ...prev, totalRows, totalPages }));
      setLoading(false);
    }, [sorting, pagination.pageIndex, pagination.pageSize, applyFilters]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const handlePaginationChange = ({
      pageIndex,
      pageSize,
    }: {
      pageIndex: number;
      pageSize: number;
    }) => {
      setPagination((prev) => ({ ...prev, pageIndex, pageSize }));
    };

    const handleSearchChange = (value: string) => {
      setSearch(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleFiltersChange = (newFilters: FilterState) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    // Server-side export handler
    const handleExport = async (options: ExportOptions): Promise<User[]> => {
      console.log('Server-side export requested:', options);

      // Simulate fetching all data from server
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return all filtered data (not just current page)
      let exportData = applyFilters(sampleData);

      // Apply sorting for export too
      if (sorting) {
        exportData = [...exportData].sort((a, b) => {
          const aVal = a[sorting.column as keyof User];
          const bVal = b[sorting.column as keyof User];
          const modifier = sorting.direction === 'asc' ? 1 : -1;

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * modifier;
          }
          return ((aVal as number) - (bVal as number)) * modifier;
        });
      }

      return exportData;
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This example simulates server-side filtering and export. The export fetches all
          matching data from the server (simulated with 1s delay), not just the current page.
        </p>
        <DataTable
          data={data}
          columns={columnsWithFilters}
          loading={loading}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          searchValue={search}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          exportable
          onExport={handleExport}
          exportFilename="server-side-export"
          searchPlaceholder="Search users (server-side)..."
        />
      </div>
    );
  },
};
