import { Bid } from "@/types";
import { formatRelativeTime, formatCurrency } from "@/utils/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface BidHistoryProps {
  bids: Bid[];
  isLoading: boolean;
}

const BidHistory = ({ bids, isLoading }: BidHistoryProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  const getUserColor = (userId: string) => {
    const colors = [
      "bg-red-100 text-red-700",
      "bg-green-100 text-green-700",
      "bg-blue-100 text-blue-700",
      "bg-yellow-100 text-yellow-700",
      "bg-purple-100 text-purple-700",
      "bg-indigo-100 text-indigo-700",
      "bg-pink-100 text-pink-700",
    ];
    
    const hash = userId.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Bid History</h3>
          <span className="text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
            Live Updates
          </span>
        </div>
        <ScrollArea className="h-64 mt-3">
          <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Bid History</h3>
          <span className="text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
            Live Updates
          </span>
        </div>
        <div className="mt-3 text-center py-8">
          <p className="text-sm text-gray-500">No bids yet. Be the first to bid!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Bid History</h3>
        <span className="text-xs text-gray-500">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
          Live Updates
        </span>
      </div>
      <ScrollArea className="h-64 mt-3">
        <div className="flow-root">
          <ul role="list" className="-my-4 divide-y divide-gray-200">
            {bids.map((bid) => (
              <li key={bid.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarFallback className={getUserColor(bid.userId)}>
                          {getInitials(bid.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{bid.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(new Date(bid.createdAt))}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(bid.amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BidHistory;
