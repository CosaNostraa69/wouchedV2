// src/app/api/employers/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        company: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = {
      id: user.id,
      name: user.name,
      avatarUrl: user.image,
      rating: 0, // Vous devrez implémenter le calcul de la note
      reviewCount: 0, // Vous devrez implémenter le comptage des avis
      company: {
        name: user.company?.name || 'N/A',
        description: user.company?.description || 'N/A',
        website: user.company?.website || 'N/A',
        foundedYear: user.company?.createdAt?.getFullYear() || 'N/A',
        size: user.company?.size || 'N/A',
        location: user.company?.location || 'N/A',
      },
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching employer profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}