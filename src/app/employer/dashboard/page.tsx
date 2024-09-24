import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import EmployerJobList from '@/components/EmployerJobList'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EmployerDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/signin')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
      <Link href="/employer/jobs/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Post New Job
      </Link>
      <EmployerJobList />
    </div>
  )
}