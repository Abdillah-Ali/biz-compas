import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'default' | 'income' | 'expense' | 'neutral';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, variant = 'default', trend }: MetricCardProps) {
  const formatValue = (val: number) => {
    if (title.toLowerCase().includes('transaction')) {
      return val.toLocaleString();
    }
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
    return `TZS ${formatted}`;
  };

  const formattedValue = formatValue(value);

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="metric-label truncate">{title}</p>
            <div
              className={cn(
                'p-2.5 rounded-xl shrink-0 shadow-sm',
                variant === 'income' && 'bg-income-muted',
                variant === 'expense' && 'bg-expense-muted',
                variant === 'default' && 'bg-secondary',
                variant === 'neutral' && (value >= 0 ? 'bg-income-muted' : 'bg-expense-muted')
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  variant === 'income' && 'text-income',
                  variant === 'expense' && 'text-expense',
                  variant === 'default' && 'text-primary',
                  variant === 'neutral' && (value >= 0 ? 'text-income' : 'text-expense')
                )}
              />
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <p
              className={cn(
                'metric-value tabular-nums transition-all duration-300 whitespace-nowrap',
                variant === 'income' && 'text-income',
                variant === 'expense' && 'text-expense',
                variant === 'neutral' && value >= 0 ? 'text-income' : variant === 'neutral' && 'text-expense',
                formattedValue.length > 22 ? 'text-sm' :
                  formattedValue.length > 18 ? 'text-base' :
                    formattedValue.length > 15 ? 'text-lg' :
                      formattedValue.length > 12 ? 'text-xl' :
                        'text-2xl'
              )}
              title={formattedValue}
            >
              {variant === 'neutral' && value >= 0 ? '+' : ''}
              {formattedValue}
            </p>
            {trend && (
              <p className={cn('text-xs font-medium truncate', trend.isPositive ? 'text-income' : 'text-expense')}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
