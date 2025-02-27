'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type SortOption = 'newest' | 'priceDesc' | 'priceAsc';

interface SortSelectorProps {
  currentSort: SortOption;
}

export default function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handleSortChange = (value: string) => {
    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());
    
    // sortパラメータを設定
    params.set('sort', value);
    
    // 並び替えを変更したときは1ページ目に戻す
    params.delete('page');
    
    // 新しいURLに遷移
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
      <span className="text-sm text-gray-600 mr-3 font-medium">並び替え:</span>
      <select
        className="text-sm text-gray-800 font-medium bg-transparent focus:outline-none cursor-pointer"
        onChange={(e) => handleSortChange(e.target.value)}
        defaultValue={currentSort}
      >
        <option value="newest">新着順</option>
        <option value="priceDesc">価格が高い順</option>
        <option value="priceAsc">価格が低い順</option>
      </select>
    </div>
  );
} 