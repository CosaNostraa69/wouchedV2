'use client'

import {  SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const predefinedCategories = [
  "Game Development",
  "Game Design",
  "3D Modeling",
  "Animation",
  "Programming",
  "Art & Illustration",
  "Sound Design",
  "Quality Assurance",
  "Project Management",
  "Marketing",
  "Community Management",
  "Esports",
  "Streaming",
  "Virtual Reality",
  "Augmented Reality",
]

export default function JobPostForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('FULL_TIME')
  const [categories, setCategories] = useState<string[]>([])
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
          categories,
        }),
      })
      if (res.ok) {
        router.push('/employer/dashboard')
      } else {
        throw new Error('Failed to create job')
      }
    } catch (error) {
      console.error('Job creation error:', error)
    }
  }

  function handleCategoryChange(value: string): void {
    setCategories(prev => 
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>Fill in the details to create a new job listing.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Input
              id="requirements"
              value={requirements}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setRequirements(e.target.value)}
              placeholder="Separate with commas"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSalary(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select value={type} onValueChange={setType}>
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
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {predefinedCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(category => (
                <Badge 
                  key={category} 
                  variant="secondary"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                  <span className="ml-1 cursor-pointer">×</span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Post Job</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
