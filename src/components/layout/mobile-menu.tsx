import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

const MobileMenu = ({ isOpen, toggle }: MobileMenuProps) => {
  const { user, logout } = useAuth();

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return ""; // Default fallback initial
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="pt-2 pb-3 space-y-1">
        <Link
          href="/"
          className="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          onClick={toggle}
        >
          Dashboard
        </Link>
        {user && (
          <>
            <Link
              href="/my-auctions"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={toggle}
            >
              My Auctions
            </Link>
          
          </>
        )}
      </div>

      {user ? (
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user.name}</div>
              <div className="text-sm font-medium text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                logout();
                toggle();
              }}
              className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-4">
            <Button asChild className="w-full" onClick={toggle}>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
