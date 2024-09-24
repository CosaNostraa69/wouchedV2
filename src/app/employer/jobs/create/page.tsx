import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import JobPostForm from '@/components/JobPostForm'
import { redirect } from 'next/navigation'

export default async function CreateJobPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      <JobPostForm />
    </div>
  )
}