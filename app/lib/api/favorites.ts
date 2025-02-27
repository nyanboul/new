import { supabase } from '../supabase-client';

export const favoritesApi = {
  async toggleFavorite(itemId: string, userId: string) {
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
      return false; // お気に入り解除
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, item_id: itemId }]);
      
      if (error) throw error;
      return true; // お気に入り追加
    }
  }
}; 