import { createContext, ReactNode, useState, useEffect } from "react";
import { User } from "@/types";
import { authApi } from "@/api/api";
import { cookieUtils } from "@/utils/cookies";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  joinAuction: (id: string) => void;
  leaveAuction: (id: string) => void;
  isConnected: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  joinAuction: () => {},
  leaveAuction: () => {},
  isConnected: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = cookieUtils.getToken();

  const { joinAuction, leaveAuction, disconnect, isConnected } = useAuctionSocket({
    token: token || "",
    onAuctionUpdate: () => {
      {}
    },
    onConnect: () => {},
    onDisconnect: () => {},
    onError: (err) => console.error("WebSocket Error:", err),
  });


  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const currentUser = await authApi.getCurrentUser();
          if (currentUser) setUser(currentUser);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    return () => {
      disconnect(); // Ensure socket disconnects on unmount
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authApi.login({ email, password });
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Login error:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await authApi.register({ name, email, password });
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        joinAuction,
        leaveAuction,
        isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
