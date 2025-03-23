import { Switch, Route,Redirect  } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page"
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import MyAuctionsPage from "@/pages/my-auctions-page";
import AuctionPage from "@/pages/auction-page";
import Header from "./components/layout/header";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "@/context/AuthContext";

function Router() {
  const { user } = useAuth();
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login">
        {user ? <Redirect to="/" /> : <LoginPage />}
      </Route>
      <Route path="/register">
        {user ? <Redirect to="/" /> : <RegisterPage />}
      </Route>
      <Route path="/auction/:id" component={AuctionPage} />
      <ProtectedRoute path="/my-auctions" component={MyAuctionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Router />
        </main>
      </div>
    </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
