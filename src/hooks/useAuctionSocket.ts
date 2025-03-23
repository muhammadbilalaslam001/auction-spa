import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
interface AuctionUpdate {
  currentPrice: number;
  highestBid: {
    id: string;
    amount: number;
    userId: string;
    createdAt: string;
  };
}
interface UseAuctionSocketProps {
  token: string;
  auctionId?: string;
  onAuctionUpdate?: (data: AuctionUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}
export const useAuctionSocket = ({
  token,
  auctionId,
  onAuctionUpdate,
  onConnect,
  onDisconnect,
  onError,
}: UseAuctionSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  // Initialize socket connection
  useEffect(() => {
    if (!token) return;
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
    });
    // Connection events
    socketRef.current.on('connect', () => {
      onConnect?.();
    });
    socketRef.current.on('connect_error', (error: Error) => {
      console.error('Connection error:', error.message);
      onError?.(error);
    });
    socketRef.current.on('disconnect', (reason: string) => {
      onDisconnect?.(reason);
    });
    // Auction update event
    socketRef.current.on('auctionUpdate', (data: AuctionUpdate) => {
      onAuctionUpdate?.(data);
    });
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, onConnect, onDisconnect, onError, onAuctionUpdate]);
  // Join auction room when auctionId changes
  useEffect(() => {
    if (socketRef.current && auctionId) {
      socketRef.current.emit('joinAuction', auctionId);
    }
    return () => {
      if (socketRef.current && auctionId) {
        socketRef.current.emit('leaveAuction', auctionId);
      }
    };
  }, [auctionId]);
  // Helper functions
  const joinAuction = useCallback((id: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinAuction', id);
    }
  }, []);
  const leaveAuction = useCallback((id: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveAuction', id);
    }
  }, []);
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    joinAuction,
    leaveAuction,
    disconnect,
    isConnected: socketRef.current?.connected ?? false,
  };
};
