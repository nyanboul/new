// 階層構造を持つカテゴリー定義
export const HIERARCHICAL_CATEGORIES = {
  'CPU': {
    'インテル': [
      'Core i9', 'Core i7', 'Core i5', 'Core i3', 'Pentium', 'Celeron'
    ],
    'AMD': [
      'Ryzen 9', 'Ryzen 7', 'Ryzen 5', 'Ryzen 3', 'Athlon'
    ],
    'ソケット': [
      'LGA 1700', 'LGA 1200', 'Socket AM4', 'Socket AM5'
    ],
    '世代': [
      '第13世代', '第12世代', '第11世代', '第10世代', 'Zen 4', 'Zen 3', 'Zen 2'
    ]
  },
  'メモリ': {
    'タイプ': [
      'DDR5', 'DDR4', 'DDR3', 'SODIMM'
    ],
    '容量': [
      '4GB', '8GB', '16GB', '32GB', '64GB', '128GB'
    ],
    '速度': [
      'DDR5-6400', 'DDR5-6000', 'DDR5-5600', 'DDR5-4800',
      'DDR4-4800', 'DDR4-4000', 'DDR4-3600', 'DDR4-3200', 'DDR4-2666',
      'DDR3-2400', 'DDR3-2133', 'DDR3-1866', 'DDR3-1600'
    ]
  },
  'GPU': {
    'NVIDIA': [
      'RTX 4090', 'RTX 4080', 'RTX 4070', 'RTX 4060', 'RTX 4050',
      'RTX 3090', 'RTX 3080', 'RTX 3070', 'RTX 3060', 'RTX 3050',
      'GTX 1660', 'GTX 1650', 'GTX 1630'
    ],
    'AMD': [
      'RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7700 XT', 'RX 7600',
      'RX 6950 XT', 'RX 6900 XT', 'RX 6800 XT', 'RX 6700 XT', 'RX 6600 XT'
    ],
    'VRAM': [
      '24GB', '16GB', '12GB', '10GB', '8GB', '6GB', '4GB'
    ],
    'メーカー': [
      'ASUS', 'MSI', 'GIGABYTE', 'EVGA', 'Zotac', 'Palit', 'GALAX', 'Sapphire'
    ]
  },
  'ストレージ': {
    'SSD': [
      'NVMe SSD', 'SATA SSD', 'M.2 SSD', '2.5インチSSD'
    ],
    'HDD': [
      '内蔵HDD', '外付けHDD', '3.5インチHDD', '2.5インチHDD'
    ],
    '容量': [
      '250GB', '500GB', '1TB', '2TB', '4TB', '8TB', '10TB', '16TB'
    ],
    'インターフェース': [
      'PCIe 5.0', 'PCIe 4.0', 'PCIe 3.0', 'SATA3', 'USB 3.2', 'USB 3.1', 'USB-C'
    ]
  },
  'モニター': {
    'リフレッシュレート': [
      '60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '165Hz', '240Hz', '360Hz', '500Hz'
    ],
    'サイズ': [
      '24インチ', '27インチ', '32インチ', '34インチ', '49インチ'
    ],
    'パネル': [
      'IPSパネル', 'VAパネル', 'TNパネル', 'OLEDパネル', 'Mini LED'
    ],
    '解像度': [
      'フルHD', 'WQHD', '4K', '5K', '8K', 'ウルトラワイド'
    ],
    '機能': [
      'G-SYNC', 'FreeSync', 'HDR対応', 'HDMI 2.1', 'DisplayPort 1.4', 'USB-C'
    ]
  },
  'キーボード': {
    'タイプ': [
      'メカニカル', 'メンブレン', 'パンタグラフ', '光学式スイッチ'
    ],
    '接続方式': [
      '有線', 'ワイヤレス', 'Bluetooth', '2.4GHz'
    ],
    'レイアウト': [
      'フルサイズ', 'テンキーレス', '60%', '65%', '75%', '80%'
    ],
    'スイッチ': [
      'Cherry MX Red', 'Cherry MX Blue', 'Cherry MX Brown', 'Gateron', 'Kailh', 'Outemu'
    ]
  },
  'マウス': {
    'タイプ': [
      'ゲーミング', 'オフィス用', 'トラックボール', '人間工学'
    ],
    '接続方式': [
      '有線', 'ワイヤレス', 'Bluetooth', '2.4GHz', 'デュアルモード'
    ],
    'センサー': [
      '光学式', 'レーザー', 'HERO', 'PAW3370', 'PMW3389'
    ],
    'DPI': [
      '1000-8000', '8000-16000', '16000-26000', '26000以上'
    ]
  },
  'マザーボード': {
    'フォームファクター': [
      'ATX', 'micro-ATX', 'mini-ITX', 'E-ATX'
    ],
    'インテル用': [
      'Z790', 'Z690', 'B760', 'B660', 'H670', 'H610'
    ],
    'AMD用': [
      'X670E', 'X670', 'B650E', 'B650', 'X570', 'B550', 'A520'
    ],
    '機能': [
      'PCIe 5.0対応', 'DDR5対応', 'DDR4対応', 'Wi-Fi内蔵', 'Bluetooth内蔵', 'RGB対応'
    ]
  },
  'PCケース': {
    'サイズ': [
      'フルタワー', 'ミドルタワー', 'ミニタワー'
    ],
    '対応規格': [
      'ATX対応', 'micro-ATX対応', 'mini-ITX対応', 'E-ATX対応'
    ],
    '冷却': [
      'エアフロー型', '静音型', '水冷対応', 'ファン付き'
    ]
  },
  '電源': {
    '出力': [
      '500W', '550W', '650W', '750W', '850W', '1000W', '1200W以上'
    ],
    '規格': [
      '80PLUS Bronze', '80PLUS Silver', '80PLUS Gold', '80PLUS Platinum', '80PLUS Titanium'
    ],
    'タイプ': [
      'フルモジュラー', 'セミモジュラー', '非モジュラー', 'SFX', 'ATX'
    ]
  },
  '冷却': {
    'CPUクーラー': [
      '空冷', '水冷', '簡易水冷'
    ],
    'ファンサイズ': [
      '120mm', '140mm', '240mm', '280mm', '360mm'
    ],
    'ファンタイプ': [
      'PWM', 'RGB対応', '静音', '高風量', 'ケースファン'
    ]
  },
  'ネットワーク': {
    'Wi-Fi': [
      'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7', 'メッシュWi-Fi'
    ],
    '有線': [
      'ギガビット', '10ギガビット', 'Cat 6', 'Cat 6a', 'Cat 7', 'Cat 8'
    ],
    'ルーター': [
      'ゲーミング', 'トライバンド', 'デュアルバンド', 'VPN対応'
    ]
  }
};

// 互換性のために平坦なカテゴリー構造も提供
export const CATEGORIES = Object.entries(HIERARCHICAL_CATEGORIES).reduce((acc, [category, subcategories]) => {
  acc[category] = Object.values(subcategories).flat();
  return acc;
}, {} as {[key: string]: string[]}); 