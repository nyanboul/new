'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/colors';
import { SearchProvider } from '@/components/search/SearchProvider';
import SearchBar from '@/components/SearchBar';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">Otafli</Link>
        </div>
        
        <div className="flex-1 mx-4">
          <SearchBar />
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/notifications" className="text-sm text-gray-600 hover:text-gray-900">
                お知らせ
              </Link>
              <Link href="/mypage" className="text-sm text-gray-600 hover:text-gray-900">
                マイページ
              </Link>
              <Link href="/mypage/favorites" className="text-sm text-gray-600 hover:text-gray-900">
                マイリスト
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                href="/auth/login" 
                className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline-block"
              >
                ログイン
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 flex items-center"
              >
                <span className="font-bold">新規登録</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 