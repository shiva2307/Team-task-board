import { PrismaClient } from '@ttb/database';

const prisma = new PrismaClient();

const taskInclude = {
  assignee: true
};

type GraphQLStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

type ResolverContext = {
  requireAuth: () => void;
};

const getProjectByKey = async (projectKey: string) => {
  return prisma.project.findUnique({
    where: { key: projectKey }
  });
};

export const resolvers = {
  Query: {
    tasks: async (_parent: unknown, args: { projectKey: string }) => {
      const project = await getProjectByKey(args.projectKey);
      if (!project) {
        return [];
      }

      return prisma.task.findMany({
        where: { projectId: project.id },
        orderBy: [
          { status: 'asc' },
          { orderIndex: 'asc' }
        ],
        include: taskInclude
      });
    }
  },
  Mutation: {
    addTask: async (
      _parent: unknown,
      args: { projectKey: string; title: string },
      ctx: ResolverContext
    ) => {
      ctx.requireAuth();

      const project = await getProjectByKey(args.projectKey);
      if (!project) {
        throw new Error(`Project with key ${args.projectKey} not found`);
      }

      const maxOrderIndex = await prisma.task.aggregate({
        where: {
          projectId: project.id,
          status: 'TODO'
        },
        _max: { orderIndex: true }
      });

      const nextOrderIndex = (maxOrderIndex._max.orderIndex ?? -1) + 1;

      return prisma.task.create({
        data: {
          projectId: project.id,
          title: args.title,
          status: 'TODO',
          orderIndex: nextOrderIndex
        },
        include: taskInclude
      });
    },
    moveTask: async (
      _parent: unknown,
      args: { taskId: string; status: GraphQLStatus; orderIndex: number },
      ctx: ResolverContext
    ) => {
      ctx.requireAuth();

      const task = await prisma.task.update({
        where: { id: args.taskId },
        data: {
          status: args.status,
          orderIndex: args.orderIndex
        },
        include: taskInclude
      });

      return task;
    },
    updateTask: async (
      _parent: unknown,
      args: {
        taskId: string;
        title?: string | null;
        description?: string | null;
        dueDate?: string | null;
      },
      ctx: ResolverContext
    ) => {
      ctx.requireAuth();

      const data: Record<string, unknown> = {};

      if (args.title !== undefined) {
        data.title = args.title;
      }

      if (args.description !== undefined) {
        data.description = args.description;
      }

      if (args.dueDate !== undefined) {
        data.dueDate = args.dueDate ? new Date(args.dueDate) : null;
      }

      const task = await prisma.task.update({
        where: { id: args.taskId },
        data,
        include: taskInclude
      });

      return task;
    },
    deleteTask: async (
      _parent: unknown,
      args: { taskId: string },
      ctx: ResolverContext
    ) => {
      ctx.requireAuth();

      const existing = await prisma.task.findUnique({
        where: { id: args.taskId }
      });

      if (!existing) {
        return false;
      }

      await prisma.task.delete({
        where: { id: args.taskId }
      });

      return true;
    }
  },
  Task: {
    dueDate: (parent: { dueDate: Date | null }) => {
      return parent.dueDate ? parent.dueDate.toISOString() : null;
    }
  }
};
