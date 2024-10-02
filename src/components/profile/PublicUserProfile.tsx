'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



interface UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    profile: {
        bio: string;
        experience: string;
        skills: string[];
        steamProfile: string;
        twitchProfile: string;
        discordProfile: string;
    } | null;
}

interface PublicUserProfileProps {
    userId: string;
}

export function PublicUserProfile({ userId }: PublicUserProfileProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) {
                setError('User ID is undefined')
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch(`/api/users/${userId}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`Failed to fetch user profile: ${errorData.error || response.statusText}`)
                }
                const data = await response.json()
                console.log('Fetched profile data:', data)
                setProfile(data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setError(error instanceof Error ? error.message : 'An unknown error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfileData()
    }, [userId])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!profile) return <div>User not found</div>

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold">Bio</h3>
                <p>{profile.profile?.bio || 'No bio available.'}</p>

                <h3 className="font-semibold mt-4">Experience</h3>
                <p>{profile.profile?.experience || 'No experience available.'}</p>

                <h3 className="font-semibold mt-4">Skills</h3>
                <p>
                    {profile.profile?.skills && profile.profile.skills.length > 0
                        ? profile.profile.skills.join(', ')
                        : 'No skills listed.'}
                </p>


                <h3 className="font-semibold mt-4">Gaming Profiles</h3>
                <p><strong>Steam:</strong> {profile.profile?.steamProfile || 'Not provided'}</p>
                <p><strong>Twitch:</strong> {profile.profile?.twitchProfile || 'Not provided'}</p>
                <p><strong>Discord:</strong> {profile.profile?.discordProfile || 'Not provided'}</p>
            </CardContent>
        </Card>
    )
}
