import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Auction, AuctionStatus, CreateAuctionDto } from '@/types';
import { auctionsApi } from '@/api/api';

export function useAuctions(params?: { skip?: number; take?: number; status?: AuctionStatus }) {
  const queryClient = useQueryClient();

  // Get all auctions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['auctions', params],
    queryFn: async () => {
      const response = await auctionsApi.getAll(params);
      return response;
    },
  });

  const auctions = data || [];

  // Create auction mutation
  const {
    mutateAsync: createAuction,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: (data: CreateAuctionDto) => auctionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  // Update auction mutation
  const {
    mutateAsync: updateAuction,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Auction> }) =>
      auctionsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
    },
  });

  // Delete auction mutation
  const {
    mutateAsync: deleteAuction,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => auctionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  // Update auction status mutation
  const {
    mutateAsync: updateAuctionStatus,
    isPending: isUpdatingStatus,
    error: updateStatusError,
  } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AuctionStatus }) =>
      auctionsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
    },
  });

  return {
    auctions,
    isLoading,
    error,
    refetch,
    createAuction,
    isCreating,
    createError,
    updateAuction,
    isUpdating,
    updateError,
    deleteAuction,
    isDeleting,
    deleteError,
    updateAuctionStatus,
    isUpdatingStatus,
    updateStatusError,
  };
}

export function useAuction(id: string) {
  const queryClient = useQueryClient();

  const {
    data: auction,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auction', id],
    queryFn: async () => {
      const response = await auctionsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Update auction mutation
  const {
    mutateAsync: updateAuction,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: (data: Partial<Auction>) => auctionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', id] });
    },
  });

  // Delete auction mutation
  const {
    mutateAsync: deleteAuction,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: () => auctionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  // Update auction status mutation
  const {
    mutateAsync: updateAuctionStatus,
    isPending: isUpdatingStatus,
    error: updateStatusError,
  } = useMutation({
    mutationFn: (status: AuctionStatus) => auctionsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', id] });
    },
  });

  return {
    auction,
    isLoading,
    error,
    refetch,
    updateAuction,
    isUpdating,
    updateError,
    deleteAuction,
    isDeleting,
    deleteError,
    updateAuctionStatus,
    isUpdatingStatus,
    updateStatusError,
  };
}
