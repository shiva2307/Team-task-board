export const typeDefs = `#graphql
  enum Status {
    TODO
    IN_PROGRESS
    DONE
  }

  type User {
    id: ID!
    email: String!
    name: String!
    image: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: Status!
    orderIndex: Int!
    dueDate: String
    assignee: User
  }

  type Query {
    tasks(projectKey: String!): [Task!]!
  }

  type Mutation {
    addTask(projectKey: String!, title: String!): Task!
    moveTask(taskId: ID!, status: Status!, orderIndex: Int!): Task!
    updateTask(taskId: ID!, title: String, description: String, dueDate: String): Task!
    deleteTask(taskId: ID!): Boolean!
  }
`;
