'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  company?: {
    name: string
    description: string | null
    website: string | null
  }
}

export default function PublicProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.image || undefined} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <p>{profile.email}</p>
          </div>
          {profile.role === 'EMPLOYER' && profile.company && (
            <>
              <div>
                <Label>Company</Label>
                <p>{profile.company.name}</p>
              </div>
              {profile.company.description && (
                <div>
                  <Label>Company Description</Label>
                  <p>{profile.company.description}</p>
                </div>
              )}
              {profile.company.website && (
                <div>
                  <Label>Website</Label>
                  <a href={profile.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.company.website}
                  </a>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}