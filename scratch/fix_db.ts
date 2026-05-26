import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function fixDb() {
  const client = new Client({
    connectionString: 'postgresql://postgres:fitzonepassw@db.zcdlmnosrtcvgamqznzg.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    // Add company_name if it doesn't exist
    await client.query(`
      ALTER TABLE contact_enquiries 
      ADD COLUMN IF NOT EXISTS company_name TEXT;
    `);
    console.log('Successfully added company_name column');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

fixDb();
