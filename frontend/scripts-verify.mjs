import fs from 'node:fs';
import path from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const required = ['package.json', 'vite.config.ts', 'src/main.tsx', 'src/app/App.tsx', 'src/services/api.ts', 'src/services/backend.ts', 'src/types/api.ts', 'src/theme/theme.ts'];
for (const file of required) if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
console.log('HireVibe frontend foundation: required files present.');
