import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/Layout/ThemeToggle';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-gray-50 to-sage-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-sage-300/25 dark:bg-sage-900/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-sage-200/35 dark:bg-sage-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-sage-100/40 dark:bg-sage-800/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-end p-4 relative z-10">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-500 rounded-2xl mb-5 shadow-lg shadow-sage-300/60 dark:shadow-sage-900/40">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Solace
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Your safe space to breathe, reflect, and grow
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/85 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-sage-100 dark:border-gray-800 p-8 shadow-2xl shadow-sage-200/40 dark:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition-all placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition-all placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-sage-500 hover:bg-sage-600 active:bg-sage-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-sage-300/40 dark:shadow-none hover:shadow-lg hover:shadow-sage-300/50 hover:-translate-y-0.5 active:translate-y-0 mt-2"
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-sage-600 dark:text-sage-400 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5">
            Your conversations are private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
