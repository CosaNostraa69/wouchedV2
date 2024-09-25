'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  company: {
    name: string;
    description: string;
    website: string;
    foundedYear: number;
    size: string;
    location: string;
  };
}

interface EmployerProfileFormProps {
  initialData: ProfileData;
  userId: string;
}

export function EmployerProfileForm({ initialData, userId }: EmployerProfileFormProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        router.refresh()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)

      try {
        const response = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const { avatarUrl } = await response.json()
          setProfileData(prev => ({ ...prev, avatarUrl }))
          toast({
            title: "Success",
            description: "Avatar updated successfully",
          })
        } else {
          throw new Error('Failed to upload avatar')
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
        toast({
          title: "Error",
          description: "Failed to upload avatar",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employer Profile</CardTitle>
        <CardDescription>Manage your personal and company information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="company">Company Information</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="personal" className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatarUrl} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                  Change Avatar
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
            </TabsContent>
            <TabsContent value="company" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={profileData.company.name}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, name: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={profileData.company.description}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, description: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={profileData.company.website}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, website: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={profileData.company.foundedYear}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, foundedYear: parseInt(e.target.value)}})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Input
                  id="companySize"
                  value={profileData.company.size}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, size: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLocation">Company Location</Label>
                <Input
                  id="companyLocation"
                  value={profileData.company.location}
                  onChange={(e) => setProfileData({...profileData, company: {...profileData.company, location: e.target.value}})}
                />
              </div>
            </TabsContent>
            <CardFooter className="mt-4 flex justify-between">
              <Button type="submit">Save Changes</Button>
              <Link href={`/users/${userId}`} passHref>
                <Button variant="outline">View Public Profile</Button>
              </Link>
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}