'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JobPostForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('FULL_TIME')
  const [categories, setCategories] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requirements: requirements.split(',').map(req => req.trim()),
          salary,
          location,
          type,
          categories: categories.split(',').map(cat => cat.trim()),
        }),
      })
      if (res.ok) {
        router.push('/employer/jobs')
      } else {
        throw new Error('Failed to create job')
      }
    } catch (error) {
      console.error('Job creation error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Job Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Job Description"
        required
      />
      <input
        type="text"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        placeholder="Requirements (comma-separated)"
        required
      />
      <input
        type="text"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Salary"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="FREELANCE">Freelance</option>
      </select>
      <input
        type="text"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        placeholder="Categories (comma-separated)"
        required
      />
      <button type="submit">Post Job</button>
    </form>
  )
}