# Supabase Authentication Setup for 2Carvn Academy

## Overview
This document explains how to set up Supabase authentication for the 2Carvn Academy platform, including creating the initial Super Admin user.

## Prerequisites
1. A Supabase project (create at https://supabase.com)
2. Node.js 18+ installed
3. npm or yarn package manager

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project name: `2carvn-academy` (or your preferred name)
5. Set a strong database password (save this securely)
6. Choose a region close to your users
7. Click "Create new project" and wait for setup to complete

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run Database Migrations

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/20261111_master_schema.sql`
4. Click "Run" to execute the migration

This creates:
- All 17 tables for the platform
- Custom enums (user_role, lesson_status, etc.)
- Row Level Security (RLS) policies
- Auto-profile creation trigger
- Seed data for initial subjects and programmes

## Step 5: Create the Super Admin User

1. In Supabase SQL Editor, paste the contents of `supabase/seed_super_admin.sql`
2. Click "Run"

This creates:
- A super admin user: `admin@2carvn.academy`
- Password: `Admin@2Carvn2026` (change this after first login!)
- Profile with `role = 'admin'` and `force_password_change = false`

### Alternative: Create Admin via Signup + Promote

If you prefer to create the admin through the normal signup flow:

1. Go to your app's login page
2. Sign up with a new email
3. Open Supabase SQL Editor and run:
   ```sql
   SELECT public.promote_to_super_admin('your-email@example.com');
   ```
4. This promotes any existing user to super admin status

## Step 6: Start the Application

```bash
cd d:\Compiney\2Carvan\web
npm run dev
```

Visit http://localhost:3000 and log in with:
- **Email:** admin@2carvn.academy
- **Password:** Admin@2Carvn2026

## Step 7: Change the Default Password

After first login, it's strongly recommended to change the default password:

1. Click your profile/avatar in the dashboard
2. Go to Settings → Change Password
3. Enter a new strong password

Alternatively, use the SQL function to reset:
```sql
-- Reset password for any user
UPDATE auth.users 
SET encrypted_password = crypt('NewPassword123!', gen_salt('bf'))
WHERE email = 'admin@2carvn.academy';
```

## Authentication Flow Details

### Login Process
1. User submits email/password via `/login`
2. Supabase Auth verifies credentials
3. On success, user profile is fetched from `public.profiles`
4. Role is determined from profile (not just email)
5. If `force_password_change = true`, user is redirected to `/change-password`
6. User is routed to their role-specific dashboard

### Role Determination
Roles are set in the `public.profiles` table and can be:
- `admin` — Super Admin (full platform access)
- `institution_head` — Institution/Batch Head (view-only)
- `teacher` — Teaching Faculty (assigned batches only)
- `student` — Learner (own data only)
- `money_management` — Financial records (no academic access)

### Force Password Change
- New users created via Admin have `force_password_change = true` by default
- Admin accounts have `force_password_change = false`
- On first login, non-admin users must change their password

### Row Level Security (RLS)
All tables have RLS enabled with policies that enforce:
- Admin: Full access to all data
- Users: Access only to their own data
- Teachers: Access to assigned batches/students
- Students: Access only to own data and enrolled batches
- Money Management: Finance tables only

## Security Best Practices

### Change Default Credentials
The default admin password `Admin@2Carvn2026` should be changed immediately in production.

### Enable Email Confirmation
In Supabase dashboard → Authentication → Settings:
- Enable "Confirm email"
- Set appropriate email templates

### Configure Password Policies
In Supabase dashboard → Authentication → Policies:
- Set minimum password length (recommended: 12+ characters)
- Consider requiring special characters, numbers, mixed case

### Recommended: Enable MFA for Admin
The PRD recommends reconsidering MFA for Admin accounts before production.

### Use Environment Variables
Never commit `.env.local` to version control. The `.env.example` file shows required variables without secrets.

## Troubleshooting

### "Supabase credentials are not configured"
- Ensure `.env.local` exists with valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after changing env vars

### "Invalid login credentials"
- Verify the user exists in Supabase Authentication
- Check that the password was set correctly
- For admin, run the seed script again to reset password

### "Profile not found"
- Ensure the migration script ran successfully
- Check that the `on_auth_user_created` trigger is active
- The profile should be auto-created on signup

### Role not working correctly
- Check the `role` column in `public.profiles` table
- For existing users, use `public.promote_to_super_admin(email)` to fix

## API Reference

### Supabase Client
- Browser: `src/lib/supabase/client.ts`
- Server: `src/lib/supabase/server.ts`
- Middleware: `src/lib/supabase/middleware.ts`

### Key Functions
- `createClient()` — Get Supabase client instance
- `supabase.auth.signInWithPassword({ email, password })` — Login
- `supabase.auth.signUp({ email, password })` — Register (admin creates users)
- `supabase.auth.signOut()` — Logout
- `supabase.from('profiles').select()` — Fetch user profile

### SQL Functions
- `public.promote_to_super_admin(target_email)` — Promote user to admin
- `public.get_current_role()` — Get current user's role (used in RLS)
- `public.handle_new_user()` — Auto-create profile on signup

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side admin key (use with caution) |

## Default Admin Account

After running the seed script:
- **Email:** admin@2carvn.academy
- **Password:** Admin@2Carvn2026
- **Role:** admin (Super Admin)
- **Force Password Change:** false (can login directly)

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run migrations
4. ✅ Create super admin
5. 🔄 Create additional users via Admin dashboard
6. 🔄 Configure email templates (welcome, password reset, etc.)
7. 🔄 Set up WhatsApp notifications (future integration)
8. 🔄 Review and test RLS policies
9. 🔄 Consider enabling MFA for admin accounts
