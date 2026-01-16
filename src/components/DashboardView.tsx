import { useFinanceData } from '@/hooks/useFinanceData';
import { BusinessSelector } from '@/components/BusinessSelector';
import { MetricCard } from '@/components/MetricCard';
import { CashFlowChart } from '@/components/CashFlowChart';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseBreakdown } from '@/components/ExpenseBreakdown';
import { AccountsOverview } from '@/components/AccountsOverview';
import { QuickAddTransaction } from '@/components/QuickAddTransaction';
import { BusinessPerformance } from '@/components/BusinessPerformance';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    History,
    Briefcase
} from 'lucide-react';
import { AddBusinessDialog } from '@/components/AddBusinessDialog';

export const DashboardView = () => {
    const {
        businesses,
        accounts,
        transactions,
        metrics,
        businessMetrics,
        expensesByCategory,
        chartData,
        selectedBusinessId,
        setSelectedBusinessId,
        addTransaction,
        addBusiness,
    } = useFinanceData();

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">My Financial Overview</h1>
                    <p className="text-slate-500 font-medium">
                        Track your personal business portfolio and performance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <QuickAddTransaction businesses={businesses} onAdd={addTransaction} />
                </div>
            </div>

            {/* Business Selector (Unified Control) */}
            <section className="animate-fade-in flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-dashed border-slate-300">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Briefcase size={16} />
                    </div>
                    <BusinessSelector
                        businesses={businesses}
                        selectedId={selectedBusinessId}
                        onSelect={setSelectedBusinessId}
                    />
                </div>
                <AddBusinessDialog onAdd={addBusiness} />
            </section>

            {/* Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-slide-up">
                <MetricCard
                    title="Total Income"
                    value={metrics.totalIncome}
                    icon={TrendingUp}
                    variant="income"
                />
                <MetricCard
                    title="Total Expenses"
                    value={metrics.totalExpenses}
                    icon={TrendingDown}
                    variant="expense"
                />
                <MetricCard
                    title="Net Profit"
                    value={metrics.netProfit}
                    icon={Activity}
                    variant="neutral"
                />
                <MetricCard
                    title="Transactions"
                    value={metrics.transactionCount}
                    icon={History}
                    variant="default"
                />
            </section>

            {/* Charts & Lists Grid */}
            <section className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <CashFlowChart data={chartData} />
                    <TransactionList
                        transactions={transactions}
                        businesses={businesses}
                        limit={5}
                    />
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <BusinessPerformance data={businessMetrics} />
                    <ExpenseBreakdown data={expensesByCategory} />
                    <AccountsOverview accounts={accounts} />
                </div>
            </section>
        </div>
    );
};
