'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // セッションの確認
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session');
        setUser(null);
        return;
      }

      // プロフィール取得
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // エラーの詳細をログ出力
        console.error('Profile fetch error:', {
          code: error.code,
          message: error.message,
          details: error.details
        });

        // プロフィールが存在しない場合は新規作成
        if (error.code === 'PGRST116') {
          console.log('Creating new profile for:', authUser.id);
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authUser.id,
                email: authUser.email,
                username: authUser.user_metadata?.username || `user_${authUser.id.slice(0, 8)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Profile creation error:', insertError);
            throw insertError;
          }

          console.log('New profile created:', newProfile);
          setUser(newProfile);
          return;
        }

        throw error;
      }

      console.log('Profile found:', data);
      setUser(data);
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', {
        error: error.message,
        details: error.details,
        stack: error.stack
      });
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data);

      if (data.user) {
        await fetchUserProfile(data.user);
      } else {
        console.error('No user data received after login');
        throw new Error('Login failed: No user data');
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (authError) throw authError;

      void authData;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...profile });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 