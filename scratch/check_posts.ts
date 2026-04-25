
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*');

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      console.log(`Found ${posts.length} posts in total.`);
      if (posts.length > 0) {
        posts.forEach(p => {
          console.log(`- [${p.is_published ? 'PUBLISHED' : 'DRAFT'}] ${p.title} (ID: ${p.id})`);
        });
      } else {
        console.log('No posts found in the table.');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkPosts();
