'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/ImageUploader';
import { CATEGORIES } from '@/constants/categories';
import { getAllTagSynonyms } from '@/constants/tagSynonyms';

// CATEGORIESのキーの型を定義
type CategoryKey = keyof typeof CATEGORIES;

type ItemFormData = {
  title: string;
  price: number;
  description: string;
  condition: string;
  category: CategoryKey | ''; // 空文字列も許容
  tags: string[];
  images: string[];
  brand: string;
  model: string;
};

// カテゴリーとサブカテゴリーの定義
const categories = [
  { id: 'cpu', name: 'CPU' },
  { id: 'gpu', name: 'グラフィックボード' },
  { id: 'motherboard', name: 'マザーボード' },
  { id: 'memory', name: 'メモリ' },
  { id: 'storage', name: 'ストレージ' },
  { id: 'case', name: 'PCケース' },
  { id: 'power_supply', name: 'パワーサプライ' },
  { id: 'cooling', name: '冷却装置' },
  { id: 'peripheral', name: '周辺機器' },
  { id: 'accessory', name: 'アクセサリー' },
  { id: 'other', name: 'その他' },
];

// ブランド定義を拡充
const brands = {
  cpu: [
    { id: 'intel', name: 'Intel' },
    { id: 'amd', name: 'AMD' },
    { id: 'other_cpu', name: 'その他' },
  ],
  gpu: [
    { id: 'nvidia', name: 'NVIDIA' },
    { id: 'amd_gpu', name: 'AMD' },
    { id: 'asus', name: 'ASUS' },
    { id: 'msi', name: 'MSI' },
    { id: 'gigabyte', name: 'GIGABYTE' },
    { id: 'evga', name: 'EVGA' },
    { id: 'zotac', name: 'ZOTAC' },
    { id: 'other_gpu', name: 'その他' },
  ],
  motherboard: [
    { id: 'asus', name: 'ASUS' },
    { id: 'msi', name: 'MSI' },
    { id: 'gigabyte', name: 'GIGABYTE' },
    { id: 'asrock', name: 'ASRock' },
    { id: 'other_mb', name: 'その他' },
  ],
  memory: [
    { id: 'corsair', name: 'Corsair' },
    { id: 'gskill', name: 'G.Skill' },
    { id: 'crucial', name: 'Crucial' },
    { id: 'kingston', name: 'Kingston' },
    { id: 'teamgroup', name: 'Team Group' },
    { id: 'other_memory', name: 'その他' },
  ],
  storage: [
    { id: 'samsung', name: 'Samsung' },
    { id: 'western_digital', name: 'Western Digital' },
    { id: 'seagate', name: 'Seagate' },
    { id: 'crucial', name: 'Crucial' },
    { id: 'kingston', name: 'Kingston' },
    { id: 'sandisk', name: 'SanDisk' },
    { id: 'other_storage', name: 'その他' },
  ],
  case: [
    { id: 'corsair', name: 'Corsair' },
    { id: 'nzxt', name: 'NZXT' },
    { id: 'fractal', name: 'Fractal Design' },
    { id: 'cooler_master', name: 'Cooler Master' },
    { id: 'lian_li', name: 'Lian Li' },
    { id: 'phanteks', name: 'Phanteks' },
    { id: 'thermaltake', name: 'Thermaltake' },
    { id: 'other_case', name: 'その他' },
  ],
  power_supply: [
    { id: 'corsair', name: 'Corsair' },
    { id: 'seasonic', name: 'Seasonic' },
    { id: 'evga', name: 'EVGA' },
    { id: 'cooler_master', name: 'Cooler Master' },
    { id: 'thermaltake', name: 'Thermaltake' },
    { id: 'be_quiet', name: 'be quiet!' },
    { id: 'other_psu', name: 'その他' },
  ],
  cooling: [
    { id: 'noctua', name: 'Noctua' },
    { id: 'corsair', name: 'Corsair' },
    { id: 'cooler_master', name: 'Cooler Master' },
    { id: 'nzxt', name: 'NZXT' },
    { id: 'be_quiet', name: 'be quiet!' },
    { id: 'arctic', name: 'Arctic' },
    { id: 'other_cooling', name: 'その他' },
  ],
  peripheral: [
    { id: 'logitech', name: 'Logitech' },
    { id: 'razer', name: 'Razer' },
    { id: 'corsair', name: 'Corsair' },
    { id: 'steelseries', name: 'SteelSeries' },
    { id: 'hyperx', name: 'HyperX' },
    { id: 'other_peripheral', name: 'その他' },
  ],
  accessory: [
    { id: 'various', name: 'メーカー各種' },
    { id: 'other_accessory', name: 'その他' },
  ],
  other: [
    { id: 'various', name: 'メーカー各種' },
    { id: 'other_misc', name: 'その他' },
  ],
};

// シリーズ定義を拡充
const series = {
  // CPUシリーズ
  intel: [
    { id: 'i9', name: 'Core i9' },
    { id: 'i7', name: 'Core i7' },
    { id: 'i5', name: 'Core i5' },
    { id: 'i3', name: 'Core i3' },
    { id: 'pentium', name: 'Pentium' },
    { id: 'celeron', name: 'Celeron' },
    { id: 'xeon', name: 'Xeon' },
    { id: 'other_intel', name: 'その他' },
  ],
  amd: [
    { id: 'ryzen9', name: 'Ryzen 9' },
    { id: 'ryzen7', name: 'Ryzen 7' },
    { id: 'ryzen5', name: 'Ryzen 5' },
    { id: 'ryzen3', name: 'Ryzen 3' },
    { id: 'athlon', name: 'Athlon' },
    { id: 'threadripper', name: 'Threadripper' },
    { id: 'epyc', name: 'EPYC' },
    { id: 'other_amd', name: 'その他' },
  ],
  
  // GPUシリーズ
  nvidia: [
    { id: 'rtx_4000', name: 'RTX 4000シリーズ' },
    { id: 'rtx_3000', name: 'RTX 3000シリーズ' },
    { id: 'rtx_2000', name: 'RTX 2000シリーズ' },
    { id: 'gtx_1000', name: 'GTX 1000シリーズ' },
    { id: 'gtx_900', name: 'GTX 900シリーズ' },
    { id: 'quadro', name: 'Quadro' },
    { id: 'other_nvidia', name: 'その他' },
  ],
  amd_gpu: [
    { id: 'rx_7000', name: 'RX 7000シリーズ' },
    { id: 'rx_6000', name: 'RX 6000シリーズ' },
    { id: 'rx_5000', name: 'RX 5000シリーズ' },
    { id: 'rx_500', name: 'RX 500シリーズ' },
    { id: 'radeon_pro', name: 'Radeon Pro' },
    { id: 'other_amd_gpu', name: 'その他' },
  ],
  
  // マザーボードシリーズ
  asus: [
    { id: 'rog', name: 'ROG (Republic of Gamers)' },
    { id: 'tuf', name: 'TUF Gaming' },
    { id: 'prime', name: 'Prime' },
    { id: 'proart', name: 'ProArt' },
    { id: 'other_asus', name: 'その他' },
  ],
  msi: [
    { id: 'meg', name: 'MEG' },
    { id: 'mpg', name: 'MPG' },
    { id: 'mag', name: 'MAG' },
    { id: 'pro', name: 'PRO' },
    { id: 'other_msi', name: 'その他' },
  ],
  gigabyte: [
    { id: 'aorus', name: 'AORUS' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'ultra_durable', name: 'Ultra Durable' },
    { id: 'other_gigabyte', name: 'その他' },
  ],
  asrock: [
    { id: 'taichi', name: 'Taichi' },
    { id: 'phantom_gaming', name: 'Phantom Gaming' },
    { id: 'steel_legend', name: 'Steel Legend' },
    { id: 'pro', name: 'Pro' },
    { id: 'other_asrock', name: 'その他' },
  ],
  
  // メモリシリーズ
  corsair: [
    { id: 'vengeance', name: 'Vengeance' },
    { id: 'dominator', name: 'Dominator' },
    { id: 'other_corsair_memory', name: 'その他' },
  ],
  gskill: [
    { id: 'trident_z', name: 'Trident Z' },
    { id: 'ripjaws', name: 'Ripjaws' },
    { id: 'other_gskill', name: 'その他' },
  ],
  crucial: [
    { id: 'ballistix', name: 'Ballistix' },
    { id: 'other_crucial_memory', name: 'その他' },
  ],
  kingston: [
    { id: 'hyperx_fury', name: 'HyperX Fury' },
    { id: 'hyperx_predator', name: 'HyperX Predator' },
    { id: 'other_kingston_memory', name: 'その他' },
  ],
  teamgroup: [
    { id: 't_force', name: 'T-Force' },
    { id: 'other_teamgroup', name: 'その他' },
  ],
  
  // ストレージシリーズ
  samsung: [
    { id: '970_evo', name: '970 EVO' },
    { id: '980_pro', name: '980 PRO' },
    { id: '870_evo', name: '870 EVO' },
    { id: 'other_samsung', name: 'その他' },
  ],
  western_digital: [
    { id: 'black', name: 'WD Black' },
    { id: 'blue', name: 'WD Blue' },
    { id: 'red', name: 'WD Red' },
    { id: 'other_wd', name: 'その他' },
  ],
  seagate: [
    { id: 'barracuda', name: 'Barracuda' },
    { id: 'firecuda', name: 'FireCuda' },
    { id: 'ironwolf', name: 'IronWolf' },
    { id: 'other_seagate', name: 'その他' },
  ],
  
  // PCケースシリーズ
  nzxt: [
    { id: 'h_series', name: 'Hシリーズ' },
    { id: 'other_nzxt', name: 'その他' },
  ],
  fractal: [
    { id: 'define', name: 'Define' },
    { id: 'meshify', name: 'Meshify' },
    { id: 'other_fractal', name: 'その他' },
  ],
  cooler_master: [
    { id: 'mastercase', name: 'MasterCase' },
    { id: 'masterbox', name: 'MasterBox' },
    { id: 'other_cm_case', name: 'その他' },
  ],
  
  // 他のブランドにもシリーズを追加（省略）
  
  // すべてのカテゴリーに「その他」を追加
  other_cpu: [{ id: 'various', name: 'その他の種類' }],
  other_gpu: [{ id: 'various', name: 'その他の種類' }],
  other_mb: [{ id: 'various', name: 'その他の種類' }],
  other_memory: [{ id: 'various', name: 'その他の種類' }],
  other_storage: [{ id: 'various', name: 'その他の種類' }],
  other_case: [{ id: 'various', name: 'その他の種類' }],
  other_psu: [{ id: 'various', name: 'その他の種類' }],
  other_cooling: [{ id: 'various', name: 'その他の種類' }],
  other_peripheral: [{ id: 'various', name: 'その他の種類' }],
  other_accessory: [{ id: 'various', name: 'その他の種類' }],
  other_misc: [{ id: 'various', name: 'その他の種類' }],
  
  // 汎用的な「その他」オプション
  various: [{ id: 'various_series', name: 'その他' }],
};

export default function SellPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  // フォーム状態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [productSeries, setProductSeries] = useState('');
  
  // 画像関連の状態
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // カテゴリー変更時にブランドとシリーズをリセット
  useEffect(() => {
    setBrand('');
    setProductSeries('');
  }, [category]);

  // ブランド変更時にシリーズをリセット
  useEffect(() => {
    setProductSeries('');
  }, [brand]);

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/sell');
    }
  }, [user, authLoading, router]);

  // 画像プレビュー生成
  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map(image => URL.createObjectURL(image));
      setImageUrls(urls);
      
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [images]);

  // 画像選択ハンドラー
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // 画像の数制限チェック
    if (images.length + e.target.files.length > 5) {
      alert('画像は最大5枚までアップロードできます');
      return;
    }
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrls([...imageUrls, reader.result]);
        setImages([...images, file]);
      }
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // 画像削除ハンドラー
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // カテゴリーのみ必須チェック（ブランドとシリーズは任意）
    if (!title || !description || !price || !condition || !category || images.length === 0) {
      setError('すべての必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // ブランドとシリーズの名前を取得
      const brandInfo = brand ? brands[category as keyof typeof brands]?.find(b => b.id === brand)?.name || brand : '';
      const seriesInfo = productSeries && series[brand as keyof typeof series] ? 
        series[brand as keyof typeof series]?.find(s => s.id === productSeries)?.name || productSeries : '';
      
      // カテゴリー名を取得
      const categoryName = categories.find(c => c.id === category)?.name || category;
      
      console.log('送信データ:', {
        title,
        description,
        price,
        condition,
        category,
        categoryName,
        brand,
        brandInfo,
        productSeries,
        seriesInfo,
        seller_id: user?.id
      });
      
      // 商品情報をタグに変換
      const productTags = [
        categoryName,
        brandInfo,
        seriesInfo
      ].filter(Boolean); // 空の値を除外
      
      // 商品の登録処理
      const priceNum = parseFloat(price);
      
      // ブランドとシリーズの情報を説明に含める
      const enhancedDescription = `${description}\n\n【商品情報】\nカテゴリー: ${categoryName}\nブランド: ${brandInfo}\nシリーズ: ${seriesInfo}`;
      
      // 商品データの登録（先に登録）
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert([
          {
            title,
            description: enhancedDescription,
            price: priceNum,
            condition,
            category,
            tags: productTags,
            seller_id: user?.id,
          }
        ])
        .select()
        .single();

      if (itemError) {
        console.error('商品データ登録エラー:', JSON.stringify(itemError));
        throw itemError;
      }

      console.log('商品データ登録成功:', itemData);
      
      // 画像処理（商品登録後に実行 - これが編集ページの方法と同じ）
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `item-images/${fileName}`;
        
        try {
          // 画像をアップロード（バケット名を確認）
          const { error: uploadError } = await supabase.storage
            .from('items') // ここのバケット名が編集画面と同じであることを確認
            .upload(filePath, image);
            
          if (uploadError) {
            console.error('画像アップロードエラー:', uploadError);
            continue; // 次の画像に進む
          }
          
          // 画像のURLを取得
          const { data: urlData } = supabase.storage
            .from('items') // バケット名が同じであることを確認
            .getPublicUrl(filePath);
          
          if (!urlData || !urlData.publicUrl) {
            console.error('画像URLの取得に失敗');
            continue;
          }
          
          // 画像情報をデータベースに登録
          console.log('画像情報の登録を試みます:', {
            item_id: itemData.id,
            url: urlData.publicUrl,
            is_primary: i === 0
          });

          const { data: imageData, error: imageError } = await supabase
            .from('item_images')
            .insert({
              item_id: itemData.id,
              url: urlData.publicUrl,
              is_primary: i === 0, // 最初の画像をプライマリに
              storage_path: filePath // ストレージパスも保存
            })
            .select();

          if (imageError) {
            console.error('画像情報登録エラー詳細:', JSON.stringify(imageError));
          } else {
            console.log('画像情報登録成功:', imageData);
          }
        } catch (err) {
          console.error('画像処理エラー:', err);
        }
      }

      console.log('出品処理完了');
      router.push(`/items/${itemData.id}`);
    } catch (error: any) {
      console.error('出品エラー:', error);
      setError('出品に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">商品を出品する</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 商品画像 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            商品画像 <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">最大5枚までアップロードできます。1枚目が表紙になります。</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-500 text-3xl">+</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 商品名 */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            商品名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: Intel Core i9-12900K CPU"
            maxLength={100}
            required
          />
        </div>

        {/* 商品説明 */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            商品の説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="商品の詳細な説明を入力してください。状態、使用期間、付属品などを記載すると良いでしょう。"
            rows={5}
            maxLength={2000}
            required
          />
          <p className="text-sm text-gray-500 mt-1">{description.length}/2000</p>
        </div>

        {/* 商品の状態 */}
        <div className="mb-6">
          <label htmlFor="condition" className="block text-gray-700 font-medium mb-2">
            商品の状態 <span className="text-red-500">*</span>
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            <option value="新品">新品</option>
            <option value="中古-良い">中古-良い</option>
            <option value="中古-普通">中古-普通</option>
            <option value="中古-悪い">中古-悪い</option>
          </select>
        </div>

        {/* 価格 */}
        <div className="mb-6">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
            販売価格 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2">¥</span>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="300"
              min="300"
              max="9999999"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">300円〜9,999,999円</p>
        </div>

        {/* カテゴリー（階層的選択） */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* カテゴリー */}
            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">選択してください</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ブランド（カテゴリーが選択されたら表示、必須ではない） */}
            <div>
              <label htmlFor="brand" className="block text-gray-700 font-medium mb-2">
                ブランド
              </label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!category}
              >
                <option value="">選択してください</option>
                {category && brands[category as keyof typeof brands]?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* シリーズ（ブランドが選択されたら表示、必須ではない） */}
            <div>
              <label htmlFor="series" className="block text-gray-700 font-medium mb-2">
                シリーズ
              </label>
              <select
                id="series"
                value={productSeries}
                onChange={(e) => setProductSeries(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!brand || !series[brand as keyof typeof series]}
              >
                <option value="">選択してください</option>
                {brand && series[brand as keyof typeof series]?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? '処理中...' : '出品する'}
          </Button>
        </div>
      </form>
    </div>
  );
} 