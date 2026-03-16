import { supabase } from '../lib/supabase';

export async function logActivity(action: string, details: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('system_logs').insert([{
      action,
      details,
      user_email: user.email,
    }]);

    if (error) {
      console.error('Failed to write system log:', error);
    }
  } catch (err) {
    console.error('Error in logActivity:', err);
  }
}
