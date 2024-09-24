// src/app/api/profile/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      company: {
        name: user.company?.name || '',
        description: user.company?.description || '',
        website: user.company?.website || '',
        foundedYear: user.company?.foundedYear || new Date().getFullYear(),
        size: user.company?.size || '',
        location: user.company?.location || '',
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, email, company } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        company: {
          upsert: {
            create: {
              name: company.name,
              description: company.description,
              website: company.website,
              foundedYear: company.foundedYear,
              size: company.size,
              location: company.location,
            },
            update: {
              name: company.name,
              description: company.description,
              website: company.website,
              foundedYear: company.foundedYear,
              size: company.size,
              location: company.location,
            },
          },
        },
      },
      include: { company: true },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.image,
        company: {
          name: updatedUser.company?.name || '',
          description: updatedUser.company?.description || '',
          website: updatedUser.company?.website || '',
          foundedYear: updatedUser.company?.foundedYear || new Date().getFullYear(),
          size: updatedUser.company?.size || '',
          location: updatedUser.company?.location || '',
        },
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}