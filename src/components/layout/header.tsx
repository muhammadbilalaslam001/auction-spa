import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from './user-menu';
import MobileMenu from './mobile-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gavel } from 'lucide-react';
import CreateAuctionForm from '../auctions/create-auction-form';

const Header = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createAuctionOpen, setCreateAuctionOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Gavel className="text-primary-600 h-6 w-6 mr-2" />
              <span className="text-xl font-bold text-gray-900">BidNest</span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className={`${
                  location === '/'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              {user && (
                <>
                  <Link
                    href="/my-auctions"
                    className={`${
                      location === '/my-auctions'
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    My Auctions
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User menu (desktop) */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="mr-4"
                  onClick={() => setCreateAuctionOpen(true)}
                >
                  <span className="text-xs mr-2">+</span>
                  Create Auction
                </Button>
                <UserMenu user={user} />
              </>
            ) : (
              <Button variant="default" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {user && (
              <Button
                size="sm"
                variant="ghost"
                className="mr-2"
                onClick={() => setCreateAuctionOpen(true)}
              >
                <span className="text-xs mr-1">+</span>
                Create
              </Button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} toggle={toggleMobileMenu} />

      {/* Create Auction Dialog */}
      <Dialog open={createAuctionOpen} onOpenChange={setCreateAuctionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Auction</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new auction.
            </DialogDescription>
          </DialogHeader>
          <CreateAuctionForm onSuccess={() => setCreateAuctionOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
