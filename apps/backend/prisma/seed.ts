import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLE = {
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.upsert({
    where: {
      email: 'demo@ablespace.com',
    },
    update: {},
    create: {
      email: 'demo@ablespace.com',
      passwordHash,
      name: 'Demo User',
      role: ROLE.USER,
      isGuest: false,
      theme: 'light',
    },
  });

  const tasks = [
    {
      title: 'Design onboarding flow',
      description:
        'Create wireframes for the new user onboarding experience.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Fix caseload table sorting',
      description:
        'Sorting by Eval Due date is not stable across pages.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Write API documentation',
      description:
        'Document all task and auth endpoints in Swagger.',
      status: TASK_STATUS.DONE,
      priority: TASK_PRIORITY.LOW,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Set up CI pipeline',
      description:
        'Add GitHub Actions workflow for lint, test, and build.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.HIGH,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Review accessibility audit',
      description:
        'Go through the a11y findings and triage into tickets.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: null,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        ownerId: demoUser.id,
      },
    });
  }

  console.log(
    'Seed complete. Demo login: demo@ablespace.com / Password123!',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });