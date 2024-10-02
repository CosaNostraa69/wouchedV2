import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        company: {
          select: {
            name: true,
            description: true,
            website: true,
            foundedYear: true,
            size: true,
            location: true,
          }
        },
        profile: {
          select: {
            bio: true,
            experience: true,
            skills: true,
            steamProfile: true,
            twitchProfile: true,
            discordProfile: true,
          }
        },
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const baseUserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      role: user.role,
    }

    if (user.role === 'EMPLOYER') {
      return NextResponse.json({
        ...baseUserInfo,
        company: user.company,
      })
    } else {
      return NextResponse.json({
        ...baseUserInfo,
        profile: user.profile,
      })
    }

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}