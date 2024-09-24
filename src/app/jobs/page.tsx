import PublicJobList from '@/components/jobs/PublicJobList'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function JobsPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>Explore the latest job opportunities in esports and gaming.</CardDescription>
        </CardHeader>
        <CardContent>
          <PublicJobList />
        </CardContent>
      </Card>
    </div>
  )
}