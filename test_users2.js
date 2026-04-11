const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cjjewehmdqlxptkcowhw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqamV3ZWhtZHFseHB0a2Nvd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDc4ODgsImV4cCI6MjA5MTMyMzg4OH0.COQz8rpLHTAy_JK75MR-v9OYrCP0DKCWB1LGQxSC_rQ'
);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('users table error:', error);
  console.log('users count:', data ? data.length : 0);
  console.log('users preview (first 2):', data ? data.slice(0, 2) : null);
}

checkUsers();
