/**
 * タグの同義語マッピング
 * キー: 元のタグ名
 * 値: 同義語の配列
 */
export const TAG_SYNONYMS: Record<string, string[]> = {
  // カテゴリレベルの同義語
  'CPU': ['プロセッサー', 'プロセッサ', 'シーピーユー'],
  'GPU': ['グラフィックカード', 'グラフィックボード', 'グラボ', 'ビデオカード'],
  'マザーボード': ['マザボ', 'マザー', '基盤'],
  'メモリ': ['RAM', 'メモリー', 'DRAM'],
  'ストレージ': ['SSD', 'HDD', 'NVMe', 'ハードディスク'],
  'PCケース': ['ケース', 'シャーシ'],
  '電源': ['PSU', 'パワーサプライ'],
  'モニター': ['ディスプレイ', 'ディスプレー', '液晶', 'モニタ'],
  
  // ブランドレベルの同義語
  'Intel': ['インテル'],
  'AMD': ['エーエムディー'],
  'NVIDIA': ['エヌビディア', 'ンビディア'],
  'ASUS': ['エイスース', 'アスース'],
  'MSI': ['エムエスアイ'],
  'GIGABYTE': ['ギガバイト'],
  
  // モデルレベルの同義語
  'Core i9': ['i9', 'アイナイン'],
  'Core i7': ['i7', 'アイセブン'],
  'Core i5': ['i5', 'アイファイブ'],
  'Ryzen 9': ['ライゼン9'],
  'Ryzen 7': ['ライゼン7'],
  'Ryzen 5': ['ライゼン5'],
  'RTX 4090': ['4090'],
  'RTX 4080': ['4080'],
  'RTX 4070': ['4070'],
};

/**
 * タグの同義語を取得する
 * @param tag 元のタグ
 * @returns 同義語を含む配列
 */
export function getTagSynonyms(tag: string): string[] {
  // 元のタグも含める
  const synonyms = [tag];
  
  // 定義されている同義語を追加
  if (TAG_SYNONYMS[tag]) {
    synonyms.push(...TAG_SYNONYMS[tag]);
  }
  
  return synonyms;
}

/**
 * 複数タグの同義語をすべて取得する
 * @param tags タグの配列
 * @returns 同義語を含む配列
 */
export function getAllTagSynonyms(tags: string[]): string[] {
  const allSynonyms: string[] = [];
  
  tags.forEach(tag => {
    allSynonyms.push(tag);
    if (TAG_SYNONYMS[tag]) {
      allSynonyms.push(...TAG_SYNONYMS[tag]);
    }
  });
  
  // 重複を排除して返す
  return [...new Set(allSynonyms)];
} 