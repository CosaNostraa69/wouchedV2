'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/ui/mode-toggle'  

const Header = () => {
  const { data: session, status } = useSession()
  const [profileData, setProfileData] = useState<{ name: string; avatarUrl: string } | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            const data = await response.json()
            setProfileData({
              name: session.user.role === 'EMPLOYER' ? data.company.name : data.name,
              avatarUrl: data.avatarUrl
            })
          }
        } catch (error) {
          console.error('Error fetching profile data:', error)
        }
      }
    }

    if (session) {
      fetchProfileData()
    }
  }, [session])

  const displayName = profileData?.name || session?.user?.name || ''
  const avatarUrl = profileData?.avatarUrl || session?.user?.image || undefined

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/wouched.png" alt="Wouched Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold">Wouched</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/jobs" className="hover:text-gray-300 transition-colors">Jobs</Link>
          <ModeToggle />
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
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
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header