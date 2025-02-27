export const CATEGORIES: Record<string, string[]> = {
  cpu: ['Intel', 'AMD', 'Celeron', 'Pentium', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'],
  gpu: ['NVIDIA', 'AMD', 'GeForce', 'Radeon', 'RTX', 'GTX', 'ASUS', 'MSI', 'GIGABYTE', 'EVGA', 'ZOTAC'],
  motherboard: ['ATX', 'Micro-ATX', 'Mini-ITX', 'ASUS', 'MSI', 'GIGABYTE', 'ASRock', 'Intel', 'AMD'],
  memory: ['DDR4', 'DDR5', 'Corsair', 'G.Skill', 'Crucial', 'Kingston', 'Team Group'],
  storage: ['SSD', 'HDD', 'NVMe', 'Samsung', 'Western Digital', 'Seagate', 'Crucial', 'Kingston', 'SanDisk'],
  case: ['ATX', 'Micro-ATX', 'Mini-ITX', 'Corsair', 'NZXT', 'Fractal Design', 'Cooler Master', 'Lian Li', 'Phanteks', 'Thermaltake'],
  power_supply: ['ATX', 'SFX', 'Modular', 'Semi-Modular', 'Corsair', 'Seasonic', 'EVGA', 'Cooler Master', 'be quiet!'],
  cooling: ['Air Cooler', 'Liquid Cooler', 'AIO', 'Noctua', 'Corsair', 'NZXT', 'be quiet!', 'Arctic'],
  peripheral: ['Keyboard', 'Mouse', 'Monitor', 'Headphones', 'Logitech', 'Razer', 'Corsair', 'SteelSeries', 'HyperX'],
  accessory: ['Cable', 'Adapter', 'Fan', 'RGB', 'Controller'],
  other: ['Various', 'Other']
};

// カテゴリーキーの型を定義
export type CategoryKey = keyof typeof CATEGORIES; 