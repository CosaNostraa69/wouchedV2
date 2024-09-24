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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description.substring(0, 100)}...</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500 mr-2">{job.location}</span>
                <span className="text-sm text-gray-500 mr-2">{job.type}</span>
                <span className="text-sm text-gray-500">{job.salary}</span>
              </div>
              <div className="mt-2">
                {job.categories.map((category) => (
                  <span key={category.name} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {category.name}
                  </span>
                ))}
              </div>
              <Link href={`/employer/jobs/${job.id}/edit`} className="text-blue-500 hover:underline mr-2">
                Edit
              </Link>
              <button onClick={() => {/* Add delete functionality */}} className="text-red-500 hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EmployerJobList