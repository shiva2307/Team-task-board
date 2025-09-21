import type { ReactNode } from 'react';

export const metadata = {
  title: 'Team Task Board',
  description: 'Kanban workspace powered by Next.js and NextAuth.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
