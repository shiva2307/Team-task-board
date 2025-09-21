import type { CSSProperties } from 'react';
import { auth, signIn, signOut } from '../auth';

const inputStyle: CSSProperties = {
  display: 'block',
  marginBottom: 12,
  padding: '8px 12px',
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: 16,
  width: '100%',
  maxWidth: 320
};

const buttonStyle: CSSProperties = {
  padding: '8px 16px',
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer'
};

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
            <button type="submit" style={buttonStyle}>
              Sign out
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>Welcome</h1>
          <p>Enter any email and password to explore the Team Task Board demo.</p>
          <form
            action={async (formData) => {
              'use server';

              const email = formData.get('email');
              const password = formData.get('password');

              if (typeof email !== 'string' || typeof password !== 'string') {
                console.warn('Missing email or password in credentials sign-in');
                return;
              }

              await signIn('credentials', {
                email,
                password,
                redirectTo: '/'
              });
            }}
            style={{ maxWidth: 320 }}
          >
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
            <input
              name="password"
              type="password"
              placeholder="Enter any password"
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Sign in
            </button>
          </form>
        </>
      )}
    </main>
  );
}
