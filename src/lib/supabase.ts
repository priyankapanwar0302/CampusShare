import { createClient } from '@supabase/supabase-js';

// Support both standard Vite (VITE_) and Next.js copy-paste (NEXT_PUBLIC_) conventions
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[CampusShare] Supabase credentials not found or incomplete. Falling back to local state and mock data.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * Helper to test the connection to Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase URL or Key is missing from your .env.local file.',
    };
  }

  try {
    const { error } = await supabase.from('resources').select('id', { count: 'exact', head: true });
    if (error) {
      // Table might not exist yet if SQL migration hasn't been run
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! (Note: Tables not created yet — run the SQL schema next).',
        };
      }
      return {
        success: false,
        message: `Connection error: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Successfully connected to Supabase database!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Network error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
