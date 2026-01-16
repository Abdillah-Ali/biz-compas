import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { BusinessSelector } from '@/components/BusinessSelector';
import { MetricCard } from '@/components/MetricCard';
import { CashFlowChart } from '@/components/CashFlowChart';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseBreakdown } from '@/components/ExpenseBreakdown';
import { AccountsOverview } from '@/components/AccountsOverview';
import { QuickAddTransaction } from '@/components/QuickAddTransaction';
import { BusinessPerformance } from '@/components/BusinessPerformance';
import { TrendingUp, TrendingDown, Activity, History } from 'lucide-react';
import { AddBusinessDialog } from '@/components/AddBusinessDialog';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
          <h1 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your business finances and track performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QuickAddTransaction businesses={businesses} onAdd={addTransaction} />
        </div>
      </div>

      {/* Business Selector */}
      <section className="animate-fade-in flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <BusinessSelector
          businesses={businesses}
          selectedId={selectedBusinessId}
          onSelect={setSelectedBusinessId}
        />
        <AddBusinessDialog onAdd={addBusiness} />
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
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
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CashFlowChart data={chartData} />
          <TransactionList
            transactions={transactions}
            businesses={businesses}
            limit={5}
          />
        </div>
        <div className="space-y-6">
          <BusinessPerformance data={businessMetrics} />
          <ExpenseBreakdown data={expensesByCategory} />
          <AccountsOverview accounts={accounts} />
        </div>
      </section>
    </div>
  );
};

export default Index;
