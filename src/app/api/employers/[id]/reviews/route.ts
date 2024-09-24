import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Fetching reviews for employer ID:', params.id)
  try {
    const reviews = await prisma.review.findMany({
      where: { employerId: params.id },
      orderBy: { createdAt: 'desc' },
    })
    console.log('Reviews found:', reviews)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}