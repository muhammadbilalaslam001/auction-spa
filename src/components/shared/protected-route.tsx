import { useAuth } from "../../hooks/useAuth";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

// export const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => {
export const ProtectedRoute = ({ path }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // return <Route path={path} component={Component} />;
  return <Route path={path} />;
};
