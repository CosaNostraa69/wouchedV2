import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save the file
    const fileName = `avatar-${session.user.id}-${Date.now()}${path.extname(file.name)}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await writeFile(filePath, buffer)

    // Update user's avatar URL in the database
    const avatarUrl = `/uploads/${fileName}`
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: avatarUrl },
    })

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}