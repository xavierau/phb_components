import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SimpleBarChart,
  ChatInterface,
} from './index';

function App() {
  const [checked, setChecked] = useState(true);
  const [selectValue, setSelectValue] = useState('');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold">PHB Components</h1>
            <p className="text-muted-foreground mt-1">Design System Preview</p>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Form Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Fields</CardTitle>
                <CardDescription>Input and textarea components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selection</CardTitle>
                <CardDescription>Select and checkbox</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={selectValue}
                    onChange={setSelectValue}
                    options={[
                      { label: 'Admin', value: 'admin' },
                      { label: 'Editor', value: 'editor' },
                      { label: 'Viewer', value: 'viewer' },
                    ]}
                    placeholder="Select a role"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={checked} onCheckedChange={setChecked} />
                  <Label>Accept terms</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Table Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Table</h2>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>A list of recent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>
                      <Badge>Paid</Badge>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV002</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell className="text-right">$120.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Chart Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Charts</h2>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                height={250}
                data={[
                  { label: 'Jan', value: 4000 },
                  { label: 'Feb', value: 3000 },
                  { label: 'Mar', value: 5500 },
                  { label: 'Apr', value: 4500 },
                  { label: 'May', value: 2000 },
                  { label: 'Jun', value: 6000 },
                ]}
              />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Trending up by 5.2% this month
            </CardFooter>
          </Card>
        </section>

        {/* Chat Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Chat Interface</h2>
          <div className="max-w-md">
            <ChatInterface />
          </div>
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
