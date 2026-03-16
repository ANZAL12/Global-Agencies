import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
);

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLogs() {
  console.log('--- Database Audit ---');
  const tablesToCheck = [
    'users', 
    'sales', 
    'announcements', 
    'system_logs', 
    'activity_logs', 
    'logs', 
    'audit_logs',
    'announcement_targets'
  ];

  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (error) {
      if (error.message.includes('schema cache')) {
        console.log(`[MISSING] Table: ${table}`);
      } else {
        console.log(`[ERROR]   Table: ${table} - ${error.message}`);
      }
    } else {
      console.log(`[EXISTS]  Table: ${table}`);
    }
  }
}

async function checkStorage() {
  console.log('\n--- Storage Audit ---');
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error.message);
    return;
  }

  console.log('Buckets found:', data.map(b => b.name));
  const bucketsToCheck = ['sales_bills', 'announcements'];
  
  for (const bucketName of bucketsToCheck) {
      const bucket = data.find(b => b.name === bucketName);
      if (bucket) {
          console.log(`[EXISTS]  Bucket: ${bucketName} (Public: ${bucket.public})`);
          
          // Try a test upload if we have a bucket
          console.log(`Attempting test upload to '${bucketName}'...`);
          const testBlob = new Blob(['test content'], { type: 'text/plain' });
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(`test_${Date.now()}.txt`, testBlob);
            
          if (uploadError) {
              console.error(`[UPLOAD FAILED] Bucket: ${bucketName} - ${uploadError.message}`);
              if (uploadError.message.includes('row-level security') || uploadError.message.includes('permission denied')) {
                  console.log('  -> Suggestion: Check RLS policies for storage.objects');
              }
          } else {
              console.log(`[UPLOAD SUCCESS] Bucket: ${bucketName}`);
          }
      } else {
          console.log(`[MISSING] Bucket: ${bucketName}`);
      }
  }
}

async function main() {
    await checkLogs();
    await checkStorage();
}

main();
