import * as React from 'react';
import { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  Loader2,
  Send,
  Minus,
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Bot,
  Copy,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Download,
  Filter,
  FileSpreadsheet,
  FileText,
  Plus,
  GripVertical,
  MoreHorizontal,
  Calendar,
  Flag,
  AlertCircle,
} from 'lucide-react';

/**
 * UTILITIES
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple markdown to HTML renderer for chat messages
 * Supports: bold, italic, code blocks, inline code, links, lists, tables
 */
function renderMarkdown(text: string): string {
  let html = text;

  // Escape HTML entities first (security)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```...```) - must be before inline code
  html = html.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    '<pre class="my-2 rounded-md bg-background/50 p-3 overflow-x-auto"><code class="text-xs">$2</code></pre>'
  );

  // Inline code (`...`)
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-background/50 px-1.5 py-0.5 text-xs font-mono">$1</code>'
  );

  // Bold (**...**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic (*...*)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">$1</a>'
  );

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (_, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    const isHeader = cells.every((cell: string) => /^-+$/.test(cell));
    if (isHeader) return ''; // Skip separator row
    const cellTag = 'td';
    const cellsHtml = cells
      .map((cell: string) => `<${cellTag} class="border border-border px-3 py-1.5">${cell}</${cellTag}>`)
      .join('');
    return `<tr>${cellsHtml}</tr>`;
  });

  // Wrap consecutive table rows
  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>\n?)+/g,
    '<table class="my-2 w-full border-collapse text-xs"><tbody>$&</tbody></table>'
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, (match) => {
    if (!match.includes('class="ml-4"')) return match;
    return `<ul class="my-2 list-disc pl-4">${match}</ul>`;
  });

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Line breaks (preserve newlines that aren't part of block elements)
  html = html.replace(/\n/g, '<br />');

  // Clean up extra breaks around block elements
  html = html.replace(/<br \/>\s*(<\/?(?:pre|ul|ol|table|tbody|tr))/g, '$1');
  html = html.replace(/(<\/(?:pre|ul|ol|table|tbody|tr)>)\s*<br \/>/g, '$1');

  return html;
}

/**
 * ----------------------------------------------------------------------------
 * BUTTON
 * ----------------------------------------------------------------------------
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const buttonSizes: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

/**
 * ----------------------------------------------------------------------------
 * CARD
 * ----------------------------------------------------------------------------
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

/**
 * ----------------------------------------------------------------------------
 * INPUT
 * ----------------------------------------------------------------------------
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

/**
 * ----------------------------------------------------------------------------
 * LABEL
 * ----------------------------------------------------------------------------
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

/**
 * ----------------------------------------------------------------------------
 * TEXTAREA
 * ----------------------------------------------------------------------------
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

/**
 * ----------------------------------------------------------------------------
 * CHECKBOX
 * ----------------------------------------------------------------------------
 */
export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            !disabled && onCheckedChange?.(!checked);
          }
        }}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center transition-colors',
          checked
            ? 'bg-primary text-primary-foreground'
            : 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {checked && <Check className="h-3 w-3 text-white font-bold" strokeWidth={3} />}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

/**
 * ----------------------------------------------------------------------------
 * SELECT
 * ----------------------------------------------------------------------------
 */
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  /** Enable type-to-filter search input in the dropdown */
  searchable?: boolean;
  /** Placeholder text for the search input (only when searchable is true) */
  searchPlaceholder?: string;
  /** Remote search callback — when provided, enables remote mode (searchable is auto-enabled) */
  onSearch?: (query: string) => Promise<SelectOption[]>;
  /** Message shown while loading remote results (default: 'Loading...') */
  loadingMessage?: string;
  /** Message shown when no results found (default: 'No results found') */
  noResultsMessage?: string;
}

export const Select: React.FC<SelectProps> = ({
  placeholder = 'Select...',
  options = [],
  value,
  onChange,
  disabled,
  className,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  loadingMessage = 'Loading...',
  noResultsMessage = 'No results found',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestIdRef = useRef(0);

  const isRemote = !!onSearch;
  const effectiveSearchable = searchable || isRemote;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && effectiveSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
      if (isRemote) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        ++searchRequestIdRef.current;
        setRemoteOptions([]);
        setIsLoading(false);
      }
    }
  }, [isOpen, effectiveSearchable, isRemote]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ??
    selectedOption?.label ??
    remoteOptions.find((opt) => opt.value === value)?.label;

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);

    if (!isRemote) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setRemoteOptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const requestId = ++searchRequestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await onSearch!(value);
        if (requestId === searchRequestIdRef.current) {
          setRemoteOptions(results);
        }
      } catch {
        if (requestId === searchRequestIdRef.current) {
          setRemoteOptions([]);
        }
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 300);
  };

  const displayOptions = (() => {
    if (isRemote) {
      return searchQuery.trim() ? remoteOptions : options;
    }
    return effectiveSearchable && searchQuery
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;
  })();

  return (
    <div className={cn('relative w-full', className)} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={!selectedLabel ? 'text-muted-foreground' : 'text-foreground'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1">
          {effectiveSearchable && (
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex h-7 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchInputChange('')}
                  className="ml-1 shrink-0 opacity-50 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
          <div className="p-1 max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center px-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loadingMessage}
              </div>
            ) : displayOptions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {noResultsMessage}
              </div>
            ) : (
              displayOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange?.(opt.value);
                    if (isRemote) setSelectedOption(opt);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer',
                    value === opt.value && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  {opt.label}
                  {value === opt.value && <Check className="ml-auto h-4 w-4" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * BADGE
 * ----------------------------------------------------------------------------
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground',
};

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
};

/**
 * ----------------------------------------------------------------------------
 * TABLE
 * ----------------------------------------------------------------------------
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

/**
 * ----------------------------------------------------------------------------
 * CHART COMPONENTS
 * ----------------------------------------------------------------------------
 */

// Common chart types and utilities
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface ChartTooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

// Chart color palette (PHB branded)
const defaultChartColors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
];

// Tooltip component for charts
const ChartTooltip: React.FC<ChartTooltipProps> = ({ x, y, content, visible }) => {
  if (!visible) return null;
  return (
    <div
      className="absolute pointer-events-none bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-md whitespace-nowrap z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%) translateY(-8px)',
      }}
    >
      {content}
    </div>
  );
};

/**
 * SIMPLE BAR CHART (Legacy)
 */
export interface SimpleBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 200,
  className,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div
      className={cn('w-full flex items-end justify-between gap-2 pt-6', className)}
      style={{ height }}
    >
      {data.map((item, i) => {
        const percent = (item.value / maxValue) * 100;
        return (
          <div key={i} className="flex flex-col items-center flex-1 group relative">
            <div className="absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border shadow-md">
              {item.label}: {item.value}
            </div>
            <div
              className={cn(
                'w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out hover:opacity-90',
                item.value === maxValue ? 'bg-secondary' : 'bg-primary'
              )}
              style={{ height: `${percent}%` }}
            />
            <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * LINE CHART
 */
export interface LineChartProps {
  data: ChartDataPoint[] | { labels: string[]; series: ChartSeries[] };
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  showArea?: boolean;
  curved?: boolean;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  showDots = true,
  showArea = false,
  curved = true,
  className,
}) => {
  const [tooltip, setTooltip] = useState<ChartTooltipProps>({ x: 0, y: 0, content: '', visible: false });
  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize data to multi-series format
  const isMultiSeries = !Array.isArray(data);
  const labels = isMultiSeries ? data.labels : (data as ChartDataPoint[]).map((d) => d.label);
  const series: ChartSeries[] = isMultiSeries
    ? data.series
    : [{ name: 'Value', data: (data as ChartDataPoint[]).map((d) => d.value) }];

  const allValues = series.flatMap((s) => s.data);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(0, Math.min(...allValues));

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (index: number) => padding.left + (index / (labels.length - 1)) * (chartWidth - padding.left - padding.right);
  const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  const generatePath = (values: number[], areaPath = false) => {
    if (values.length === 0) return '';

    const points = values.map((v, i) => ({ x: xScale(i), y: yScale(v) }));
    const firstPoint = points[0]!;
    const lastPoint = points[points.length - 1]!;

    if (!curved) {
      const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
      if (areaPath) {
        return `${linePath} L ${lastPoint.x} ${yScale(minValue)} L ${firstPoint.x} ${yScale(minValue)} Z`;
      }
      return linePath;
    }

    // Curved path using bezier curves
    let path = `M ${firstPoint.x} ${firstPoint.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i]!;
      const next = points[i + 1]!;
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    if (areaPath) {
      path += ` L ${lastPoint.x} ${yScale(minValue)} L ${firstPoint.x} ${yScale(minValue)} Z`;
    }
    return path;
  };

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + ((maxValue - minValue) * (4 - i)) / 4;
    return { y: yScale(value), value };
  });

  const handleMouseMove = (e: React.MouseEvent, seriesIndex: number, _pointIndex: number, value: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${series[seriesIndex]?.name ?? 'Value'}: ${value.toLocaleString()}`,
      visible: true,
    });
  };

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full" style={{ height }}>
        {/* Grid */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={chartWidth - padding.right}
              y2={line.y}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <text
              x={padding.left - 10}
              y={line.y}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[10px] fill-muted-foreground"
            >
              {line.value.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 10}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground"
          >
            {label}
          </text>
        ))}

        {/* Series */}
        {series.map((s, seriesIndex) => {
          const color = s.color || defaultChartColors[seriesIndex % defaultChartColors.length];
          return (
            <g key={seriesIndex}>
              {/* Area fill */}
              {showArea && (
                <path
                  d={generatePath(s.data, true)}
                  fill={color}
                  fillOpacity={0.1}
                />
              )}
              {/* Line */}
              <path
                d={generatePath(s.data)}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
              {/* Dots */}
              {showDots && s.data.map((value, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(value)}
                  r={4}
                  fill={color}
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseMove={(e) => handleMouseMove(e, seriesIndex, i, value)}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <ChartTooltip {...tooltip} />
    </div>
  );
};

/**
 * BAR CHART
 */
export interface BarChartProps {
  data: ChartDataPoint[] | { labels: string[]; series: ChartSeries[] };
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  showGrid?: boolean;
  showValues?: boolean;
  barRadius?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  horizontal = false,
  stacked = false,
  showGrid = true,
  showValues = false,
  barRadius = 4,
  className,
}) => {
  const [tooltip, setTooltip] = useState<ChartTooltipProps>({ x: 0, y: 0, content: '', visible: false });
  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize data
  const isMultiSeries = !Array.isArray(data);
  const labels = isMultiSeries ? data.labels : (data as ChartDataPoint[]).map((d) => d.label);
  const series: ChartSeries[] = isMultiSeries
    ? data.series
    : [{ name: 'Value', data: (data as ChartDataPoint[]).map((d) => d.value), color: (data as ChartDataPoint[])[0]?.color }];

  const padding = horizontal
    ? { top: 20, right: 20, bottom: 20, left: 80 }
    : { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate max values
  let maxValue: number;
  if (stacked) {
    maxValue = Math.max(
      ...labels.map((_, i) => series.reduce((sum, s) => sum + (s.data[i] || 0), 0))
    );
  } else {
    maxValue = Math.max(...series.flatMap((s) => s.data));
  }

  const barGroupWidth = horizontal
    ? chartHeight / labels.length
    : (chartWidth - padding.left - padding.right) / labels.length;
  const barWidth = stacked
    ? barGroupWidth * 0.7
    : (barGroupWidth * 0.7) / series.length;
  const barGap = (barGroupWidth - (stacked ? barWidth : barWidth * series.length)) / 2;

  const handleMouseMove = (e: React.MouseEvent, seriesName: string, value: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${seriesName}: ${value.toLocaleString()}`,
      visible: true,
    });
  };

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = (maxValue * (i + 1)) / 5;
    return { position: horizontal ? (value / maxValue) * (chartWidth - padding.left - padding.right) : value, value };
  });

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full" style={{ height }}>
        {/* Grid */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            {horizontal ? (
              <>
                <line
                  x1={padding.left + line.position}
                  y1={padding.top}
                  x2={padding.left + line.position}
                  y2={height - padding.bottom}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={padding.left + line.position}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  {line.value.toLocaleString()}
                </text>
              </>
            ) : (
              <>
                <line
                  x1={padding.left}
                  y1={padding.top + chartHeight - (line.value / maxValue) * chartHeight}
                  x2={chartWidth - padding.right}
                  y2={padding.top + chartHeight - (line.value / maxValue) * chartHeight}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={padding.left - 10}
                  y={padding.top + chartHeight - (line.value / maxValue) * chartHeight}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  {line.value.toLocaleString()}
                </text>
              </>
            )}
          </g>
        ))}

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={horizontal ? padding.left - 10 : padding.left + barGap + barGroupWidth * i + (stacked ? barWidth / 2 : (barWidth * series.length) / 2)}
            y={horizontal ? padding.top + barGap + barGroupWidth * i + barGroupWidth / 2 : height - 10}
            textAnchor={horizontal ? 'end' : 'middle'}
            dominantBaseline={horizontal ? 'middle' : 'auto'}
            className="text-[10px] fill-muted-foreground"
          >
            {label}
          </text>
        ))}

        {/* Bars */}
        {labels.map((label, labelIndex) => {
          let stackOffset = 0;
          return series.map((s, seriesIndex) => {
            const value = s.data[labelIndex] || 0;
            const color = s.color || defaultChartColors[seriesIndex % defaultChartColors.length];
            const barLength = (value / maxValue) * (horizontal ? chartWidth - padding.left - padding.right : chartHeight);

            let x: number, y: number, w: number, h: number;

            if (horizontal) {
              x = padding.left + (stacked ? stackOffset : 0);
              y = padding.top + barGap + barGroupWidth * labelIndex + (stacked ? 0 : seriesIndex * barWidth);
              w = barLength;
              h = barWidth;
            } else {
              x = padding.left + barGap + barGroupWidth * labelIndex + (stacked ? 0 : seriesIndex * barWidth);
              y = padding.top + chartHeight - barLength - (stacked ? stackOffset : 0);
              w = barWidth;
              h = barLength;
            }

            if (stacked) {
              stackOffset += barLength;
            }

            return (
              <g key={`${labelIndex}-${seriesIndex}`}>
                <rect
                  x={x}
                  y={y}
                  width={Math.max(0, w)}
                  height={Math.max(0, h)}
                  fill={color}
                  rx={barRadius}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseMove={(e) => handleMouseMove(e, `${label} - ${s.name}`, value)}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                />
                {showValues && value > 0 && (
                  <text
                    x={horizontal ? x + w + 5 : x + w / 2}
                    y={horizontal ? y + h / 2 : y - 5}
                    textAnchor={horizontal ? 'start' : 'middle'}
                    dominantBaseline={horizontal ? 'middle' : 'auto'}
                    className="text-[9px] fill-foreground font-medium"
                  >
                    {value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          });
        })}
      </svg>
      <ChartTooltip {...tooltip} />
    </div>
  );
};

/**
 * PIE CHART
 */
export interface PieChartProps {
  data: ChartDataPoint[];
  height?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  innerRadius?: number; // 0 for pie, > 0 for doughnut
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  showLabels = true,
  showLegend = true,
  innerRadius = 0,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<ChartTooltipProps>({ x: 0, y: 0, content: '', visible: false });
  const svgRef = useRef<SVGSVGElement>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = 200;
  const cy = height / 2;
  const outerRadius = Math.min(cx, cy) - 40;
  const inner = innerRadius * outerRadius;

  let currentAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const percentage = d.value / total;
    const angle = percentage * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + outerRadius * Math.cos(startAngle);
    const y1 = cy + outerRadius * Math.sin(startAngle);
    const x2 = cx + outerRadius * Math.cos(endAngle);
    const y2 = cy + outerRadius * Math.sin(endAngle);

    const ix1 = cx + inner * Math.cos(startAngle);
    const iy1 = cy + inner * Math.sin(startAngle);
    const ix2 = cx + inner * Math.cos(endAngle);
    const iy2 = cy + inner * Math.sin(endAngle);

    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = outerRadius + 20;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);

    const path = inner > 0
      ? `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      path,
      color: d.color || defaultChartColors[i % defaultChartColors.length],
      label: d.label,
      value: d.value,
      percentage,
      labelX,
      labelY,
      midAngle,
    };
  });

  const handleMouseMove = (e: React.MouseEvent, slice: typeof slices[0], index: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setActiveIndex(index);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${slice.label}: ${slice.value.toLocaleString()} (${(slice.percentage * 100).toFixed(1)}%)`,
      visible: true,
    });
  };

  return (
    <div className={cn('relative flex items-center gap-4', className)}>
      <svg ref={svgRef} viewBox={`0 0 400 ${height}`} className="flex-shrink-0" style={{ width: 400, height }}>
        {slices.map((slice, i) => (
          <g key={i}>
            <path
              d={slice.path}
              fill={slice.color}
              className="cursor-pointer transition-all duration-200"
              style={{
                transform: activeIndex === i ? `translate(${Math.cos(slice.midAngle) * 5}px, ${Math.sin(slice.midAngle) * 5}px)` : undefined,
                filter: activeIndex === i ? 'brightness(1.1)' : undefined,
              }}
              onMouseMove={(e) => handleMouseMove(e, slice, i)}
              onMouseLeave={() => {
                setActiveIndex(null);
                setTooltip((t) => ({ ...t, visible: false }));
              }}
            />
            {showLabels && slice.percentage > 0.05 && (
              <text
                x={slice.labelX}
                y={slice.labelY}
                textAnchor={slice.labelX > cx ? 'start' : 'end'}
                dominantBaseline="middle"
                className="text-[10px] fill-muted-foreground pointer-events-none"
              >
                {(slice.percentage * 100).toFixed(0)}%
              </text>
            )}
          </g>
        ))}
        {inner > 0 && (
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold fill-foreground"
          >
            {total.toLocaleString()}
          </text>
        )}
      </svg>

      {showLegend && (
        <div className="flex flex-col gap-2">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: d.color || defaultChartColors[i % defaultChartColors.length] }}
              />
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-medium">{d.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <ChartTooltip {...tooltip} />
    </div>
  );
};

/**
 * DOUGHNUT CHART (Alias for PieChart with innerRadius)
 */
export interface DoughnutChartProps extends Omit<PieChartProps, 'innerRadius'> {
  innerRadius?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  innerRadius = 0.6,
  ...props
}) => {
  return <PieChart {...props} innerRadius={innerRadius} />;
};

/**
 * AREA CHART
 */
export interface AreaChartProps {
  data: ChartDataPoint[] | { labels: string[]; series: ChartSeries[] };
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  stacked?: boolean;
  curved?: boolean;
  gradient?: boolean;
  className?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  showDots = false,
  stacked = false,
  curved = true,
  gradient = true,
  className,
}) => {
  const [tooltip, setTooltip] = useState<ChartTooltipProps>({ x: 0, y: 0, content: '', visible: false });
  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize data
  const isMultiSeries = !Array.isArray(data);
  const labels = isMultiSeries ? data.labels : (data as ChartDataPoint[]).map((d) => d.label);
  const series: ChartSeries[] = isMultiSeries
    ? data.series
    : [{ name: 'Value', data: (data as ChartDataPoint[]).map((d) => d.value) }];

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate stacked values if needed
  const stackedData = stacked
    ? series.map((s, seriesIndex) =>
        s.data.map((_value, i) =>
          series.slice(0, seriesIndex + 1).reduce((sum, s2) => sum + (s2.data[i] || 0), 0)
        )
      )
    : series.map((s) => s.data);

  const allValues = stackedData.flatMap((d) => d);
  const maxValue = Math.max(...allValues);
  const minValue = 0;

  const xScale = (index: number) => padding.left + (index / (labels.length - 1)) * (chartWidth - padding.left - padding.right);
  const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  const generatePath = (values: number[], baseline: number[] | null = null) => {
    if (values.length === 0) return '';

    const points = values.map((v, i) => ({ x: xScale(i), y: yScale(v) }));
    const firstPoint = points[0]!;
    const lastPoint = points[points.length - 1]!;
    const basePoints = baseline
      ? baseline.map((v, i) => ({ x: xScale(i), y: yScale(v) })).reverse()
      : [
          { x: lastPoint.x, y: yScale(0) },
          { x: firstPoint.x, y: yScale(0) },
        ];

    let path = `M ${firstPoint.x} ${firstPoint.y}`;

    if (curved) {
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i]!;
        const next = points[i + 1]!;
        const cp1x = curr.x + (next.x - curr.x) / 3;
        const cp1y = curr.y;
        const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
        const cp2y = next.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }
    } else {
      for (let i = 1; i < points.length; i++) {
        const point = points[i]!;
        path += ` L ${point.x} ${point.y}`;
      }
    }

    const firstBasePoint = basePoints[0]!;
    path += ` L ${firstBasePoint.x} ${firstBasePoint.y}`;
    for (let i = 1; i < basePoints.length; i++) {
      const basePoint = basePoints[i]!;
      path += ` L ${basePoint.x} ${basePoint.y}`;
    }
    path += ' Z';

    return path;
  };

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = (maxValue * (4 - i)) / 4;
    return { y: yScale(value), value };
  });

  const handleMouseMove = (e: React.MouseEvent, seriesIndex: number, _pointIndex: number, value: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${series[seriesIndex]?.name ?? 'Value'}: ${value.toLocaleString()}`,
      visible: true,
    });
  };

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full" style={{ height }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color || defaultChartColors[i % defaultChartColors.length];
            return (
              <linearGradient key={i} id={`area-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Grid */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={chartWidth - padding.right}
              y2={line.y}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <text
              x={padding.left - 10}
              y={line.y}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[10px] fill-muted-foreground"
            >
              {line.value.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 10}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground"
          >
            {label}
          </text>
        ))}

        {/* Areas (render in reverse for proper stacking) */}
        {[...series].reverse().map((s, reversedIndex) => {
          const seriesIndex = series.length - 1 - reversedIndex;
          const color = s.color || defaultChartColors[seriesIndex % defaultChartColors.length];
          const currentData = stackedData[seriesIndex] ?? [];
          const baselineData = stacked && seriesIndex > 0 ? (stackedData[seriesIndex - 1] ?? null) : null;
          const seriesData = series[seriesIndex]?.data ?? [];

          return (
            <g key={seriesIndex}>
              <path
                d={generatePath(currentData, baselineData)}
                fill={gradient ? `url(#area-gradient-${seriesIndex})` : color}
                fillOpacity={gradient ? 1 : 0.3}
              />
              <path
                d={generatePath(currentData, baselineData).split(' L ')[0]}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
              {showDots && seriesData.map((value, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(stacked ? (currentData[i] ?? value) : value)}
                  r={4}
                  fill={color}
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseMove={(e) => handleMouseMove(e, seriesIndex, i, value)}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <ChartTooltip {...tooltip} />
    </div>
  );
};

/**
 * SCATTER CHART
 */
export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
}

export interface ScatterSeries {
  name: string;
  data: ScatterDataPoint[];
  color?: string;
}

export interface ScatterChartProps {
  data: ScatterDataPoint[] | ScatterSeries[];
  height?: number;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  className,
}) => {
  const [tooltip, setTooltip] = useState<ChartTooltipProps>({ x: 0, y: 0, content: '', visible: false });
  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize data
  const firstItem = data[0];
  const isMultiSeries = data.length > 0 && firstItem && 'name' in firstItem && 'data' in firstItem;
  const series: ScatterSeries[] = isMultiSeries
    ? (data as ScatterSeries[])
    : [{ name: 'Data', data: data as ScatterDataPoint[] }];

  const allPoints = series.flatMap((s) => s.data);
  const xValues = allPoints.map((p) => p.x);
  const yValues = allPoints.map((p) => p.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(0, Math.min(...yValues));
  const yMax = Math.max(...yValues);

  const padding = { top: 20, right: 20, bottom: 50, left: 60 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (value: number) =>
    padding.left + ((value - xMin) / (xMax - xMin || 1)) * (chartWidth - padding.left - padding.right);
  const yScale = (value: number) =>
    padding.top + chartHeight - ((value - yMin) / (yMax - yMin || 1)) * chartHeight;

  const xGridLines = Array.from({ length: 5 }, (_, i) => {
    const value = xMin + ((xMax - xMin) * i) / 4;
    return { x: xScale(value), value };
  });

  const yGridLines = Array.from({ length: 5 }, (_, i) => {
    const value = yMin + ((yMax - yMin) * (4 - i)) / 4;
    return { y: yScale(value), value };
  });

  const handleMouseMove = (e: React.MouseEvent, seriesName: string, point: ScatterDataPoint) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${point.label || seriesName}: (${point.x.toLocaleString()}, ${point.y.toLocaleString()})`,
      visible: true,
    });
  };

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full" style={{ height }}>
        {/* Grid */}
        {showGrid && (
          <>
            {yGridLines.map((line, i) => (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={line.y}
                  x2={chartWidth - padding.right}
                  y2={line.y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={padding.left - 10}
                  y={line.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  {line.value.toLocaleString()}
                </text>
              </g>
            ))}
            {xGridLines.map((line, i) => (
              <g key={`x-${i}`}>
                <line
                  x1={line.x}
                  y1={padding.top}
                  x2={line.x}
                  y2={height - padding.bottom}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={line.x}
                  y={height - padding.bottom + 15}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  {line.value.toLocaleString()}
                </text>
              </g>
            ))}
          </>
        )}

        {/* Axis labels */}
        {xAxisLabel && (
          <text
            x={chartWidth / 2}
            y={height - 5}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {xAxisLabel}
          </text>
        )}
        {yAxisLabel && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
            className="text-xs fill-muted-foreground"
          >
            {yAxisLabel}
          </text>
        )}

        {/* Data points */}
        {series.map((s, seriesIndex) => {
          const color = s.color || defaultChartColors[seriesIndex % defaultChartColors.length];
          return s.data.map((point, i) => (
            <circle
              key={`${seriesIndex}-${i}`}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={point.size || 6}
              fill={point.color || color}
              fillOpacity={0.7}
              stroke={point.color || color}
              strokeWidth={2}
              className="cursor-pointer transition-all hover:fillOpacity-100 hover:scale-125"
              onMouseMove={(e) => handleMouseMove(e, s.name, point)}
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
            />
          ));
        })}
      </svg>
      <ChartTooltip {...tooltip} />
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * CHAT INTERFACE
 * ----------------------------------------------------------------------------
 */
export interface ChatMessage {
  id: number | string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessages = [
    {
      id: 1,
      sender: 'agent',
      text: 'Hello! Welcome to PHB Solution. How can I help you today?',
      time: '09:41 AM',
    },
  ],
  onSendMessage,
  title = 'PHB Support',
  subtitle = 'Online',
  className,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(input);
    setInput('');
  };

  return (
    <div
      className={cn(
        'flex flex-col h-[400px] bg-card rounded-xl border overflow-hidden shadow-sm',
        className
      )}
    >
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PS
          </div>
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex w-full', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-card border text-card-foreground rounded-tl-none'
              )}
            >
              <p>{msg.text}</p>
              <p
                className={cn(
                  'text-[10px] mt-1 opacity-70',
                  msg.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                )}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * DATA TABLE
 * ----------------------------------------------------------------------------
 */

// Column definition
export interface DataTableColumn<T> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  // Filter options
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
}

// Sort state
export interface SortingState {
  column: string;
  direction: 'asc' | 'desc';
}

// Pagination state
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

// Row selection state
export type RowSelectionState = Record<string, boolean>;

// Filter types
export type FilterType = 'text' | 'select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface ColumnFilter {
  columnId: string;
  type: FilterType;
  value: string | string[];
}

export type FilterState = Record<string, ColumnFilter>;

// Export types
export type ExportFormat = 'csv' | 'xlsx';

export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  includeHeaders?: boolean;
  exportAll?: boolean;
}

// Main DataTable props
export interface DataTableProps<T extends { id: string | number }> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];

  // Loading
  loading?: boolean;

  // Sorting (server-side)
  sorting?: SortingState | null;
  onSortingChange?: (sorting: SortingState | null) => void;

  // Pagination (server-side)
  pagination?: PaginationState;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  pageSizeOptions?: number[];

  // Selection
  selectable?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;

  // Search/Filter
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Column Filters (server-side)
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;

  // Export
  exportable?: boolean;
  onExport?: (options: ExportOptions) => Promise<T[]> | T[] | void;
  exportFilename?: string;

  // Styling
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;

  // Row customization
  onRowClick?: (row: T) => void;
  getRowClassName?: (row: T, index: number) => string;

  // Empty state
  emptyMessage?: string | React.ReactNode;
}

// Styling variants
const dataTableVariants = {
  striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/30',
  bordered: 'border [&_th]:border [&_td]:border',
  compact: '[&_th]:py-2 [&_th]:px-3 [&_td]:py-2 [&_td]:px-3',
};

// Export utility functions
function exportToCSV<T>(
  data: T[],
  columns: DataTableColumn<T>[],
  filename: string
): void {
  const headers = columns.map((col) =>
    typeof col.header === 'string' ? col.header : col.id
  );

  const rows = data.map((row) =>
    columns
      .map((col) => {
        if (col.accessorKey) {
          const value = row[col.accessorKey];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }
        return '';
      })
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportToXLSX<T>(
  data: T[],
  columns: DataTableColumn<T>[],
  filename: string
): void {
  const headers = columns.map((col) =>
    typeof col.header === 'string' ? col.header : col.id
  );

  const rows = data.map((row) =>
    columns.map((col) => {
      if (col.accessorKey) {
        const value = row[col.accessorKey];
        return value === null || value === undefined ? '' : value;
      }
      return '';
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// DataTable Filter Row Component
function DataTableFilterRow<T>({
  columns,
  filters,
  onFiltersChange,
  selectable,
}: {
  columns: DataTableColumn<T>[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  selectable: boolean;
}) {
  const debounceRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const handleTextFilterChange = useCallback(
    (columnId: string, value: string) => {
      // Clear existing timeout for this column
      if (debounceRefs.current[columnId]) {
        clearTimeout(debounceRefs.current[columnId]);
      }

      // Debounce the filter change
      debounceRefs.current[columnId] = setTimeout(() => {
        const newFilters = { ...filters };
        if (value) {
          newFilters[columnId] = {
            columnId,
            type: 'text',
            value,
          };
        } else {
          delete newFilters[columnId];
        }
        onFiltersChange(newFilters);
      }, 300);
    },
    [filters, onFiltersChange]
  );

  const handleSelectFilterChange = useCallback(
    (columnId: string, value: string) => {
      const newFilters = { ...filters };
      if (value) {
        newFilters[columnId] = {
          columnId,
          type: 'select',
          value,
        };
      } else {
        delete newFilters[columnId];
      }
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const clearFilter = useCallback(
    (columnId: string) => {
      const newFilters = { ...filters };
      delete newFilters[columnId];
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  return (
    <tr className="border-b bg-muted/20">
      {/* Empty cell for checkbox column */}
      {selectable && <td className="w-12 px-4" />}

      {columns.map((column) => {
        const currentFilter = filters[column.id];
        const filterType = column.filterType || 'text';

        if (!column.filterable) {
          return <td key={column.id} className="p-2" />;
        }

        return (
          <td key={column.id} className="p-2">
            <div className="relative">
              {filterType === 'text' ? (
                <>
                  <input
                    type="text"
                    defaultValue={(currentFilter?.value as string) || ''}
                    onChange={(e) => handleTextFilterChange(column.id, e.target.value)}
                    placeholder={column.filterPlaceholder || `Filter ${typeof column.header === 'string' ? column.header : column.id}...`}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 pr-7 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {currentFilter && (
                    <button
                      type="button"
                      onClick={() => {
                        clearFilter(column.id);
                        // Also clear the input value
                        const input = document.querySelector(
                          `input[placeholder="${column.filterPlaceholder || `Filter ${typeof column.header === 'string' ? column.header : column.id}...`}"]`
                        ) as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </>
              ) : (
                <div className="relative">
                  <select
                    value={(currentFilter?.value as string) || ''}
                    onChange={(e) => handleSelectFilterChange(column.id, e.target.value)}
                    className="flex h-8 w-full appearance-none rounded-md border border-input bg-transparent px-2 pr-7 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="">
                      {column.filterPlaceholder || `All ${typeof column.header === 'string' ? column.header : ''}`}
                    </option>
                    {column.filterOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

// DataTable Toolbar Component
function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selectionCount,
  onClearSelection,
  // Filter props
  hasFilterableColumns,
  showFilters,
  onShowFiltersChange,
  activeFilterCount,
  filters,
  onClearAllFilters,
  // Export props
  exportable,
  exporting,
  onExport,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selectionCount?: number;
  onClearSelection?: () => void;
  // Filter props
  hasFilterableColumns?: boolean;
  showFilters?: boolean;
  onShowFiltersChange?: (show: boolean) => void;
  activeFilterCount?: number;
  filters?: FilterState;
  onClearAllFilters?: () => void;
  // Export props
  exportable?: boolean;
  exporting?: boolean;
  onExport?: (format: ExportFormat) => void;
}) {
  const [localSearch, setLocalSearch] = useState(searchValue || '');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchValue || '');
  }, [searchValue]);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSearchChange?.(value);
    }, 300);
  };

  const showToolbar =
    onSearchChange ||
    (selectionCount && selectionCount > 0) ||
    hasFilterableColumns ||
    exportable;

  if (!showToolbar) return null;

  return (
    <div className="space-y-3 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          {onSearchChange && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Filter Toggle Button */}
          {hasFilterableColumns && onShowFiltersChange && (
            <Button
              variant={showFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onShowFiltersChange(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount !== undefined && activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Selection Info */}
          {selectionCount !== undefined && selectionCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selectionCount} row(s) selected</span>
              {onClearSelection && (
                <Button variant="ghost" size="sm" onClick={onClearSelection}>
                  Clear
                </Button>
              )}
            </div>
          )}

          {/* Export Dropdown */}
          {exportable && onExport && (
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>

              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-md border bg-popover p-1 shadow-lg z-50">
                  <button
                    onClick={() => {
                      onExport('csv');
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                    disabled={exporting}
                  >
                    <FileText className="h-4 w-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      onExport('xlsx');
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                    disabled={exporting}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Export as Excel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {filters && activeFilterCount !== undefined && activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.values(filters).map((filter) => (
            <Badge key={filter.columnId} variant="secondary" className="gap-1">
              {filter.columnId}: {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
              <button
                type="button"
                onClick={() => {
                  if (onClearAllFilters) {
                    // Clear just this filter by creating new state without it
                    const newFilters = { ...filters };
                    delete newFilters[filter.columnId];
                    // This requires onFiltersChange but we only have onClearAllFilters
                    // So we show chips but clearing individual ones requires the parent to handle it
                  }
                }}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {onClearAllFilters && (
            <Button variant="ghost" size="sm" onClick={onClearAllFilters} className="h-6 px-2 text-xs">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// DataTable Pagination Component
function DataTablePagination({
  pagination,
  onPaginationChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
}: {
  pagination: PaginationState;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  pageSizeOptions?: number[];
}) {
  const { pageIndex, pageSize, totalRows, totalPages } = pagination;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) =>
            onPaginationChange?.({ pageIndex: 0, pageSize: Number(e.target.value) })
          }
          className="h-8 w-16 rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {totalRows > 0 ? `${startRow}-${endRow} of ${totalRows}` : '0 results'}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPaginationChange?.({ pageIndex: 0, pageSize })}
          disabled={!canGoPrev}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPaginationChange?.({ pageIndex: pageIndex - 1, pageSize })}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2 text-sm">
          Page {pageIndex + 1} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPaginationChange?.({ pageIndex: pageIndex + 1, pageSize })}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPaginationChange?.({ pageIndex: totalPages - 1, pageSize })}
          disabled={!canGoNext}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main DataTable Component
export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  pageSizeOptions,
  selectable = false,
  rowSelection = {},
  onRowSelectionChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  // Column filters
  filters = {},
  onFiltersChange,
  // Export
  exportable = false,
  onExport,
  exportFilename = 'data-export',
  // Styling
  className,
  striped = false,
  bordered = false,
  compact = false,
  onRowClick,
  getRowClassName,
  emptyMessage = 'No results found.',
}: DataTableProps<T>) {
  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Compute selection state
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const allSelected = data.length > 0 && data.every((row) => rowSelection[String(row.id)]);
  const someSelected = selectedCount > 0 && !allSelected;

  // Compute filter state
  const hasFilterableColumns = columns.some((col) => col.filterable);
  const activeFilterCount = Object.keys(filters).length;

  // Handle sort click
  const handleSortClick = (columnId: string) => {
    if (!onSortingChange) return;

    if (!sorting || sorting.column !== columnId) {
      onSortingChange({ column: columnId, direction: 'asc' });
    } else if (sorting.direction === 'asc') {
      onSortingChange({ column: columnId, direction: 'desc' });
    } else {
      onSortingChange(null);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!onRowSelectionChange) return;

    if (allSelected) {
      // Deselect all current page items
      const newSelection = { ...rowSelection };
      data.forEach((row) => {
        delete newSelection[String(row.id)];
      });
      onRowSelectionChange(newSelection);
    } else {
      // Select all current page items
      const newSelection = { ...rowSelection };
      data.forEach((row) => {
        newSelection[String(row.id)] = true;
      });
      onRowSelectionChange(newSelection);
    }
  };

  // Handle row select
  const handleRowSelect = (row: T) => {
    if (!onRowSelectionChange) return;

    const rowId = String(row.id);
    const newSelection = { ...rowSelection };

    if (newSelection[rowId]) {
      delete newSelection[rowId];
    } else {
      newSelection[rowId] = true;
    }

    onRowSelectionChange(newSelection);
  };

  // Clear selection
  const handleClearSelection = () => {
    onRowSelectionChange?.({});
  };

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    onFiltersChange?.({});
  }, [onFiltersChange]);

  // Handle export
  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setExporting(true);
      try {
        let exportData: T[] = data;

        // If onExport callback is provided, use it to get data (supports server-side export)
        if (onExport) {
          const result = await onExport({
            filename: exportFilename,
            format,
            includeHeaders: true,
            exportAll: true,
          });

          // If the callback returns data, use it; otherwise use current data
          if (Array.isArray(result)) {
            exportData = result;
          }
        }

        // Perform the export
        if (format === 'csv') {
          exportToCSV(exportData, columns, exportFilename);
        } else {
          exportToXLSX(exportData, columns, exportFilename);
        }
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setExporting(false);
      }
    },
    [data, columns, exportFilename, onExport]
  );

  // Get cell value
  const getCellValue = (row: T, column: DataTableColumn<T>, rowIndex: number): React.ReactNode => {
    if (column.cell) {
      return column.cell(row, rowIndex);
    }
    if (column.accessorKey) {
      const value = row[column.accessorKey];
      return value as React.ReactNode;
    }
    return null;
  };

  // Get alignment class
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Build table classes
  const tableClasses = cn(
    'w-full caption-bottom text-sm',
    striped && dataTableVariants.striped,
    bordered && dataTableVariants.bordered,
    compact && dataTableVariants.compact,
    className
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        selectionCount={selectable ? selectedCount : undefined}
        onClearSelection={selectable ? handleClearSelection : undefined}
        // Filter props
        hasFilterableColumns={hasFilterableColumns}
        showFilters={showFilters}
        onShowFiltersChange={onFiltersChange ? setShowFilters : undefined}
        activeFilterCount={activeFilterCount}
        filters={filters}
        onClearAllFilters={onFiltersChange ? handleClearAllFilters : undefined}
        // Export props
        exportable={exportable}
        exporting={exporting}
        onExport={exportable ? handleExport : undefined}
      />

      {/* Table */}
      <div className="relative w-full overflow-auto rounded-md border">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <table className={tableClasses} aria-busy={loading}>
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              {/* Selection checkbox column */}
              {selectable && (
                <th className="h-12 w-12 px-4">
                  <div
                    role="checkbox"
                    aria-checked={allSelected ? true : someSelected ? 'mixed' : false}
                    tabIndex={0}
                    onClick={handleSelectAll}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectAll();
                      }
                    }}
                    className={cn(
                      'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background cursor-pointer flex items-center justify-center transition-colors',
                      allSelected && 'bg-primary text-primary-foreground',
                      someSelected && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {allSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    {someSelected && !allSelected && (
                      <Minus className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                </th>
              )}

              {/* Data columns */}
              {columns.map((column) => {
                const isSorted = sorting?.column === column.id;
                const sortDirection = isSorted ? sorting?.direction : undefined;

                return (
                  <th
                    key={column.id}
                    className={cn(
                      'h-12 px-4 align-middle font-medium text-muted-foreground',
                      getAlignClass(column.align),
                      column.sortable && 'cursor-pointer select-none hover:text-foreground'
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                    }}
                    onClick={() => column.sortable && handleSortClick(column.id)}
                    aria-sort={
                      isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end'
                      )}
                    >
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'h-3 w-3 -mb-1',
                              sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground/40'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 -mt-1',
                              sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground/40'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* Filter Row */}
            {showFilters && hasFilterableColumns && onFiltersChange && (
              <DataTableFilterRow
                columns={columns}
                filters={filters}
                onFiltersChange={onFiltersChange}
                selectable={selectable}
              />
            )}
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const isSelected = rowSelection[String(row.id)];
                const customClassName = getRowClassName?.(row, rowIndex);

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b transition-colors',
                      isSelected ? 'bg-muted' : 'hover:bg-muted/50',
                      onRowClick && 'cursor-pointer',
                      customClassName
                    )}
                    data-state={isSelected ? 'selected' : undefined}
                    aria-selected={isSelected}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className="w-12 px-4">
                        <div
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowSelect(row);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleRowSelect(row);
                            }
                          }}
                          className={cn(
                            'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background cursor-pointer flex items-center justify-center transition-colors',
                            isSelected && 'bg-primary text-primary-foreground'
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </div>
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn('p-4 align-middle', getAlignClass(column.align))}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                        }}
                      >
                        {getCellValue(row, column, rowIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <DataTablePagination
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

/**
 * ----------------------------------------------------------------------------
 * SIDEBAR
 * ----------------------------------------------------------------------------
 */

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
  defaultOpen?: boolean;
}

export interface SidebarUser {
  name: string;
  email?: string;
  avatar?: string;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logo?: React.ReactNode;
  logoCollapsed?: React.ReactNode;
  items: SidebarItem[];
  footerItems?: SidebarItem[];
  user?: SidebarUser;
  onUserClick?: () => void;
  className?: string;
}

// Sidebar Nav Item Component
function SidebarNavItem({
  item,
  collapsed,
  depth = 0,
}: {
  item: SidebarItem;
  collapsed: boolean;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      item.onClick?.();
    }
  };

  const handleMouseEnter = () => {
    if (collapsed && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const content = (
    <div
      ref={itemRef}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer relative',
        item.active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        depth > 0 && 'ml-6'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.icon && (
        <span className={cn('shrink-0', item.active ? 'text-primary' : 'text-muted-foreground')}>
          {item.icon}
        </span>
      )}

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>

          {item.badge !== undefined && (
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}

          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </>
      )}

      {/* Fixed position tooltip when collapsed - rendered via portal */}
      {collapsed && showTooltip && (
        <div
          className="fixed rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-lg border whitespace-nowrap pointer-events-none"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateY(-50%)',
            zIndex: 9999,
          }}
        >
          {item.label}
          {item.badge !== undefined && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (item.href && !hasChildren) {
    return (
      <a href={item.href} className="block">
        {content}
      </a>
    );
  }

  return (
    <div>
      {content}
      {hasChildren && !collapsed && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarNavItem key={child.id} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onCollapsedChange,
  logo,
  logoCollapsed,
  items,
  footerItems,
  user,
  onUserClick,
  className,
}) => {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header with Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {collapsed ? (
          logoCollapsed || (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              P
            </div>
          )
        ) : (
          logo || (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                P
              </div>
              <span className="font-semibold">PHB Solution</span>
            </div>
          )
        )}

        {onCollapsedChange && !collapsed && (
          <button
            onClick={() => onCollapsedChange(true)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {onCollapsedChange && collapsed && (
        <div className="flex justify-center py-2 border-b">
          <button
            onClick={() => onCollapsedChange(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => (
          <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer Items */}
      {footerItems && footerItems.length > 0 && (
        <div className="border-t p-3 space-y-1">
          {footerItems.map((item) => (
            <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </div>
      )}

      {/* User Profile */}
      {user && (
        <div
          className={cn(
            'border-t p-3 cursor-pointer hover:bg-muted transition-colors',
            collapsed && 'flex justify-center'
          )}
          onClick={onUserClick}
        >
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

/**
 * ----------------------------------------------------------------------------
 * NAVBAR
 * ----------------------------------------------------------------------------
 */

export interface NavbarUser {
  name: string;
  email?: string;
  avatar?: string;
}

export interface NavbarMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notifications?: number;
  onNotificationsClick?: () => void;
  user?: NavbarUser;
  userMenuItems?: NavbarMenuItem[];
  showThemeToggle?: boolean;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onMenuClick?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  title,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  notifications,
  onNotificationsClick,
  user,
  userMenuItems,
  showThemeToggle = true,
  theme = 'light',
  onThemeChange,
  onMenuClick,
  className,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue || '');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchValue || '');
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearch);
  };

  const defaultUserMenuItems: NavbarMenuItem[] = [
    { label: 'Profile', onClick: () => {}, icon: <User className="h-4 w-4" /> },
    { label: 'Settings', onClick: () => {}, icon: <Settings className="h-4 w-4" /> },
    { label: 'Sign out', onClick: () => {}, icon: <LogOut className="h-4 w-4" /> },
  ];

  const menuItems = userMenuItems || defaultUserMenuItems;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6',
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {logo || (
          title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )
        )}

        {/* Search */}
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-48 rounded-md border border-input bg-transparent pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:w-64 xl:w-80"
              />
            </div>
          </form>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {showThemeToggle && onThemeChange && (
          <button
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        )}

        {/* Notifications */}
        {onNotificationsClick && (
          <button
            onClick={onNotificationsClick}
            className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notifications !== undefined && notifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </button>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden text-sm font-medium lg:block">{user.name}</span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 shadow-lg z-50">
                <div className="border-b px-3 py-2 mb-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

/**
 * ----------------------------------------------------------------------------
 * APP LAYOUT
 * ----------------------------------------------------------------------------
 */

export interface AppLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarFooterItems?: SidebarItem[];
  sidebarLogo?: React.ReactNode;
  sidebarLogoCollapsed?: React.ReactNode;
  navbarTitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  notifications?: number;
  onNotificationsClick?: () => void;
  user?: NavbarUser;
  userMenuItems?: NavbarMenuItem[];
  defaultTheme?: 'light' | 'dark';
  defaultCollapsed?: boolean;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebarItems,
  sidebarFooterItems,
  sidebarLogo,
  sidebarLogoCollapsed,
  navbarTitle,
  showSearch = true,
  searchPlaceholder,
  onSearch,
  notifications,
  onNotificationsClick,
  user,
  userMenuItems,
  defaultTheme = 'light',
  defaultCollapsed = false,
  onThemeChange,
  className,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);
  const [theme, setTheme] = useState(defaultTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    onThemeChange?.(theme);
  }, [theme, onThemeChange]);

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          items={sidebarItems}
          footerItems={sidebarFooterItems}
          logo={sidebarLogo}
          logoCollapsed={sidebarLogoCollapsed}
          user={user}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64">
            <Sidebar
              items={sidebarItems}
              footerItems={sidebarFooterItems}
              logo={sidebarLogo}
              user={user}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          title={navbarTitle}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearch}
          notifications={notifications}
          onNotificationsClick={onNotificationsClick}
          user={user}
          userMenuItems={userMenuItems}
          showThemeToggle
          theme={theme}
          onThemeChange={setTheme}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * FLOATING CHAT BUTTON
 * ----------------------------------------------------------------------------
 */

export interface FloatingChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
  showPulse?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
  unreadCount,
  showPulse = false,
  position = 'bottom-right',
  className,
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        positionClasses[position],
        className
      )}
      aria-label="Open chat"
    >
      {/* Pulse animation */}
      {showPulse && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-25" />
      )}

      <MessageSquare className="h-6 w-6" />

      {/* Unread badge */}
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

/**
 * ----------------------------------------------------------------------------
 * AI COPILOT CHAT
 * ----------------------------------------------------------------------------
 */

export interface AICopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface AICopilotChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: AICopilotMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export const AICopilotChat: React.FC<AICopilotChatProps> = ({
  open,
  onOpenChange,
  messages,
  onSendMessage,
  isTyping = false,
  title = 'AI Assistant',
  subtitle = 'Ask me anything',
  placeholder = 'Type your message...',
  suggestions = [],
  onSuggestionClick,
  className,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onOpenChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onSendMessage(suggestion);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-card shadow-2xl',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <Sparkles className="mx-auto h-8 w-8 mb-2 text-primary" />
                <p>How can I help you today?</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border bg-background px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'group relative max-w-[85%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm'
                )}
              >
                {message.role === 'assistant' ? (
                  <div
                    className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                <div
                  className={cn(
                    'mt-1 flex items-center gap-2 text-[10px]',
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {message.status === 'sending' && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  {message.status === 'error' && (
                    <span className="text-destructive">Failed to send</span>
                  )}
                </div>

                {/* Copy button for assistant messages */}
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="absolute -right-2 top-2 hidden rounded-md bg-background p-1 shadow-sm border group-hover:block"
                    aria-label="Copy message"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-card p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-full border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * GANTT CHART
 * ----------------------------------------------------------------------------
 */

export interface GanttTaskData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color?: string;
  dependencies?: string[];
  assignee?: string;
  group?: string;
}

export interface GanttChartProps {
  tasks: GanttTaskData[];
  startDate?: Date;
  endDate?: Date;
  zoom?: 'day' | 'week' | 'month';
  onTaskClick?: (task: GanttTaskData) => void;
  onTaskMove?: (task: GanttTaskData, newStartDate: Date, newEndDate: Date) => void;
  showDependencies?: boolean;
  className?: string;
}

// Helper functions for date calculations
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const diffDays = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const _getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const _getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Export for potential external use
export const getStartOfWeek = _getStartOfWeek;
export const getStartOfMonth = _getStartOfMonth;

// GanttTask component for rendering individual task bars
interface GanttTaskProps {
  task: GanttTaskData;
  chartStartDate: Date;
  dayWidth: number;
  rowHeight: number;
  rowIndex: number;
  onClick?: (task: GanttTaskData) => void;
  isSelected?: boolean;
}

const GanttTaskBar: React.FC<GanttTaskProps> = ({
  task,
  chartStartDate,
  dayWidth,
  rowHeight,
  rowIndex,
  onClick,
  isSelected,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const taskRef = useRef<SVGGElement>(null);

  const startOffset = diffDays(chartStartDate, task.startDate);
  const duration = diffDays(task.startDate, task.endDate) + 1;
  const x = startOffset * dayWidth;
  const width = duration * dayWidth;
  const y = rowIndex * rowHeight + 8;
  const height = rowHeight - 16;
  const progressWidth = (width * task.progress) / 100;

  const taskColor = task.color || 'var(--primary)';

  const handleMouseEnter = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <g
      ref={taskRef}
      className="cursor-pointer"
      onClick={() => onClick?.(task)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Task bar background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill={taskColor}
        opacity={0.3}
        stroke={isSelected ? 'var(--ring)' : 'none'}
        strokeWidth={isSelected ? 2 : 0}
      />
      {/* Progress fill */}
      <rect
        x={x}
        y={y}
        width={progressWidth}
        height={height}
        rx={4}
        ry={4}
        fill={taskColor}
        clipPath={`inset(0 ${width - progressWidth}px 0 0 round 4px)`}
      />
      {/* Progress indicator inside bar */}
      {width > 50 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-xs font-medium pointer-events-none"
          style={{ fontSize: '11px' }}
        >
          {task.progress}%
        </text>
      )}
      {/* Tooltip */}
      {showTooltip && (
        <foreignObject
          x={0}
          y={0}
          width={1}
          height={1}
          overflow="visible"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="fixed z-50 rounded-lg border bg-popover p-3 shadow-lg"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y + 10,
              minWidth: '200px',
            }}
          >
            <div className="font-semibold text-sm">{task.name}</div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Start:</span>
                <span>{formatDateShort(task.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End:</span>
                <span>{formatDateShort(task.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span>{task.progress}%</span>
              </div>
              {task.assignee && (
                <div className="flex justify-between">
                  <span>Assignee:</span>
                  <span>{task.assignee}</span>
                </div>
              )}
              {task.group && (
                <div className="flex justify-between">
                  <span>Group:</span>
                  <span>{task.group}</span>
                </div>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${task.progress}%`,
                  backgroundColor: taskColor,
                }}
              />
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

// Dependency arrow component
interface DependencyArrowProps {
  fromTask: GanttTaskData;
  toTask: GanttTaskData;
  chartStartDate: Date;
  dayWidth: number;
  rowHeight: number;
  taskIndexMap: Map<string, number>;
}

const DependencyArrow: React.FC<DependencyArrowProps> = ({
  fromTask,
  toTask,
  chartStartDate,
  dayWidth,
  rowHeight,
  taskIndexMap,
}) => {
  const fromIndex = taskIndexMap.get(fromTask.id);
  const toIndex = taskIndexMap.get(toTask.id);

  if (fromIndex === undefined || toIndex === undefined) return null;

  const fromEndOffset = diffDays(chartStartDate, fromTask.endDate) + 1;
  const toStartOffset = diffDays(chartStartDate, toTask.startDate);

  const fromX = fromEndOffset * dayWidth;
  const fromY = fromIndex * rowHeight + rowHeight / 2;
  const toX = toStartOffset * dayWidth;
  const toY = toIndex * rowHeight + rowHeight / 2;

  const midX = (fromX + toX) / 2;
  const arrowSize = 6;

  // Create path for dependency line
  let path: string;
  if (toX > fromX + 10) {
    // Standard left-to-right connection
    path = `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX - arrowSize}`;
  } else {
    // Wrap around when target is to the left
    const verticalOffset = rowHeight / 3;
    path = `M ${fromX} ${fromY} H ${fromX + 10} V ${fromY + (toIndex > fromIndex ? verticalOffset : -verticalOffset)} H ${toX - 10} V ${toY} H ${toX - arrowSize}`;
  }

  return (
    <g className="pointer-events-none">
      <path
        d={path}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={1.5}
        strokeDasharray="4 2"
        opacity={0.6}
      />
      {/* Arrow head */}
      <polygon
        points={`${toX - arrowSize},${toY - arrowSize / 2} ${toX},${toY} ${toX - arrowSize},${toY + arrowSize / 2}`}
        fill="var(--muted-foreground)"
        opacity={0.6}
      />
    </g>
  );
};

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  startDate: propStartDate,
  endDate: propEndDate,
  zoom = 'day',
  onTaskClick,
  onTaskMove: _onTaskMove,
  showDependencies = true,
  className,
}) => {
  // onTaskMove is reserved for future drag-and-drop functionality
  void _onTaskMove;
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate chart date range
  const chartStartDate = React.useMemo(() => {
    if (propStartDate) return new Date(propStartDate);
    if (tasks.length === 0) return new Date();
    const earliest = tasks.reduce<Date>((min, task) =>
      task.startDate < min ? task.startDate : min,
      tasks[0]!.startDate
    );
    // Pad with 2 days before
    return addDays(earliest, -2);
  }, [propStartDate, tasks]);

  const chartEndDate = React.useMemo(() => {
    if (propEndDate) return new Date(propEndDate);
    if (tasks.length === 0) return addDays(new Date(), 30);
    const latest = tasks.reduce<Date>((max, task) =>
      task.endDate > max ? task.endDate : max,
      tasks[0]!.endDate
    );
    // Pad with 2 days after
    return addDays(latest, 2);
  }, [propEndDate, tasks]);

  // Calculate dimensions based on zoom level
  const dayWidth = zoom === 'day' ? 40 : zoom === 'week' ? 20 : 8;
  const rowHeight = 48;
  const headerHeight = 50;
  const taskListWidth = 200;

  const totalDays = diffDays(chartStartDate, chartEndDate) + 1;
  const chartWidth = totalDays * dayWidth;

  // Group tasks
  const groupedTasks = React.useMemo(() => {
    const groups = new Map<string, GanttTaskData[]>();
    const ungrouped: GanttTaskData[] = [];

    tasks.forEach((task) => {
      if (task.group) {
        const group = groups.get(task.group) || [];
        group.push(task);
        groups.set(task.group, group);
      } else {
        ungrouped.push(task);
      }
    });

    const result: { groupName?: string; tasks: GanttTaskData[] }[] = [];
    groups.forEach((groupTasks, groupName) => {
      result.push({ groupName, tasks: groupTasks });
    });
    if (ungrouped.length > 0) {
      result.push({ tasks: ungrouped });
    }

    return result;
  }, [tasks]);

  // Flatten tasks for rendering with group headers
  const flatTasks = React.useMemo(() => {
    const items: { type: 'group' | 'task'; data: GanttTaskData | string }[] = [];
    groupedTasks.forEach(({ groupName, tasks: groupTasks }) => {
      if (groupName) {
        items.push({ type: 'group', data: groupName });
      }
      groupTasks.forEach((task) => {
        items.push({ type: 'task', data: task });
      });
    });
    return items;
  }, [groupedTasks]);

  // Task index map for dependency arrows
  const taskIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    let taskIndex = 0;
    flatTasks.forEach((item) => {
      if (item.type === 'task') {
        map.set((item.data as GanttTaskData).id, taskIndex);
      }
      taskIndex++;
    });
    return map;
  }, [flatTasks]);

  // Generate timeline header columns
  const timelineColumns = React.useMemo(() => {
    const columns: { date: Date; label: string; isToday: boolean; isWeekend: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(chartStartDate, i);
      const isToday = isSameDay(date, today);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      let label = '';
      if (zoom === 'day') {
        label = date.getDate().toString();
      } else if (zoom === 'week') {
        if (date.getDay() === 1 || i === 0) {
          label = `W${getWeekNumber(date)}`;
        }
      } else {
        if (date.getDate() === 1 || i === 0) {
          label = formatMonth(date);
        }
      }

      columns.push({ date, label, isToday, isWeekend });
    }

    return columns;
  }, [chartStartDate, totalDays, zoom]);

  // Handle task click
  const handleTaskClick = (task: GanttTaskData) => {
    setSelectedTaskId(task.id);
    onTaskClick?.(task);
  };

  // Today marker position
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOffset = diffDays(chartStartDate, today);
  const showTodayMarker = todayOffset >= 0 && todayOffset <= totalDays;

  const totalHeight = flatTasks.length * rowHeight;

  return (
    <div className={cn('flex flex-col border rounded-lg bg-card overflow-hidden', className)}>
      {/* Zoom controls */}
      <div className="flex items-center gap-2 border-b px-4 py-2 bg-muted/30">
        <span className="text-sm text-muted-foreground">Zoom:</span>
        <div className="flex rounded-md border overflow-hidden">
          {(['day', 'week', 'month'] as const).map((level) => (
            <button
              key={level}
              className={cn(
                'px-3 py-1 text-xs font-medium transition-colors',
                zoom === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              )}
              onClick={() => {
                // This is a controlled component, so we don't manage zoom state internally
                // The parent should handle zoom changes
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDateShort(chartStartDate)}</span>
          <span>-</span>
          <span>{formatDateShort(chartEndDate)}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Task list panel */}
        <div
          className="flex-shrink-0 border-r bg-muted/20"
          style={{ width: taskListWidth }}
        >
          {/* Header */}
          <div
            className="border-b bg-muted/30 px-3 flex items-center font-medium text-sm"
            style={{ height: headerHeight }}
          >
            Tasks
          </div>
          {/* Task names */}
          <div className="overflow-y-auto" style={{ maxHeight: `calc(100vh - ${headerHeight + 100}px)` }}>
            {flatTasks.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center px-3 border-b',
                  item.type === 'group' && 'bg-muted/50 font-semibold text-sm',
                  item.type === 'task' && 'text-sm hover:bg-muted/30 cursor-pointer',
                  item.type === 'task' && selectedTaskId === (item.data as GanttTaskData).id && 'bg-primary/10'
                )}
                style={{ height: rowHeight }}
                onClick={() => {
                  if (item.type === 'task') {
                    handleTaskClick(item.data as GanttTaskData);
                  }
                }}
              >
                {item.type === 'group' ? (
                  <span className="truncate">{item.data as string}</span>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: (item.data as GanttTaskData).color || 'var(--primary)' }}
                    />
                    <span className="truncate">{(item.data as GanttTaskData).name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline panel */}
        <div className="flex-1 overflow-auto" ref={containerRef}>
          <svg
            width={chartWidth}
            height={headerHeight + totalHeight}
            className="block"
          >
            {/* Timeline header background */}
            <rect
              x={0}
              y={0}
              width={chartWidth}
              height={headerHeight}
              fill="var(--muted)"
              opacity={0.3}
            />

            {/* Grid columns and header labels */}
            {timelineColumns.map((col, index) => (
              <g key={index}>
                {/* Weekend highlight */}
                {col.isWeekend && (
                  <rect
                    x={index * dayWidth}
                    y={headerHeight}
                    width={dayWidth}
                    height={totalHeight}
                    fill="var(--muted)"
                    opacity={0.3}
                  />
                )}
                {/* Grid line */}
                <line
                  x1={index * dayWidth}
                  y1={headerHeight}
                  x2={index * dayWidth}
                  y2={headerHeight + totalHeight}
                  stroke="var(--border)"
                  strokeWidth={1}
                  opacity={0.5}
                />
                {/* Header label */}
                {col.label && (
                  <text
                    x={index * dayWidth + dayWidth / 2}
                    y={headerHeight / 2 + 5}
                    textAnchor="middle"
                    className="fill-muted-foreground text-xs"
                    style={{ fontSize: zoom === 'month' ? '10px' : '11px' }}
                  >
                    {col.label}
                  </text>
                )}
                {/* Month label for day view */}
                {zoom === 'day' && (col.date.getDate() === 1 || index === 0) && (
                  <text
                    x={index * dayWidth + 2}
                    y={15}
                    className="fill-foreground text-xs font-medium"
                    style={{ fontSize: '10px' }}
                  >
                    {formatMonth(col.date)}
                  </text>
                )}
              </g>
            ))}

            {/* Header bottom border */}
            <line
              x1={0}
              y1={headerHeight}
              x2={chartWidth}
              y2={headerHeight}
              stroke="var(--border)"
              strokeWidth={1}
            />

            {/* Row horizontal lines */}
            {flatTasks.map((_, index) => (
              <line
                key={index}
                x1={0}
                y1={headerHeight + (index + 1) * rowHeight}
                x2={chartWidth}
                y2={headerHeight + (index + 1) * rowHeight}
                stroke="var(--border)"
                strokeWidth={1}
                opacity={0.5}
              />
            ))}

            {/* Today marker */}
            {showTodayMarker && (
              <g>
                <line
                  x1={todayOffset * dayWidth + dayWidth / 2}
                  y1={headerHeight}
                  x2={todayOffset * dayWidth + dayWidth / 2}
                  y2={headerHeight + totalHeight}
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <rect
                  x={todayOffset * dayWidth + dayWidth / 2 - 25}
                  y={headerHeight - 18}
                  width={50}
                  height={16}
                  rx={3}
                  fill="var(--destructive)"
                />
                <text
                  x={todayOffset * dayWidth + dayWidth / 2}
                  y={headerHeight - 7}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                  style={{ fontSize: '10px' }}
                >
                  Today
                </text>
              </g>
            )}

            {/* Dependency arrows */}
            {showDependencies && (
              <g transform={`translate(0, ${headerHeight})`}>
                {tasks.map((task) =>
                  task.dependencies?.map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId);
                    if (!depTask) return null;
                    return (
                      <DependencyArrow
                        key={`${depTask.id}-${task.id}`}
                        fromTask={depTask}
                        toTask={task}
                        chartStartDate={chartStartDate}
                        dayWidth={dayWidth}
                        rowHeight={rowHeight}
                        taskIndexMap={taskIndexMap}
                      />
                    );
                  })
                )}
              </g>
            )}

            {/* Task bars */}
            <g transform={`translate(0, ${headerHeight})`}>
              {flatTasks.map((item, index) => {
                if (item.type === 'group') return null;
                const task = item.data as GanttTaskData;
                return (
                  <GanttTaskBar
                    key={task.id}
                    task={task}
                    chartStartDate={chartStartDate}
                    dayWidth={dayWidth}
                    rowHeight={rowHeight}
                    rowIndex={index}
                    onClick={handleTaskClick}
                    isSelected={selectedTaskId === task.id}
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Export GanttTask as an alias for external use
export const GanttTask = GanttTaskBar;

/**
 * ----------------------------------------------------------------------------
 * KANBAN BOARD
 * ----------------------------------------------------------------------------
 */

export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTag {
  id: string;
  label: string;
  color?: string;
}

export interface KanbanAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  priority?: KanbanPriority;
  assignee?: KanbanAssignee;
  tags?: KanbanTag[];
  dueDate?: Date;
  columnId: string;
}

export interface KanbanColumnData {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanCardProps {
  card: KanbanCardData;
  onEdit?: (card: KanbanCardData) => void;
  onDelete?: (cardId: string) => void;
  isDragging?: boolean;
  className?: string;
}

export interface KanbanColumnProps {
  column: KanbanColumnData;
  cards: KanbanCardData[];
  collapsed?: boolean;
  onToggle?: () => void;
  onAddCard?: (columnId: string) => void;
  onCardEdit?: (card: KanbanCardData) => void;
  onCardDelete?: (cardId: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: KanbanCardData) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  dragOverColumnId?: string | null;
  className?: string;
}

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  cards: KanbanCardData[];
  onCardMove?: (cardId: string, sourceColumnId: string, targetColumnId: string) => void;
  onCardAdd?: (columnId: string) => void;
  onCardEdit?: (card: KanbanCardData) => void;
  onCardDelete?: (cardId: string) => void;
  className?: string;
}

const priorityConfig: Record<KanbanPriority, { color: string; icon: React.ReactNode; label: string }> = {
  low: {
    color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    icon: <Flag className="h-3 w-3" />,
    label: 'Low',
  },
  medium: {
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    icon: <Flag className="h-3 w-3" />,
    label: 'Medium',
  },
  high: {
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
    icon: <Flag className="h-3 w-3" />,
    label: 'High',
  },
  urgent: {
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    icon: <AlertCircle className="h-3 w-3" />,
    label: 'Urgent',
  },
};

const defaultColumnColors: Record<string, string> = {
  todo: 'bg-slate-500',
  'in-progress': 'bg-blue-500',
  review: 'bg-yellow-500',
  done: 'bg-green-500',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onEdit,
  onDelete,
  isDragging = false,
  className,
}) => {
  const { title, description, priority, assignee, tags, dueDate } = card;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Overdue', className: 'text-red-600 dark:text-red-400' };
    if (days === 0) return { text: 'Today', className: 'text-orange-600 dark:text-orange-400' };
    if (days === 1) return { text: 'Tomorrow', className: 'text-yellow-600 dark:text-yellow-400' };
    return {
      text: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      className: 'text-muted-foreground',
    };
  };

  return (
    <div
      className={cn(
        'group rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg rotate-2 scale-105',
        className
      )}
      draggable
    >
      {/* Header with drag handle and menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-tight truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Edit card"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              aria-label="Delete card"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : undefined,
                color: tag.color || undefined,
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Priority, Due Date, Assignee */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {/* Priority */}
          {priority && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                priorityConfig[priority].color
              )}
            >
              {priorityConfig[priority].icon}
              {priorityConfig[priority].label}
            </span>
          )}

          {/* Due Date */}
          {dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[10px]',
                formatDate(dueDate).className
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(dueDate).text}
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignee && (
          <div className="flex items-center" title={assignee.name}>
            {assignee.avatar ? (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="h-6 w-6 rounded-full border-2 border-background"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium border-2 border-background">
                {assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
KanbanCard.displayName = 'KanbanCard';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  collapsed = false,
  onToggle,
  onAddCard,
  onCardEdit,
  onCardDelete,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  dragOverColumnId,
  className,
}) => {
  const columnColor = column.color || defaultColumnColors[column.id.toLowerCase()] || 'bg-primary';
  const isDragOver = dragOverColumnId === column.id;

  if (collapsed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center w-12 rounded-lg border bg-card p-2 cursor-pointer hover:bg-muted/50 transition-colors',
          className
        )}
        onClick={onToggle}
      >
        <div className={cn('w-2 h-2 rounded-full mb-2', columnColor)} />
        <span
          className="text-xs font-medium text-muted-foreground writing-mode-vertical whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {column.title}
        </span>
        <span className="mt-2 text-xs text-muted-foreground">{cards.length}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground mt-2" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col w-72 min-w-[18rem] rounded-lg border bg-muted/30 transition-colors',
        isDragOver && 'ring-2 ring-primary ring-offset-2 bg-primary/5',
        className
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, column.id)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', columnColor)} />
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onAddCard && (
            <button
              onClick={() => onAddCard(column.id)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Add card"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse column"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {cards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => onDragStart?.(e, card)}
            onDragEnd={onDragEnd}
          >
            <KanbanCard
              card={card}
              onEdit={onCardEdit}
              onDelete={onCardDelete}
            />
          </div>
        ))}

        {/* Empty state */}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-muted-foreground mb-2">No cards yet</p>
            {onAddCard && (
              <button
                onClick={() => onAddCard(column.id)}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add a card
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Card Button at bottom */}
      {onAddCard && cards.length > 0 && (
        <div className="p-2 border-t">
          <button
            onClick={() => onAddCard(column.id)}
            className="w-full flex items-center justify-center gap-1 p-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add card
          </button>
        </div>
      )}
    </div>
  );
};
KanbanColumn.displayName = 'KanbanColumn';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  cards,
  onCardMove,
  onCardAdd,
  onCardEdit,
  onCardDelete,
  className,
}) => {
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set());
  const [draggedCard, setDraggedCard] = useState<KanbanCardData | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const toggleColumn = useCallback((columnId: string) => {
    setCollapsedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, card: KanbanCardData) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);

    // Add a slight delay to allow the drag image to be captured
    requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.5';
    });
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedCard(null);
    setDragOverColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
      e.preventDefault();
      setDragOverColumnId(null);

      if (!draggedCard) return;
      if (draggedCard.columnId === targetColumnId) return;

      onCardMove?.(draggedCard.id, draggedCard.columnId, targetColumnId);
      setDraggedCard(null);
    },
    [draggedCard, onCardMove]
  );

  const handleDragEnter = useCallback((columnId: string) => {
    setDragOverColumnId(columnId);
  }, []);

  const getCardsForColumn = useCallback(
    (columnId: string) => cards.filter((card) => card.columnId === columnId),
    [cards]
  );

  return (
    <div
      className={cn(
        'flex gap-4 overflow-x-auto p-4 min-h-[500px]',
        className
      )}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          onDragEnter={() => handleDragEnter(column.id)}
        >
          <KanbanColumn
            column={column}
            cards={getCardsForColumn(column.id)}
            collapsed={collapsedColumns.has(column.id)}
            onToggle={() => toggleColumn(column.id)}
            onAddCard={onCardAdd}
            onCardEdit={onCardEdit}
            onCardDelete={onCardDelete}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragOverColumnId={dragOverColumnId}
          />
        </div>
      ))}
    </div>
  );
};
KanbanBoard.displayName = 'KanbanBoard';
