export function AuthHeader({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-3 text-center">
      <p className="text-sm font-medium text-sky-400">Team Task Board</p>
      <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
      <p className="text-sm text-slate-400">{description}</p>
    </header>
  );
}
