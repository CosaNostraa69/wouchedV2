'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Profile {
    bio: string;
    experience: string;
    skills: string[];
    steamProfile: string;
    twitchProfile: string;
    discordProfile: string;
}

interface ProfileData {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    profile: Profile;
}

interface UserProfileFormProps {
    initialData: Omit<ProfileData, 'profile'> & { profile?: Partial<Profile> };
}

export function UserProfileForm({ initialData }: UserProfileFormProps) {
    const [userId] = useState<string | null>(initialData.id || null)
    const { data: session, update } = useSession()
    const [profileData, setProfileData] = useState<ProfileData>({
        ...initialData,
        profile: {
            bio: initialData.profile?.bio || '',
            experience: initialData.profile?.experience || '',
            skills: initialData.profile?.skills || [],
            steamProfile: initialData.profile?.steamProfile || '',
            twitchProfile: initialData.profile?.twitchProfile || '',
            discordProfile: initialData.profile?.discordProfile || '',
        }
    })
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateSession = useCallback(() => {
        if (session?.user && (session.user.name !== profileData.name || session.user.image !== profileData.avatarUrl)) {
            update({
                ...session,
                user: {
                    ...session.user,
                    name: profileData.name,
                    image: profileData.avatarUrl,
                },
            })
        }
    }, [session, profileData.name, profileData.avatarUrl, update])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
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
                updateSession()
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
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!userId) {
            console.error('User ID is missing in initialData')
            toast({
                title: "Error",
                description: "User ID is missing. Please try reloading the page.",
                variant: "destructive",
            })
        }
    }, [userId])

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
                    updateSession()
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
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your personal information and gaming profiles</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={profileData.profile.bio}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, bio: e.target.value }
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Textarea
                            id="experience"
                            value={profileData.profile.experience}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, experience: e.target.value }
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <Input
                            id="skills"
                            value={profileData.profile.skills.join(', ')}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, skills: e.target.value.split(',').map(s => s.trim()) }
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="steamProfile">Steam Profile</Label>
                        <Input
                            id="steamProfile"
                            value={profileData.profile.steamProfile}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, steamProfile: e.target.value }
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitchProfile">Twitch Profile</Label>
                        <Input
                            id="twitchProfile"
                            value={profileData.profile.twitchProfile}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, twitchProfile: e.target.value }
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discordProfile">Discord Profile</Label>
                        <Input
                            id="discordProfile"
                            value={profileData.profile.discordProfile}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                profile: { ...profileData.profile, discordProfile: e.target.value }
                            })}
                        />
                    </div>
                    <CardFooter className="px-0 flex justify-between">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        {userId ? (
                            <Link href={`/users/${userId}`}>
                                <Button variant="outline">View Public Profile</Button>
                            </Link>
                        ) : (
                            <Button variant="outline" disabled>View Public Profile</Button>
                        )}
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    )
}
