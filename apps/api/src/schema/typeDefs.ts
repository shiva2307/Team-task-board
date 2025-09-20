export const typeDefs = /* GraphQL */ `
  scalar DateTime

  type Health {
    status: String!
    timestamp: DateTime!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    assignee: String
    dueDate: DateTime
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type Query {
    health: Health!
    tasks: [Task!]!
  }
`;
