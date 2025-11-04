'use strict';

/** @type { import("@cspell/cspell-types").CSpellUserSettings } */
const cspell = {
  language: 'en, zh-CN',
  ignorePaths: [
    'node_modules/**',
    'dist',
    '**/*.svg',
    '.github',
    '.devcontainer',
    'bin',
    '.git',
    'stats.html',
    'pnpm-lock.yaml',
  ],
  words: ['ahooks'],
};

export default cspell;
