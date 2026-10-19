import { defineConfig, mergeConfig } from 'vite';
import { readFileSync } from 'node:fs';
import base from './vite.config';

// Isolate synthetic regression records in the test bundle only.
export default mergeConfig(base, defineConfig({
  build: { outDir: 'dist-e2e' },
  plugins: [{
    name: 'e2e-keyboard-fixtures',
    enforce: 'pre',
    transform(source, id) {
      if (!id.replaceAll('\\', '/').endsWith('/src/data/builds.json')) return;
      const fixtures = JSON.parse(readFileSync(new URL('./tests/builds.fixture.json', import.meta.url), 'utf8'));
      return JSON.stringify([...JSON.parse(source), ...fixtures]);
    },
  }],
}));
