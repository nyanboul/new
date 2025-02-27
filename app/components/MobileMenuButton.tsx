'use client';

import { useState } from 'react';
import CategorySidebarWrapper from './CategorySidebarWrapper';

export default function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーメニューボタン - モバイルのみ表示 */}
      <button
        className="md:hidden fixed top-20 left-4 z-30 bg-white p-3 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      >
        {isOpen ? (
          // ✕アイコン
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // ハンバーガーアイコン
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* モバイルメニューオーバーレイ */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー - モバイルでは条件付き表示、PCでは固定表示 */}
      <div className={`
        fixed md:fixed top-0 left-0 h-full w-4/5 md:w-64 
        bg-white md:bg-white z-40 overflow-y-auto
        transition-transform duration-300 ease-in-out
        md:top-16 md:translate-x-0 md:shadow-md md:border-r md:border-gray-100
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-20 md:pt-4 px-4
      `}>
        <CategorySidebarWrapper />
      </div>
    </>
  );
} 