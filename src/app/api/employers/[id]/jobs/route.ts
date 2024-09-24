import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        type: true,
        requirements: true,
        salary: true,
        createdAt: true,
      },
    })
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}