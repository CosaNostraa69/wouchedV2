// src/app/api/employers/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('API route hit, employer ID:', params.id)
  try {
    const employer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        company: true,
      },
    })

    console.log('Employer found:', employer)

    if (!employer) {
      console.log('Employer not found')
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 })
    }

    // Transformez les données pour correspondre à l'interface EmployerProfile
    const profileData = {
      id: employer.id,
      name: employer.name || '',
      avatarUrl: employer.image || '',
      rating: 0, // Vous devrez implémenter le calcul de la note moyenne
      reviewCount: 0, // Vous devrez implémenter le comptage des avis
      description: employer.company?.description || '',
      foundedYear: employer.company?.createdAt?.getFullYear() || new Date().getFullYear(),
      size: employer.company?.size || 'N/A',
      location: employer.company?.location || 'N/A',
      website: employer.company?.website || 'N/A',
    }

    console.log('Profile data to be returned:', profileData)
    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching employer:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}