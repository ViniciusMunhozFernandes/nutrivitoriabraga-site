const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distDir = path.join(__dirname, 'dist');
const homePath = path.join(distDir, 'index.html');
const BASE = 'https://www.nutrivitoriabraga.com.br';
const DOCTORALIA = 'https://www.doctoralia.com.br/vitoria-braga-2/nutricionista/porto-alegre';
const INSTAGRAM = 'https://www.instagram.com/nutribeticavi/';
const WHATSAPP = 'https://wa.me/5551999796535?text=Ol%C3%A1%2C%20Vit%C3%B3ria%21%20Encontrei%20seu%20site%20e%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20antes%20de%20agendar%20uma%20consulta.';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Vit%C3%B3ria%20Braga%20Nutricionista%20R.%20Gomes%20Jardim%20301%20Porto%20Alegre%20RS';
const PRIVACY_PATH = '/politica-de-privacidade/';
const CONSENT_KEY = 'vb_consent_v1';
const assetsDir = path.join(distDir, 'assets');
fs.mkdirSync(assetsDir, {recursive: true});

if (!fs.existsSync(homePath)) {
  throw new Error('dist/index.html não encontrado. Finalização cancelada.');
}

function addAttr(tag, name, value) {
  const attrRe = new RegExp(`\\s${name}=("[^"]*"|'[^']*')`, 'i');
  if (attrRe.test(tag)) return tag;
  return tag.replace(/>$/, ` ${name}="${value}">`);
}

function removeAttr(tag, name) {
  const attrRe = new RegExp(`\\s${name}=("[^"]*"|'[^']*')`, 'ig');
  return tag.replace(attrRe, '');
}

function jpegDimensions(buffer) {
  if (!buffer || buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    if (offset + 4 >= buffer.length) break;
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) break;
    const isSof = [0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker);
    if (isSof && offset + 8 < buffer.length) {
      return {height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7)};
    }
    offset += 2 + length;
  }
  return null;
}

function externalizeHomeImages(html) {
  let imgIndex = 0;
  const assets = [];
  const seen = new Map();
  html = html.replace(/<img\b[^>]*\bsrc="data:image\/(jpeg|jpg|png);base64,([^"]+)"[^>]*>/gi, (tag, type, b64) => {
    const buffer = Buffer.from(b64, 'base64');
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
    const ext = /png/i.test(type) ? 'png' : 'jpg';
    const fileName = `vitoria-braga-${hash}.${ext}`;
    const assetPath = `/assets/${fileName}`;
    if (!seen.has(hash)) {
      fs.writeFileSync(path.join(assetsDir, fileName), buffer);
      seen.set(hash, assetPath);
      assets.push(assetPath);
    }

    let out = tag.replace(/src="data:image\/(?:jpeg|jpg|png);base64,[^"]+"/i, `src="${assetPath}"`);
    if (ext === 'jpg') {
      const dims = jpegDimensions(buffer);
      if (dims) {
        out = addAttr(out, 'width', String(dims.width));
        out = addAttr(out, 'height', String(dims.height));
      }
    }
    out = addAttr(out, 'decoding', 'async');
    if (imgIndex === 0) {
      out = removeAttr(out, 'loading');
      out = addAttr(out, 'fetchpriority', 'high');
      out = addAttr(out, 'alt', 'Vitória Braga, nutricionista');
    } else {
      out = addAttr(out, 'loading', 'lazy');
      out = addAttr(out, 'alt', 'Vitória Braga');
    }
    imgIndex += 1;
    return out;
  });
  return {html, heroAsset: assets[0] || null, assets};
}

function addOgTags(html, ogImage) {
  if (!ogImage) return html;
  const abs = `${BASE}${ogImage}`;
  if (!/<meta\s+property="og:image"/i.test(html)) {
    html = html.replace('</head>', `<meta property="og:image" content="${abs}">\n<meta property="og:image:alt" content="Vitória Braga, nutricionista em Porto Alegre e online">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${abs}">\n</head>`);
  }
  return html;
}

const bookingCss = `
<style id="vb-final-package-css">
.booking-section{background:#fff;padding:64px 0}.booking-head{text-align:center;max-width:760px;margin:0 auto 30px}.booking-head .section-eyebrow{justify-content:center}.booking-head h2{font:700 34px/1.15 Georgia,serif;color:var(--green);margin:0 0 12px}.booking-head p{margin:0;color:var(--muted);font-size:14px}.booking-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:18px;max-width:1040px;margin:auto;align-items:stretch}.booking-info{background:var(--green);color:#fff;border-radius:16px;padding:27px;display:flex;flex-direction:column;justify-content:center}.booking-info h3{font:700 25px/1.15 Georgia,serif;margin:0 0 12px}.booking-info p{font-size:13px;line-height:1.6;color:#e2ece9}.booking-points{display:grid;gap:11px;margin:17px 0}.booking-point{display:flex;gap:10px;align-items:flex-start;font-size:12.5px}.booking-num{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:var(--khaki);font-weight:900;flex:0 0 auto}.booking-help{border-top:1px solid rgba(255,255,255,.2);padding-top:17px;margin-top:7px}.booking-help .btn{background:#fff;color:var(--green);border-color:#fff;margin-top:7px}.booking-widget-frame{border:1px solid #e4e1d7;border-radius:16px;background:#fff;padding:18px;min-height:410px;box-shadow:0 10px 28px rgba(20,45,39,.045);overflow:auto}.booking-widget-frame #zl-url{width:100%;min-height:52px;display:flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:9px;text-decoration:none;background:var(--green);color:#fff;font-weight:850}.booking-widget-frame iframe{width:100%!important;max-width:100%!important;border:0!important}.booking-widget-note{text-align:center;font-size:10.5px;color:#798783;margin-top:12px}.footer-item a{color:var(--green);text-decoration:none}.footer-item a:hover{text-decoration:underline}.privacy-settings-link{appearance:none;border:0;background:none;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}.vb-consent{position:fixed;z-index:9999;left:18px;right:18px;bottom:18px;margin:auto;max-width:880px;background:#fff;border:1px solid #ddd8cc;border-radius:14px;box-shadow:0 16px 42px rgba(0,0,0,.16);padding:16px 18px;display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}.vb-consent[hidden]{display:none}.vb-consent p{margin:0;font-size:12.5px;line-height:1.45;color:#465955}.vb-consent p strong{color:var(--green)}.vb-consent a{color:var(--green);font-weight:800}.vb-consent-actions{display:flex;gap:8px;flex-wrap:wrap}.vb-consent button{min-height:40px;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer}.vb-consent .accept{border:1px solid var(--green);background:var(--green);color:#fff}.vb-consent .reject{border:1px solid #9aa7a3;background:#fff;color:#334943}
@media(max-width:800px){.booking-grid{grid-template-columns:1fr}.booking-widget-frame{min-height:360px}.vb-consent{grid-template-columns:1fr}}
@media(max-width:520px){.booking-section{padding:50px 0}.booking-head h2{font-size:29px}.booking-info{padding:22px}.booking-widget-frame{padding:10px;min-height:330px}.vb-consent{left:10px;right:10px;bottom:10px;padding:14px}.vb-consent-actions{width:100%}.vb-consent button{flex:1}}
</style>`;

function bookingSection() {
  return `<section class="booking-section" id="agendamento" aria-labelledby="booking-title">
  <div class="container">
    <div class="booking-head">
      <div class="section-eyebrow">Agendamento</div>
      <h2 id="booking-title">Escolha um horário para sua consulta</h2>
      <p>Consulte os horários disponíveis na agenda da Doctoralia sem precisar procurar novamente pelo perfil da profissional.</p>
    </div>
    <div class="booking-grid">
      <div class="booking-info">
        <h3>Agendamento mais simples</h3>
        <p>Escolha o melhor horário para atendimento presencial em Porto Alegre ou online, conforme a disponibilidade exibida na agenda.</p>
        <div class="booking-points">
          <div class="booking-point"><span class="booking-num">1</span><span>Veja os horários disponíveis.</span></div>
          <div class="booking-point"><span class="booking-num">2</span><span>Escolha a opção que funciona melhor para você.</span></div>
          <div class="booking-point"><span class="booking-num">3</span><span>Continue o agendamento com segurança pela Doctoralia.</span></div>
        </div>
        <div class="booking-help"><strong>Prefere conversar antes?</strong><p>Se tiver alguma dúvida inicial sobre o acompanhamento, fale pelo WhatsApp.</p><a class="btn" href="${WHATSAPP}" target="_blank" rel="noopener">Tirar dúvidas no WhatsApp</a></div>
      </div>
      <div>
        <div class="booking-widget-frame" id="doctoralia-booking-widget">
          <a id="zl-url" class="zl-url" href="${DOCTORALIA}" rel="nofollow noopener" target="_blank" data-zlw-doctor="vitoria-braga-2" data-zlw-type="big_with_calendar" data-zlw-opinion="false" data-zlw-hide-branding="true" data-zlw-saas-only="true" data-zlw-a11y-title="Widget de marcação de consultas médicas">Marque uma consulta</a>
        </div>
        <div class="booking-widget-note">Agenda disponibilizada pela Doctoralia. Caso o calendário não carregue, o botão acima abre o perfil de agendamento.</div>
      </div>
    </div>
  </div>
</section>`;
}

const consentBootstrap = `<script id="vb-consent-bootstrap">
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments)};
(function(){var v=null;try{v=localStorage.getItem('${CONSENT_KEY}')}catch(e){}var granted=v==='granted';gtag('consent','default',{ad_storage:granted?'granted':'denied',analytics_storage:granted?'granted':'denied',ad_user_data:granted?'granted':'denied',ad_personalization:granted?'granted':'denied',functionality_storage:'granted',security_storage:'granted',personalization_storage:'denied',wait_for_update:500});})();
</script>`;

const consentMarkup = `<aside class="vb-consent" id="vb-consent" role="dialog" aria-label="Preferências de privacidade" hidden><p><strong>Privacidade e medição.</strong> Usamos recursos de medição para entender o uso do site e melhorar nossas campanhas. Você pode aceitar ou recusar. Os recursos essenciais do site continuam funcionando. <a href="${PRIVACY_PATH}">Saiba mais</a>.</p><div class="vb-consent-actions"><button class="reject" type="button" data-consent="denied">Recusar</button><button class="accept" type="button" data-consent="granted">Aceitar</button></div></aside>`;

const finalScript = `<script id="vb-final-package-js">
(function(){
  var KEY='${CONSENT_KEY}';
  function getPref(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function setPref(v){try{localStorage.setItem(KEY,v)}catch(e){} if(typeof gtag==='function'){var yes=v==='granted';gtag('consent','update',{ad_storage:yes?'granted':'denied',analytics_storage:yes?'granted':'denied',ad_user_data:yes?'granted':'denied',ad_personalization:yes?'granted':'denied'});}}
  var banner=document.getElementById('vb-consent');
  function showBanner(){if(banner)banner.hidden=false}
  function hideBanner(){if(banner)banner.hidden=true}
  if(!getPref())showBanner();
  document.addEventListener('click',function(e){
    var consent=e.target.closest&&e.target.closest('[data-consent]');
    if(consent){setPref(consent.getAttribute('data-consent'));hideBanner();return;}
    var privacy=e.target.closest&&e.target.closest('[data-privacy-settings]');
    if(privacy){e.preventDefault();showBanner();return;}
    var link=e.target.closest&&e.target.closest('a');
    if(link){var href=link.getAttribute('href')||'';if(href==='#agendamento'||href==='/#agendamento'){if(typeof gtag==='function')gtag('event','click_agendar',{cta_location:link.closest('header')?'header':link.closest('.hero')?'hero':link.closest('.final')?'bottom_cta':link.closest('.cta-band')?'bottom_cta':'page',cta_label:(link.textContent||'').trim().replace(/\\s+/g,' ').slice(0,120),link_url:href,page_location:location.href,transport_type:'beacon'});}}
  },true);

  var section=document.getElementById('agendamento');
  var loaded=false, viewed=false;
  function trackView(){if(viewed)return;viewed=true;if(typeof gtag==='function')gtag('event','view_booking_widget',{page_location:location.href,transport_type:'beacon'});}
  function loadWidget(){if(loaded)return;loaded=true;trackView();if(document.getElementById('zl-widget-s'))return;var js=document.createElement('script');js.id='zl-widget-s';js.src='https://platform.docplanner.com/js/widget.js';js.async=true;document.body.appendChild(js);}
  if(section){if('IntersectionObserver'in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){loadWidget();io.disconnect();}});},{rootMargin:'280px 0px'});io.observe(section);}else{loadWidget();}}
})();
</script>`;

function ensureConsent(html) {
  if (!html.includes('id="vb-consent-bootstrap"')) {
    const gaLoader = /<script\s+async\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"><\/script>/i;
    if (gaLoader.test(html)) html = html.replace(gaLoader, `${consentBootstrap}\n$&`);
    else html = html.replace('</head>', `${consentBootstrap}\n</head>`);
  }
  if (!html.includes('id="vb-final-package-css"')) html = html.replace('</head>', `${bookingCss}\n</head>`);
  if (!html.includes('id="vb-consent"')) html = html.replace('</body>', `${consentMarkup}\n</body>`);
  if (!html.includes('id="vb-final-package-js"')) html = html.replace('</body>', `${finalScript}\n</body>`);
  return html;
}

function rewriteHomeBookingCtas(html) {
  return html.replace(/<a\b([^>]*?)href="([^"]*doctoralia\.com\.br\/vitoria-braga-2\/nutricionista\/porto-alegre)([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi, (full, pre, baseHref, suffix, post, body) => {
    const text = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    const isReview = suffix.includes('#opinions') || /avalia|opini/.test(text);
    const isFooterFallback = /agendamento no doctoralia/.test(text);
    if (isReview || isFooterFallback) return full;
    let attrs = `${pre}href="#agendamento"${post}`.replace(/\s+target=("[^"]*"|'[^']*')/ig, '').replace(/\s+rel=("[^"]*"|'[^']*')/ig, '');
    return `<a${attrs}>${body}</a>`;
  });
}

function insertBooking(html) {
  if (html.includes('id="agendamento"')) return html;
  const reviews = /(<section class="reviews" id="avaliacoes">[\s\S]*?<\/section>)/i;
  if (reviews.test(html)) return html.replace(reviews, `$1\n\n${bookingSection()}`);
  const location = /<section class="location" id="contato">/i;
  if (location.test(html)) return html.replace(location, `${bookingSection()}\n\n$&`);
  throw new Error('Ponto de inserção da agenda não encontrado na Home.');
}

function removeReviewCount(html) {
  return html.replace(/\s*<div class="review-summary">[\s\S]*?<\/div>/i, '');
}

function addHomeFaq(html) {
  if (html.includes('Como posso saber valores e formas de pagamento?')) return html;
  const faqRe = /(<section class="faq" id="duvidas">[\s\S]*?<div class="faq-list">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/i;
  if (!faqRe.test(html)) return html;
  const item = '<details><summary>Como posso saber valores e formas de pagamento?</summary><p>As informações sobre valores, formas de pagamento e disponibilidade podem ser consultadas diretamente pelos canais de atendimento.</p></details>';
  return html.replace(faqRe, `$1$2      ${item}\n    $3`);
}

function enhanceHomeFooter(html) {
  if (!html.includes(INSTAGRAM)) {
    html = html.replace(/(<a href="https:\/\/www\.doctoralia\.com\.br\/vitoria-braga-2\/nutricionista\/porto-alegre"[^>]*>Agendamento no Doctoralia<\/a>)/i, `$1<br><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram: @nutribeticavi</a><br><a href="${PRIVACY_PATH}">Política de privacidade</a>`);
  }
  if (!html.includes('data-privacy-settings')) {
    html = html.replace(/(<span>Conteúdo informativo\. O acompanhamento nutricional é individualizado\.<\/span>)/i, `$1 <button class="privacy-settings-link" type="button" data-privacy-settings>Preferências de privacidade</button>`);
  }
  return html;
}

function enhanceMaps(html) {
  return html.replace(/href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=[^"]+"/gi, `href="${MAPS}"`)
    .replace(/href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=[^"]+"/gi, `href="${MAPS}"`);
}

function homeSchema(ogImage) {
  return `<script type="application/ld+json">\n${JSON.stringify({
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'Person','@id':`${BASE}/#vitoria-braga`,name:'Vitória Braga',jobTitle:'Nutricionista',url:`${BASE}/`,sameAs:[DOCTORALIA,INSTAGRAM]},
      {'@type':['ProfessionalService','MedicalBusiness'],'@id':`${BASE}/#consultorio`,name:'Vitória Braga Nutricionista',url:`${BASE}/`,image:ogImage?`${BASE}${ogImage}`:undefined,telephone:'+55 51 99979-6535',medicalSpecialty:'https://schema.org/DietNutrition',areaServed:[{'@type':'City',name:'Porto Alegre'},{'@type':'Country',name:'Brasil'}],address:{'@type':'PostalAddress',streetAddress:'R. Gomes Jardim, 301 - Sala 407',addressLocality:'Porto Alegre',addressRegion:'RS',postalCode:'90620-130',addressCountry:'BR'},sameAs:[DOCTORALIA,INSTAGRAM],hasMap:MAPS}
    ]
  }, null, 2)}\n</script>`;
}

function replaceHomeSchema(html, ogImage) {
  const graphSchema = /<script type="application\/ld\+json">\s*\{[\s\S]*?"@graph"[\s\S]*?<\/script>/i;
  if (graphSchema.test(html)) return html.replace(graphSchema, homeSchema(ogImage));
  return html.replace('</body>', `${homeSchema(ogImage)}\n</body>`);
}

function rewriteSpecialtyCtas(html) {
  return html.replace(/href="https:\/\/www\.doctoralia\.com\.br\/vitoria-braga-2\/nutricionista\/porto-alegre"/gi, 'href="/#agendamento"')
    .replace(/(<a\b[^>]*href="\/#agendamento"[^>]*?)\s+target="_blank"/gi, '$1')
    .replace(/(<a\b[^>]*href="\/#agendamento"[^>]*?)\s+rel="noopener"/gi, '$1');
}

function enhanceSpecialtyFooter(html) {
  if (!html.includes('data-specialty-social')) {
    html = html.replace(/(<div class="footer-grid">[\s\S]*?<\/div>)(<div class="legal">)/i, `$1<div data-specialty-social style="margin-top:10px;display:flex;gap:14px;flex-wrap:wrap"><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @nutribeticavi</a><a href="${PRIVACY_PATH}">Política de privacidade</a><button class="privacy-settings-link" type="button" data-privacy-settings>Preferências de privacidade</button></div>$2`);
  }
  return html;
}

function specialtySchema(html, ogImage) {
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : `${BASE}/`;
  const title = titleMatch ? titleMatch[1].replace(/\s*\|\s*Vitória Braga.*$/i,'') : 'Acompanhamento nutricional';
  const graph = {
    '@context':'https://schema.org',
    '@graph':[
      {'@type':['ProfessionalService','MedicalBusiness'],'@id':`${BASE}/#consultorio`,name:'Vitória Braga Nutricionista',url:`${BASE}/`,image:ogImage?`${BASE}${ogImage}`:undefined,telephone:'+55 51 99979-6535',medicalSpecialty:'https://schema.org/DietNutrition',address:{'@type':'PostalAddress',streetAddress:'R. Gomes Jardim, 301 - Sala 407',addressLocality:'Porto Alegre',addressRegion:'RS',postalCode:'90620-130',addressCountry:'BR'},sameAs:[DOCTORALIA,INSTAGRAM],hasMap:MAPS},
      {'@type':'Service','@id':`${canonical}#service`,name:title,url:canonical,provider:{'@id':`${BASE}/#consultorio`},areaServed:[{'@type':'City',name:'Porto Alegre'},{'@type':'Country',name:'Brasil'}]}
    ]
  };
  const schema = `<script type="application/ld+json">\n${JSON.stringify(graph,null,2)}\n</script>`;
  const existing = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
  if (existing.test(html)) return html.replace(existing, schema);
  return html.replace('</head>', `${schema}\n</head>`);
}

function privacyPage() {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Política de Privacidade | Vitória Braga Nutricionista</title><meta name="description" content="Política de privacidade do site de Vitória Braga Nutricionista."><link rel="canonical" href="${BASE}${PRIVACY_PATH}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">${consentBootstrap}<style>:root{--green:#0f4f45;--khaki:#74683A;--cream:#fbfaf6;--text:#334943}*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--text);font:16px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}.wrap{width:min(calc(100% - 36px),850px);margin:auto}header{background:#fff;border-bottom:1px solid #e8e4da;padding:19px 0}.brand{font:700 24px Georgia,serif;color:var(--green);text-decoration:none}main{padding:50px 0 65px}h1,h2{font-family:Georgia,serif;color:var(--green)}h1{font-size:42px;line-height:1.05;margin:0 0 16px}h2{font-size:23px;margin-top:34px}p,li{font-size:14px}a{color:var(--green);font-weight:700}.box{background:#fff;border:1px solid #e5e1d7;border-radius:14px;padding:22px;margin:24px 0}.back{display:inline-flex;margin-top:25px;padding:10px 14px;border-radius:8px;background:var(--green);color:#fff;text-decoration:none}</style>${bookingCss}</head><body><header><div class="wrap"><a class="brand" href="/">Vitória Braga · Nutricionista</a></div></header><main><div class="wrap"><h1>Política de Privacidade</h1><p>Última atualização: 25 de agosto de 2026.</p><div class="box"><strong>Resumo:</strong> este site utiliza recursos de medição para entender seu uso e melhorar a experiência e as campanhas. Não é necessário informar dados clínicos para navegar pelo site.</div><h2>1. Dados tratados</h2><p>Ao navegar, podem ser tratados dados técnicos como páginas acessadas, tipo de dispositivo, navegador, origem da visita e interações com botões. Quando você escolhe falar pelo WhatsApp, agendar pela Doctoralia ou acessar o Instagram, o tratamento de dados passa também a seguir as políticas dessas plataformas.</p><h2>2. Google Analytics e publicidade</h2><p>O site utiliza Google Analytics 4 e pode ser integrado ao Google Ads para medir desempenho. O Consent Mode é usado para respeitar sua escolha sobre armazenamento de dados de analytics e publicidade. Você pode aceitar ou recusar esses recursos a qualquer momento.</p><h2>3. Doctoralia, WhatsApp, Google Maps e Instagram</h2><p>O site contém integrações e links para Doctoralia, WhatsApp, Google Maps e Instagram. Essas empresas possuem políticas próprias de privacidade. O widget de agendamento da Doctoralia é carregado quando você se aproxima da seção de agenda.</p><h2>4. Dados de saúde</h2><p>Os eventos de medição configurados neste site registram interações gerais, como clique em agendamento ou WhatsApp, sem a intenção de enviar ao Google informações sobre diagnósticos, exames ou outras informações clínicas do paciente.</p><h2>5. Suas escolhas</h2><p>Você pode alterar a preferência de medição usando o botão abaixo. Também pode usar o navegador para controlar cookies e armazenamento local.</p><button class="privacy-settings-link" type="button" data-privacy-settings>Alterar preferências de privacidade</button><h2>6. Contato</h2><p>Para dúvidas sobre esta política ou sobre o atendimento, entre em contato com Vitória Braga pelo <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>.</p><a class="back" href="/">Voltar ao site</a></div></main>${consentMarkup}${finalScript}</body></html>`;
}

let home = fs.readFileSync(homePath, 'utf8');
const images = externalizeHomeImages(home);
home = images.html;
home = addOgTags(home, images.heroAsset);
home = rewriteHomeBookingCtas(home);
home = insertBooking(home);
home = removeReviewCount(home);
home = addHomeFaq(home);
home = enhanceHomeFooter(home);
home = enhanceMaps(home);
home = replaceHomeSchema(home, images.heroAsset);
home = ensureConsent(home);
fs.writeFileSync(homePath, home, 'utf8');

const specialtyDirs = fs.readdirSync(distDir, {withFileTypes:true}).filter(d => d.isDirectory() && d.name.startsWith('nutricionista-'));
for (const dirent of specialtyDirs) {
  const pagePath = path.join(distDir, dirent.name, 'index.html');
  if (!fs.existsSync(pagePath)) continue;
  let html = fs.readFileSync(pagePath, 'utf8');
  html = addOgTags(html, images.heroAsset);
  html = rewriteSpecialtyCtas(html);
  html = enhanceSpecialtyFooter(html);
  html = specialtySchema(html, images.heroAsset);
  html = ensureConsent(html);
  fs.writeFileSync(pagePath, html, 'utf8');
}

const privacyDir = path.join(distDir, 'politica-de-privacidade');
fs.mkdirSync(privacyDir, {recursive:true});
fs.writeFileSync(path.join(privacyDir, 'index.html'), privacyPage(), 'utf8');

console.log(`Pacote final aplicado: agenda Doctoralia, consentimento, privacidade, Instagram, schema, OG e ${images.assets.length} imagem(ns) externa(s).`);
