
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspectTable() {
  // Try to insert a dummy record to see if it works or what error it gives
  const { data, error } = await supabase
    .from('contact_enquiries')
    .insert({
      name: 'Test Agent',
      email: 'test@example.com',
      message: 'This is a test message to check schema constraints.',
      enquiry_type: 'general'
    })
    .select();

  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

inspectTable();
