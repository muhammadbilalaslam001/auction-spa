import { AuctionStatus } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuctionFiltersProps {
  currentFilter: AuctionStatus | 'ALL';
  onFilterChange: (filter: AuctionStatus | 'ALL') => void;
}

const AuctionFilters = ({ currentFilter, onFilterChange }: AuctionFiltersProps) => {
  return (
    <Tabs
      value={currentFilter}
      onValueChange={value => onFilterChange(value as AuctionStatus | 'ALL')}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="ALL">All</TabsTrigger>
        <TabsTrigger value="ACTIVE">Active</TabsTrigger>
        <TabsTrigger value="DRAFT">Draft</TabsTrigger>
        <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AuctionFilters;
