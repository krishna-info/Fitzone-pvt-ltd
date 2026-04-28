
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error checking contact_enquiries table:', error.message);
    if (error.message.includes('relation "contact_enquiries" does not exist')) {
      console.log('THE TABLE DOES NOT EXIST!');
    }
  } else {
    console.log('Table contact_enquiries exists and is accessible.');
  }
}

checkTable();
