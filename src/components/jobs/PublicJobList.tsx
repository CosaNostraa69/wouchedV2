'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Job {
  id: string
  title: string
  description: string
  company: { 
    id: string
    name: string 
  }
  type: string
  location: string
  salary: string
  categories?: { name: string }[]  // Make categories optional
}

export default function PublicJobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        console.log('API response:', data)
        if (Array.isArray(data)) {
          setJobs(data)
        } else if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs)
        } else {
          console.error('Unexpected data structure:', data)
          setError('Unexpected data structure received from API')
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('An error occurred while fetching jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Latest Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No job listings available at the moment.</p>
      ) : (
        jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{job.company?.name || 'Company name not available'}</p>
              <p className="text-gray-600 mb-2">{job.description ? job.description.substring(0, 150) + '...' : 'No description available'}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.type && <Badge variant="secondary">{job.type}</Badge>}
                {job.location && <Badge variant="outline">{job.location}</Badge>}
                {job.salary && <Badge variant="outline">{job.salary}</Badge>}
              </div>
              {job.categories && job.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.categories.map((category) => (
                    <Badge key={category.name} variant="secondary">{category.name}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/jobs/${job.id}`} passHref>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}