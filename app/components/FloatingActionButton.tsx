'use client';

import Link from 'next/link';

interface FloatingActionButtonProps {
  href: string;
  label: string;
}

export default function FloatingActionButton({ href, label }: FloatingActionButtonProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 w-auto px-6 h-14 rounded-xl bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors"
      aria-label={label}
    >
      <span className="text-xl font-bold">＋</span>
      <span className="text-base font-medium">出品</span>
    </Link>
  );
} 