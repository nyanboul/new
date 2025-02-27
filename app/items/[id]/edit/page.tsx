'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/ImageUploader';
import { CATEGORIES } from '@/constants/categories';
import Button from '@/components/ui/Button';

type CategoryKey = keyof typeof CATEGORIES;

interface ItemFormData {
  title: string;
  price: number;
  description: string;
  condition: string;
  category: CategoryKey | '';
  tags: string[];
  images: string[];
  status: 'active' | 'sold' | 'hidden';
}

// 独自のdebounce実装を追加
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function EditItemPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    price: 0,
    description: '',
    condition: '新品',
    category: '',
    tags: [],
    images: [],
    status: 'active'
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchItemDetails();
  }, [user, itemId]);

  const fetchItemDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          images:item_images(url)
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Item not found');

      setFormData({
        title: data.title,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        tags: data.tags || [],
        images: data.images?.map(img => img.url) || [],
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('商品の取得に失敗しました');
      router.push('/mypage/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // 商品情報の更新
      const { error: itemError } = await supabase
        .from('items')
        .update({
          title: formData.title,
          price: formData.price,
          description: formData.description,
          condition: formData.condition,
          category: formData.category,
          tags: formData.tags,
          status: formData.status
        })
        .eq('id', itemId);

      if (itemError) throw itemError;

      // 画像の更新（既存の画像を削除して新しい画像を追加）
      const { error: deleteImagesError } = await supabase
        .from('item_images')
        .delete()
        .eq('item_id', itemId);

      if (deleteImagesError) throw deleteImagesError;

      if (formData.images.length > 0) {
        const { error: insertImagesError } = await supabase
          .from('item_images')
          .insert(
            formData.images.map(url => ({
              item_id: itemId,
              url: url,
              storage_path: url.split('/').pop() || '',
              is_primary: false
            }))
          );

        if (insertImagesError) throw insertImagesError;
      }

      alert('商品情報を更新しました');
      router.push('/mypage/listings');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('商品の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 自動保存の実装
  const saveChanges = async (data: ItemFormData) => {
    try {
      setSaving(true);
      
      const { error: itemError } = await supabase
        .from('items')
        .update({
          title: data.title,
          price: data.price,
          description: data.description,
          condition: data.condition,
          category: data.category,
          tags: data.tags,
          status: data.status
        })
        .eq('id', itemId);

      if (itemError) throw itemError;

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setSaving(false);
    }
  };

  // debounceを使用して自動保存を遅延実行
  const debouncedSave = useCallback(
    debounce((data: ItemFormData) => saveChanges(data), 1000),
    [itemId]
  );

  // フォームデータが変更されたときの処理
  const handleFormChange = (changes: Partial<ItemFormData>) => {
    const newFormData = { ...formData, ...changes };
    setFormData(newFormData);
    debouncedSave(newFormData);
  };

  // 画像の自動保存
  const handleImagesChange = async (images: string[]) => {
    try {
      setSaving(true);
      
      // 既存の画像を削除
      const { error: deleteImagesError } = await supabase
        .from('item_images')
        .delete()
        .eq('item_id', itemId);

      if (deleteImagesError) throw deleteImagesError;

      // 新しい画像を追加（重複を防ぐため、一意の画像URLのみを使用）
      if (images.length > 0) {
        // 重複を除去
        const uniqueImages = Array.from(new Set(images));
        
        const { error: insertImagesError } = await supabase
          .from('item_images')
          .insert(
            uniqueImages.map(url => ({
              item_id: itemId,
              url: url,
              storage_path: url.split('/').pop() || '',
              is_primary: false
            }))
          );

        if (insertImagesError) throw insertImagesError;

        // フォームデータを更新（重複を除去した配列を使用）
        setFormData(prev => ({ ...prev, images: uniqueImages }));
      } else {
        // 画像が0枚の場合
        setFormData(prev => ({ ...prev, images: [] }));
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      setSaving(false);
    }
  };

  // カテゴリー選択の改善
  function getCategoryDisplayName(categoryKey: string): string {
    const categoryMap: Record<string, string> = {
      cpu: 'CPU',
      gpu: 'グラフィックボード',
      motherboard: 'マザーボード',
      memory: 'メモリ',
      storage: 'ストレージ',
      case: 'PCケース',
      power_supply: 'パワーサプライ',
      cooling: '冷却装置',
      peripheral: '周辺機器',
      accessory: 'アクセサリー',
      other: 'その他'
    };
    
    return categoryMap[categoryKey] || categoryKey;
  }

  // 条件式とマッピングを安全に行う
  const categoryTags = useMemo(() => {
    if (!formData.category) return [];
    return CATEGORIES[formData.category as CategoryKey] || [];
  }, [formData.category]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">商品情報の編集</h1>

      {/* 保存状態の表示 */}
      <div className="mb-4 text-sm">
        {saving ? (
          <span className="text-blue-600">保存中...</span>
        ) : lastSaved ? (
          <span className="text-green-600">
            最終保存: {lastSaved.toLocaleTimeString()}
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品画像
          </label>
          <ImageUploader
            images={formData.images}
            onChange={handleImagesChange}
          />
        </div>

        {/* 商品名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品名
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleFormChange({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 価格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            価格
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">¥</span>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => handleFormChange({ price: parseInt(e.target.value) })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 商品の状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品の状態
          </label>
          <select
            value={formData.condition}
            onChange={(e) => handleFormChange({ condition: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="新品">新品</option>
            <option value="中古-良い">中古-良い</option>
            <option value="中古-普通">中古-普通</option>
            <option value="中古-悪い">中古-悪い</option>
          </select>
        </div>

        {/* 出品状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出品状態
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleFormChange({ status: e.target.value as 'active' | 'sold' | 'hidden' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="active">出品中</option>
            <option value="sold">売却済み</option>
            <option value="hidden">非公開</option>
          </select>
        </div>

        {/* カテゴリー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリー
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleFormChange({ category: e.target.value as CategoryKey | '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((category) => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* タグ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ
          </label>
          {/* デバッグ情報 */}
          <div className="mb-2 text-xs text-gray-400">
            カテゴリー値: "{formData.category}"
            <br />
            カテゴリーが存在: {formData.category ? "はい" : "いいえ"}
            <br />
            CATEGORIESにキーが存在: {formData.category && CATEGORIES[formData.category as CategoryKey] ? "はい" : "いいえ"}
          </div>
          
          <div className="space-y-2">
            {categoryTags.length > 0 ? (
              categoryTags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleFormChange({ tags: [...formData.tags, tag] });
                      } else {
                        handleFormChange({
                          tags: formData.tags.filter((t) => t !== tag),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  {tag}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">カテゴリーに関連するタグがありません</p>
            )}
          </div>
        </div>

        {/* 商品の説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品の説明
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleFormChange({ description: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? '更新中...' : '更新する'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/mypage/listings')}
            className="flex-1"
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
} 