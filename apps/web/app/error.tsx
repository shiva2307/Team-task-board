'use client';

import type { ReactNode } from 'react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }): ReactNode {
  console.error('App error boundary caught:', error);
  return (
    <main style={{ padding: 24 }}>
      <h1>Something went wrong</h1>
      <p>We hit an unexpected error. Please try again.</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: '8px 16px',
          borderRadius: 4,
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </main>
  );
}
