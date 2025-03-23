import { useEffect, useState ,useContext} from "react";
import { Link, useParams } from "wouter";

import { useAuction } from "@/hooks/useAuctions";
import { useBids } from "@/hooks/useBids";
import { formatCurrency, formatDate } from "@/utils/format";
import { Auction, Bid } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import BidForm from "@/components/auctions/bid-form";
import BidHistory from "@/components/auctions/bid-history";
import CountdownTimer from "../components/auctions/count-down-timer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

import { AuthContext} from "@/context/AuthContext"
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { cookieUtils } from "@/utils/cookies";

const AuctionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { auction, isLoading: isLoadingAuction } = useAuction(id);
  const { bids, isLoading: isLoadingBids } = useBids(id);
  const [liveAuction, setLiveAuction] = useState<Auction | null>(null);
  const [liveBids, setLiveBids] = useState<Bid[]>([]);
  const [loading,setLoading]=useState(false);
  const auth =useContext(AuthContext);
  const token = cookieUtils.getToken();

  useEffect(()=>{
    setLoading(auth.isConnected??false);
  },[auth.isConnected])


  useEffect(() => {
    if (auction) {
      setLiveAuction(auction);
    }
  }, [auction]);

  useEffect(() => {
    if (bids && bids.length > 0) {
      setLiveBids(bids);
    }
  }, [bids]);


  useEffect(() => {
    if(!loading&&id){
      auth.joinAuction(id)
    }
  }, [loading,id]);

  // Handle WebSocket events
  const { isConnected, joinAuction, leaveAuction } = useAuctionSocket({
    token: token??"",
    auctionId: id,
    onAuctionUpdate: (data) => {
      // Update live auction data
      setLiveAuction((prev) => ({
        ...prev!,
        currentPrice: data.currentPrice,
      }));

      // Update live bids
      setLiveBids((prevBids:any) => {
        const existingBidIndex = prevBids.findIndex(
          (bid:any) => bid.id === data.highestBid.id
        );

        if (existingBidIndex === -1) {
          return [data.highestBid, ...prevBids];
        }
        return prevBids;
      });
    },
  });

  useEffect(() => {
    if (isConnected && id) {
      joinAuction(id);
    }
    return () => {
      if (id) {
        leaveAuction(id);
      }
    };
  }, [isConnected, id]);


  // Determine highest bid amount
  const getHighestBidAmount = () => {
    if (liveBids && liveBids.length > 0) {
      return liveBids[0].amount;
    }
    return liveAuction?.startPrice || 0;
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  // Loading state
  if (isLoadingAuction) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Skeleton className="h-[400px] w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-5 w-1/4 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200">
                <div className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-6" />
                  <Skeleton className="h-32 w-full mb-6" />
                  <Skeleton className="h-40 w-full mb-6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!liveAuction) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Not Found</h2>
            <p className="text-gray-600 mb-6">The auction you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="md:flex">
            {/* Left Column: Image and Description */}
            <div className="md:w-1/2">
              <div className="relative pb-[75%] bg-gray-200">
                {/* Placeholder image */}
                <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20"
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
                <div className="absolute top-0 left-0 m-4">
                  <StatusBadge status={liveAuction.status} />
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">{liveAuction.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Listed on {formatDate(new Date(liveAuction.createdAt))}
                </p>
                <div className="mt-4">
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  <div className="mt-2 prose prose-sm text-gray-500">
                    <p>{liveAuction.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Auction Details and Bidding */}
            <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Auction Details</h2>
                    <p className="mt-1 text-sm text-gray-500">Bid now to win this item</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {liveAuction.status === "ACTIVE" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                        <span className="relative flex h-2 w-2 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Auction
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Current Price and Timer */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current bid</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(liveAuction.currentPrice || liveAuction.startPrice)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{liveBids.length} bids</span> · 
                        <span className="text-gray-500"> {new Set(liveBids.map(b => b.userId)).size} bidders</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {liveAuction.status === "ACTIVE" ? "Auction ends in" : "Auction status"}
                      </p>
                      {liveAuction.status === "ACTIVE" ? (
                        <>
                          <CountdownTimer endDate={new Date(liveAuction.endDate)} />
                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(new Date(liveAuction.endDate))}
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-gray-600">
                          {liveAuction.status === "COMPLETED" ? "Ended" : "Not Started"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bidding Form */}
                <BidForm 
                  auction={liveAuction} 
                  highestBid={getHighestBidAmount()} 
                />
                
                {/* Seller Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Seller Information</h3>
                  <div className="mt-3 flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {liveAuction.user ? getInitials(liveAuction.user.name) : "??"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {liveAuction.user ? liveAuction.user.name : "Unknown Seller"}
                      </p>
                      <p className="text-xs text-gray-500">Member since January 2023</p>
                    </div>
                  </div>
                </div>
                
                {/* Bid History */}
                <BidHistory bids={liveBids} isLoading={isLoadingBids} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
