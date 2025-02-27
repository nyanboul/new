'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // エラーメッセージをクリア
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/mypage');
    } catch (err: any) {
      // エラーメッセージをより具体的に
      if (err.message === 'Invalid login credentials') {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else if (err.message === 'Email not confirmed') {
        setError('メールアドレスの確認が完了していません。メールをご確認ください');
      } else {
        setError('ログインに失敗しました。しばらく経ってからお試しください');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <AuthLayout title="ログイン">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="メールアドレス"
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <Input
          label="パスワード"
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <div className="space-y-4">
          <Button type="submit" fullWidth>
            ログイン
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              アカウントをお持ちでない方は{' '}
            </span>
            <Link
              href="/auth/register"
              className="text-sm text-[#6C3CE1] hover:underline"
            >
              新規登録
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gray-600 hover:underline"
          >
            パスワードをお忘れの方
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
} 