// src/components/EmployerJobList.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  description: string
  salary: string
  location: string
  type: string
  categories: { name: string }[]
}

const EmployerJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/employer/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data.jobs)
      } catch (err) {
        setError('An error occurred while fetching jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description.substring(0, 100)}...</p>
            <div className="mt-4">
              <Link href={`/employer/jobs/${job.id}/edit`} className="text-blue-500 hover:underline mr-4">
                Edit
              </Link>
              <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmployerJobList