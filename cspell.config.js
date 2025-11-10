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
  dictionaries: [
    'en_US',
    'typescript',
    'node',
    'html',
    'css',
    'zh_CN',
    'bash',
    'npm',
    'companies',
    'softwareTerms',
    'fonts',
    'en-gb',
    'dictionaries',
  ],
  dictionaryDefinitions: [
    {
      name: 'dictionaries',
      path: './dictionaries.txt',
      addWords: true,
    },
  ],
};

export default cspell;
