import { supabase } from './supabase';

// 商品関連
export const itemsApi = {
  // 商品を出品
  async createItem(itemData: any) {
    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ユーザーの出品商品を取得
  async getUserItems(userId: string) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        item_images (*)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // お気に入りに追加/削除
  async toggleFavorite(userId: string, itemId: string) {
    const { data: existing } = await supabase
      .from('favorites')
      .select()
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, item_id: itemId }]);
      if (error) throw error;
      return true;
    }
  }
}; 