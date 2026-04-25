import { createSupabaseAdminClient } from '@/lib/supabase-admin';

async function testFetch() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('posts').select('id, title');

  if (error) {
    console.error('Fetch error:', error);
  } else {
    console.log('Fetched posts count:', data?.length);
    console.log('Posts:', data);
  }
}

testFetch();
