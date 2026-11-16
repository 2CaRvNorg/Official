import { ReactNode } from 'react';

interface GlassCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function GlassCard({ title, children, className = '', action }: GlassCardProps) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title}
          </h3>
          {action ?? (
            <button className="text-xs" style={{ color: '#888888' }}>•••</button>
          )}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
