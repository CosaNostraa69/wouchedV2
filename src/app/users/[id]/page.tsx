'use client'

import { useParams } from 'next/navigation'
import { PublicEmployerProfile } from '@/components/PublicEmployerProfile'

export default function PublicEmployerProfilePage() {
  const params = useParams()
  const employerId = params.id as string

  return (
    <div className="container mx-auto p-4">
      <PublicEmployerProfile employerId={employerId} />
    </div>
  )
}