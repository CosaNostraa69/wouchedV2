'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            setProfileData({
              name: session.user.role === 'EMPLOYER' ? data.company.name : data.name,
              avatarUrl: data.avatarUrl
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    if (session) {
      fetchProfileData();
    }
  }, [session]);

  const displayName = profileData?.name || session?.user?.name || '';
  const avatarUrl = profileData?.avatarUrl || session?.user?.image || undefined;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/wouched.png" alt="Wouched Logo" width={40} height={40} />
            <span className="text-xl font-bold text-gray-800">Wouched</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-800">
                Companies <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-800">
                Freelancers <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/jobs" className="text-gray-600 hover:text-gray-800">Jobs</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.user.role === 'EMPLOYER' && (
                  <DropdownMenuItem asChild>
                    <Link href="/employer/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut()} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
                <Link href="/auth/register">Create my account</Link>
              </Button>
            </div>
          )}
          <select className="bg-transparent text-sm">
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
