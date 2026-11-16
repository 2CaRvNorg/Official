#!/usr/bin/env node
/**
 * 2Carvn Academy - CLI User Creator
 * 
 * Creates users directly in Supabase Auth and profiles table.
 * Usage: npx ts-node scripts/create-user.ts --email=user@example.com --role=student --name="John Doe"
 * 
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 * 
 * ⚠️  SECURITY WARNING: This script uses the SERVICE_ROLE_KEY which bypasses RLS.
 * Only use this in trusted environments (local dev, CI/CD with secrets).
 * Never expose SERVICE_ROLE_KEY to the browser.
 */

import { createClient } from '@supabase/supabase-js';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string): string => {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index + 1 >= args.length) return '';
  return args[index + 1];
};

const email = getArg('email');
const password = getArg('password') || `Temp${Math.random().toString(36).substring(2, 8).toUpperCase()}#`;
const name = getArg('name') || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
const role = getArg('role') || 'student';
const phone = getArg('phone') || '';

const validRoles = ['admin', 'institution_head', 'teacher', 'student', 'money_management'];

if (!email) {
  console.error('❌  Error: --email is required');
  console.error('Usage: npx ts-node scripts/create-user.ts --email=user@example.com [--password=secret] [--name="Full Name"] [--role=student] [--phone=+1234567890]');
  process.exit(1);
}

if (!validRoles.includes(role)) {
  console.error(`❌  Error: Invalid role "${role}". Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  console.error('');
  console.error('Set them before running:');
  console.error('  export SUPABASE_URL=https://your-project.supabase.co');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceKey);

async function createUser() {
  console.log(`\n🔐  Creating user in Supabase Auth...`);
  console.log(`   Email: ${email}`);
  console.log(`   Role: ${role}`);
  console.log(`   Name: ${name}`);
  console.log(`   Password: ${password.includes('Temp') ? '(auto-generated)' : password}`);
  console.log('');

  try {
    // Step 1: Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (Admin-created accounts)
      user_metadata: {
        full_name: name,
        role: role,
      },
    });

    if (authError) {
      console.error('❌  Failed to create auth user:');
      console.error(authError.message);
      process.exit(1);
    }

    if (!authData.user) {
      console.error('❌  No user data returned from auth creation');
      process.exit(1);
    }

    const userId = authData.user.id;
    console.log(`✅  Auth user created: ${userId}`);

    // Step 2: Create/update profile in public.profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          full_name: name,
          role: role,
          phone: phone || null,
          force_password_change: role !== 'admin', // Admins don't need to change password
          status: 'active',
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (profileError) {
      console.error('❌  Failed to create profile:');
      console.error(profileError.message);
      process.exit(1);
    }

    console.log('✅  Profile created/updated:');
    console.log(`   ID: ${profileData.id}`);
    console.log(`   Name: ${profileData.full_name}`);
    console.log(`   Role: ${profileData.role}`);
    console.log(`   Force Password Change: ${profileData.force_password_change}`);

    // Step 3: If student, initialize gamification record
    if (role === 'student') {
      const { error: gamError } = await supabase
        .from('learner_gamification')
        .upsert({ student_id: userId }, { onConflict: 'student_id' })
        .select()
        .maybeSingle();

      if (gamError) {
        console.error('⚠️  Warning: Could not initialize gamification:', gamError.message);
      } else {
        console.log('✅  Gamification record initialized');
      }
    }

    // Summary
    console.log('\n─────────────────────────────────────────');
    console.log('📋  USER CREATION SUMMARY');
    console.log('─────────────────────────────────────────');
    console.log(`👤  Email:      ${email}`);
    console.log(`🔑  Password:   ${password}`);
    console.log(`🏷️   Role:       ${role}`);
    console.log(`🆔  User ID:    ${userId}`);
    console.log('─────────────────────────────────────────');

    if (role === 'student' || role === 'teacher') {
      console.log('\n💡  Next steps:');
      console.log('   1. Assign student to a batch via Admin → Users → Batch Assignment');
      console.log('   2. Or assign teacher to batches via Admin → Users → Teacher Allocation');
    }

    if (role === 'student') {
      console.log('\n📧  Student will be prompted to change password on first login.');
    }

    console.log('\n✅  User created successfully!\n');
  } catch (error) {
    console.error('❌  Unexpected error:', error);
    process.exit(1);
  }
}

createUser();
