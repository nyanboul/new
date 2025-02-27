'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 総ページ数を計算
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 表示するページ番号の範囲を決定（最大7ページ表示）
  let startPage = Math.max(1, currentPage - 3);
  let endPage = Math.min(totalPages, startPage + 6);
  
  // スタートページを調整
  if (endPage - startPage < 6) {
    startPage = Math.max(1, endPage - 6);
  }
  
  // 新しいURLを生成する関数
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <nav className="flex justify-center my-8">
      <ul className="flex items-center">
        {/* 前へボタン */}
        {currentPage > 1 && (
          <li>
            <Link 
              href={createPageURL(currentPage - 1)}
              className="mx-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              前へ
            </Link>
          </li>
        )}
        
        {/* 最初のページ */}
        {startPage > 1 && (
          <>
            <li>
              <Link 
                href={createPageURL(1)}
                className="mx-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                1
              </Link>
            </li>
            {startPage > 2 && (
              <li className="mx-1 text-gray-500">...</li>
            )}
          </>
        )}
        
        {/* ページ番号 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <li key={page}>
            <Link 
              href={createPageURL(page)}
              className={`mx-1 px-3 py-2 border rounded ${
                page === currentPage 
                  ? 'bg-gray-700 text-white border-gray-700' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          </li>
        ))}
        
        {/* 最後のページ */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="mx-1 text-gray-500">...</li>
            )}
            <li>
              <Link 
                href={createPageURL(totalPages)}
                className="mx-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}
        
        {/* 次へボタン */}
        {currentPage < totalPages && (
          <li>
            <Link 
              href={createPageURL(currentPage + 1)}
              className="mx-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              次へ
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
} 