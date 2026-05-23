import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Defensive Programming: Automatically strip out trailing /rest/v1/ or /rest/v1
// in case the user pasted the direct Rest API URL instead of the base project URL.
if (supabaseUrl.endsWith('/rest/v1/')) {
  supabaseUrl = supabaseUrl.replace('/rest/v1/', '');
} else if (supabaseUrl.endsWith('/rest/v1')) {
  supabaseUrl = supabaseUrl.replace('/rest/v1', '');
}

console.log('🔍 OrgVault Env Check:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 8)}...` : 'undefined',
  env_raw: import.meta.env
});

// Verify that the user has supplied actual credentials rather than the default placeholders
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseUrl !== 'your_supabase_url' &&
  supabaseAnonKey !== 'your_supabase_anon_api_key' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

console.log('🔍 isSupabaseConfigured:', isSupabaseConfigured);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (isSupabaseConfigured) {
  console.log('🔌 OrgVault: Live Supabase client connected successfully.');
} else {
  console.log('🤖 OrgVault: Supabase credentials not set. Running in offline Mock Mode.');
}

export default supabase;
