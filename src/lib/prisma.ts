import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Test the database connection
prisma.$connect()
  .then(() => console.log('Successfully connected to the database'))
  .catch((e) => console.error('Failed to connect to the database', e))

export default prisma