// src/app/api/jobs/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, requirements, salary, location, type, categories } = await req.json()

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        type,
        categories: {
          set: [],
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
  
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    try {
      await prisma.job.delete({
        where: { id: params.id },
      })
  
      return NextResponse.json({ message: 'Job deleted successfully' })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
