import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = `
INSERT INTO "Role" ("name", "createdAt", "updatedAt") VALUES
('Admin', NOW(), NOW()),
('SuperAdmin', NOW(), NOW()),
('Manager', NOW(), NOW()),
('Employee', NOW(), NOW());

  `;

  try {
    await prisma.$executeRawUnsafe(query);
    console.log('Roles inserted successfully');
  } catch (error) {
    console.error('Error inserting roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();