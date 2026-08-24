const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'index.html');
const outDir = path.join(__dirname, 'dist');
const outPath = path.join(outDir, 'index.html');

let html = fs.readFileSync(inputPath, 'utf8');

function replaceExact(from, to, label) {
  if (!html.includes(from)) {
    throw new Error(`Trecho não encontrado para ${label}. Build cancelado para proteger o site.`);
  }
  html = html.replace(from, to);
}

const icons = {
  glucose: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="12" y="5" width="24" height="34" rx="6" stroke-width="2.2"/><rect x="17" y="11" width="14" height="12" rx="2.5" stroke-width="2"/><path d="M24 14.5c-1.9 2.5-3 4-3 5.1a3 3 0 0 0 6 0c0-1.1-1.1-2.6-3-5.1Z" stroke-width="1.8"/><circle cx="24" cy="31" r="2" stroke-width="2"/><path d="M20 39v4h8v-4" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  labs: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M16 9h-3a4 4 0 0 0-4 4v27h30V13a4 4 0 0 0-4-4h-3" stroke-width="2.1"/><rect x="17" y="5" width="14" height="8" rx="3" stroke-width="2.1"/><path d="m15 21 2 2 4-5M25 21h8M15 30l2 2 4-5M25 30h8M15 39l2 2 4-5M25 39h8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  kidney: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M18 8c-6 0-10 5-10 12 0 8 4 14 10 14 4 0 6-3 6-7V15c0-4-2-7-6-7Z" stroke-width="2.2"/><path d="M30 8c6 0 10 5 10 12 0 8-4 14-10 14-4 0-6-3-6-7V15c0-4 2-7 6-7Z" stroke-width="2.2"/><path d="M18 25c3 0 6 2 6 6v11M30 25c-3 0-6 2-6 6" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  plate: `<svg viewBox="0 0 56 48" fill="none" aria-hidden="true"><path d="M17 10v28M12 10v10c0 4 2 6 5 6s5-2 5-6V10M44 10c-3 5-4 10-4 15v13" stroke-width="2.1" stroke-linecap="round"/><circle cx="31" cy="25" r="12" stroke-width="2.1"/><path d="M27 28c1-6 5-9 10-9-1 5-4 9-10 9Zm1 0c-3-5-7-7-11-6 1 4 5 7 11 6Z" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  diabetes: `<svg viewBox="0 0 64 48" fill="none" aria-hidden="true"><rect x="4" y="4" width="23" height="34" rx="6" stroke-width="2.2"/><rect x="9" y="10" width="13" height="11" rx="2.2" stroke-width="2"/><path d="M15.5 13.5c-1.7 2.2-2.6 3.5-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1-.9-2.3-2.6-4.5Z" stroke-width="1.7"/><circle cx="15.5" cy="30" r="1.8" stroke-width="1.8"/><path d="m38 36 15-26 6 3.5-15 26-8 5 2-8.5Z" stroke-width="2.2" stroke-linejoin="round"/><path d="m51 13 6 3.5M39 35l6 3.5" stroke-width="2"/></svg>`,
  chronic: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 42S8 32 8 19c0-6 4-10 10-10 4 0 6 2 8 5 2-3 4-5 8-5 6 0 10 4 10 10 0 13-16 23-20 23Z" stroke-width="2.2"/><path d="M24 18v12M18 24h12" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  maternal: `<svg viewBox="0 0 52 48" fill="none" aria-hidden="true"><path d="M17 11c0-5 4-8 8-8 5 0 8 4 8 9v5h-5v20H8v-4c0-6 3-10 8-13 2-2 4-4 4-8 0-3-2-6-6-6Z" stroke-width="2"/><circle cx="31" cy="25" r="5" stroke-width="2"/><path d="M22 36c3-6 8-9 13-8 4 1 6 4 6 8 0 5-4 8-9 8H21c-5 0-8-3-8-7" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  chat: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 9h25a7 7 0 0 1 7 7v9a7 7 0 0 1-7 7H20l-9 7v-7H8a7 7 0 0 1-7-7v-9a7 7 0 0 1 7-7Z" transform="translate(3)" stroke-width="2.1" stroke-linejoin="round"/><circle cx="18" cy="21" r="1.6" fill="currentColor" stroke="none"/><circle cx="24" cy="21" r="1.6" fill="currentColor" stroke="none"/><circle cx="30" cy="21" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  chart: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 40V27h8v13H8Zm12 0V19h8v21h-8Zm12 0V11h8v29h-8Z" stroke-width="2"/><path d="m8 21 9-8 7 4 14-11M33 6h5v5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  autonomy: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="20" cy="14" r="6" stroke-width="2.1"/><path d="M8 40v-5c0-7 5-12 12-12s12 5 12 12v5" stroke-width="2.1" stroke-linecap="round"/><path d="m37 16 1.6 3.5 3.8.4-2.8 2.6.8 3.7-3.4-1.9-3.3 1.9.7-3.7-2.7-2.6 3.8-.4L37 16Z" stroke-width="1.8" stroke-linejoin="round"/></svg>`
};

// Talvez você tenha chegado aqui porque...
replaceExact('<div class="need-icon">◩</div>', `<div class="need-icon">${icons.glucose}</div>`, 'motivo: diabetes');
replaceExact('<div class="need-icon">▣</div>', `<div class="need-icon">${icons.labs}</div>`, 'motivo: exames');
replaceExact('<div class="need-icon">◉</div>', `<div class="need-icon">${icons.kidney}</div>`, 'motivo: doença renal');
replaceExact('<div class="need-icon">❧</div>', `<div class="need-icon">${icons.plate}</div>`, 'motivo: hábitos');

// Especialidades
replaceExact('<div class="card-icon">◉</div>', `<div class="card-icon">${icons.diabetes}</div>`, 'especialidade: diabetes');
replaceExact('<div class="card-icon">◌</div>', `<div class="card-icon">${icons.kidney}</div>`, 'especialidade: doença renal');
replaceExact('<div class="card-icon">♡</div>', `<div class="card-icon">${icons.chronic}</div>`, 'especialidade: doenças crônicas');
replaceExact('<div class="card-icon">❧</div>', `<div class="card-icon">${icons.plate}</div>`, 'especialidade: alimentação e hábitos');
replaceExact('<div class="card-icon">♧</div>', `<div class="card-icon">${icons.maternal}</div>`, 'especialidade: materno-infantil');

// Como funciona o acompanhamento
replaceExact('<div class="step-circle"><span class="step-num">1</span>◯</div>', `<div class="step-circle"><span class="step-num">1</span>${icons.chat}</div>`, 'etapa 1');
replaceExact('<div class="step-circle"><span class="step-num">2</span>▤</div>', `<div class="step-circle"><span class="step-num">2</span>${icons.labs}</div>`, 'etapa 2');
replaceExact('<div class="step-circle"><span class="step-num">3</span>◉</div>', `<div class="step-circle"><span class="step-num">3</span>${icons.plate}</div>`, 'etapa 3');
replaceExact('<div class="step-circle"><span class="step-num">4</span>↗</div>', `<div class="step-circle"><span class="step-num">4</span>${icons.chart}</div>`, 'etapa 4');
replaceExact('<div class="step-circle"><span class="step-num">5</span>○</div>', `<div class="step-circle"><span class="step-num">5</span>${icons.autonomy}</div>`, 'etapa 5');

const iconCss = `\n/* Ícones clínicos e nutricionais */\n.need-icon svg{width:34px;height:34px;stroke:currentColor}\n.card-icon svg{width:52px;height:42px;stroke:currentColor}\n.step-circle svg{width:34px;height:34px;stroke:currentColor}\n`;
if (!html.includes('/* Ícones clínicos e nutricionais */')) {
  html = html.replace('</style>', `${iconCss}</style>`);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');

for (const file of ['404.html', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'googlef584426b5a709e5e.html']) {
  const source = path.join(__dirname, file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(outDir, file));
}

console.log('Site gerado com ícones atualizados sem alterar as imagens embutidas do index.html.');
