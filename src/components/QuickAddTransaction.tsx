import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Business, Transaction } from '@/types/finance';
import { categories, paymentMethods } from '@/lib/constants';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAddTransactionProps {
  businesses: Business[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export function QuickAddTransaction({ businesses, onAdd }: QuickAddTransactionProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [formData, setFormData] = useState({
    business_id: '',
    amount: '',
    category: '',
    paymentMethod: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail && (e.detail.type === 'income' || e.detail.type === 'expense')) {
        setType(e.detail.type);
        setOpen(true);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener('openQuickAdd', handleOpen);
    return () => window.removeEventListener('openQuickAdd', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_id || !formData.amount || !formData.category) {
      return;
    }

    onAdd({
      type,
      business_id: formData.business_id,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    setFormData({
      business_id: '',
      amount: '',
      category: '',
      paymentMethod: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  const currentCategories = type === 'income' ? categories.income : categories.expense;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="quick-add-trigger" size="lg" className="gap-2 shadow-soft">
          <Plus className="h-5 w-5" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            className={cn(
              'flex-1 gap-2',
              type === 'income' && 'bg-income hover:bg-income/90'
            )}
            onClick={() => setType('income')}
          >
            <ArrowUpRight className="h-4 w-4" />
            Income
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            className={cn(
              'flex-1 gap-2',
              type === 'expense' && 'bg-expense hover:bg-expense/90'
            )}
            onClick={() => setType('expense')}
          >
            <ArrowDownRight className="h-4 w-4" />
            Expense
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TZS)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">TZS</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-12 text-lg font-semibold"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business</Label>
            <Select
              value={formData.business_id}
              onValueChange={(value) => setFormData({ ...formData, business_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: business.color }}
                      />
                      {business.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Note (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
