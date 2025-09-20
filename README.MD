# Team Task Board

Full-stack Kanban platform for project teams. Organise work into projects, assign teammates, set due dates, and drag tasks across Todo, In Progress, and Done while the whole team sees updates instantly.

---

## Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Domain Model](#domain-model)
- [GraphQL Schema Surface](#graphql-schema-surface)
- [Frontend Experience](#frontend-experience)
- [Authentication & Authorization](#authentication--authorization)
- [Realtime Collaboration](#realtime-collaboration)
- [Infrastructure](#infrastructure)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing Strategy](#testing-strategy)
- [Roadmap](#roadmap)

---

## Key Features
- **Projects & RBAC**: Create projects with unique keys and invite teammates with roles (Owner, Admin, Member).
- **Task Lifecycle**: CRUD tasks with titles, descriptions, status, assignee, priority, due date, labels, and threaded comments.
- **Board Operations**: Drag-and-drop tasks across Todo / In Progress / Done columns with optimistic UI updates and O(1) reordering via floating `orderIndex`.
- **Collaboration Tools**: Activity feed, overdue indicators, priority chips, avatar stacks, and inline editing.
- **Realtime Sync**: GraphQL subscriptions push task moves, new tasks, and comments to connected clients.
- **Simple Auth**: NextAuth credential + Google providers with JWT-backed sessions for browser and API usage.

## Technology Stack
- **Client**: Next.js 14 (App Router), React, TypeScript, React Query, Zustand, Tailwind CSS, Headless UI, `@dnd-kit/core`.
- **API**: Node.js 20, Apollo Server 4, GraphQL Yoga (subscriptions), Prisma ORM with MySQL driver.
- **Database**: MySQL 8 (AWS RDS in production, Dockerized locally).
- **Auth**: NextAuth.js with stateless JWT session strategy and bcrypt password hashing.
- **Realtime Layer**: WebSocket-based GraphQL subscriptions with Redis Pub/Sub for horizontal fan-out.
- **Dev Tooling**: pnpm workspace, ESLint, Prettier, Vitest, Jest, Playwright, Docker Compose, GitHub Actions.

## System Architecture
```
┌────────────────┐      HTTP(S)/WS      ┌────────────────┐        SQL         ┌─────────────┐
│  Next.js Web   │◀────────────────────▶│   Apollo API   │◀──────────────────▶│  MySQL 8    │
│ React + TS     │                     │ GraphQL Server │                   │ (Prisma)    │
│ React Query    │    Subscription Bus │                │    Pub/Sub         │             │
└────────────────┘◀────────────────────▶│  Redis (WS)    │◀──────────────────▶│ Redis Cache │
```
- Next.js renders authenticated pages and hydrates React Query caches.
- Apollo Server exposes GraphQL queries, mutations, and subscriptions on `/graphql`.
- Prisma ORM manages schema migrations and queries against MySQL.
- Redis distributes subscription events across API instances.

## Domain Model
Prisma-style schema sketch for core entities:
```prisma
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  passwordHash  String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  memberships   ProjectMember[]
  assignedTasks Task[]    @relation("TaskAssignee")
  comments      Comment[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  key         String   @unique
  description String?
  createdBy   String
  createdAt   DateTime @default(now())
  members     ProjectMember[]
  tasks       Task[]
  labels      Label[]
}

model ProjectMember {
  project   Project @relation(fields: [projectId], references: [id])
  projectId String
  user      User    @relation(fields: [userId], references: [id])
  userId    String
  role      Role
  joinedAt  DateTime @default(now())

  @@id([projectId, userId])
}

model Task {
  id          String        @id @default(cuid())
  project     Project       @relation(fields: [projectId], references: [id])
  projectId   String
  title       String
  description String?
  status      TaskStatus    @default(TODO)
  assignee    User?         @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String?
  priority    TaskPriority  @default(MEDIUM)
  dueDate     DateTime?
  orderIndex  Float
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  comments    Comment[]
  labels      TaskLabel[]
}

model Comment {
  id        String   @id @default(cuid())
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  body      String
  createdAt DateTime @default(now())
}

model Label {
  id        String  @id @default(cuid())
  project   Project @relation(fields: [projectId], references: [id])
  projectId String
  name      String
  color     String
  tasks     TaskLabel[]

  @@unique([projectId, name])
}

model TaskLabel {
  task    Task  @relation(fields: [taskId], references: [id])
  taskId  String
  label   Label @relation(fields: [labelId], references: [id])
  labelId String

  @@id([taskId, labelId])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```
`orderIndex` values are floats so inserting between adjacent tasks only requires computing a midpoint (1.0 → 1.5 → 1.75, etc.).

## GraphQL Schema Surface
```graphql
type Query {
  me: User
  projects(filter: ProjectFilter): [Project!]!
  project(id: ID!): Project
  task(id: ID!): Task
}

type Mutation {
  createProject(input: CreateProjectInput!): Project!
  inviteProjectMember(input: InviteMemberInput!): ProjectMember!
  createTask(input: CreateTaskInput!): Task!
  updateTask(input: UpdateTaskInput!): Task!
  moveTask(input: MoveTaskInput!): Task!
  addComment(input: AddCommentInput!): Comment!
  login(email: String!, password: String!): AuthPayload!
}

type Subscription {
  taskMoved(projectId: ID!): TaskMoveEvent!
  taskCreated(projectId: ID!): Task!
  commentAdded(taskId: ID!): Comment!
}

input MoveTaskInput {
  taskId: ID!
  status: TaskStatus!
  orderIndex: Float!
}

type TaskMoveEvent {
  task: Task!
  previousStatus: TaskStatus!
}
```
- RBAC checks use the user context derived from JWT to validate membership roles.
- Subscriptions broadcast via Redis channels keyed on project/task IDs.
- Optimistic updates reuse mutation inputs for React Query cache hydration.

## Frontend Experience
- **Routes**: `/login`, `/projects`, `/projects/[id]`, `/settings`.
- **Data fetching**: React Query wraps a GraphQL fetcher with per-operation cache keys.
- **State slices**: Zustand handles board UI state (filters, modals, drag state).
- **Drag-and-drop**: `@dnd-kit/core` sensors (pointer, touch, keyboard). Drop handlers compute `orderIndex` and trigger the `moveTask` mutation with optimistic updates.
- **UI system**: Tailwind CSS design tokens, Headless UI dialog/listbox, Radix Toast for notifications, dark mode support.

## Authentication & Authorization
- NextAuth credential provider calls the GraphQL `login` mutation; Google OAuth uses built-in provider.
- Stateless JWT stored in HTTP-only cookie; payload carries `userId`, `email`, and token version.
- Project roles retrieved via resolver-side lookups; Prisma transactions enforce authorization and concurrency.
- Password hashing via bcrypt; future enhancements include email verification and 2FA.

## Realtime Collaboration
- GraphQL subscriptions over WebSocket via `graphql-ws`.
- Redis Pub/Sub ensures multi-instance delivery of `taskMoved`, `taskCreated`, and `commentAdded` events.
- Client merges subscription payloads into React Query cache to keep board state aligned across users.
- Future additions: presence indicators, typing indicators, Slack/Teams notifications.

## Infrastructure
- **Docker Images**: separate images for `web` (Next.js) and `api` (Apollo). Optional Nginx proxy for TLS termination.
- **Docker Compose (dev)**: services for `web`, `api`, `mysql`, `redis`, plus seeded data container.
- **CI/CD**: GitHub Actions pipeline installs dependencies, runs lint/tests, builds Docker images, and deploys to AWS (ECS or Kubernetes). Prisma migrations run during deploy.
- **Production**: AWS RDS for MySQL, Redis (Upstash/Elasticache), container orchestration behind load balancer.

## Environment Variables
- `DATABASE_URL=mysql://user:pass@host:3306/team_task_board`
- `NEXTAUTH_URL=https://app.example.com`
- `NEXTAUTH_SECRET=...`
- `JWT_SECRET=...`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GRAPHQL_ENDPOINT=https://api.example.com/graphql`
- `GRAPHQL_WS_ENDPOINT=wss://api.example.com/subscriptions`
- `REDIS_URL=redis://:password@redis-host:6379`

## Local Development
```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm db:seed       # optional: load demo users/projects/tasks
pnpm dev           # runs Next.js and Apollo via turborepo scripts
```
- Next.js dev server proxies `/api/graphql` to the standalone Apollo server at `http://localhost:4000/graphql`.
- `pnpm prisma studio` opens an admin UI for inspecting local data.

## Testing Strategy
- **Unit**: Vitest for React components; Jest for resolver/service logic using Prisma test database.
- **Integration**: Playwright covering login, project creation, card drag-and-drop, commenting workflows.
- **Contract**: GraphQL operation snapshots with `graphql-request` against mocked Prisma.
- **E2E**: Playwright/Cypress hitting Docker stack with seeded data and NextAuth flows.
- **Static Analysis**: ESLint, TypeScript strict mode, Prisma format checks in CI.

## Roadmap
- Calendar view aggregating due dates across projects.
- Advanced filters (assignee, label, due date ranges, keyword search).
- Slack/Teams integrations and Jira import bridge.
- Task checklist items, attachments, and subtasks.
- Presence indicators and offline support via service worker queueing.
- Analytics dashboard (burn-up, workload distribution).

---

Use this document as the blueprint for implementing the Team Task Board application end to end.
