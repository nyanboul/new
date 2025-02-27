'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profilesApi } from '@/lib/api/profiles';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MypageLayout from '@/components/mypage/MypageLayout';

export default function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    location: '',
    phone_number: '',
    shipping_address: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // 初期データの取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const data = await profilesApi.getProfile(user.id);
        if (data) {
          setProfile({
            username: data.username || '',
            bio: data.bio || '',
            location: data.location || '',
            phone_number: data.phone_number || '',
            shipping_address: data.shipping_address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // プロフィールを更新
      const updatedProfile = await profilesApi.updateProfile(user.id, {
        username: profile.username,
        bio: profile.bio,
        location: profile.location,
        phone_number: profile.phone_number,
        shipping_address: profile.shipping_address,
        updated_at: new Date().toISOString()
      });

      // AuthContextのユーザー情報も更新
      await updateProfile({
        username: updatedProfile.username,
      });

      setMessage({ type: 'success', text: 'プロフィールを更新しました' });
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: '更新に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' }); // メッセージをクリア
  };

  if (!user) return null;

  return (
    <MypageLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>

        {message.text && (
          <div
            className={`p-4 rounded mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="ユーザー名"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自己紹介
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
            />
          </div>

          <Input
            label="所在地"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />

          <Input
            label="電話番号"
            name="phone_number"
            type="tel"
            value={profile.phone_number}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配送先住所
            </label>
            <textarea
              name="shipping_address"
              value={profile.shipping_address}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? '更新中...' : '更新する'}
          </Button>
        </form>
      </div>
    </MypageLayout>
  );
} 