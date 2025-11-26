#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const target = args[0]; // 'local' or 'cloud'

if (!target || !['local', 'cloud'].includes(target)) {
  console.log('Usage: npm run db:switch [local|cloud]');
  console.log('  local - Switch to SQLite local database');
  console.log('  cloud - Switch to PostgreSQL cloud database');
  process.exit(1);
}

const envPath = path.join(__dirname, '..', '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Update DB_ENV
envContent = envContent.replace(/DB_ENV=.*/, `DB_ENV=${target}`);

// Write back
fs.writeFileSync(envPath, envContent);

console.log(`✅ Switched to ${target} database`);
console.log(`📊 Database: ${target === 'local' ? 'SQLite (./dev.db)' : 'PostgreSQL (Neon Cloud)'}`);
console.log(`🔄 Run: npm run prisma:push to sync schema`);