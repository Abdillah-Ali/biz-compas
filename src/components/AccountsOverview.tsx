import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account } from '@/types/finance';
import { Wallet, Building, Smartphone } from 'lucide-react';

interface AccountsOverviewProps {
  accounts: Account[];
}

export function AccountsOverview({ accounts }: AccountsOverviewProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `TZS ${formatted}`;
  };

  const getIcon = (type: Account['type']) => {
    switch (type) {
      case 'cash':
        return Wallet;
      case 'bank':
        return Building;
      case 'mobile':
        return Smartphone;
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Accounts</CardTitle>
        <span className="text-xl font-bold tabular-nums text-slate-900">{formatCurrency(totalBalance)}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {accounts.map((account) => {
            const Icon = getIcon(account.type);
            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-white shadow-sm shrink-0">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-slate-800 truncate">{account.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{account.type}</p>
                  </div>
                </div>
                <p className="font-bold text-sm tabular-nums text-slate-900 shrink-0">{formatCurrency(account.balance)}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
