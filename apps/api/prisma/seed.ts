import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      credentials: {
        create: {
          type: 'EMAIL',
          provider: 'EMAIL',
          providerId: 'test@example.com',
          passwordHash: passwordHash,
        },
      },
    },
  });

  console.log(`✅ Created test user: ${testUser.email} (ID: ${testUser.id})`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
