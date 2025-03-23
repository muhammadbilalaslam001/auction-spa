import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  user: User;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return ''; // Return empty string if name is undefined or empty

    return name
      .split(' ')
      .map(part => part[0] || '') // Handle cases where part is empty
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-expanded={open}
        >
          <span className="sr-only">Open user menu</span>
          <Avatar>
            <AvatarFallback className="bg-primary-100 text-primary-700">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="border-b border-gray-200 pb-2">
          <div className="font-medium">{user.name}</div>
          <div className="text-gray-500 text-xs truncate">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/my-auctions" className="cursor-pointer">
            My Auctions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-600 focus:text-red-700"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
