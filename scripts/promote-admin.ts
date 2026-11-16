#!/usr/bin/env node
/**
 * 2Carvn Academy - CLI Admin Promoter
 * 
 * Promotes an existing user to Super Admin role.
 * Usage: npx ts-node scripts/promote-admin.ts user@example.com
 * 
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 */

import { createClient } from '@supabase/supabase-js';

const email = process.argv[2];

if (!email) {
  console.error('❌  Error: Email address is required');
  console.error('Usage: npx ts-node scripts/promote-admin.ts user@example.com');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function promoteToAdmin() {
  console.log(`\n👑  Promoting user to Super Admin...`);
  console.log(`   Email: ${email}`);
  console.log('');

  try {
    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      // Try auth.users directly - list users and find by email
      const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError || !allUsers?.users) {
        console.error('❌  Could not list users:', listError?.message);
        process.exit(1);
      }

      const foundUser = allUsers.users.find(u => u.email === email);
      
      if (!foundUser) {
        console.error('❌  User not found:', email);
        console.error('\n💡  First create the user, then promote them:');
        console.error('   npx ts-node scripts/create-user.ts --email=' + email + ' --role=student');
        process.exit(1);
      }      // Create profile for user who signed up but has no profile
      const userId = foundUser.id;
      const userName = foundUser.user_metadata?.full_name || email.split('@')[0];
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          full_name: userName,
          role: 'admin',
          force_password_change: false,
          status: 'active',
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌  Failed to create profile:', profileError.message);
        process.exit(1);
      }

      console.log('✅  Profile created for existing auth user');
    } else {
      // User exists, update their role
      const userId = userData.id;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          force_password_change: false,
          status: 'active',
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌  Failed to update profile:', updateError.message);
        process.exit(1);
      }

      console.log('✅  Profile updated');
    }

    // Update auth.users metadata
    const targetUserId = userData?.id; // Use the ID we already have from profiles query
    const { error: authError } = await supabase.auth.admin.updateUserById(
      targetUserId!, {
        user_metadata: {
          role: 'admin',
        },
      }
    );

    if (authError) {
      console.error('⚠️  Warning: Could not update auth metadata:', authError.message);
    }

    console.log('\n─────────────────────────────────────────');
    console.log('👑  PROMOTION COMPLETE');
    console.log('─────────────────────────────────────────');
    console.log(`👤  Email: ${email}`);
    console.log(`🏷️   New Role: admin (Super Admin)`);
    console.log(`✅  User now has full platform access`);
    console.log('─────────────────────────────────────────');
    console.log('\n🔐  IMPORTANT: This user can now:');
    console.log('   • Access all institutions, branches, and batches');
    console.log('   • Manage all users and their roles');
    console.log('   • View and export all financial records');
    console.log('   • Configure grading, certificates, and platform settings');
    console.log('   • View security audit logs');
    console.log('\n⚠️  Ensure this account uses a strong password and enable MFA if possible.\n');
  } catch (error) {
    console.error('❌  Unexpected error:', error);
    process.exit(1);
  }
}

promoteToAdmin();
