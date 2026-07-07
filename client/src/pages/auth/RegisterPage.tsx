import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const RegisterPage: React.FC = () => {
  const { register, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const result = registerSchema.safeParse({ fullName, email, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        fullName: formatted.fullName?._errors[0],
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password, fullName);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background visuals */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(56,85,255,0.4)] group-hover:shadow-[0_0_28px_rgba(56,85,255,0.6)] transition-all">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.5L11 7.25V10.75L8 12.5L5 10.75V7.25L8 5.5Z"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-display">
            GradPilot <span className="text-brand-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Get started with your AI University Application Copilot
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex gap-2.5 items-start animate-fade-in"
              role="alert"
            >
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!fieldErrors.fullName}
                className={[
                  'w-full h-11 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder:text-slate-700 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500/50',
                  fieldErrors.fullName
                    ? 'border-red-500/60'
                    : 'border-slate-800/80 hover:border-slate-700',
                ].join(' ')}
                placeholder="Jane Doe"
              />
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                className={[
                  'w-full h-11 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder:text-slate-700 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500/50',
                  fieldErrors.email
                    ? 'border-red-500/60'
                    : 'border-slate-800/80 hover:border-slate-700',
                ].join(' ')}
                placeholder="you@university.edu"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                className={[
                  'w-full h-11 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder:text-slate-700 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500/50',
                  fieldErrors.password
                    ? 'border-red-500/60'
                    : 'border-slate-800/80 hover:border-slate-700',
                ].join(' ')}
                placeholder="•••••••• (Min 8 characters)"
              />
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white rounded-xl text-sm font-medium transition-all duration-150 shadow-[0_0_20px_rgba(56,85,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
