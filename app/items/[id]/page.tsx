'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { itemsApi } from '@/lib/api';
import FavoriteButton from '@/components/FavoriteButton';

interface ItemImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface Item {
  id: string;
  title: string;
  price: number;
  description: string;
  condition: string;
  category: string;
  subcategory: string;
  seller: {
    id: string;
    username: string;
    rating: number;
  };
  images: ItemImage[];
  tags: string[];
  created_at: string;
}

// 商品の状態に応じた色と簡略表記を取得する関数
function getConditionInfo(condition: string) {
  switch (condition) {
    // 「良い」状態 - 緑系の色
    case '新品':
      return { color: 'bg-green-600', label: '良い', detail: condition };
    case '未使用に近い':
      return { color: 'bg-green-500', label: '良い', detail: condition };
      
    // 「普通」状態 - 青系の色
    case '目立った傷や汚れなし':
      return { color: 'bg-blue-500', label: '普通', detail: condition };
    case 'やや傷や汚れあり':
      return { color: 'bg-blue-400', label: '普通', detail: condition };
      
    // 「悪い」状態 - 赤/オレンジ系の色
    case '傷や汚れあり':
      return { color: 'bg-orange-500', label: '悪い', detail: condition };
    case '全体的に状態が悪い':
      return { color: 'bg-red-500', label: '悪い', detail: condition };
      
    default:
      return { color: 'bg-gray-500', label: '不明', detail: condition };
  }
}

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params?.id as string;
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;
    fetchItemDetails();
    fetchRelatedItems();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          seller:profiles(id, username, rating),
          images:item_images(id, url, is_primary)
        `)
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new Error(`Failed to fetch item: ${error.message}`);
      }

      if (!data) {
        console.error('No data found for item:', itemId);
        return;
      }

      console.log('Fetched item data:', data); // デバッグ用

      const formattedItem: Item = {
        id: data.id,
        title: data.title,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        tags: data.tags || [],
        created_at: data.created_at,
        images: Array.isArray(data.images) ? data.images : [],
        seller: {
          id: data.seller?.id || '',
          username: data.seller?.username || '不明なユーザー',
          rating: data.seller?.rating || 0,
        }
      };

      setItem(formattedItem);
      if (formattedItem.images.length > 0) {
        const primaryImage = formattedItem.images.find(img => img.is_primary);
        setSelectedImage(primaryImage?.url || formattedItem.images[0].url);
      }

    } catch (error: any) {
      console.error('Error fetching item:', error.message);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedItems = async () => {
    if (!item?.category) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          images:item_images(*)
        `)
        .eq('category', item.category)
        .neq('id', itemId)
        .limit(5);

      if (error) {
        console.error('Error fetching related items:', error.message);
        return;
      }

      setRelatedItems(data || []);
    } catch (error: any) {
      console.error('Error fetching related items:', error.message);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) return;
    try {
      const result = await itemsApi.toggleFavorite(user.id, itemId);
      setIsFavorite(result);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // 商品の状態に応じた色を取得する関数
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case '新品':
        return 'bg-green-500';
      case '未使用に近い':
        return 'bg-emerald-500';
      // その他のケース...
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">商品が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* 左側: 画像セクション */}
        <div className="space-y-4">
          {/* モバイル表示 - 現状維持 */}
          <div className="block lg:hidden">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={selectedImage || item.images[0].url}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            {/* モバイル用サムネイル */}
            {item.images && item.images.length > 1 && (
              <div className="mt-4 flex overflow-x-auto space-x-2 pb-2">
                {item.images.map((image: any) => (
                  <div
                    key={image.id}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer ${
                      selectedImage === image.url ? 'border-gray-900' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* デスクトップ表示 - 大きな画像と下部にサムネイル */}
          <div className="hidden lg:block">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={selectedImage || item.images[0].url}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            {/* デスクトップ用サムネイル */}
            {item.images && item.images.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {item.images.map((image: any) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all hover:opacity-90 ${
                      selectedImage === image.url ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={`${item.title} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 16vw, 8vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右側: 商品情報 */}
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-xl md:text-2xl font-bold">{item.title}</h1>
          <p className="text-2xl md:text-3xl font-bold">¥{item.price.toLocaleString()}</p>

          <div className="space-y-4">
            {/* 商品の状態 - 元の表示に戻す */}
            <div className={`inline-block ${getConditionColor(item.condition)} text-white text-xs px-2 py-1 rounded-md`}>
              {item.condition}
            </div>

            {/* お気に入りボタン */}
            <div className="flex items-center space-x-4 mt-4">
              <FavoriteButton itemId={item.id} />
              <span className="text-gray-500">リストに追加</span>
            </div>

            {/* 商品説明 */}
            <div className="border-t pt-4">
              <h2 className="font-bold mb-2">商品の説明</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* 出品者情報 */}
            <div className="border-t pt-4">
              <h2 className="font-bold mb-2">出品者</h2>
              <div className="flex items-center gap-2">
                <span>{item.seller.username}</span>
                <span>★{item.seller.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 関連商品 */}
      <div className="mt-8 md:mt-12">
        <h2 className="text-lg md:text-xl font-bold mb-4">関連商品</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {relatedItems.map((relatedItem) => (
            <Link
              key={relatedItem.id}
              href={`/items/${relatedItem.id}`}
              className="block group w-full"
            >
              <div className="relative aspect-[16/9] md:aspect-square rounded-lg overflow-hidden bg-gray-100">
                {relatedItem.images?.[0] ? (
                  <Image
                    src={relatedItem.images[0].url}
                    alt={relatedItem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {relatedItem.title}
                </h3>
                <p className="mt-1 text-base md:text-lg font-bold text-gray-900">
                  ¥{relatedItem.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 