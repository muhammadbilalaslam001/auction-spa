import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bid, CreateBidDto } from "@/types";
import { bidsApi } from "@/api/api";

export function useBids(auctionId?: string) {
  const queryClient = useQueryClient();
  
  // Get bids for an auction
  const {
    data, 
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bids", auctionId],
    queryFn: async () => {
      const response = await bidsApi.getByAuctionId(auctionId!);
      return response;
    },
    enabled: !!auctionId,
  });  

  const bids = data || [];


  // Create bid mutation
  const {
    mutateAsync: createBid,
    isPending: isCreatingBid,
    error: createBidError,
  } = useMutation({
    mutationFn: (data: CreateBidDto) => bidsApi.create(data),
    onSuccess: () => {
      if (auctionId) {
        queryClient.invalidateQueries({ queryKey: ["bids", auctionId] });
        queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      }
      queryClient.invalidateQueries({ queryKey: ["userBids"] });
    },
  });

  return {
    bids,
    isLoading,
    error,
    refetch,
    createBid,
    isCreatingBid,
    createBidError,
  };
}

export function useUserBids() {
  // Get bids for the current user
  const {
    data: userBids = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Bid[]>({
    queryKey: ["userBids"],
    queryFn: () => bidsApi.getUserBids(),
  });

  return {
    userBids,
    isLoading,
    error,
    refetch,
  };
}
