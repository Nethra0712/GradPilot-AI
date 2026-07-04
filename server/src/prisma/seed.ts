import {
  DocumentStatus,
  DocumentType,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from '@prisma/client';
import prisma, { disconnectPrisma } from './client';
import { logger } from '../utils/logger';

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Development seed cannot run in production.');
  }

  // Clear existing data in correct dependency order
  await prisma.subscription.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.aIGeneration.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gradpilot.ai',
      fullName: 'GradPilot Admin',
      password: null,
      role: UserRole.ADMIN,
      subscriptionTier: SubscriptionPlan.PRO,
      subscription: {
        create: {
          plan: SubscriptionPlan.PRO,
          status: SubscriptionStatus.ACTIVE,
        },
      },
    },
  });

  // Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@gradpilot.ai',
      fullName: 'Demo Student',
      password: null,
      role: UserRole.USER,
      subscriptionTier: SubscriptionPlan.FREE,
      subscription: {
        create: {
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.ACTIVE,
        },
      },
    },
  });

  // Create Profile for Demo User
  await prisma.profile.create({
    data: {
      userId: demoUser.id,
      academicBackground:
        'Final-year computer science student preparing for graduate applications.',
      achievements: ['Dean honor list', 'Capstone project lead'],
      careerGoals: 'Build accessible AI tools for international education.',
      targetCountries: ['United States', 'Canada'],
      targetFields: ['Computer Science', 'Artificial Intelligence'],
    },
  });

  // Create Documents for Demo User
  await prisma.document.createMany({
    data: [
      {
        userId: demoUser.id,
        documentType: DocumentType.SOP,
        status: DocumentStatus.DRAFT,
        content: {
          title: 'Demo SOP Draft',
          seeded: true,
          sections: [],
        },
      },
      {
        userId: demoUser.id,
        documentType: DocumentType.PERSONAL_STATEMENT,
        status: DocumentStatus.DRAFT,
        content: {
          title: 'Demo Personal Statement Draft',
          seeded: true,
          sections: [],
        },
      },
    ],
  });

  logger.info({ adminUserId: adminUser.id, demoUserId: demoUser.id }, 'Development seed completed');
}

main()
  .catch((error) => {
    logger.error(error, 'Development seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
