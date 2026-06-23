import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register, googleLoginHandler, githubLoginHandler } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // GitHub Auth Redirect Handler
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setLoading(true);
      githubLoginHandler(code)
        .then(() => {
          toast.success('Successfully logged in with GitHub!', {
            style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
          });
          navigate('/');
        })
        .catch(() => {
          toast.error('GitHub login failed');
          setLoading(false);
        });
    }
  }, [searchParams]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLoginHandler(tokenResponse.access_token);
        toast.success('Successfully logged in with Google!', {
          style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
        });
        navigate('/');
      } catch (error) {
        toast.error('Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back!', {
          style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
        });
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome to AI Tools.', {
          style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
        });
      }
      navigate('/');
    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-600/15 to-transparent rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
        {/* Logo removed */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mt-4">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isLogin ? 'Sign in to bookmark tools and more' : 'Join 24K+ AI enthusiasts'}
          </p>
        </div>

        <div className="glass p-8">
          {/* Toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {['Sign In', 'Sign Up'].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  (i === 0) === isLogin
                    ? 'bg-violet-600 text-white shadow-accent-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="John Doe"
                  className="input-glass"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                className="input-glass"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="••••••••"
                  className="input-glass pr-11"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() => {
                  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id';
                  const redirectUri = window.location.origin + '/login';
                  window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`);
                }}
                className="btn-ghost py-2.5 text-sm"
              >
                GitHub
            </button>
            <button
                type="button"
                onClick={() => {
                  // For Google we use the hook with implicit flow and exchange it
                  loginWithGoogle();
                }}
                className="btn-ghost py-2.5 text-sm"
              >
                Google
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          By signing in, you agree to our{' '}
          <Link to="/" className="text-violet-400 hover:text-violet-300">Terms</Link>
          {' '}and{' '}
          <Link to="/" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>
        </p>
        </motion.div>
      </div>
    </div>
  );
}
