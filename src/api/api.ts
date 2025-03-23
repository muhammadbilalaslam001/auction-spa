import axios from "axios";
import { Auction, AuctionStatus, Bid, CreateAuctionDto, CreateBidDto, User } from "../types";
import { cookieUtils } from "@/utils/cookies";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",  
  withCredentials: true,
});

// Add an auth token interceptor
api.interceptors.request.use((config) => {
  const token = cookieUtils.getToken();
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<{ data: { access_token: string } }>("/api/auth/login", credentials);
    cookieUtils.setToken(response.data.data.access_token, 1)
    return response.data;
  },

  register: async (userData: { email: string; name: string; password: string }) => {
    await api.post("/api/auth/register", userData);
  },
  
  logout: () => {
    cookieUtils.removeToken();
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get<User>("/api/users/me");
      return response?.data?.data;
    } catch (error) {
      return null;
    }
  }
};

// Auctions API
export const auctionsApi = {
  getAll: async (params?: { 
    skip?: number; 
    take?: number; 
    status?: AuctionStatus;
    count?: boolean;
  }) => {
    const response = await api.get<Auction>("/api/auctions", { 
      params: { ...params, count: true } 
    });
    return response?.data?.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Auction>(`/api/auctions/${id}`);
    return response.data;
  },
  
  create: async (auctionData: CreateAuctionDto) => {
    const response = await api.post<Auction>("/api/auctions", auctionData);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Auction>) => {
    const response = await api.patch<Auction>(`/api/auctions/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<Auction>(`/api/auctions/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: AuctionStatus) => {
    const response = await api.patch<Auction>(`/api/auctions/${id}/status`, { status });
    return response.data;
  }
};

// Bids API
export const bidsApi = {
  create: async (bidData: CreateBidDto) => {
    const response = await api.post<Bid>("/api/bids", bidData);
    return response.data;
  },
  
  getByAuctionId: async (auctionId: string) => {
    const response = await api.get<Bid>(`/api/bids/auction/${auctionId}`);
    return response.data.data;
  },
  
  getUserBids: async () => {
    const response = await api.get<Bid[]>("/api/bids");
    return response.data;
  }
};

export default api;
