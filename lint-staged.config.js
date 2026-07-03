module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md}': 'prettier --write',
  'client/src/**/*.{ts,tsx}': () => 'npm run lint -w client',
  'server/src/**/*.ts': () => 'npm run lint -w server',
};
