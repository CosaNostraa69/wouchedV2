import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { EmployerJobList } from '@/components/EmployerJobList'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

async function getEmployerJobs(userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employers/${userId}/jobs`, { cache: 'no-store' })
  if (!response.ok) {
    console.error('Failed to fetch jobs:', await response.text())
    return []
  }
  return response.json()
}

export default async function EmployerDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/signin')
  }

  const jobs = await getEmployerJobs(session.user.id)

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Employer Dashboard</CardTitle>
          <CardDescription>Manage your job listings and post new opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Link href="/employer/jobs/create" passHref>
              <Button>Post New Job</Button>
            </Link>
          </div>
          <EmployerJobList jobs={jobs} isPublicView={false} />
        </CardContent>
      </Card>
    </div>
  )
}