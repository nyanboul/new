'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ 
  images, 
  onChange,
  maxImages = 8
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const newImages: string[] = [];

      const remainingSlots = maxImages - images.length;
      
      const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        alert(`画像は最大${maxImages}枚までアップロードできます`);
        return;
      }

      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      const allImages = [...new Set([...images, ...newImages])];
      const limitedImages = allImages.slice(0, maxImages);
      onChange(limitedImages);

    } catch (error: any) {
      console.error('Error uploading image:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      alert('画像のアップロードに失敗しました。');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={`${url}-${index}`} className="relative aspect-[16/9] md:aspect-square">
            <Image
              src={url}
              alt={`アップロード画像 ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-[16/9] md:aspect-square cursor-pointer hover:border-gray-400 flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              ref={fileInputRef}
              disabled={uploading}
            />
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14c0-4.418-3.582-8-8-8H16c-4.418 0-8 3.582-8 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M24 14v20M14 24h20"
                />
              </svg>
              <span className="mt-2 block text-sm text-gray-600">
                {uploading ? 'アップロード中...' : '画像を追加'}
              </span>
            </div>
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        最大{maxImages}枚まで、1枚5MB以内のJPEG、PNGファイル
      </p>
    </div>
  );
} 