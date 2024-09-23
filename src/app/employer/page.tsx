import JobPostForm from '@/components/JobPostForm'

export default function EmployerPage() {
  return (
    <div>
      <h1>Employer Dashboard</h1>
      <p>Welcome to the employer area. Only employers should be able to see this page.</p>
      <h2>Post a New Job</h2>
      <JobPostForm />
    </div>
  )
}