'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
// TagInputのインポートパスを修正
import TagInput from '@/components/TagInput';
// 他のコンポーネントのパスも確認して修正
import Dropzone from '@/components/items/Dropzone';
import DynamicChart from '@/components/DynamicChart';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

// 必要な型を定義
interface FormDataItem {
  title: string;
  price: number;
  condition: string;
  description: string;
  tags: string[];
  // その他必要なフィールド
}

// エラーに対応するためのエラー型定義
interface UploadError {
  message: string;
  code?: string;
  details?: string;
}

export default function SellPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataItem>({
    title: '',
    price: 0,
    condition: '新品',
    description: '',
    tags: [],
    // 他のフィールド初期値
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // ユーザーが認証されているか確認
  useEffect(() => {
    if (!user && !localStorage.getItem('sb-auth-token')) {
      router.push('/login?redirect=/sell');
    }
  }, [user, router]);

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 商品データを保存
      const itemId = await saveItemData();
      
      // 画像をアップロード
      if (images.length > 0) {
        await uploadImages(itemId);
      }
      
      // 成功したら商品ページにリダイレクト
      router.push(`/items/${itemId}`);
    } catch (error: UploadError) {
      console.error('出品エラー:', error.message);
      setErrors({ form: '出品中にエラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームのバリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルを入力してください';
    }
    
    if (formData.price <= 0) {
      newErrors.price = '価格は0より大きい値を入力してください';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '商品説明を入力してください';
    }
    
    if (images.length === 0) {
      newErrors.images = '少なくとも1枚の画像をアップロードしてください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 商品データを保存
  const saveItemData = async () => {
    const itemId = uuidv4();
    
    const { error } = await supabase
      .from('items')
      .insert([
        {
          id: itemId,
          seller_id: user?.id,
          title: formData.title,
          price: formData.price,
          condition: formData.condition,
          description: formData.description,
          tags: formData.tags,
          status: 'active',
        },
      ]);
    
    if (error) throw error;
    
    return itemId;
  };

  // 画像をアップロード
  const uploadImages = async (itemId: string) => {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}_${index}.${fileExt}`;
      const filePath = `items/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      const imageId = uuidv4();
      const { error: dbError } = await supabase
        .from('item_images')
        .insert([
          {
            id: imageId,
            item_id: itemId,
            url: urlData.publicUrl,
            is_primary: index === 0,
          },
        ]);
      
      if (dbError) throw dbError;
    });
    
    await Promise.all(uploadPromises);
  };

  // フォーム入力ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value) || 0 : value,
    }));
  };

  // タグ変更ハンドラ
  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  // 画像変更ハンドラ
  const handleImagesChange = (files: File[]) => {
    setImages(files);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">商品を出品する</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル入力 */}
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="商品名（60文字以内）"
            maxLength={60}
          />
          {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
        </div>
        
        {/* 画像アップロード */}
        <div>
          <label className="block mb-1 font-medium">
            商品画像 <span className="text-red-500">*</span>
          </label>
          <Dropzone
            onFilesAdded={handleImagesChange}
            existingImages={[]}
            maxFiles={10}
          />
          {errors.images && <p className="mt-1 text-red-500 text-sm">{errors.images}</p>}
        </div>

        {/* 価格入力 */}
        <div>
          <label htmlFor="price" className="block mb-1 font-medium">
            価格 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              ¥
            </span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              className={`w-full p-2 pl-8 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="例：1000"
              min="1"
            />
          </div>
          {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price}</p>}
        </div>
        
        {/* 商品の状態 */}
        <div>
          <label htmlFor="condition" className="block mb-1 font-medium">
            商品の状態 <span className="text-red-500">*</span>
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="新品">新品</option>
            <option value="未使用に近い">未使用に近い</option>
            <option value="目立った傷や汚れなし">目立った傷や汚れなし</option>
            <option value="やや傷や汚れあり">やや傷や汚れあり</option>
            <option value="傷や汚れあり">傷や汚れあり</option>
            <option value="全体的に状態が悪い">全体的に状態が悪い</option>
          </select>
        </div>
        
        {/* 商品説明 */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            商品説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="商品の説明（色、素材、重さ、定価、注意点など）"
          />
          {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        {/* タグ入力 */}
        <div>
          <label className="block mb-1 font-medium">
            タグ
          </label>
          <TagInput
            tags={formData.tags}
            onChange={handleTagsChange}
            placeholder="例：Ryzen, SSD, メモリ（カンマまたはEnterで区切る）"
          />
          <p className="mt-1 text-sm text-gray-500">
            商品を見つけやすくするためのタグを追加してください（最大10個）
          </p>
        </div>
        
        {/* フォーム全体のエラー */}
        {errors.form && (
          <div className="p-3 bg-red-50 text-red-700 rounded">
            {errors.form}
          </div>
        )}
        
        {/* 送信ボタン */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '出品中...' : '出品する'}
          </button>
        </div>
      </form>
    </div>
  );
}
