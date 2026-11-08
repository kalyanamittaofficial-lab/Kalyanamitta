import { supabase } from './supabase';

/**
 * Initiates Google OAuth sign-in flow via Supabase Auth
 * @param {string} [redirectTo] - Optional custom redirect path (default is /auth/callback)
 */
export async function signInWithGoogle(redirectTo) {
  const redirectUrl = redirectTo 
    ? (redirectTo.startsWith('http') ? redirectTo : `${window.location.origin}${redirectTo}`)
    : `${window.location.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    console.error('Google OAuth sign-in error:', error);
  }

  return { data, error };
}

/**
 * Signs out the current user and clears session state
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
  }
  return { error };
}

/**
 * Fetches the user profile from the profiles table
 * @param {string} userId - User ID
 */
export async function fetchUserProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}
