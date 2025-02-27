'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/components/search/SearchProvider';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { search } = useSearch();

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      try {
        // 検索クエリをURLに反映し検索ページに遷移
        await router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } catch (error) {
        console.error('検索ページへの遷移に失敗しました:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSearch(query);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="PCパーツを検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
          aria-label="検索"
        />
        <button 
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-700"
          aria-label="検索ボタン"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
} 