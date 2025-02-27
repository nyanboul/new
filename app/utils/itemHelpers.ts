export function getConditionColor(condition: string) {
  switch (condition) {
    case '新品':
      return 'bg-green-500';
    case '未使用に近い':
      return 'bg-emerald-500';
    case '目立った傷や汚れなし':
      return 'bg-blue-500';
    case 'やや傷や汚れあり':
      return 'bg-yellow-500';
    case '傷や汚れあり':
      return 'bg-orange-500';
    case '全体的に状態が悪い':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
} 