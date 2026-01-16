import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ExpenseBreakdownProps {
  data: {
    category: string;
    amount: number;
  }[];
}

export function ExpenseBreakdown({ data }: ExpenseBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `TZS ${formatted}`;
  };

  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
    'bg-chart-5',
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map((item, index) => {
            const percentage = total > 0 ? (item.amount / total) * 100 : 0;
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(item.amount)} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={colors[index % colors.length]}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
