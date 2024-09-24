// src/components/EmployerJobList.tsx

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Job {
  id: string
  title: string
  description: string
  type: string
  requirements: string[]
  salary: string
  location: string
  createdAt: string
}

interface EmployerJobListProps {
  initialJobs: Job[]
  isPublicView?: boolean
}

export const EmployerJobList: React.FC<EmployerJobListProps> = ({ initialJobs = [], isPublicView = false }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Remove the deleted job from the local state
        setJobs(jobs.filter(job => job.id !== id))
        console.log('Job deleted successfully')
      } else {
        throw new Error('Failed to delete job')
      }
    } catch (error) {
      console.error('Job deletion error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {isPublicView ? "Current Job Listings" : "Your Job Listings"}
      </h2>
      {jobs.length === 0 ? (
        <p>{isPublicView ? "No jobs currently listed." : "You haven't posted any jobs yet."}</p>
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
              {isPublicView ? (
                <Link href={`/jobs/${job.id}`} passHref>
                  <Button variant="outline">View Details</Button>
                </Link>
              ) : (
                <>
                  <Link href={`/employer/jobs/${job.id}/edit`} passHref>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your job listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(job.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}