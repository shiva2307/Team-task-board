import { auth, signIn, signOut } from '../auth';

export default async function Page() {
  const session = await auth();

  return (
    <main style={{ padding: 24 }}>
      {session?.user ? (
        <>
          <h1>Hi, {session.user.name ?? 'there'} 👋</h1>
          <p>You are signed in as {session.user.email ?? 'unknown user'}.</p>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button type="submit">Sign out</button>
          </form>
        </>
      ) : (
        <>
          <h1>Welcome</h1>
          <p>Sign in to access your Team Task Board workspace.</p>
          <form
            action={async () => {
              'use server';
              await signIn('github');
            }}
          >
            <button type="submit">Sign in with GitHub</button>
          </form>
        </>
      )}
    </main>
  );
}
