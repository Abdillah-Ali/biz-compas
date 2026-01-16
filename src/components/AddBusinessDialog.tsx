import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Business } from '@/types/finance';

interface AddBusinessDialogProps {
    onAdd: (business: Omit<Business, 'id'>) => void;
}

const PREDEFINED_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#64748B', // Slate
];

export function AddBusinessDialog({ onAdd }: AddBusinessDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState(PREDEFINED_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, color });
        setOpen(false);
        setName('');
        setColor(PREDEFINED_COLORS[0]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 border-0"
                >
                    <Plus className="h-4 w-4" />
                    Add Business
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Business</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. My Coffee Shop"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Color Code</Label>
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Business</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
