'use client';

import Link from 'next/link';
import { HIERARCHICAL_CATEGORIES } from '@/constants/categories';
import { useState } from 'react';

interface CategorySidebarProps {
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedModel: string | null;
  onCategorySelect: (category: string) => void;
  onBrandSelect: (brand: string) => void;
  onModelSelect: (model: string) => void;
}

export default function CategorySidebar({
  selectedCategory,
  selectedBrand,
  selectedModel,
  onCategorySelect,
  onBrandSelect,
  onModelSelect
}: CategorySidebarProps) {
  // カテゴリーの展開状態を管理
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // カテゴリーをクリックした時の処理
  const handleCategoryClick = (category: string) => {
    // カテゴリーを選択処理
    onCategorySelect(category);
    
    // 展開状態を切り替え
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // メインカテゴリー一覧
  const mainCategories = Object.keys(HIERARCHICAL_CATEGORIES);

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">カテゴリー</h2>
      
      {/* すべての商品を表示 */}
      <div className="mb-2">
        <Link
          href="/"
          className={`block py-2 px-3 rounded-md ${!selectedCategory ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
        >
          すべての商品
        </Link>
      </div>
      
      {/* メインカテゴリー一覧 */}
      <ul className="space-y-1">
        {mainCategories.map(category => (
          <li key={category}>
            {/* メインカテゴリー */}
            <button
              className={`w-full text-left py-2 px-3 rounded-md flex items-center justify-between ${
                selectedCategory === category ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category}</span>
              {Object.keys(HIERARCHICAL_CATEGORIES[category]).length > 0 && (
                <span className="text-xs">
                  {expandedCategories[category] || selectedCategory === category ? '▼' : '▶'}
                </span>
              )}
            </button>
            
            {/* ブランド一覧 */}
            {(expandedCategories[category] || selectedCategory === category) && (
              <ul className="ml-4 mt-1 space-y-1">
                {Object.keys(HIERARCHICAL_CATEGORIES[category]).map(brand => (
                  <li key={brand}>
                    <button
                      className={`w-full text-left py-1 px-3 rounded-md flex items-center justify-between ${
                        selectedBrand === brand ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onBrandSelect(brand)}
                    >
                      <span>{brand}</span>
                      {HIERARCHICAL_CATEGORIES[category][brand].length > 0 && (
                        <span className="text-xs">
                          {selectedBrand === brand ? '▼' : '▶'}
                        </span>
                      )}
                    </button>
                    
                    {/* モデル一覧 */}
                    {selectedBrand === brand && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {HIERARCHICAL_CATEGORIES[category][brand].map(model => (
                          <li key={model}>
                            <button
                              className={`w-full text-left py-1 px-3 rounded-md ${
                                selectedModel === model ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => onModelSelect(model)}
                            >
                              {model}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 