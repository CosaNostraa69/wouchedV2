'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { EmployerProfileForm } from '@/components/profile/EmployerProfileForm'
import { UserProfileForm } from '@/components/profile/UserProfileForm'
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfileData()
    }
  }, [status, session, router])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      } else {
        throw new Error('Failed to fetch profile data')
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profileData) {
    return <div>Error loading profile data</div>
  }

  return (
    <div className="container mx-auto p-4">
      {session?.user.role === 'EMPLOYER' ? (
        <EmployerProfileForm initialData={profileData} userId={session.user.id} />
      ) : (
        <UserProfileForm initialData={profileData} />
      )}
    </div>
  )
}