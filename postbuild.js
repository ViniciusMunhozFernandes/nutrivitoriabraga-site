const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Mantém o domínio canônico oficial com www.
html = html.replaceAll('https://nutrivitoriabraga.com.br/', 'https://www.nutrivitoriabraga.com.br/');

// SEO/posicionamento da Home: deixa claros os focos clínicos sem limitar o atendimento geral.
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Nutricionista em Porto Alegre e online, com foco em diabetes, doença renal, hipertensão e saúde materno-infantil, além de alimentação e hábitos.">'
);
html = html.replace(
  /<meta property="og:description" content="[^"]*">/,
  '<meta property="og:description" content="Nutrição clínica individualizada para diabetes, doença renal, hipertensão, materno-infantil e alimentação e hábitos.">'
);

// Hero: mantém a foto original embutida e altera apenas a mensagem.
html = html.replace(
  /<p class="hero-lead">[\s\S]*?<\/p>/,
  '<p class="hero-lead">Nutricionista clínica com foco em diabetes, doença renal, hipertensão e saúde materno-infantil — além de acompanhamento em alimentação e hábitos.</p>'
);

// Inclui depoimentos na navegação, sem remover os links atuais.
if (!html.includes('href="#avaliacoes">Depoimentos</a>')) {
  html = html.replace(
    '<a href="#duvidas">Dúvidas</a>',
    '<a href="#avaliacoes">Depoimentos</a>\n      <a href="#duvidas">Dúvidas</a>'
  );
}

// Nova apresentação das especialidades aprovada na prévia.
const hypertensionIcon = `<svg viewBox="0 0 56 48" fill="none" aria-hidden="true"><path d="M28 42S9 31 9 18c0-6 4-10 10-10 4 0 7 2 9 6 2-4 5-6 9-6 6 0 10 4 10 10 0 13-19 24-19 24Z" stroke="currentColor" stroke-width="2.2"/><path d="M13 25h8l3-8 6 16 4-10 3 2h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const glucoseIcon = `<svg viewBox="0 0 56 48" fill="none" aria-hidden="true"><rect x="7" y="5" width="24" height="35" rx="6" stroke="currentColor" stroke-width="2.2"/><rect x="12" y="11" width="14" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M19 14c-1.8 2.3-2.7 3.7-2.7 4.7a2.7 2.7 0 0 0 5.4 0c0-1-.9-2.4-2.7-4.7Z" stroke="currentColor" stroke-width="1.7"/><circle cx="19" cy="31" r="2" stroke="currentColor" stroke-width="2"/><path d="m39 35 10-19 4 2-10 19-6 4 2-6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
const kidneyIcon = `<svg viewBox="0 0 52 48" fill="none" aria-hidden="true"><path d="M19 7c-6 0-11 5-11 13 0 8 4 14 11 14 4 0 7-3 7-7V15c0-5-3-8-7-8Z" stroke="currentColor" stroke-width="2.2"/><path d="M33 7c6 0 11 5 11 13 0 8-4 14-11 14-4 0-7-3-7-7V15c0-5 3-8 7-8Z" stroke="currentColor" stroke-width="2.2"/><path d="M19 25c4 0 7 2 7 7v10M33 25c-4 0-7 2-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const maternalIcon = `<svg viewBox="0 0 54 48" fill="none" aria-hidden="true"><path d="M18 11c0-5 4-8 8-8 5 0 8 4 8 9v5h-5v20H9v-4c0-6 3-10 8-13 2-2 4-4 4-8 0-3-2-6-6-6" stroke="currentColor" stroke-width="2"/><circle cx="33" cy="25" r="5" stroke="currentColor" stroke-width="2"/><path d="M23 36c3-6 8-9 13-8 4 1 7 4 7 8 0 5-4 8-9 8H22c-5 0-8-3-8-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const habitsIcon = `<svg viewBox="0 0 56 48" fill="none" aria-hidden="true"><circle cx="30" cy="25" r="12" stroke="currentColor" stroke-width="2.1"/><path d="M26 29c1-6 5-10 11-10-1 6-5 10-11 10Zm1 0c-3-5-7-7-11-6 1 4 5 7 11 6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v28M8 10v10c0 4 1.5 6 4 6s4-2 4-6V10M46 10c-3 5-4 10-4 15v13" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>`;

const specialtiesSection = `<section class="specialties" id="especialidades">
  <div class="container">
    <div class="section-eyebrow center-eyebrow">Especialidades</div>
    <h2 class="section-title specialties-title">Acompanhamento nutricional para<br>diferentes fases e necessidades</h2>
    <div class="cards specialty-cards">
      <article class="card focus-card">
        <div class="card-icon specialty-icon">${glucoseIcon}</div>
        <h3>Diabetes</h3>
        <p>Acompanhamento nutricional individualizado para diabetes tipo 1, tipo 2 e pré-diabetes.</p>
        <a href="#contato">Saiba mais →</a>
      </article>
      <article class="card focus-card">
        <div class="card-icon specialty-icon">${kidneyIcon}</div>
        <h3>Doença renal</h3>
        <p>Plano alimentar personalizado considerando exames, estágio da doença, rotina e necessidades individuais.</p>
        <a href="#contato">Saiba mais →</a>
      </article>
      <article class="card focus-card">
        <div class="card-icon specialty-icon">${hypertensionIcon}</div>
        <h3>Hipertensão e saúde cardiovascular</h3>
        <p>Estratégias nutricionais para controle da pressão arterial, saúde cardiovascular e prevenção de complicações.</p>
        <a href="#contato">Saiba mais →</a>
      </article>
      <article class="card focus-card">
        <div class="card-icon specialty-icon">${maternalIcon}</div>
        <h3>Materno-infantil</h3>
        <p>Nutrição na gestação, amamentação, introdução alimentar e alimentação infantil em diferentes fases.</p>
        <a href="#contato">Saiba mais →</a>
      </article>
      <article class="card focus-card">
        <div class="card-icon specialty-icon">${habitsIcon}</div>
        <h3>Alimentação e hábitos</h3>
        <p>Reeducação alimentar, prevenção, qualidade de vida e construção de hábitos possíveis para a rotina.</p>
        <a href="#contato">Saiba mais →</a>
      </article>
    </div>
  </div>
</section>`;

const specialtiesRegex = /<section class="specialties" id="especialidades">[\s\S]*?<\/section>/;
if (!specialtiesRegex.test(html)) {
  throw new Error('Seção de especialidades não encontrada. Pós-build cancelado para proteger o site.');
}
html = html.replace(specialtiesRegex, specialtiesSection);

// Linguagem do acompanhamento alinhada à nova composição visual.
html = html.replace('<h2 class="section-title">Como funciona o acompanhamento</h2>', '<div class="section-eyebrow center-eyebrow">Como funciona o acompanhamento</div><h2 class="section-title process-title">Um cuidado construído com você</h2>');
html = html.replace('<h3>Entender</h3>', '<h3>Conversamos</h3>');
html = html.replace('<h3>Planejar</h3>', '<h3>Planejamos</h3>');
html = html.replace('<h3>Aplicar</h3>', '<h3>Colocamos em prática</h3>');
html = html.replace('<h3>Acompanhar</h3>', '<h3>Acompanhamos e ajustamos</h3>');
html = html.replace('<h3>Ganhar autonomia</h3>', '<h3>Você ganha autonomia</h3>');

// Destaque da história profissional/pessoal sem alterar o conteúdo clínico existente.
html = html.replace(
  '<div class="about-copy"><h2>Sobre mim</h2>',
  '<div class="about-copy"><div class="section-eyebrow">Sobre mim</div><h2>Nutrição baseada em ciência e experiência de vida</h2>'
);

// Aproxima “Sobre mim” e “Como funciona” da composição visual aprovada.
const storyProcessRegex = /(<section class="process" id="como-funciona">[\s\S]*?<\/section>)\s*(<section class="about" id="sobre">[\s\S]*?<\/section>)/;
const storyProcessMatch = html.match(storyProcessRegex);
if (!storyProcessMatch) {
  throw new Error('Blocos Sobre mim/Como funciona não encontrados. Pós-build cancelado para proteger o site.');
}
html = html.replace(
  storyProcessRegex,
  `<section class="story-process-shell"><div class="container story-process-grid">${storyProcessMatch[2]}${storyProcessMatch[1]}</div></section>`
);

// CSS da nova Home. Mantemos a foto original, avaliações, localização e FAQ existentes.
const homeRefreshCss = `
/* Home refresh 2026-08: layout aprovado */
.section-eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--khaki-dark);font-weight:900;margin-bottom:10px;display:flex;align-items:center;gap:9px}
.section-eyebrow:before{content:"";width:22px;height:1px;background:var(--khaki);display:inline-block}
.center-eyebrow{justify-content:center}
.specialties{padding:58px 0 64px;background:#fff}
.specialties-title{margin-bottom:28px;font-size:34px}
.specialty-cards{gap:16px;align-items:stretch}
.focus-card{border:1px solid #e5dfd2;background:linear-gradient(180deg,#fffdfa 0%,#fbfaf6 100%);border-radius:14px;padding:20px 18px 18px;min-height:270px;text-align:center;display:flex;flex-direction:column;align-items:center;box-shadow:0 8px 25px rgba(20,45,39,.035)}
.specialty-icon{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--green);color:#e9dfbc;margin:0 auto 14px}
.specialty-icon svg{width:43px;height:38px;stroke:currentColor}
.focus-card h3{font-size:19px;min-height:42px;display:flex;align-items:center;justify-content:center;margin-bottom:9px}
.focus-card p{font-size:12.5px;line-height:1.5;min-height:92px;margin:0 0 14px;color:#455752}
.focus-card a{margin-top:auto;color:var(--green);font-weight:850}
.story-process-shell{padding:0 0 18px;background:#fff}
.story-process-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:16px;align-items:stretch}
.story-process-grid>.about,.story-process-grid>.process{padding:0;background:transparent;min-width:0}
.story-process-grid>.about>.container,.story-process-grid>.process>.container{width:100%;margin:0;height:100%}
.story-process-grid .about-grid{display:block;height:100%}
.story-process-grid .about-photo{display:none}
.story-process-grid .about-copy{height:100%;border:1px solid #ebe5d9;background:linear-gradient(145deg,#fffdf9,#faf6ef);padding:28px;border-radius:14px;box-shadow:none}
.story-process-grid .about-copy h2{font-size:29px;margin-bottom:15px}
.story-process-grid .about-copy p{font-size:13.5px;line-height:1.55}
.story-process-grid .personal-story{font-size:13px;margin:16px 0;background:#f6f0e4;border-left-color:var(--khaki)}
.story-process-grid .credentials{display:none}
.story-process-grid .process>.container{border:1px solid #ebe5d9;background:linear-gradient(145deg,#fffdf9,#faf8f3);border-radius:14px;padding:28px}
.process-title{font-size:28px;margin-bottom:24px}
.story-process-grid .steps{grid-template-columns:repeat(5,1fr);gap:8px}
.story-process-grid .step-circle{width:56px;height:56px;background:#e7eddc;color:var(--green);margin-bottom:12px}
.story-process-grid .step-circle svg{width:31px;height:31px}
.story-process-grid .step-num{background:transparent;color:var(--khaki);border:0;font:700 19px/1 Georgia,serif;left:17px;top:65px;width:auto;height:auto}
.story-process-grid .step{padding-bottom:24px}
.story-process-grid .step h3{font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:12.5px;line-height:1.25;margin-top:27px;min-height:32px}
.story-process-grid .step p{font-size:10.8px;line-height:1.45;max-width:125px}
.cta-band{background:#fff;padding:0 0 22px}
.cta-band .cta-grid{background:linear-gradient(90deg,#edf2e8,#e6eee7);border:1px solid #dce5d9;border-radius:12px;padding:20px 28px}
.cta-band .cta-copy h2{color:var(--green);font-size:24px}
.cta-band .cta-copy p{color:#40534e}
.cta-band .btn-book{background:var(--green)}
.cta-band .btn-book:hover{background:var(--green-dark)}
.cta-band .btn-outline{border-color:var(--green)!important;color:var(--green)!important;background:#fff!important}
.step-num{background:var(--khaki)}
@media(max-width:1100px){
  .specialty-cards{grid-template-columns:repeat(3,1fr)}
  .story-process-grid{grid-template-columns:1fr}
  .story-process-grid .steps{grid-template-columns:repeat(5,1fr)}
}
@media(max-width:760px){
  .specialties-title{font-size:29px}
  .specialty-cards{grid-template-columns:1fr 1fr}
  .focus-card{min-height:250px}
  .story-process-grid .steps{grid-template-columns:1fr 1fr;row-gap:22px}
  .story-process-grid .step-num{position:static;margin-top:7px;font-size:18px}
  .story-process-grid .step h3{margin-top:7px}
}
@media(max-width:520px){
  .specialty-cards{grid-template-columns:1fr}
  .focus-card{min-height:auto}
  .focus-card p{min-height:auto}
  .cta-band .cta-grid{padding:20px}
}
`;

if (!html.includes('/* Home refresh 2026-08: layout aprovado */')) {
  html = html.replace('</style>', `${homeRefreshCss}\n</style>`);
}

// Substitui o rastreamento de cliques por uma versão robusta.
const trackingRegex = /<script>\s*\/\* GA4 conversion events(?: v2)? \*\/[\s\S]*?<\/script>/;

const trackingScript = `<script>
/* GA4 conversion events v2 */
(function () {
  function getCtaLocation(link) {
    if (link.classList.contains('float-wa')) return 'floating_whatsapp';
    if (link.closest('header')) return 'header';
    if (link.closest('.hero')) return 'hero';
    if (link.closest('.specialties')) return 'specialties';
    if (link.closest('.reviews')) return 'reviews';
    if (link.closest('.location')) return 'location';
    if (link.closest('.cta-band')) return 'bottom_cta';
    if (link.closest('footer')) return 'footer';
    return 'other';
  }

  function getLabel(link) {
    return (link.textContent || link.getAttribute('aria-label') || '')
      .trim()
      .replace(/\\s+/g, ' ')
      .slice(0, 120);
  }

  function sendEvent(eventName, link) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, {
      cta_location: getCtaLocation(link),
      cta_label: getLabel(link),
      link_url: link.href || '',
      page_location: window.location.href,
      transport_type: 'beacon'
    });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest ? event.target.closest('a') : null;
    if (!link) return;

    const href = link.href || '';
    const label = getLabel(link).toLowerCase();

    if (href.includes('wa.me/')) {
      sendEvent('click_whatsapp', link);
      return;
    }

    if (href.includes('doctoralia.com.br')) {
      if (href.includes('#opinions') || label.includes('avaliaç') || label.includes('avaliac') || label.includes('opini')) {
        sendEvent('click_doctoralia_reviews', link);
      } else {
        sendEvent('click_agendar', link);
      }
      return;
    }

    if (href.includes('google.com/maps') || href.includes('maps.google')) {
      sendEvent('click_google_maps', link);
    }
  }, true);
})();
</script>`;

if (!trackingRegex.test(html)) {
  throw new Error('Bloco de rastreamento GA4 não encontrado. Pós-build cancelado para proteger o site.');
}
html = html.replace(trackingRegex, trackingScript);

fs.writeFileSync(file, html, 'utf8');
console.log('Pós-build aplicado: nova Home + www canônico + rastreamento robusto de CTAs.');
