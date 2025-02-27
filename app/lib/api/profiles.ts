import { supabase } from '@/lib/supabase';
import type { ProfileUpdate } from '@/types/database';

export const profilesApi = {
  // プロフィール取得
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
    return data;
  },

  // プロフィール更新
  async updateProfile(userId: string, profile: ProfileUpdate) {
    console.log('Updating profile:', { userId, profile });

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Profile update error:', error);
      throw error;
    }
    
    console.log('Profile updated:', data);
    return data;
  },

  // プロフィール画像アップロード
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return this.updateProfile(userId, { avatar_url: publicUrl });
  }
}; 