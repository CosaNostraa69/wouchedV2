// src/app/api/employer/jobs/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const jobs = await prisma.job.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        categories: true
      }
    })

    return NextResponse.json({ jobs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}