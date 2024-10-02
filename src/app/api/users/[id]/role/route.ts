import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params

    // Vérification que l'ID est bien défini et valide
    if (!id || id === 'undefined') {
        return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                company: true, // Inclut les données d'entreprise si l'utilisateur est un EMPLOYER
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Si l'utilisateur est un EMPLOYER, renvoyer également les informations de l'entreprise
        if (user.role === 'EMPLOYER' && user.company) {
            return NextResponse.json({
                role: user.role,
                profile: user.profile,
                company: {
                    name: user.company.name,
                    description: user.company.description,
                    website: user.company.website,
                    foundedYear: user.company.foundedYear,
                    size: user.company.size,
                    location: user.company.location,
                }
            })
        }

        // Si l'utilisateur est un USER, ne renvoyer que les informations utilisateur
        return NextResponse.json({
            role: user.role,
            profile: user.profile,
        })

    } catch (error) {
        console.error('Error fetching user role:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
