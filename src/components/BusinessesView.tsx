import { useFinanceData } from '@/hooks/useFinanceData';
import { BusinessPerformance } from '@/components/BusinessPerformance';
import { AddBusinessDialog } from '@/components/AddBusinessDialog';

export const BusinessesView = () => {
    const { businessMetrics, addBusiness } = useFinanceData();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Businesses</h1>
                    <p className="text-slate-500">Manage and track performance across all your ventures</p>
                </div>
                <AddBusinessDialog onAdd={addBusiness} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <BusinessPerformance data={businessMetrics} />
            </div>
        </div>
    );
};
