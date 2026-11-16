import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D0D0D',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
