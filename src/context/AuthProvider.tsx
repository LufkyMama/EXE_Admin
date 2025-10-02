// src/context/AuthProvider.tsx
import { useEffect, useMemo, useState } from 'react';
import { getMe } from '@/services/userApi';
import { login as apiLogin } from '@/services/authApi';
import { AuthContext } from './AuthContext';
import type { User } from '@/types';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const prime = async () => {
    const t = localStorage.getItem('token');
    if (!t) { setUser(null); setLoading(false); return; }
    try {
      const u = await getMe();
      setUser(u);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { prime(); }, []);

  const ctx = useMemo(() => ({
    user,
    loading,
    login: async (emailOrUserName: string, password: string) => {
      const { token, user } = await apiLogin(emailOrUserName, password);
      localStorage.setItem('token', token);
      setUser(user ?? null);
      // Nếu không chắc BE luôn trả user, có thể fallback:
      if (!user) await prime();
    },
    logout: () => {
      localStorage.removeItem('token');
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
