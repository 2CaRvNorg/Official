import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
  circularProgress?: number; // 0-100
}

export function CircularProgressRing({
  progress,
  size = 72,
  stroke = 6,
  color = '#D4A843',
  value,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  value: string | number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {/* Value label */}
      <div
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {typeof value === 'number' && value > 100 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
    </div>
  );
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  accentColor = '#D4A843',
  circularProgress,
}: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}25` }}
          >
            <span style={{ color: accentColor }}>{icon}</span>
          </div>
        )}
        {circularProgress !== undefined && (
          <CircularProgressRing
            progress={circularProgress}
            color={accentColor}
            value={value}
          />
        )}
      </div>

      <div>
        {circularProgress === undefined && (
          <div className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {value}
          </div>
        )}
        <div className="text-xs font-medium" style={{ color: '#888888' }}>
          {title}
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 mt-1.5 text-xs font-medium"
            style={{ color: trend.positive ? '#4CAF50' : '#FF5252' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              {trend.positive ? <path d="M12 4l8 16H4z"/> : <path d="M12 20L4 4h16z"/>}
            </svg>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
