'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) {
                setError('User ID is undefined');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch user profile: ${errorData.error || response.statusText}`);
                }
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (isLoading) return <p>Loading profile...</p>;
    if (error) return <ErrorDisplay message={error} />;
    if (!profile) return <ErrorDisplay message="User not found" />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <div className="h-48 w-full md:w-48 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="h-full w-full flex justify-center items-center">
                                <Avatar className="h-32 w-32 border-4 border-white">
                                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                                    <AvatarFallback className="text-4xl font-bold">
                                        {profile.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 flex-1">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Gamer Profile</div>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">{profile.name}</h1>
                        <p className="mt-4 text-gray-600">{profile.profile?.bio || 'No bio available.'}</p>
                    </div>
                </div>
                <CardContent className="px-8 py-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                            <p className="mt-2 text-gray-600">{profile.profile?.experience || 'No experience available.'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {profile.profile?.skills && profile.profile.skills.length > 0
                                    ? profile.profile.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                    ))
                                    : <span className="text-gray-600">No skills listed.</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Gaming Profiles</h3>
                        <div className="mt-2 space-y-2">
                            <ProfileLink name="Steam" profile={profile.profile?.steamProfile} />
                            <ProfileLink name="Twitch" profile={profile.profile?.twitchProfile} />
                            <ProfileLink name="Discord" profile={profile.profile?.discordProfile} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ProfileLink({ name, profile }: { name: string, profile?: string }) {
    if (!profile) return null;
    return (
        <a href={profile} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <span>{name}: {profile}</span>
        </a>
    );
}

function ErrorDisplay({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Card className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden">
                <CardContent className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{message}</p>
                </CardContent>
            </Card>
        </div>
    );
}
