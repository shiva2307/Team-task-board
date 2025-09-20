import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@kanban.dev' },
    update: { name: 'Demo User' },
    create: {
      email: 'demo@kanban.dev',
      name: 'Demo User',
      image: 'https://avatars.githubusercontent.com/u/1?v=4'
    }
  });

  const project = await prisma.project.upsert({
    where: { key: 'TTB' },
    update: {
      name: 'Team Task Board',
      ownerId: demoUser.id
    },
    create: {
      key: 'TTB',
      name: 'Team Task Board',
      ownerId: demoUser.id
    }
  });

  const tasks = [
    {
      id: 'ttb-task-1',
      title: 'Set up monorepo tooling',
      description: 'Configure Turbo, pnpm workspaces, and shared configs.',
      status: Status.DONE,
      orderIndex: 0,
      assignToDemo: true,
      dueDate: null
    },
    {
      id: 'ttb-task-2',
      title: 'Design database schema',
      description: 'Model users, projects, and tasks in Prisma.',
      status: Status.IN_PROGRESS,
      orderIndex: 1,
      assignToDemo: true,
      dueDate: new Date()
    },
    {
      id: 'ttb-task-3',
      title: 'Implement GraphQL API',
      description: 'Create project/task resolvers with RBAC enforcement.',
      status: Status.TODO,
      orderIndex: 2,
      assignToDemo: false,
      dueDate: null
    },
    {
      id: 'ttb-task-4',
      title: 'Build Kanban board UI',
      description: 'Drag-and-drop columns with optimistic updates.',
      status: Status.TODO,
      orderIndex: 3,
      assignToDemo: true,
      dueDate: null
    },
    {
      id: 'ttb-task-5',
      title: 'Add realtime subscriptions',
      description: 'Sync task movements via WebSocket subscriptions.',
      status: Status.IN_PROGRESS,
      orderIndex: 4,
      assignToDemo: false,
      dueDate: null
    }
  ];

  await Promise.all(
    tasks.map((task) =>
      prisma.task.upsert({
        where: { id: task.id },
        update: {
          title: task.title,
          description: task.description,
          status: task.status,
          orderIndex: task.orderIndex,
          assigneeId: task.assignToDemo ? demoUser.id : null,
          dueDate: task.dueDate
        },
        create: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          orderIndex: task.orderIndex,
          projectId: project.id,
          assigneeId: task.assignToDemo ? demoUser.id : null,
          dueDate: task.dueDate
        }
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
