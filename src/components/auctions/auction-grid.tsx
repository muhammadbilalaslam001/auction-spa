import { Auction } from '@/types';
import AuctionCard from './auction-card';
import { Skeleton } from '@/components/ui/skeleton';

const AuctionGrid = ({ auctions = [], isLoading }: any) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!auctions) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No auctions found</h3>
        <p className="mt-1 text-sm text-gray-500">Try changing your filters or check back later.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auctions?.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction} />)}
    </div>
  );
};

const AuctionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative pb-[60%] bg-gray-200" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex justify-between mt-3">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
};

export default AuctionGrid;
