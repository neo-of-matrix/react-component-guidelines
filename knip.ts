import type { KnipConfig } from 'knip';
const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.test.ts', '!src/**/*.test.tsx'],
  include: ['dependencies', 'devDependencies'],
};

export default config;
