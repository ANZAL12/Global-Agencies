require('dotenv').config({ path: './frontend/mobile/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
  console.log('Data:', data);
}

checkUsers();
