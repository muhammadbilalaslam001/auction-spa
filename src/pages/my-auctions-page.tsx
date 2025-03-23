import { useState } from "react";
import { Link } from "wouter";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { Auction, AuctionStatus } from "@/types";
import { formatCurrency, formatTimeLeft, formatDate } from "@/utils/format";
import { StatusBadge } from "../components/shared/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";import { toast } from "sonner";
import CreateAuctionForm from "@/components/auctions/create-auction-form";
import { Loader2 } from "lucide-react";

const MyAuctionsPage = () => {
  const { user } = useAuth();
  const { auctions, isLoading, updateAuctionStatus, isUpdatingStatus } = useAuctions();
  const [createAuctionOpen, setCreateAuctionOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"ALL" | AuctionStatus>("ALL");
  // Filter auctions by the current user and the selected tab
  const filteredAuctions = auctions?.filter((auction:Auction) => {
    const isOwnAuction = auction.userId === user?.id;
    const matchesTab = selectedTab === "ALL" || auction.status === selectedTab;
    return isOwnAuction && matchesTab;
  });

  // Count auctions by status
  const countByStatus = {
    ALL: filteredAuctions?.length,
    ACTIVE: filteredAuctions?.filter((a:any) => a.status === "ACTIVE").length,
    DRAFT: filteredAuctions?.filter((a:any) => a.status === "DRAFT").length,
    COMPLETED: filteredAuctions?.filter((a:any) => a.status === "COMPLETED").length,
  };

  const handlePublish = async (auction: Auction) => {
    try {
      await updateAuctionStatus({
        id: auction.id,
        status: AuctionStatus.ACTIVE,
      });
      toast("Your auction is now live and accepting bids.");
    } catch (error: any) {
      toast("Failed to publish auction");
    }
  };

  const getEndDateDisplay = (auction: Auction) => {
    if (auction.status === "DRAFT") {
      return "Not started";
    } else if (auction.status === "ACTIVE") {
      return formatTimeLeft(new Date(auction.endDate)) + " remaining";
    } else {
      return `Ended on ${formatDate(new Date(auction.endDate))}`;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Auctions</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your auction listings</p>
          </div>
          <Button 
            onClick={() => setCreateAuctionOpen(true)}
          >
            <span className="text-xs mr-2">+</span>
            Create Auction
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "ALL" | AuctionStatus)}>
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="ALL">
              All ({countByStatus.ALL})
            </TabsTrigger>
            <TabsTrigger value="ACTIVE">
              Active ({countByStatus.ACTIVE})
            </TabsTrigger>
            <TabsTrigger value="DRAFT">
              Drafts ({countByStatus.DRAFT})
            </TabsTrigger>
            <TabsTrigger value="COMPLETED">
              Completed ({countByStatus.COMPLETED})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {isLoading ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Bid</TableHead>
                      <TableHead>Bids</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center">
                            <Skeleton className="h-10 w-10 rounded mr-4" />
                            <div>
                              <Skeleton className="h-5 w-36 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : filteredAuctions?.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
                <p className="text-gray-500 mb-6">
                  {selectedTab === "ALL" 
                    ? "You haven't created any auctions yet."
                    : `You don't have any ${selectedTab.toLowerCase()} auctions.`}
                </p>
                <Button onClick={() => setCreateAuctionOpen(true)}>
                  <span className="text-xs mr-2">+</span>
                  Create Your First Auction
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Bid</TableHead>
                      <TableHead>Bids</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuctions?.map((auction:any) => (
                      <TableRow key={auction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded">
                              <div className="h-10 w-10 rounded flex items-center justify-center text-gray-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
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
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{auction.title}</div>
                              <div className="text-gray-500">Created on {formatDate(new Date(auction.createdAt))}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={auction.status} />
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-900">
                            {formatCurrency(auction.currentPrice || auction.startPrice)}
                          </div>
                          <div className="text-gray-500">
                            {auction.status === "DRAFT" ? "Starting bid" : `${auction.bids?.length || 0} bids`}
                          </div>
                        </TableCell>
                        <TableCell>{auction.bids?.length || 0}</TableCell>
                        <TableCell>{getEndDateDisplay(auction)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            {auction.status === "DRAFT" ? (
                              <>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/auction/${auction.id}`}>Edit</Link>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePublish(auction)}
                                  disabled={isUpdatingStatus}
                                >
                                  {isUpdatingStatus ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Publish"
                                  )}
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/auction/${auction.id}`}>View</Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={createAuctionOpen} onOpenChange={setCreateAuctionOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Create New Auction</DialogTitle>
      <DialogDescription>
        Fill in the details below to create a new auction.
      </DialogDescription>
    </DialogHeader>
    <CreateAuctionForm onSuccess={() => setCreateAuctionOpen(false)} />
  </DialogContent>
</Dialog>

    </div>
  );
};

export default MyAuctionsPage;
