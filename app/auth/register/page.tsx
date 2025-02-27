'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // バリデーション
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      router.push('/mypage'); // 登録成功後、マイページへ遷移
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。');
      console.error('Registration error:', err);
    }
  };

  return (
    <AuthLayout title="新規アカウント登録">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="ユーザー名"
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />

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
          autoComplete="new-password"
          minLength={8}
        />

        <Input
          label="パスワード（確認）"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
        />

        <div className="space-y-4">
          <Button type="submit" fullWidth>
            登録する
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は{' '}
            </span>
            <Link
              href="/auth/login"
              className="text-sm text-[#6C3CE1] hover:underline"
            >
              ログイン
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              登録することで、
              <Link href="/terms" className="text-[#6C3CE1] hover:underline">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-[#6C3CE1] hover:underline">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
} 