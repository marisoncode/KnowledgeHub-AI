import React from 'react';
import type { DocumentStatus } from '../../types/document';

interface BadgeProps {
  status: DocumentStatus | 'info' | 'neutral';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, children, className = '' }) => {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    processing: 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse',
    failed: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  };

  const labels: Record<string, string> = {
    completed: 'Indexed',
    processing: 'Processing',
    failed: 'Failed',
    info: 'Info',
    neutral: 'Draft',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border tracking-wide uppercase ${styles[status] || styles.neutral} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full fill-current mr-1.5 bg-current opacity-70"></span>
      {children || labels[status] || status}
    </span>
  );
};

