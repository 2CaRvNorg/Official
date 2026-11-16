'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ROLE_HOME: Record<string, string> = {
  admin: '/dashboard/admin',
  institution_head: '/dashboard/institution',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
  money_management: '/dashboard/admin/finance',
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw userError || new Error('You must be signed in to change your password.');
      }

      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateAuthError) throw updateAuthError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({ force_password_change: false })
        .eq('id', user.id)
        .select('role')
        .single();
      if (profileError || !profile) throw profileError || new Error('Unable to update your account profile.');

      const roleHome = ROLE_HOME[String(profile.role)];
      if (!roleHome) throw new Error('Your account role is not supported. Contact your administrator.');
      router.replace(roleHome);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#0D0D0D' }}
    >
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
              color: '#0D0D0D',
            }}
          >
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Set Your New Password
          </h1>
          <p className="text-sm text-[#888888]">
            For your security, please update your temporary password to a permanent one before accessing your account.
          </p>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555555] outline-none"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555555] outline-none"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
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
              {isLoading ? 'Updating...' : 'Save Password & Proceed →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
