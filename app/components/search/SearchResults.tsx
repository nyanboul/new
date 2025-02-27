'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getConditionColor } from '@/utils/itemHelpers';

type SearchResultsProps = {
  items: any[];
  query: string;
  loading: boolean;
};

export default function SearchResults({ items, query, loading }: SearchResultsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* 検索結果のヘッダー */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {query ? `「${query}」の検索結果` : '商品を検索'}
          </h1>
          {items.length > 0 && (
            <p className="text-gray-600">{items.length}件の商品が見つかりました</p>
          )}
        </div>
        
        {/* ローディング表示 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : items.length > 0 ? (
          // 検索結果の表示
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="block group w-full"
              >
                <div className="relative aspect-[16/9] md:aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {item.images?.[0] ? (
                    <>
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div 
                        className={`absolute top-2 left-2 ${getConditionColor(item.condition)} text-white text-xs px-2 py-1 rounded-md z-10`}
                      >
                        {item.condition}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-base md:text-lg font-bold text-gray-900">
                    ¥{item.price.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span className="truncate">{item.seller.username}</span>
                    <span className="mx-1">•</span>
                    <span>★{item.seller.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          // 検索結果が0件の場合
          <div className="py-12 text-center">
            <p className="text-gray-600">「{query}」に一致する商品が見つかりませんでした。</p>
            <p className="mt-2 text-gray-500 text-sm">
              別のキーワードで検索してみてください。
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
} 