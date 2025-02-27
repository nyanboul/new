import { HIERARCHICAL_CATEGORIES } from '@/constants/categories';

/**
 * カテゴリーに関連するすべてのタグを取得する
 */
export function getCategoryTags(category: string): string[] {
  // メインカテゴリー自体をタグとして追加
  const tags = [category];
  
  // サブカテゴリーとして関連タグを追加
  if (HIERARCHICAL_CATEGORIES[category]) {
    Object.keys(HIERARCHICAL_CATEGORIES[category]).forEach(subcategory => {
      tags.push(subcategory);
      
      // さらに具体的な製品タグを追加
      if (HIERARCHICAL_CATEGORIES[category][subcategory]) {
        HIERARCHICAL_CATEGORIES[category][subcategory].forEach(tag => {
          tags.push(tag);
        });
      }
    });
  }
  
  return tags;
} 