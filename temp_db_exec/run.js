const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const client = new Client({
    connectionString: `postgres://postgres.qqstpsvalgdbjacdkmmk:${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
  });

  try {
    await client.connect();
    const sql = fs.readFileSync('../supabase/migrations/003_cms_tables.sql', 'utf8');
    await client.query(sql);
    console.log('Migration 003 completed successfully.');
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

main();
