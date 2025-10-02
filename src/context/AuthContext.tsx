import { createContext } from 'react';
import type { User } from '@/types';

export interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

// Giá trị mặc định để IDE có type; sẽ bị override bởi Provider
export const AuthContext = createContext<AuthCtx>({
  user: null, loading: true, login: async () => {}, logout: () => {},
});
