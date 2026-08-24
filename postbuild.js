const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');

html = html.replaceAll('https://nutrivitoriabraga.com.br/', 'https://www.nutrivitoriabraga.com.br/');

fs.writeFileSync(file, html, 'utf8');
console.log('SEO pós-build aplicado: URLs canônicas atualizadas para www.');
