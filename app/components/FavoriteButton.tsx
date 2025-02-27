'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface FavoriteButtonProps {
  itemId: string;
  initialIsFavorite?: boolean;
  className?: string;
}

export default function FavoriteButton({ 
  itemId, 
  initialIsFavorite = false,
  className = ''
}: FavoriteButtonProps) {
  const { user, isLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  // ログイン時にリスト状態を取得
  useEffect(() => {
    if (!user || isLoading) return;

    const checkListStatus = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle();

      if (!error && data) {
        setIsFavorite(true);
      }
    };

    checkListStatus();
  }, [user, itemId, isLoading]);

  const toggleList = async () => {
    if (!user) {
      // 未ログインの場合はログインページへリダイレクト
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      if (isFavorite) {
        // リストから削除
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // リストに追加
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, item_id: itemId });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('リスト更新に失敗しました', error);
      alert('リストの更新に失敗しました。再度お試しください。');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={toggleList}
      disabled={isUpdating || isLoading}
      className={`transition-colors ${className}`}
      aria-label={isFavorite ? 'リストから削除' : 'リストに追加'}
    >
      {/* インラインSVGを使用 */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={`w-6 h-6 ${isFavorite ? 'fill-blue-500 text-blue-500' : 'fill-none text-gray-500 hover:text-blue-500'}`}
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
        />
      </svg>
    </button>
  );
} 