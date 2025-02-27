'use client';

import { useState, useEffect } from 'react';
import MypageLayout from '@/components/mypage/MypageLayout';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface ListingItem {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  images: { url: string }[];
}

export default function Listings() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [user]);

  const fetchUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          images:item_images(url)
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched items:', data); // デバッグ用
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('本当にこの商品を削除しますか？')) return;

    try {
      setLoading(true);

      // 1. まず画像の情報を取得
      const { data: imageData, error: fetchError } = await supabase
        .from('item_images')
        .select('url, storage_path')
        .eq('item_id', itemId);

      if (fetchError) {
        console.error('Error fetching images:', fetchError);
        throw fetchError;
      }

      // 2. item_imagesテーブルから画像レコードを削除
      const { error: deleteImagesError } = await supabase
        .from('item_images')
        .delete()
        .eq('item_id', itemId);

      if (deleteImagesError) {
        console.error('Error deleting image records:', deleteImagesError);
        throw deleteImagesError;
      }

      // 3. Storageから画像ファイルを削除
      if (imageData && imageData.length > 0) {
        const storagePaths = imageData
          .map(img => img.storage_path)
          .filter(path => path); // null/undefinedを除外

        if (storagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('item-images')
            .remove(storagePaths);

          if (storageError) {
            console.error('Error deleting from storage:', storageError);
            throw storageError;
          }
        }
      }

      // 4. itemsテーブルから商品を削除
      const { error: deleteItemError } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('seller_id', user?.id);

      if (deleteItemError) {
        console.error('Error deleting item:', deleteItemError);
        throw deleteItemError;
      }

      // 5. UIを更新
      setItems(items.filter(item => item.id !== itemId));
      alert('商品を削除しました');

    } catch (error: any) {
      console.error('Error deleting item:', error.message || error);
      alert('商品の削除に失敗しました。' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: 'active' | 'sold' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) throw error;

      // 商品リストを更新
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('ステータスの更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <MypageLayout>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </MypageLayout>
    );
  }

  return (
    <MypageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">出品した商品</h1>
          <Link href="/sell">
            <Button>商品を出品する</Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            出品した商品はありません
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 relative flex-shrink-0">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-600">¥{item.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as 'active' | 'sold' | 'hidden')}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="active">出品中</option>
                        <option value="sold">売却済み</option>
                        <option value="hidden">非公開</option>
                      </select>
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/items/${item.id}/edit`}>
                        <Button variant="secondary" className="text-sm">
                          編集
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        className="text-sm text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MypageLayout>
  );
} 