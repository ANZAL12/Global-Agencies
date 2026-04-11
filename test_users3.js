const url = 'https://cjjewehmdqlxptkcowhw.supabase.co/rest/v1/users?select=';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqamV3ZWhtZHFseHB0a2Nvd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDc4ODgsImV4cCI6MjA5MTMyMzg4OH0.COQz8rpLHTAy_JK75MR-v9OYrCP0DKCWB1LGQxSC_rQ';

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
  }
})
.then(res => res.json())
.then(data => {
  console.log('Users array length:', data.length);
  console.log('Preview:', data.slice(0, 2));
})
.catch(err => console.error(err));
