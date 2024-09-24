// src/app/employer/jobs/[id]/edit/page.tsx

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import EditJobForm from '@/components/EditJobForm'
import { redirect } from 'next/navigation'
import { Job } from '@/types/job'

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/signin')
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { categories: true },
  })

  if (!job) {
    return <div>Job not found</div>
  }

  const typedJob: Job = {
    ...job,
    salary: job.salary,
    location: job.location,
    type: job.type as Job['type'], // Assurez-vous que le type correspond
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Job</h1>
      <EditJobForm job={typedJob} />
    </div>
  )
}