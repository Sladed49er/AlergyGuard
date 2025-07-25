// app/test-db.ts
// This is a quick test to verify our database connection works
// We'll delete this file after testing

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Test creating a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('Created user:', user)

    // Test reading users
    const users = await prisma.user.findMany()
    console.log('All users:', users)

    // Clean up - delete the test user
    await prisma.user.delete({
      where: {
        email: 'test@example.com',
      },
    })
    console.log('Test user deleted')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()