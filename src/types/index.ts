// User-related types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // Auction-related types
  export enum AuctionStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED"
  }
  
  export interface Auction {
    data: Auction;
    id: string;
    title: string;
    description: string;
    startPrice: number;
    currentPrice?: number;
    endDate: Date;
    status: AuctionStatus;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
    version?: number;
    user?: {
      id: string;
      name: string;
      email: string;
    };
    bids?: Bid[];
  }
  
  export interface CreateAuctionDto {
    title: string;
    description: string;
    startPrice: number;
    endDate: Date;
  }
  
  export interface UpdateAuctionDto {
    title?: string;
    description?: string;
    startPrice?: number;
    endDate?: Date;
  }
  
  // Bid-related types
  export interface Bid {
    data: Bid;
    id: string;
    amount: number;
    auctionId: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
    auction?: {
      id: string;
      title: string;
      currentPrice: number;
      status: AuctionStatus;
      endDate: Date;
    };
  }
  
  export interface CreateBidDto {
    amount: number;
    auctionId: string;
  }
  