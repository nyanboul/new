import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES, HIERARCHICAL_CATEGORIES } from '@/constants/categories';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import Pagination from '@/components/Pagination';
import SortSelector from '@/components/SortSelector';
import MobileMenuButton from '@/components/MobileMenuButton';
import { getConditionColor } from '@/utils/itemHelpers';

// 並び替えオプションの型定義
type SortOption = 'newest' | 'priceDesc' | 'priceAsc';

export default async function Home({ searchParams }: { 
  searchParams: { 
    page?: string; 
    sort?: string;
    category?: string;
    brand?: string;
    model?: string;
    tag?: string;
  } 
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // 現在のページ番号を取得（デフォルトは1）
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // 並び替えオプションを取得（デフォルトは新着順）
  const sortOption = (searchParams.sort as SortOption) || 'newest';
  
  // フィルター条件を取得
  const categoryFilter = searchParams.category;
  const brandFilter = searchParams.brand;
  const modelFilter = searchParams.model;
  const tagFilter = searchParams.tag;
  
  // ページングのための計算
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // 詳細なデバッグ情報
  console.log('URL パラメータ:', { 
    category: categoryFilter, 
    brand: brandFilter, 
    model: modelFilter, 
    tag: tagFilter 
  });
  
  // 検索クエリ構築 - 基本クエリのみ
  let countQuery = supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
    
  let query = supabase
    .from('items')
    .select(`
      *,
      seller:seller_id(username),
      images:item_images(*)
    `)
    .eq('status', 'active');
  
  // シンプルな方法でカテゴリだけでフィルタリング
  if (categoryFilter) {
    countQuery = countQuery.eq('category', categoryFilter);
    query = query.eq('category', categoryFilter);
    
    console.log(`カテゴリ "${categoryFilter}" でフィルタリング`);
  }
  else if (tagFilter) {
    // タグベースのフィルタリングは一時的に無効化
    console.log(`タグ "${tagFilter}" フィルタリングはスキップ`);
  }
  
  // 総数を取得
  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error('カウントエラー:', countError);
  }
  const totalItems = count || 0;
  
  // 並び替えを適用
  switch (sortOption) {
    case 'priceDesc':
      query = query.order('price', { ascending: false });
      break;
    case 'priceAsc':
      query = query.order('price', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }
  
  // データを取得
  const { data: items, error } = await query
    .range(offset, offset + ITEMS_PER_PAGE - 1);
  
  // 結果をログに出力
  console.log('検索結果数:', items?.length || 0);
  if (error) {
    console.error('検索エラー:', error);
  } else if (items && items.length > 0) {
    // 商品データの構造を詳しく確認
    console.log('最初の商品のデータ:', {
      id: items[0].id,
      title: items[0].title,
      category: items[0].category,
      tags: items[0].tags,
      // その他の関連フィールド
    });
  }

  // データ構造を把握した後、クライアントサイドでさらなるフィルタリングを適用
  let filteredItems = items || [];
  
  // 商品データが存在し、ブランドフィルターが指定されている場合
  if (filteredItems.length > 0 && brandFilter) {
    filteredItems = filteredItems.filter(item => {
      // tags配列またはcategoryフィールドにブランド名が含まれているか確認
      const hasBrandInTags = Array.isArray(item.tags) && 
        item.tags.some((tag: string) => tag.includes(brandFilter));
        
      const hasBrandInCategory = item.subcategory === brandFilter;
      
      return hasBrandInTags || hasBrandInCategory;
    });
    
    console.log(`ブランド "${brandFilter}" でフィルタリング後: ${filteredItems.length}件`);
    
    // さらにモデルフィルターが指定されている場合
    if (modelFilter && filteredItems.length > 0) {
      filteredItems = filteredItems.filter(item => {
        // tags配列またはmodelフィールドにモデル名が含まれているか確認
        const hasModelInTags = Array.isArray(item.tags) && 
          item.tags.some((tag: string) => tag.includes(modelFilter));
          
        const hasModelInModel = item.model === modelFilter;
        
        return hasModelInTags || hasModelInModel;
      });
      
      console.log(`モデル "${modelFilter}" でフィルタリング後: ${filteredItems.length}件`);
    }
  }

  // 表示用のタイトルを生成
  let displayTitle = '新着商品';
  if (categoryFilter) {
    displayTitle = categoryFilter;
    if (brandFilter) {
      displayTitle += ` > ${brandFilter}`;
      if (modelFilter) {
        displayTitle += ` > ${modelFilter}`;
      }
    }
  } else if (tagFilter) {
    displayTitle = `タグ: ${tagFilter}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* モバイルメニューボタンとサイドバー */}
      <MobileMenuButton />
      
      {/* メインコンテンツエリア */}
      <div className="md:ml-72 mt-4">
        {/* 検索結果のヘッダー部分 */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {displayTitle}
            </h1>
            
            {/* 並び替え機能（クライアントコンポーネント） */}
            <SortSelector currentSort={sortOption} />
          </div>
        </div>
        
        {filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
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
            
            <div className="mt-8 mb-10">
              <Pagination
                totalItems={filteredItems.length === items?.length ? totalItems : filteredItems.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 my-12">商品が見つかりませんでした</p>
        )}
      </div>
    </div>
  );
}