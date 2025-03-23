import { Link } from 'wouter';
import { Auction } from '@/types';
import { StatusBadge } from '../shared/status-badge';
import { formatCurrency, formatTimeLeft } from '@/utils/format';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
  const isActive = auction.status === 'ACTIVE';
  const isDraft = auction.status === 'DRAFT';

  const getEndTimeDisplay = () => {
    if (isActive) {
      return formatTimeLeft(new Date(auction.endDate));
    } else if (isDraft) {
      return 'Not Started';
    } else {
      return 'Ended';
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative pb-[60%] bg-gray-200">
        <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute top-0 left-0 m-2">
          <StatusBadge status={auction.status} />
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{auction.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">{auction.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{isDraft ? 'Starting bid' : 'Current bid'}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(auction.currentPrice || auction.startPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 text-right">{isActive ? 'Ends in' : 'Status'}</p>
            <p className="text-sm font-medium text-secondary-600">{getEndTimeDisplay()}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant={isDraft ? 'outline' : 'default'} asChild className="w-full">
          <Link href={`/auction/${auction.id}`}>{isDraft ? 'Edit Draft' : 'View Details'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
