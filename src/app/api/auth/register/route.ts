import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { User, Company } from '@prisma/client'

type UserWithCompany = User & { company: Company | null }

export async function POST(req: Request) {
  try {
    const { name, email, password, role, companyName } = await req.json()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    let user: User | UserWithCompany

    if (role === 'EMPLOYER') {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          company: {
            create: {
              name: companyName,
            },
          },
        },
        include: {
          company: true,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      })
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: role === 'EMPLOYER' ? (user as UserWithCompany).company?.name : undefined,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 })
  }
}
