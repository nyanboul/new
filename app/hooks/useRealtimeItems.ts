import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeItems(userId: string) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 初期データの取得
    fetchItems();

    // リアルタイムサブスクリプション
    const subscription = supabase
      .channel('items')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `seller_id=eq.${userId}`
        },
        (payload) => {
          // データの更新処理
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', userId);
    setItems(data || []);
  };

  return items;
} 