// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider } from '@/context/AuthContext';
// import { AppRoutes } from '@/router';

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-100">
//           <AppRoutes />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;




import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page"
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import MyAuctionsPage from "@/pages/my-auctions-page";
import AuctionPage from "@/pages/auction-page";
// import AuthPage from "@/pages/auth-page";
import Header from "./components/layout/header";
// import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "@/context/AuthContext";

function Router() {
  const { user } = useAuth();
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/auth">{user ? <Route path="/" /> : <RegisterPage />}</Route>
      <Route path="/auction/:id" component={AuctionPage} />
      <Route path="/my-auctions" component={MyAuctionsPage} />
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
