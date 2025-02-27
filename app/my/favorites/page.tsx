'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyFavoritesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // 正しいURLにリダイレクト
    router.replace('/mypage/favorites');
  }, [router]);
  
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <p className="text-gray-500">リダイレクト中...</p>
    </div>
  );
} 