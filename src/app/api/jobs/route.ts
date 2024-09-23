import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, requirements, salary, location, type, categories } = await req.json()

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        type,
        company: { connect: { id: session.user.companyId } },
        user: { connect: { id: session.user.id } },
        categories: {
          connectOrCreate: categories.map((category: string) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
      },
    })

    return NextResponse.json({ job })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}