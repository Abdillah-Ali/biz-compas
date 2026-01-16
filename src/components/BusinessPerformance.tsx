import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BusinessPerformanceProps {
  data: {
    id: string;
    name: string;
    color: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
}

export function BusinessPerformance({ data }: BusinessPerformanceProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `TZS ${formatted}`;
  };

  const bestPerformer = [...data].sort((a, b) => b.profit - a.profit)[0];

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Business Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((business) => (
            <div
              key={business.id}
              className={cn(
                'p-4 rounded-2xl border transition-all duration-300',
                business.id === bestPerformer?.id
                  ? 'border-income/20 bg-income-muted/30'
                  : 'border-slate-100 bg-slate-50/50'
              )}
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: business.color }}
                  />
                  <span className="font-bold text-slate-800 truncate">{business.name}</span>
                  {business.id === bestPerformer?.id && (
                    <span className="text-[10px] bg-income text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                      Best
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'font-bold text-base tabular-nums shrink-0',
                    business.profit >= 0 ? 'text-income' : 'text-expense'
                  )}
                >
                  {business.profit >= 0 ? '+' : ''}
                  {formatCurrency(business.profit)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="min-w-0">
                  <span className="text-slate-500 font-medium block mb-0.5">Income</span>
                  <p className="font-bold text-income truncate tabular-nums">{formatCurrency(business.income)}</p>
                </div>
                <div className="min-w-0 text-right">
                  <span className="text-slate-500 font-medium block mb-0.5">Expenses</span>
                  <p className="font-bold text-expense truncate tabular-nums">{formatCurrency(business.expenses)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
