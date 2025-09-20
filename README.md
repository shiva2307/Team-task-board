# 🗂️ Team Task Board (Kanban)

A full-stack **Kanban task management platform** built with a modern monorepo stack.  
Users can organize work into projects, assign teammates, set due dates, and drag tasks across **Todo → In Progress → Done** columns, while the whole team sees updates instantly.

---

## ✨ Features

- **Projects & RBAC**: Create projects with unique keys and invite teammates with roles (Owner, Admin, Member, Viewer).
- **Kanban Boards**: Drag & drop tasks across columns using [dnd-kit](https://dndkit.com/).
- **Tasks**: Assign users, add due dates, and update statuses in real-time.
- **Auth**: Secure login via [NextAuth](https://next-auth.js.org/) with JWT/session support.
- **Realtime Collaboration**: Optimistic updates with Redis Pub/Sub + GraphQL subscriptions.
- **Database**: MySQL via Prisma ORM.
- **API**: Node.js GraphQL API powered by Apollo Server 4.
- **Frontend**: Next.js 14 (App Router) with React Query + Zustand for state management.
- **Monorepo**: Powered by [Turborepo](https://turbo.build/) + pnpm workspaces.
- **Testing**: ESLint, Prettier, Vitest/Jest, Playwright for E2E.

---

## 📂 Repository Structure

```txt
Team-task-board/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js GraphQL API
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── ui/           # Shared React UI components
│   ├── config/       # Shared configs (eslint, tsconfig, tailwind, etc.)
│   └── shared/       # Shared utilities (types, helpers)
├── turbo.json        # Turborepo pipeline config
├── package.json      # Root scripts
├── pnpm-workspace.yaml
└── README.md
```
