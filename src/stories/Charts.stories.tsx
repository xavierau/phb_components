import type { Meta, StoryObj } from '@storybook/react';
import {
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  AreaChart,
  ScatterChart,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  InjectStyles,
} from '../index';

// Simple data format
const simpleData = [
  { label: 'Jan', value: 100 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 150 },
  { label: 'Apr', value: 300 },
  { label: 'May', value: 250 },
  { label: 'Jun', value: 400 },
];

// Multi-series data format
const multiSeriesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Sales', data: [100, 200, 150, 300, 250, 400], color: '#0D5697' },
    { name: 'Revenue', data: [80, 160, 120, 240, 200, 320], color: '#FFC100' },
    { name: 'Profit', data: [40, 80, 60, 120, 100, 160], color: '#10b981' },
  ],
};

// Pie/Doughnut data
const pieData = [
  { label: 'Desktop', value: 400, color: '#0D5697' },
  { label: 'Mobile', value: 300, color: '#FFC100' },
  { label: 'Tablet', value: 100, color: '#10b981' },
  { label: 'Other', value: 50, color: '#f59e0b' },
];

// Scatter data
const scatterData = [
  { x: 10, y: 20, label: 'Point A' },
  { x: 30, y: 40, label: 'Point B' },
  { x: 50, y: 30, label: 'Point C' },
  { x: 70, y: 60, label: 'Point D' },
  { x: 90, y: 45, label: 'Point E' },
];

const scatterMultiSeries = [
  {
    name: 'Group A',
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 30 },
    ],
    color: '#0D5697',
  },
  {
    name: 'Group B',
    data: [
      { x: 15, y: 25 },
      { x: 35, y: 45 },
      { x: 55, y: 35 },
    ],
    color: '#FFC100',
  },
];

// Wrapper component for stories
const ChartWrapper = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <>
    <InjectStyles />
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </>
);

// LineChart Stories
const lineChartMeta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <InjectStyles />
        <div className="p-4">
          <Story />
        </div>
      </>
    ),
  ],
};
export default lineChartMeta;

type LineChartStory = StoryObj<typeof LineChart>;

export const Simple: LineChartStory = {
  render: () => (
    <ChartWrapper title="Simple Line Chart">
      <LineChart data={simpleData} height={300} showDots showGrid />
    </ChartWrapper>
  ),
};

export const MultiSeries: LineChartStory = {
  render: () => (
    <ChartWrapper title="Multi-Series Line Chart">
      <LineChart data={multiSeriesData} height={300} showDots showGrid />
    </ChartWrapper>
  ),
};

export const WithArea: LineChartStory = {
  render: () => (
    <ChartWrapper title="Line Chart with Area Fill">
      <LineChart data={simpleData} height={300} showDots showArea curved />
    </ChartWrapper>
  ),
};

export const Straight: LineChartStory = {
  render: () => (
    <ChartWrapper title="Straight Line Chart">
      <LineChart data={multiSeriesData} height={300} showDots curved={false} />
    </ChartWrapper>
  ),
};

// BarChart Stories
export const BarChartSimple: StoryObj<typeof BarChart> = {
  render: () => (
    <ChartWrapper title="Simple Bar Chart">
      <BarChart data={simpleData} height={300} showValues />
    </ChartWrapper>
  ),
};

export const BarChartGrouped: StoryObj<typeof BarChart> = {
  render: () => (
    <ChartWrapper title="Grouped Bar Chart">
      <BarChart data={multiSeriesData} height={300} />
    </ChartWrapper>
  ),
};

export const BarChartStacked: StoryObj<typeof BarChart> = {
  render: () => (
    <ChartWrapper title="Stacked Bar Chart">
      <BarChart data={multiSeriesData} height={300} stacked />
    </ChartWrapper>
  ),
};

export const BarChartHorizontal: StoryObj<typeof BarChart> = {
  render: () => (
    <ChartWrapper title="Horizontal Bar Chart">
      <BarChart data={simpleData} height={300} horizontal showValues />
    </ChartWrapper>
  ),
};

// PieChart Stories
export const PieChartBasic: StoryObj<typeof PieChart> = {
  render: () => (
    <ChartWrapper title="Pie Chart">
      <PieChart data={pieData} height={300} showLabels showLegend />
    </ChartWrapper>
  ),
};

// DoughnutChart Stories
export const DoughnutChartBasic: StoryObj<typeof DoughnutChart> = {
  render: () => (
    <ChartWrapper title="Doughnut Chart">
      <DoughnutChart data={pieData} height={300} showLabels showLegend />
    </ChartWrapper>
  ),
};

export const DoughnutChartThin: StoryObj<typeof DoughnutChart> = {
  render: () => (
    <ChartWrapper title="Thin Doughnut Chart">
      <DoughnutChart data={pieData} height={300} innerRadius={0.8} />
    </ChartWrapper>
  ),
};

// AreaChart Stories
export const AreaChartSimple: StoryObj<typeof AreaChart> = {
  render: () => (
    <ChartWrapper title="Simple Area Chart">
      <AreaChart data={simpleData} height={300} gradient />
    </ChartWrapper>
  ),
};

export const AreaChartMultiSeries: StoryObj<typeof AreaChart> = {
  render: () => (
    <ChartWrapper title="Multi-Series Area Chart">
      <AreaChart data={multiSeriesData} height={300} gradient showDots />
    </ChartWrapper>
  ),
};

export const AreaChartStacked: StoryObj<typeof AreaChart> = {
  render: () => (
    <ChartWrapper title="Stacked Area Chart">
      <AreaChart data={multiSeriesData} height={300} stacked gradient />
    </ChartWrapper>
  ),
};

// ScatterChart Stories
export const ScatterChartBasic: StoryObj<typeof ScatterChart> = {
  render: () => (
    <ChartWrapper title="Scatter Chart">
      <ScatterChart
        data={scatterData}
        height={300}
        xAxisLabel="X Values"
        yAxisLabel="Y Values"
      />
    </ChartWrapper>
  ),
};

export const ScatterChartMultiSeries: StoryObj<typeof ScatterChart> = {
  render: () => (
    <ChartWrapper title="Multi-Series Scatter Chart">
      <ScatterChart
        data={scatterMultiSeries}
        height={300}
        xAxisLabel="X Values"
        yAxisLabel="Y Values"
      />
    </ChartWrapper>
  ),
};

// All Charts Overview
export const AllCharts: StoryObj = {
  render: () => (
    <>
      <InjectStyles />
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={multiSeriesData} height={250} showDots />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={multiSeriesData} height={250} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} height={250} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doughnut Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <DoughnutChart data={pieData} height={250} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={multiSeriesData} height={250} stacked gradient />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scatter Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ScatterChart data={scatterMultiSeries} height={250} />
          </CardContent>
        </Card>
      </div>
    </>
  ),
};
