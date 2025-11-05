import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  empresaId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_and_increment_rate_limit', {
      _user_id: userId,
      _empresa_id: empresaId,
      _max_emails: 50,
      _window_hours: 24,
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Rate limit exception:', error);
    return false;
  }
}
