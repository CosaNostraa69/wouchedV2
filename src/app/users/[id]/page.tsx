import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PublicUserProfile } from '@/components/profile/PublicUserProfile'
import { PublicEmployerProfile } from '@/components/PublicEmployerProfile'
import prisma from '@/lib/prisma'
import { Company, UserProfile, PublicEmployerProfileProps, PublicUserProfileProps } from '@/types/profile'

async function getUserProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true, company: true }
  })

  if (!user) {
    notFound()
  }

  return user
}

function ProfileLoading() {
  return <div>Loading profile...</div>
}

async function ProfileContent({ id }: { id: string }) {
  const user = await getUserProfile(id)

  if (user.role === 'EMPLOYER' && user.company) {
    const employerProps: PublicEmployerProfileProps = {
      employerId: id,
      company: user.company as Company
    }
    return <PublicEmployerProfile {...employerProps} />
  } else if (user.profile) {
    const userProps: PublicUserProfileProps = {
      userId: id,
      profile: user.profile as UserProfile
    }
    return <PublicUserProfile {...userProps} />
  } else {
    return <div>Invalid user profile</div>
  }
}

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id || id === 'undefined') {
    notFound()
  }

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent id={id} />
    </Suspense>
  )
}