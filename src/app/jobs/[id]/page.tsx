import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      categories: true,
    },
  })
  return job
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const job = await getJob(params.id)

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-2">{job.company.name}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{job.type}</Badge>
            <Badge variant="outline">{job.location}</Badge>
            {job.salary && <Badge variant="outline">{job.salary}</Badge>}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p>{job.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Requirements</h3>
              <ul className="list-disc list-inside">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Categories</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {job.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">{category.name}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {session ? (
            <Button>Apply Now</Button>
          ) : (
            <Button variant="outline">Sign in to Apply</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}