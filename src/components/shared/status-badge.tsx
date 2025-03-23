import { AuctionStatus } from '../../types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: AuctionStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: AuctionStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
        };
      case 'DRAFT':
        return {
          label: 'Draft',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
