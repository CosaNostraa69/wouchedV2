'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job, JobType } from '@/types/job'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function EditJobForm({ job }: { job: Job }) {
  const [title, setTitle] = useState(job.title)
  const [description, setDescription] = useState(job.description)
  const [requirements, setRequirements] = useState(job.requirements.join(', '))
  const [salary, setSalary] = useState(job.salary ?? '')
  const [location, setLocation] = useState(job.location ?? '')
  const [type, setType] = useState<JobType>(job.type)
  const [categories, setCategories] = useState(job.categories.map(c => c.name).join(', '))
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requirements: requirements.split(',').map(req => req.trim()),
          salary: salary || null,
          location: location || null,
          type,
          categories: categories.split(',').map(cat => cat.trim()),
        }),
      })
      if (res.ok) {
        router.push('/employer/dashboard')
      } else {
        throw new Error('Failed to update job')
      }
    } catch (error) {
      console.error('Job update error:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Job</CardTitle>
        <CardDescription>Make changes to your job posting here.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Input
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Requirements (comma-separated)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Salary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select value={type} onValueChange={(value: JobType) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categories">Categories</Label>
            <Input
              id="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Categories (comma-separated)"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Update Job</Button>
        </CardFooter>
      </form>
    </Card>
  )
}