import { supabase } from '@/lib/supabase';

export const itemsApi = {
  async getItems() {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        seller:profiles(*),
        category:categories(*),
        images:item_images(*)
      `)
      .eq('status', 'on_sale')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getItemById(id: string) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        seller:profiles(*),
        category:categories(*),
        images:item_images(*),
        tags:item_tags(tags(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}; 