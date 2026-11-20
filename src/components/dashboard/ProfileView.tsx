'use client';

import { useEffect, useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { getProfileHref, getRoleHome, ROLE_LABELS } from '@/lib/rbac';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
}

const DASHBOARD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          if (authError) console.error('Failed to verify profile session:', authError);
          if (active) router.replace('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, role, status')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          console.error('Failed to load user profile:', error);
          if (active) setErrorMessage('Unable to load your profile. Please try again.');
          return;
        }

        if (active) {
          setProfile(data);
          setFullName(data.full_name);
          setPhone(data.phone ?? '');
        }
      } catch (error) {
        console.error('Unexpected error while loading user profile:', error);
        if (active) setErrorMessage('Unable to load your profile. Please try again.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const nextName = fullName.trim();
    const nextPhone = phone.trim();
    if (!nextName || nextName.length > 120) {
      setErrorMessage('Name must be between 1 and 120 characters.');
      return;
    }
    if (nextPhone.length > 32) {
      setErrorMessage('Phone number must be 32 characters or fewer.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await createClient()
        .from('profiles')
        .update({ full_name: nextName, phone: nextPhone || null })
        .eq('id', profile.id)
        .select('id, full_name, email, phone, role, status')
        .single();

      if (error || !data) {
        console.error('Failed to save user profile:', error);
        setErrorMessage('Unable to save your profile. Please try again.');
        return;
      }

      setProfile(data);
      setFullName(data.full_name);
      setPhone(data.phone ?? '');
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Unexpected error while saving user profile:', error);
      setErrorMessage('Unable to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const roleHome = profile ? getRoleHome(profile.role) : null;
  const navItems: NavItem[] = roleHome
    ? [{ label: 'Dashboard', href: roleHome, icon: DASHBOARD_ICON }]
    : [];
  const initials = profile?.full_name
    ? profile.full_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'A';

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar
        navItems={navItems}
        userName={profile?.full_name ?? 'Account'}
        userRole={profile ? ROLE_LABELS[profile.role as keyof typeof ROLE_LABELS] ?? profile.role : 'Profile'}
        avatarInitials={initials}
      />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="My Profile"
          subtitle="View and update your account details"
          userName={profile?.full_name ?? 'Account'}
          avatarInitials={initials}
          profileHref={profile ? getProfileHref(profile.role) : undefined}
        />

        <main className="flex-1 p-5 pb-20 md:pb-6">
          <div className="mx-auto max-w-3xl">
            <GlassCard title="Profile details">
              {isLoading ? (
                <p className="text-sm text-white/60" role="status">Loading your profile…</p>
              ) : errorMessage && !profile ? (
                <p className="text-sm text-red-400" role="alert">{errorMessage}</p>
              ) : profile ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-[#AAAAAA]">
                      Full name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      autoComplete="name"
                      maxLength={120}
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-[#D4A843]"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-email" className="mb-1.5 block text-xs font-medium text-[#AAAAAA]">
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white/60 outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-phone" className="mb-1.5 block text-xs font-medium text-[#AAAAAA]">
                      Phone
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={32}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-[#D4A843]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-[#888888]">Role</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {ROLE_LABELS[profile.role as keyof typeof ROLE_LABELS] ?? profile.role}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-[#888888]">Account status</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {profile.status}
                      </p>
                    </div>
                  </div>

                  {errorMessage && <p className="text-sm text-red-400" role="alert">{errorMessage}</p>}
                  {successMessage && <p className="text-sm text-emerald-400" role="status">{successMessage}</p>}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl px-5 py-3 text-sm font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)' }}
                  >
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              ) : null}
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
