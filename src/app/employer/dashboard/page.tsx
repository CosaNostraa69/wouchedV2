import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import EmployerJobList from '@/components/EmployerJobList'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default async function EmployerDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/signin')
  }

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
          <EmployerJobList />
        </CardContent>
      </Card>
    </div>
  )
}