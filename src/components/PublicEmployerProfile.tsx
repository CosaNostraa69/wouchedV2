'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EmployerJobList } from '@/components/EmployerJobList'
import { StarRating } from '@/components/StarRating'

interface EmployerProfile {
    id: string;
    name: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    company: {
        name: string;
        description: string;
        website: string;
        foundedYear: number;
        size: string;
        location: string;
    };
}

interface Review {
    id: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    date: string;
}

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    type: string;
    requirements: string[];
    salary: string;
    createdAt: string;
}

interface PublicEmployerProfileProps {
    employerId: string;
}

export function PublicEmployerProfile({ employerId }: PublicEmployerProfileProps) {
    const [profile, setProfile] = useState<EmployerProfile | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch profile data
                const profileResponse = await fetch(`/api/employers/${employerId}`)
                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch employer profile')
                }
                const profileData = await profileResponse.json()
                setProfile(profileData)

                // Fetch reviews
                const reviewsResponse = await fetch(`/api/employers/${employerId}/reviews`)
                if (!reviewsResponse.ok) {
                    console.warn('Failed to fetch reviews:', await reviewsResponse.text())
                    setReviews([])
                } else {
                    const reviewsData = await reviewsResponse.json()
                    setReviews(reviewsData)
                }

                // Fetch jobs
                const jobsResponse = await fetch(`/api/employers/${employerId}/jobs`)
                if (!jobsResponse.ok) {
                    console.warn('Failed to fetch jobs:', await jobsResponse.text())
                    setJobs([])
                } else {
                    const jobsData = await jobsResponse.json()
                    setJobs(jobsData)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setError(error instanceof Error ? error.message : 'An unknown error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfileData()
    }, [employerId])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!profile) return <div>Employer not found</div>

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                        <StarRating rating={profile.rating} />
                        <span>{profile.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({profile.reviewCount} avis)</span>
                    </div>
                </div>
                <Button className="ml-auto">Suivre</Button>
                <Button variant="outline">Soumettre un avis</Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="about">
                    <TabsList>
                        <TabsTrigger value="about">À propos</TabsTrigger>
                        <TabsTrigger value="reviews">Avis</TabsTrigger>
                        <TabsTrigger value="jobs">Annonces</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about">
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <h3 className="font-semibold">Date de création</h3>
                                <p>{profile.company?.foundedYear || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Taille de l'entreprise</h3>
                                <p>{profile.company?.size || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Siège social</h3>
                                <p>{profile.company?.location || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Site web</h3>
                                {profile.company?.website ? (
                                    <a href={profile.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {profile.company.website}
                                    </a>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Qui sommes-nous?</h3>
                            <p>{profile.company?.description || 'Aucune description disponible.'}</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="reviews">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <Card key={review.id} className="mb-4">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>{review.title}</CardTitle>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="text-sm text-gray-500">{review.author} - {review.date}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{review.content}</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p>No reviews available.</p>
                        )}
                    </TabsContent>
                    <TabsContent value="jobs">
                        <EmployerJobList jobs={jobs} isPublicView={true} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}