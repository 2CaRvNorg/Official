'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Require Supabase credentials to be configured for production auth
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
    ) {
      setErrorMsg(
        'Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file, then restart the dev server.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Fetch user profile to determine role and force_password_change
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, force_password_change, full_name')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          setErrorMsg('Your account profile could not be loaded. Please contact your administrator.');
          return;
        }

        const userRole = profile.role;

        // Force password change on first login for non-admin users
        if (profile.force_password_change) {
          router.push('/change-password');
          return;
        }

        const safeRedirectTarget =
          redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.includes('\\')
            ? redirectTo
            : null;

        if (safeRedirectTarget) {
          router.push(safeRedirectTarget);
          return;
        }

        // Direct to role-based dashboard
        switch (userRole) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'teacher':
            router.push('/dashboard/teacher');
            break;
          case 'institution_head':
            router.push('/dashboard/institution');
            break;
          case 'student':
            router.push('/dashboard/student');
            break;
          case 'money_management':
            router.push('/dashboard/admin/finance');
            break;
          default:
            await supabase.auth.signOut();
            setErrorMsg('Your account has an unsupported role. Please contact your administrator.');
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setErrorMsg('Enter your email address first.');
      return;
    }

    setIsSendingReset(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/change-password`,
      });
      if (error) throw error;
      setSuccessMsg('If an account exists for this email, a password reset link has been sent.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send a password reset email.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const redirectTo = searchParams.get('redirectTo');

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#0D0D0D' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, rgba(13,13,13,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <Image
              src="/2carvn-mark.png"
              alt="2Carvn Academy logo"
              width={56}
              height={56}
              priority
              className="h-14 w-14 object-contain drop-shadow-[0_0_16px_rgba(212,168,67,0.28)]"
            />
            <div className="text-left">
              <span className="block font-bold text-white text-xl tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                2CARVN <span style={{ color: '#D4A843' }}>Academy</span>
              </span>
              <span className="block text-[11px] text-[#A0A0A0] tracking-widest uppercase">
                A Way for Creativity
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm text-[#888888]">
            Sign in with your Academy credentials to access your learning portal
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-7 relative"
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div role="status" className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Email Address or Username
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@2carvn.academy"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555555] outline-none transition-colors"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#AAAAAA]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isSendingReset}
                  className="text-xs text-[#D4A843] hover:underline disabled:opacity-50"
                >
                  {isSendingReset ? 'Sending reset link…' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555555] outline-none transition-colors"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-[#0D0D0D] transition-all hover:brightness-110 active:scale-[0.99] mt-2 shadow-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal →'}
            </button>
          </form>

        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-[#666666]">
          Protected by 2Carvn Academy Multi-Tenant Security · Need help? Contact your institution administrator.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D]" />}>
      <LoginForm />
    </Suspense>
  );
}
