'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Image from 'next/image';
import Link from 'next/link';
import { getConditionColor } from '@/utils/itemHelpers';
import Pagination from '@/components/Pagination';
import { ITEMS_PER_PAGE } from '@/constants/pagination';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

  useEffect(() => {
    if (!keyword) return;

    const fetchItems = async () => {
      setLoading(true);
      
      try {
        // 検索キーワードを含む商品の総数を取得
        const countQuery = supabase
          .from('items')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
          
        // キーワード検索フィルターを追加
        countQuery.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
        
        const { count, error: countError } = await countQuery;
        
        if (countError) {
          console.error('カウントエラー:', countError);
          setLoading(false);
          return;
        }
        
        setTotalItems(count || 0);
        
        // 検索条件に合う商品を取得
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        
        const itemsQuery = supabase
          .from('items')
          .select(`
            *,
            seller:seller_id(username),
            images:item_images(*)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .range(offset, offset + ITEMS_PER_PAGE - 1);
          
        // キーワード検索フィルターを追加
        itemsQuery.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
        
        const { data, error } = await itemsQuery;
        
        if (error) {
          console.error('検索エラー:', error);
          setLoading(false);
          return;
        }
        
        setItems(data || []);
      } catch (error) {
        console.error('検索処理エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [keyword, currentPage]);

  if (!keyword) {
    return <div className="text-center py-10">検索キーワードを入力してください</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">「{keyword}」の検索結果</h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : items.length > 0 ? (
        <>
          <p className="mb-4 text-gray-600">{totalItems}件の商品が見つかりました</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="block group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {item.images && item.images[0] ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* 商品の状態バッジ */}
                  {item.condition && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium text-white ${getConditionColor(item.condition)}`}>
                      {item.condition}
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
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10">検索結果がありませんでした</div>
      )}
    </div>
  );
}