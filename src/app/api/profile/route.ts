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
    // Récupérer les données de l'utilisateur et inclure son profil et sa société (le cas échéant)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        profile: true,  // Inclure le profil utilisateur
        company: true,  // Inclure l'entreprise si l'utilisateur est un employeur
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Construire une réponse en fonction du rôle de l'utilisateur
    const response = {
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      role: user.role,
      profile: user.profile ? { // Inclure le profil si l'utilisateur a un profil
        bio: user.profile.bio || '',
        experience: user.profile.experience || '',
        skills: user.profile.skills || [],
        steamProfile: user.profile.steamProfile || '',
        twitchProfile: user.profile.twitchProfile || '',
        discordProfile: user.profile.discordProfile || '',
      } : null,
      company: user.company ? { // Inclure les informations de l'entreprise si l'utilisateur a une entreprise
        name: user.company.name,
        description: user.company.description || '',
        website: user.company.website || '',
        foundedYear: user.company.foundedYear || new Date().getFullYear(),
        size: user.company.size || '',
        location: user.company.location || '',
      } : null,
    }

    return NextResponse.json(response)

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
    const { name, email, profile, company } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        profile: {
          upsert: {
            create: {
              bio: profile?.bio || '',
              experience: profile?.experience || '',
              skills: profile?.skills || [],
              steamProfile: profile?.steamProfile || '',
              twitchProfile: profile?.twitchProfile || '',
              discordProfile: profile?.discordProfile || '',
            },
            update: {
              bio: profile?.bio || '',
              experience: profile?.experience || '',
              skills: profile?.skills || [],
              steamProfile: profile?.steamProfile || '',
              twitchProfile: profile?.twitchProfile || '',
              discordProfile: profile?.discordProfile || '',
            },
          },
        },
        company: company ? {
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
        } : undefined, // Ne pas modifier la société si `company` est null
      },
      include: { profile: true, company: true },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.image,
        role: updatedUser.role,
        profile: updatedUser.profile ? {
          bio: updatedUser.profile.bio,
          experience: updatedUser.profile.experience,
          skills: updatedUser.profile.skills,
          steamProfile: updatedUser.profile.steamProfile,
          twitchProfile: updatedUser.profile.twitchProfile,
          discordProfile: updatedUser.profile.discordProfile,
        } : null,
        company: updatedUser.company ? {
          name: updatedUser.company.name,
          description: updatedUser.company.description,
          website: updatedUser.company.website,
          foundedYear: updatedUser.company.foundedYear,
          size: updatedUser.company.size,
          location: updatedUser.company.location,
        } : null,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
