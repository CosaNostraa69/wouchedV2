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
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Internal Server Error', details: 'An unknown error occurred' }, { status: 500 })
    }
  }
}