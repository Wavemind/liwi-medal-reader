const fs = require('fs');

const codeToObscure = /console.warn\([\s\S].*`Require cycle:[^;]*;/gi;
const problemFilePath = './node_modules/metro/src/lib/polyfills/require.js';
const problemFileContent = fs.readFileSync(problemFilePath, 'utf8');
fs.writeFileSync(problemFilePath, problemFileContent.replace(codeToObscure, ''), 'utf8');
