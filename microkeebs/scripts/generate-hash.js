#!/usr/bin/env node
// Generate bcrypt hash for admin password
// Usage: node scripts/generate-hash.js YOUR_PASSWORD

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-hash.js YOUR_PASSWORD');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nPassword hash (set as ADMIN_PASSWORD_HASH in Netlify):');
console.log(hash);
console.log('\nOther required env vars:');
console.log('JWT_SECRET=<random 32+ char string>');
console.log('GITHUB_TOKEN=<GitHub PAT with repo scope>');
console.log('GITHUB_REPO=<owner/repo>');
