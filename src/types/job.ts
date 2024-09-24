// src/types/job.ts

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE'

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  salary: string | null
  location: string | null
  type: JobType
  categories: { id: string; name: string }[]
  createdAt: Date
  updatedAt: Date
  companyId: string
  userId: string
}