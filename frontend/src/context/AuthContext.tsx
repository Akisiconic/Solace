import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; user: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER': return { user: action.user, loading: false };
    case 'CLEAR_USER': return { user: null, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.loading };
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: true });

  // On mount, check if there's an active session via the cookie
  useEffect(() => {
    authApi.me()
      .then((user) => dispatch({ type: 'SET_USER', user }))
      .catch(() => dispatch({ type: 'CLEAR_USER' }));
  }, []);

  async function login(email: string, password: string) {
    const { user } = await authApi.login(email, password);
    dispatch({ type: 'SET_USER', user });
  }

  async function register(name: string, email: string, password: string) {
    const { user } = await authApi.register(name, email, password);
    dispatch({ type: 'SET_USER', user });
  }

  async function logout() {
    await authApi.logout();
    dispatch({ type: 'CLEAR_USER' });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
