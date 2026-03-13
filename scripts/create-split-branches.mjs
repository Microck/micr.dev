#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const splits = [
  { branch: 'split/about', prefix: 'about' },
  { branch: 'split/quarzite', prefix: 'quarzite' },
  { branch: 'split/anonq', prefix: 'anonq' },
  { branch: 'split/microkeebs', prefix: 'microkeebs' },
];

for (const split of splits) {
  console.log(`Creating ${split.branch} from ${split.prefix}...`);
  execFileSync(
    'git',
    ['subtree', 'split', '--prefix', split.prefix, '-b', split.branch],
    { stdio: 'inherit' }
  );
}
