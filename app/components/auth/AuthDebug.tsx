'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AuthDebug() {
  const { user } = useAuth();

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Current session:', session, 'Error:', error);
  };

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Current user:', user, 'Error:', error);
  };

  return process.env.NODE_ENV === 'development' ? (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs">
      <pre>{JSON.stringify({ user }, null, 2)}</pre>
      <button onClick={checkSession}>Check Session</button>
      <button onClick={checkUser}>Check User</button>
    </div>
  ) : null;
} 