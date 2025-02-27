'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { getConditionColor } from '@/utils/itemHelpers';
import FavoriteButton from '@/components/FavoriteButton';
import MypageLayout from '@/components/mypage/MypageLayout';

// スピナーコンポーネント
const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function MyPageFavorites() {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      window.location.href = '/login?redirect=/mypage/favorites';
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setErrorMessage('');
      
      try {
        console.log('ユーザーID:', user.id);
        
        // 基本クエリ
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
          
        if (favoritesError) {
          console.error('基本クエリエラー:', favoritesError);
          setErrorMessage(`リストの取得に失敗しました: ${favoritesError.message}`);
          setLoading(false);
          return;
        }
        
        if (favoritesData.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }
        
        // 商品データを取得
        const itemIds = favoritesData.map(fav => fav.item_id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select(`
            *,
            seller:seller_id(username),
            images:item_images(*)
          `)
          .in('id', itemIds);
        
        if (itemsError) {
          console.error('商品データ取得エラー:', itemsError);
          setErrorMessage(`商品データの取得に失敗しました: ${itemsError.message}`);
          setLoading(false);
          return;
        }
        
        setItems(itemsData || []);
      } catch (error: any) {
        console.error('リストの取得中にエラーが発生しました', error);
        setErrorMessage(`エラーが発生しました: ${error.message || '不明なエラー'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <MypageLayout>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </MypageLayout>
    );
  }

  return (
    <MypageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">マイリスト</h1>
      
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}
      
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <Link 
                  href={`/items/${item.id}`}
                  className="block"
                >
                  <div className="relative aspect-square">
                    {item.images && item.images[0] ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
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
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                    <p className="text-lg font-bold mt-2">
                      ¥{item.price.toLocaleString()}
                    </p>
                    {item.seller && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{item.seller.username}</span>
                      </div>
                    )}
                  </div>
                </Link>
              
                {/* リストボタン（右上に配置） */}
                <div className="absolute top-2 right-2">
                  <FavoriteButton 
                    itemId={item.id} 
                    initialIsFavorite={true} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">リストに追加した商品はありません</p>
            <Link 
              href="/"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              商品を探す
            </Link>
          </div>
        )}
      </div>
    </MypageLayout>
  );
} 