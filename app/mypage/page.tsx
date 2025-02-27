'use client';

import { useAuth } from '@/contexts/AuthContext';
import MypageLayout from '@/components/mypage/MypageLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // ログアウト後はトップページへ
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <MypageLayout>
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">マイページ</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ログアウト
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">プロフィール情報</h2>
              <div className="mt-2 space-y-2 text-gray-600">
                <p>ユーザー名: {user.username || '未設定'}</p>
                <p>メールアドレス: {user.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/mypage/profile" 
                className="text-gray-900 hover:text-gray-600"
              >
                プロフィールを編集
              </Link>
            </div>
          </div>
        </div>

        {/* アカウント管理セクション */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">アカウント管理</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">アカウントの削除</h3>
                <p className="text-sm text-gray-500">一度削除すると元に戻せません</p>
              </div>
              <button
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                onClick={() => {
                  // アカウント削除の確認ダイアログを表示する処理を追加予定
                  alert('この機能は現在準備中です');
                }}
              >
                アカウントを削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </MypageLayout>
  );
} 