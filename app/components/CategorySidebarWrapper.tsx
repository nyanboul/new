'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import CategorySidebar from '@/components/CategorySidebar';

export default function CategorySidebarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // URLパラメータから現在の選択状態を取得
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    searchParams.get('brand')
  );
  const [selectedModel, setSelectedModel] = useState<string | null>(
    searchParams.get('model')
  );

  // URLパラメータが変わったら状態を更新
  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
    setSelectedBrand(searchParams.get('brand'));
    setSelectedModel(searchParams.get('model'));
  }, [searchParams]);

  // カテゴリが選択されたときの処理
  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 同じカテゴリを再度クリックした場合はフィルタ解除
    if (category === selectedCategory) {
      params.delete('category');
      params.delete('brand');
      params.delete('model');
    } else {
      params.set('category', category);
      params.delete('brand');
      params.delete('model');
    }
    
    // ページネーションをリセット
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // ブランドが選択されたときの処理
  const handleBrandSelect = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 同じブランドを再度クリックした場合はブランドフィルタのみ解除
    if (brand === selectedBrand) {
      params.delete('brand');
      params.delete('model');
    } else {
      params.set('brand', brand);
      params.delete('model');
    }
    
    // ページネーションをリセット
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // モデルが選択されたときの処理
  const handleModelSelect = (model: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 同じモデルを再度クリックした場合はモデルフィルタ解除
    if (model === selectedModel) {
      params.delete('model');
    } else {
      params.set('model', model);
    }
    
    // ページネーションをリセット
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="md:sticky md:top-20">
      <CategorySidebar
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedModel={selectedModel}
        onCategorySelect={handleCategorySelect}
        onBrandSelect={handleBrandSelect}
        onModelSelect={handleModelSelect}
      />
    </div>
  );
} 