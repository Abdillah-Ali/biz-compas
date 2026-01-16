import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Business } from '@/types/finance';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  businesses: Business[];
  limit?: number;
}

export function TransactionList({ transactions, businesses, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `TZS ${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getBusinessName = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  const getBusinessColor = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.color || '#6B7280';
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Badge variant="secondary" className="font-mono">{transactions.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {displayTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    'p-2 rounded-lg shrink-0',
                    transaction.type === 'income' ? 'bg-income-muted' : 'bg-expense-muted'
                  )}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-income" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-expense" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-900 truncate">{transaction.category}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: getBusinessColor(transaction.business_id) }}
                    />
                    <span className="truncate">{getBusinessName(transaction.business_id)}</span>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <p
                className={cn(
                  'font-bold text-sm tabular-nums shrink-0 whitespace-nowrap',
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
