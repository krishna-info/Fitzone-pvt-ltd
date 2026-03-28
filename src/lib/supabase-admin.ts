import { createClient } from '@supabase/supabase-js';

// WARNING: ONLY use this on the server side (Server Components, Actions, Route Handlers)
// This client uses the service_role_key which bypasses RLS.
export const createSupabaseAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};
