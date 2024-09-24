// src/app/api/profile/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { useSession } from 'next-auth/react'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
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
        name: user.company?.name,
        description: user.company?.description,
        website: user.company?.website,
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  console.log('PUT /api/profile - Start')
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('PUT /api/profile - Unauthorized: No session')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, email, company } = await req.json()
    console.log('Received data:', { name, email, company })

    let updatedUser

    if (session.user.role === 'EMPLOYER') {
      updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
          company: {
            update: {
              name: company.name,
              description: company.description,
              website: company.website,
            },
          },
        },
        include: { company: true },
      })
    } else {
      updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { name, email },
      })
    }

    console.log('Updated user:', updatedUser)

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}