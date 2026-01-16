import { Button } from '@/components/ui/button';
import { Business } from '@/types/finance';
import { Building2 } from 'lucide-react';

interface BusinessSelectorProps {
  businesses: Business[];
  selectedId: string | 'all';
  onSelect: (id: string | 'all') => void;
}

export function BusinessSelector({ businesses, selectedId, onSelect }: BusinessSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedId === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect('all')}
        className="gap-2"
      >
        <Building2 className="h-4 w-4" />
        All Businesses
      </Button>
      {businesses.map((business) => (
        <Button
          key={business.id}
          variant={selectedId === business.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(business.id)}
          className="gap-2"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: business.color }}
          />
          {business.name}
        </Button>
      ))}
    </div>
  );
}
