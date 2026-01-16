import { useFinanceData } from '@/hooks/useFinanceData';
import { TransactionList } from '@/components/TransactionList';

export const TransactionsView = () => {
    const { transactions, businesses } = useFinanceData();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transaction History</h1>
                <p className="text-slate-500">View and manage all your financial records</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <TransactionList
                    transactions={transactions}
                    businesses={businesses}
                />
            </div>
        </div>
    );
};
