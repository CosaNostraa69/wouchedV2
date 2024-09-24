// src/components/EmployerJobList.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Job {
  id: string
  title: string
  description: string
  type: string
  location: string
  createdAt: string
}

export default function EmployerJobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/employer/jobs')
      const data = await res.json()
      setJobs(data.jobs)
    }
    fetchJobs()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setJobs(jobs.filter(job => job.id !== id))
        } else {
          throw new Error('Failed to delete job')
        }
      } catch (error) {
        console.error('Job deletion error:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{job.description.substring(0, 150)}...</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{job.type}</Badge>
                <Badge variant="outline">{job.location}</Badge>
              </div>
              <p className="text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/employer/jobs/${job.id}/edit`} passHref>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}