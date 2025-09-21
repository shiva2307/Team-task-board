'use client';

import { useSession } from 'next-auth/react';
import type { CSSProperties } from 'react';

const containerStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'system-ui, sans-serif'
};

const preStyle: CSSProperties = {
  marginTop: 16,
  padding: 16,
  borderRadius: 6,
  background: '#0f172a',
  color: '#e2e8f0',
  overflowX: 'auto',
  maxWidth: 640
};

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  console.log('Session (client):', session);

  return (
    <main style={containerStyle}>
      <h1>Session Debug</h1>
      <p>Status: {status}</p>
      <pre style={preStyle}>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
