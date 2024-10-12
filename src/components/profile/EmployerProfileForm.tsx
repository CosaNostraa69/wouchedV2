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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-800 text-white p-6">
          <CardTitle className="text-2xl font-semibold">Employer Profile</CardTitle>
          <CardDescription className="text-gray-300 mt-1">Manage your personal and company information</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-md">
              <TabsTrigger value="personal" className="px-4 py-2 text-sm font-medium">Personal Information</TabsTrigger>
              <TabsTrigger value="company" className="px-4 py-2 text-sm font-medium">Company Information</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="personal" className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24 rounded-full border-4 border-gray-200">
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="text-2xl font-bold bg-gray-300 text-gray-600">{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                  >
                    Change Avatar
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="company" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profileData.company.name}
                      onChange={(e) => setProfileData({...profileData, company: {...profileData.company, name: e.target.value}})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite" className="text-sm font-medium text-gray-700">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={profileData.company.website}
                      onChange={(e) => setProfileData({...profileData, company: {...profileData.company, website: e.target.value}})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyDescription" className="text-sm font-medium text-gray-700">Company Description</Label>
                  <Textarea
                    id="companyDescription"
                    value={profileData.company.description}
                    onChange={(e) => setProfileData({...profileData, company: {...profileData.company, description: e.target.value}})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear" className="text-sm font-medium text-gray-700">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      value={profileData.company.foundedYear}
                      onChange={(e) => setProfileData({...profileData, company: {...profileData.company, foundedYear: parseInt(e.target.value)}})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="text-sm font-medium text-gray-700">Company Size</Label>
                    <Input
                      id="companySize"
                      value={profileData.company.size}
                      onChange={(e) => setProfileData({...profileData, company: {...profileData.company, size: e.target.value}})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyLocation" className="text-sm font-medium text-gray-700">Company Location</Label>
                    <Input
                      id="companyLocation"
                      value={profileData.company.location}
                      onChange={(e) => setProfileData({...profileData, company: {...profileData.company, location: e.target.value}})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
              <CardFooter className="mt-8 flex justify-between items-center border-t pt-6">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out"
                >
                  Save Changes
                </Button>
                <Link href={`/users/${userId}`} passHref>
                  <Button 
                    variant="outline"
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md transition duration-300 ease-in-out"
                  >
                    View Public Profile
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}