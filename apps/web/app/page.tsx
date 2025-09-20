export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-20">
      <section className="space-y-6 text-center">
        <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-sky-400 ring-1 ring-sky-500/30">
          Realtime teamwork, without the fuss
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Plan projects, move tasks, and keep everyone aligned
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
          Create workspaces, invite your team, and manage tasks across Todo, In Progress,
          and Done. Every update syncs instantly across devices so that no detail slips through.
        </p>
      </section>
      <section className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-10 shadow-xl shadow-sky-500/10">
        <h2 className="text-lg font-medium text-slate-200">Workspace highlights</h2>
        <dl className="grid gap-6 text-left sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-semibold uppercase tracking-wide text-sky-400">
              Kanban columns
            </dt>
            <dd className="text-sm text-slate-300">
              Organise cards across Todo, In Progress, and Done with buttery-smooth drag and drop.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-semibold uppercase tracking-wide text-sky-400">
              Realtime presence
            </dt>
            <dd className="text-sm text-slate-300">
              See teammates editing tasks and commenting as it happens thanks to GraphQL subscriptions.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-semibold uppercase tracking-wide text-sky-400">
              Powerful filters
            </dt>
            <dd className="text-sm text-slate-300">
              Slice work by priority, assignee, labels, and due dates to stay focused on what matters.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-semibold uppercase tracking-wide text-sky-400">
              Secure access
            </dt>
            <dd className="text-sm text-slate-300">
              Role-based permissions keep projects safe while remaining flexible for fast-moving teams.
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
