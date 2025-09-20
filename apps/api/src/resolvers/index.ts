import { GraphQLScalarType, Kind } from "graphql";

import type { GraphQLContext } from "../context";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: string;
  dueDate?: string;
}

const isoDateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO-8601 compliant DateTime",
  serialize(value) {
    const date = typeof value === "string" ? new Date(value) : value;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError("DateTime scalar expects a valid Date");
    }
    return date.toISOString();
  },
  parseValue(value) {
    if (typeof value !== "string") {
      throw new TypeError("DateTime scalar expects a string");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new TypeError("DateTime scalar received an invalid date value");
    }
    return date;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      return null;
    }
    const date = new Date(ast.value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
});

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Create onboarding project",
    status: "TODO",
    assignee: "Alice",
    dueDate: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Implement drag and drop",
    status: "IN_PROGRESS",
    assignee: "Bob"
  },
  {
    id: "task-3",
    title: "Ship realtime subscriptions",
    status: "DONE",
    assignee: "Taylor"
  }
];

export const resolvers = {
  DateTime: isoDateTime,
  Query: {
    health: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      ctx.logger.debug({ requestId: ctx.requestId }, "health check");
      return {
        status: "ok",
        timestamp: new Date().toISOString()
      };
    },
    tasks: () => mockTasks
  }
};
