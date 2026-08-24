const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const homePath = path.join(distDir, 'index.html');
const BASE = 'https://www.nutrivitoriabraga.com.br';
const DOCTORALIA = 'https://www.doctoralia.com.br/vitoria-braga-2/nutricionista/porto-alegre';
const WHATSAPP = 'https://wa.me/5551999796535?text=Ol%C3%A1%2C%20Vit%C3%B3ria%21%20Encontrei%20seu%20site%20e%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20antes%20de%20agendar%20uma%20consulta.';
const GA_ID = 'G-VPY018B4H3';

function escRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Atualiza a Home para usar as páginas dedicadas sem poluir o menu.
let home = fs.readFileSync(homePath, 'utf8');

home = home.replace(
  /<p class="hero-lead">[\s\S]*?<\/p>/,
  '<p class="hero-lead">Atendimento presencial em Porto Alegre e online para todo o Brasil, com foco em diabetes, doença renal, hipertensão e saúde materno-infantil — além de alimentação e hábitos.</p>'
);

const homeLinks = {
  'Diabetes': '/nutricionista-diabetes-porto-alegre/',
  'Doença renal': '/nutricionista-doenca-renal-porto-alegre/',
  'Hipertensão e saúde cardiovascular': '/nutricionista-hipertensao-porto-alegre/',
  'Materno-infantil': '/nutricionista-materno-infantil-porto-alegre/'
};

for (const [title, url] of Object.entries(homeLinks)) {
  const re = new RegExp(`(<h3>${escRegex(title)}<\\/h3>[\\s\\S]*?<a href=")[^"]+("[^>]*>Saiba mais →<\\/a>)`);
  if (!re.test(home)) throw new Error(`Card da Home não encontrado: ${title}`);
  home = home.replace(re, `$1${url}$2`);
}

// Alimentação e hábitos segue como atendimento geral na própria Home.
const habitsRe = /(<h3>Alimentação e hábitos<\/h3>[\s\S]*?<a href=")[^"]+("[^>]*>Saiba mais →<\/a>)/;
if (habitsRe.test(home)) home = home.replace(habitsRe, '$1#contato$2');

// Link discreto para atendimento online, sem adicionar mais um item ao menu superior.
if (!home.includes('class="online-note"')) {
  const onlineNote = '<p class="online-note">Prefere atendimento à distância? <a href="/nutricionista-online/">Conheça o acompanhamento nutricional online →</a></p>';
  home = home.replace('</section>\n\n<section class="philosophy">', `${onlineNote}\n</section>\n\n<section class="philosophy">`);
  home = home.replace('</style>', '\n.online-note{max-width:720px;margin:24px auto 0;text-align:center;font-size:13px;color:var(--muted)}.online-note a{color:var(--green);font-weight:800;text-decoration:none}.online-note a:hover{text-decoration:underline}\n</style>');
}

fs.writeFileSync(homePath, home, 'utf8');

const icons = {
  diabetes: '<svg viewBox="0 0 72 72" fill="none"><rect x="11" y="9" width="31" height="46" rx="8" stroke="currentColor" stroke-width="2.5"/><rect x="17" y="17" width="19" height="15" rx="3" stroke="currentColor" stroke-width="2.2"/><path d="M26.5 21c-2.4 3-3.6 4.8-3.6 6.1a3.6 3.6 0 0 0 7.2 0c0-1.3-1.2-3.1-3.6-6.1Z" stroke="currentColor" stroke-width="2"/><circle cx="26.5" cy="43" r="2.5" stroke="currentColor" stroke-width="2.2"/><path d="m50 53 13-25 5 2.8-13 25-8 5 3-7.8Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>',
  renal: '<svg viewBox="0 0 72 72" fill="none"><path d="M28 11c-9 0-15 8-15 19 0 12 6 21 15 21 6 0 10-4 10-10V23c0-7-4-12-10-12Z" stroke="currentColor" stroke-width="2.6"/><path d="M44 11c9 0 15 8 15 19 0 12-6 21-15 21-6 0-10-4-10-10V23c0-7 4-12 10-12Z" stroke="currentColor" stroke-width="2.6"/><path d="M28 38c6 0 10 4 10 10v14M44 38c-6 0-10 4-10 10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  hipertensao: '<svg viewBox="0 0 72 72" fill="none"><path d="M36 61S11 47 11 28c0-9 6-15 15-15 6 0 10 3 13 9 3-6 7-9 13-9 9 0 15 6 15 15 0 19-31 33-31 33Z" stroke="currentColor" stroke-width="2.6"/><path d="M17 36h11l4-11 8 22 6-14 4 3h9" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  maternal: '<svg viewBox="0 0 72 72" fill="none"><path d="M25 17c0-8 6-13 13-13 8 0 13 6 13 14v8h-8v30H15v-6c0-9 5-16 13-20 3-3 6-7 6-12 0-5-3-9-9-9" stroke="currentColor" stroke-width="2.5"/><circle cx="48" cy="38" r="7" stroke="currentColor" stroke-width="2.5"/><path d="M31 55c4-9 12-14 20-12 6 1 10 6 10 12 0 7-6 12-13 12H30c-8 0-13-5-13-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  online: '<svg viewBox="0 0 72 72" fill="none"><rect x="9" y="12" width="54" height="38" rx="5" stroke="currentColor" stroke-width="2.5"/><path d="M25 61h22M30 50l-2 11M42 50l2 11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="36" cy="27" r="6" stroke="currentColor" stroke-width="2.3"/><path d="M25 43c1-7 5-11 11-11s10 4 11 11" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>'
};

const pages = [
  {
    slug: 'nutricionista-diabetes-porto-alegre',
    key: 'diabetes',
    title: 'Nutricionista para Diabetes em Porto Alegre e Online | Vitória Braga',
    description: 'Acompanhamento nutricional para diabetes tipo 1, tipo 2 e pré-diabetes em Porto Alegre e online para todo o Brasil.',
    eyebrow: 'Diabetes · Porto Alegre e online',
    h1: 'Nutricionista para Diabetes em Porto Alegre e atendimento online',
    lead: 'Acompanhamento individualizado para ajudar você a entender sua alimentação, organizar a rotina e tomar decisões com mais segurança no cuidado com o diabetes.',
    introTitle: 'Nutrição no diabetes sem transformar a rotina em uma lista de proibições',
    intro: 'O acompanhamento considera tipo de diabetes, uso de medicamentos ou insulina, exames, preferências alimentares, rotina, atividade física e objetivos. A proposta é construir estratégias possíveis, baseadas em evidências e adaptadas à sua realidade.',
    benefits: ['Organização das refeições e carboidratos', 'Estratégias para rotina, trabalho e exercício', 'Leitura de rótulos e escolhas alimentares', 'Acompanhamento individual conforme evolução'],
    indicated: ['Diabetes tipo 1', 'Diabetes tipo 2', 'Pré-diabetes', 'Pessoas que usam insulina', 'Quem deseja compreender melhor carboidratos e glicemia'],
    faq: [
      ['Preciso cortar carboidratos?', 'Não existe uma regra única. Quantidade, tipo, distribuição e combinação dos carboidratos precisam ser avaliados dentro do contexto de cada pessoa.'],
      ['Você atende diabetes tipo 1?', 'Sim. O atendimento inclui pessoas com diabetes tipo 1, sempre de forma individualizada e integrada às orientações da equipe de saúde.'],
      ['O atendimento pode ser online?', 'Sim. É possível realizar o acompanhamento online para todo o Brasil, além do atendimento presencial em Porto Alegre.']
    ]
  },
  {
    slug: 'nutricionista-doenca-renal-porto-alegre',
    key: 'renal',
    title: 'Nutricionista para Doença Renal em Porto Alegre e Online | Vitória Braga',
    description: 'Nutrição para doença renal em Porto Alegre e online, com orientação individualizada conforme exames, estágio da doença e rotina.',
    eyebrow: 'Doença renal · Porto Alegre e online',
    h1: 'Nutricionista para Doença Renal em Porto Alegre e atendimento online',
    lead: 'Orientação nutricional individualizada considerando exames, estágio da doença renal, tratamento, rotina e preferências alimentares.',
    introTitle: 'Na doença renal, a alimentação precisa ser individualizada',
    intro: 'Necessidades de proteína, sódio, potássio, fósforo, líquidos e energia podem variar conforme o quadro clínico. Por isso, o acompanhamento evita restrições genéricas e parte de uma avaliação completa, respeitando também as orientações da equipe assistencial.',
    benefits: ['Plano alimentar alinhado aos exames', 'Orientação sobre sódio, potássio e fósforo quando necessário', 'Adequação de proteínas conforme o contexto clínico', 'Estratégias práticas para a rotina'],
    indicated: ['Doença renal crônica em diferentes estágios', 'Pessoas em tratamento conservador', 'Pessoas em diálise, conforme avaliação individual', 'Alterações laboratoriais relacionadas à função renal', 'Quem recebeu orientação para mudar a alimentação por causa dos rins'],
    faq: [
      ['Todo paciente renal precisa cortar potássio?', 'Não. A necessidade de restrição depende de exames, medicamentos, estágio da doença e outros fatores clínicos.'],
      ['Preciso diminuir proteína?', 'Nem sempre. A recomendação varia conforme o estágio da doença, tratamento e estado nutricional.'],
      ['Posso fazer acompanhamento online?', 'Sim. O atendimento pode ser presencial em Porto Alegre ou online para todo o Brasil.']
    ]
  },
  {
    slug: 'nutricionista-hipertensao-porto-alegre',
    key: 'hipertensao',
    title: 'Nutricionista para Hipertensão em Porto Alegre e Online | Vitória Braga',
    description: 'Acompanhamento nutricional para hipertensão e saúde cardiovascular em Porto Alegre e online para todo o Brasil.',
    eyebrow: 'Hipertensão · Porto Alegre e online',
    h1: 'Nutricionista para Hipertensão e Saúde Cardiovascular em Porto Alegre e online',
    lead: 'Estratégias alimentares individualizadas para apoiar o controle da pressão arterial e cuidar da saúde cardiovascular de forma sustentável.',
    introTitle: 'Cuidar da pressão vai além de apenas retirar o sal da comida',
    intro: 'O acompanhamento considera padrão alimentar, consumo de sódio, qualidade das refeições, peso quando relevante, exames, medicamentos, rotina e presença de outras condições como diabetes ou doença renal.',
    benefits: ['Estratégias para reduzir excesso de sódio', 'Leitura de rótulos e escolhas no dia a dia', 'Organização de um padrão alimentar cardiovascularmente adequado', 'Plano integrado à rotina e a outras condições clínicas'],
    indicated: ['Hipertensão arterial', 'Pressão arterial limítrofe ou elevada', 'Alterações de colesterol e triglicerídeos', 'Síndrome metabólica', 'Pessoas com diabetes e hipertensão', 'Pessoas com doença renal e hipertensão, conforme avaliação clínica'],
    faq: [
      ['Basta parar de usar sal?', 'Não. O sódio também está presente em alimentos industrializados, temperos e preparações prontas, e o padrão alimentar como um todo precisa ser considerado.'],
      ['Você atende quem tem hipertensão junto com diabetes?', 'Sim. Condições podem coexistir e o plano é construído considerando o conjunto do quadro clínico.'],
      ['Existe atendimento online?', 'Sim. O acompanhamento é presencial em Porto Alegre e online para todo o Brasil.']
    ]
  },
  {
    slug: 'nutricionista-materno-infantil-porto-alegre',
    key: 'maternal',
    title: 'Nutricionista Materno-Infantil em Porto Alegre e Online | Vitória Braga',
    description: 'Nutrição materno-infantil em Porto Alegre e online: gestação, amamentação, introdução alimentar e alimentação infantil.',
    eyebrow: 'Materno-infantil · Porto Alegre e online',
    h1: 'Nutricionista Materno-Infantil em Porto Alegre e atendimento online',
    lead: 'Acompanhamento nutricional para gestação, amamentação, introdução alimentar e diferentes fases da alimentação infantil, respeitando a realidade de cada família.',
    introTitle: 'Nutrição para diferentes fases da maternidade e da infância',
    intro: 'Cada fase traz necessidades e dúvidas diferentes. O acompanhamento busca orientar com clareza, acolher a rotina familiar e construir estratégias seguras e possíveis, evitando regras desnecessárias e respeitando o desenvolvimento da criança.',
    benefits: ['Orientação nutricional durante a gestação', 'Suporte alimentar no período de amamentação', 'Introdução alimentar com orientação individualizada', 'Construção de hábitos alimentares na infância'],
    indicated: ['Gestantes', 'Lactantes', 'Famílias iniciando a introdução alimentar', 'Bebês e crianças em diferentes fases', 'Famílias com dúvidas sobre rotina e alimentação infantil'],
    faq: [
      ['Quando procurar nutricionista na gestação?', 'O acompanhamento pode começar em diferentes momentos da gestação, especialmente quando existem dúvidas, sintomas, alterações de exames ou necessidade de organizar melhor a alimentação.'],
      ['Você orienta introdução alimentar?', 'Sim. A orientação considera desenvolvimento, rotina da família, segurança alimentar e construção gradual da relação da criança com os alimentos.'],
      ['A consulta infantil pode ser online?', 'Dependendo da necessidade, o acompanhamento pode ocorrer online. Também há atendimento presencial em Porto Alegre.']
    ]
  },
  {
    slug: 'nutricionista-online',
    key: 'online',
    title: 'Nutricionista Online para Todo o Brasil | Vitória Braga',
    description: 'Consulta nutricional online para todo o Brasil com foco em diabetes, doença renal, hipertensão, materno-infantil e alimentação e hábitos.',
    eyebrow: 'Atendimento online · Todo o Brasil',
    h1: 'Nutricionista online para todo o Brasil',
    lead: 'Consulta por vídeo com acompanhamento individualizado e a mesma proposta de cuidado: ciência, acolhimento e estratégias que façam sentido para a sua rotina.',
    introTitle: 'Acompanhamento nutricional onde você estiver',
    intro: 'O atendimento online permite organizar histórico, exames, rotina, alimentação e objetivos sem a necessidade de deslocamento. Após a avaliação, as estratégias são construídas de forma individualizada e acompanhadas ao longo da evolução.',
    benefits: ['Consulta por vídeo', 'Atendimento para todo o Brasil', 'Plano individualizado', 'Acompanhamento e ajustes ao longo do processo'],
    indicated: ['Pessoas com diabetes', 'Pessoas com doença renal', 'Pessoas com hipertensão', 'Gestantes, lactantes e famílias', 'Quem busca melhorar alimentação e hábitos'],
    faq: [
      ['A consulta online funciona como a presencial?', 'A estrutura de avaliação e acompanhamento é semelhante, adaptada ao formato remoto. Exames e informações relevantes podem ser compartilhados para avaliação.'],
      ['Quem mora fora de Porto Alegre pode consultar?', 'Sim. O atendimento online é direcionado a pessoas de todo o Brasil.'],
      ['Como vejo os horários disponíveis?', 'Os horários podem ser consultados pelo Doctoralia, pelo botão de agendamento desta página.']
    ]
  }
];

function nav() {
  return `<header><div class="wrap nav"><a class="brand" href="/"><span class="brand-mark">❧</span><span><strong>Vitória Braga</strong><small>Nutricionista · CRN-RS 21802D</small></span></a><nav><a href="/">Início</a><a href="/#especialidades">Especialidades</a><a href="/#sobre">Sobre mim</a><a href="/#avaliacoes">Depoimentos</a><a href="/#contato">Contato</a></nav><a class="btn primary desktop-cta" href="${DOCTORALIA}" target="_blank" rel="noopener">Agendar consulta</a></div></header>`;
}

function related(current) {
  const items = pages.filter(p => p.slug !== current.slug).slice(0, 4);
  return items.map(p => `<a class="related-card" href="/${p.slug}/"><span>${icons[p.key]}</span><strong>${p.key === 'online' ? 'Atendimento online' : p.h1.replace(' e atendimento online','').replace(' em Porto Alegre','')}</strong><small>Conheça o acompanhamento →</small></a>`).join('');
}

function faqMarkup(items) {
  return items.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
}

function listMarkup(items) {
  return items.map(item => `<li><span>✓</span>${item}</li>`).join('');
}

function pageHtml(p) {
  const canonical = `${BASE}/${p.slug}/`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.description}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<style>
:root{--green:#0f4f45;--green-dark:#0a3b34;--khaki:#74683A;--cream:#fbfaf6;--ink:#17332e;--text:#334943;--muted:#667773;--line:#e8e3d9;--soft:#f1f5ef;--max:1120px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff;color:var(--text);font:16px/1.6 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}a{color:inherit}.wrap{width:min(calc(100% - 36px),var(--max));margin:auto}header{height:74px;border-bottom:1px solid #eee;background:rgba(255,255,255,.98);position:sticky;top:0;z-index:20}.nav{height:100%;display:flex;align-items:center;gap:25px}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--green);margin-right:auto}.brand-mark{font:34px Georgia,serif;color:var(--khaki)}.brand strong{display:block;font:700 22px Georgia,serif}.brand small{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#71807b}.nav nav{display:flex;gap:21px}.nav nav a{text-decoration:none;font-size:13px;font-weight:700}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:45px;padding:10px 17px;border-radius:8px;text-decoration:none;font-weight:800;border:1px solid var(--green)}.primary{background:var(--green);color:#fff}.outline{background:#fff;color:var(--green)}.hero{background:linear-gradient(125deg,#fff 0%,#fbf8f1 100%)}.hero-grid{display:grid;grid-template-columns:1.08fr .92fr;min-height:480px;align-items:center;gap:42px}.crumb{font-size:11px;color:#7b8985;margin-bottom:22px}.crumb a{text-decoration:none}.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:var(--khaki);margin-bottom:12px}.hero h1{font:700 clamp(38px,4.8vw,58px)/1.03 Georgia,serif;color:var(--green);letter-spacing:-.025em;margin:0 0 18px}.hero p{font-size:17px;max-width:650px;margin:0;color:#405550}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:25px}.visual{height:360px;border-radius:48% 52% 42% 58%/50% 42% 58% 50%;display:grid;place-items:center;background:linear-gradient(145deg,#edf2e8,#f8f0e5);color:var(--green);overflow:hidden}.visual svg{width:170px;height:170px}.location-strip{display:flex;gap:25px;flex-wrap:wrap;margin-top:27px;font-size:12px;color:#53645f}.location-strip strong{color:var(--green)}section{padding:58px 0}.section-title{font:700 32px/1.15 Georgia,serif;color:var(--green);margin:0 0 16px}.section-lead{max-width:820px;color:var(--muted);margin:0}.benefits{background:#fff}.benefit-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:30px}.benefit{border:1px solid var(--line);border-radius:13px;padding:19px;background:#fff}.benefit b{display:block;color:var(--green);font-size:14px}.benefit span{display:block;width:36px;height:36px;border-radius:50%;background:var(--soft);color:var(--green);display:grid;place-items:center;margin-bottom:12px}.process{background:#faf9f5}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:30px}.step{position:relative;padding-top:8px}.num{width:44px;height:44px;border-radius:50%;border:1px solid #9aa99f;display:grid;place-items:center;font:700 18px Georgia,serif;color:var(--green);margin-bottom:12px}.step h3{font-size:14px;color:var(--green);margin:0 0 6px}.step p{font-size:12px;color:var(--muted);margin:0}.indicated{background:#fff}.indicated-grid{display:grid;grid-template-columns:1fr .8fr;gap:35px;align-items:start}.checklist{list-style:none;padding:0;margin:24px 0 0;display:grid;gap:10px}.checklist li{display:flex;gap:10px;align-items:flex-start}.checklist span{color:var(--green);font-weight:900}.note{background:linear-gradient(145deg,#f1f5ef,#fbf7ef);border:1px solid var(--line);border-radius:16px;padding:27px}.note h3{font:700 23px Georgia,serif;color:var(--green);margin:0 0 12px}.note p{font-size:13px;color:#53645f}.faq{background:#faf9f5}.faq-grid{max-width:850px}.faq details{background:#fff;border:1px solid var(--line);border-radius:11px;padding:16px 19px;margin:10px 0}.faq summary{cursor:pointer;font-weight:800;color:var(--green)}.faq details p{font-size:13px;color:var(--muted);margin:10px 0 0}.related{background:#fff}.related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:25px}.related-card{border:1px solid var(--line);border-radius:13px;padding:17px;text-decoration:none;display:flex;flex-direction:column;gap:8px}.related-card span{width:42px;height:42px;color:var(--green)}.related-card svg{width:42px;height:42px}.related-card strong{font:700 17px Georgia,serif;color:var(--green)}.related-card small{color:var(--khaki);font-weight:800;margin-top:auto}.final{background:var(--green);color:#fff;text-align:center}.final h2{font:700 32px Georgia,serif;margin:0 0 8px}.final p{margin:0 auto 22px;max-width:650px;color:#e5efeb}.final .outline{border-color:#fff}.footer{padding:28px 0;background:#fff;font-size:12px;color:#64746f}.footer-grid{display:flex;justify-content:space-between;gap:25px;flex-wrap:wrap}.footer a{color:var(--green);font-weight:700}.legal{font-size:11px;margin-top:13px;color:#7a8783}
@media(max-width:850px){header{height:auto}.nav{padding:13px 0}.nav nav{display:none}.desktop-cta{margin-left:auto}.hero-grid{grid-template-columns:1fr;padding:42px 0}.visual{height:270px}.benefit-grid,.steps,.related-grid{grid-template-columns:1fr 1fr}.indicated-grid{grid-template-columns:1fr}}
@media(max-width:520px){.brand strong{font-size:19px}.desktop-cta{font-size:12px;padding:9px 11px}.hero h1{font-size:39px}.actions{flex-direction:column}.actions .btn{width:100%}.benefit-grid,.steps,.related-grid{grid-template-columns:1fr}.visual{height:230px}.visual svg{width:130px;height:130px}section{padding:44px 0}}
</style>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"MedicalBusiness","name":"Vitória Braga Nutricionista","url":"${canonical}","telephone":"+55 51 99979-6535","areaServed":[{"@type":"City","name":"Porto Alegre"},{"@type":"Country","name":"Brasil"}],"address":{"@type":"PostalAddress","streetAddress":"R. Gomes Jardim, 301 - Sala 407","addressLocality":"Porto Alegre","addressRegion":"RS","postalCode":"90620-130","addressCountry":"BR"}}</script>
</head>
<body>
${nav()}
<main>
<section class="hero"><div class="wrap hero-grid"><div><div class="crumb"><a href="/">Início</a> › <a href="/#especialidades">Especialidades</a> › ${p.eyebrow.split(' · ')[0]}</div><div class="eyebrow">${p.eyebrow}</div><h1>${p.h1}</h1><p>${p.lead}</p><div class="actions"><a class="btn primary" href="${DOCTORALIA}" target="_blank" rel="noopener">Agendar consulta</a><a class="btn outline" href="${WHATSAPP}" target="_blank" rel="noopener">Tirar dúvidas no WhatsApp</a></div><div class="location-strip"><span><strong>Presencial</strong><br>Porto Alegre/RS</span><span><strong>Online</strong><br>para todo o Brasil</span><span><strong>Atendimento</strong><br>individualizado</span></div></div><div class="visual">${icons[p.key]}</div></div></section>
<section class="benefits"><div class="wrap"><h2 class="section-title">${p.introTitle}</h2><p class="section-lead">${p.intro}</p><div class="benefit-grid">${p.benefits.map((b,i)=>`<div class="benefit"><span>${i+1}</span><b>${b}</b></div>`).join('')}</div></div></section>
<section class="process"><div class="wrap"><h2 class="section-title">Como funciona o acompanhamento</h2><div class="steps"><div class="step"><div class="num">1</div><h3>Avaliação completa</h3><p>Histórico, rotina, alimentação, exames e objetivos.</p></div><div class="step"><div class="num">2</div><h3>Planejamento individual</h3><p>Estratégias construídas conforme necessidades e preferências.</p></div><div class="step"><div class="num">3</div><h3>Aplicação na rotina</h3><p>Orientações práticas para situações reais do dia a dia.</p></div><div class="step"><div class="num">4</div><h3>Acompanhamento e ajustes</h3><p>Reavaliação e adaptações conforme sua evolução.</p></div></div></div></section>
<section class="indicated"><div class="wrap indicated-grid"><div><h2 class="section-title">Para quem este acompanhamento pode ser indicado</h2><ul class="checklist">${listMarkup(p.indicated)}</ul></div><aside class="note"><h3>Presencial ou online</h3><p>Você pode realizar sua consulta no consultório em Porto Alegre ou por vídeo, de qualquer lugar do Brasil. O formato é escolhido conforme sua preferência e necessidade.</p><a class="btn primary" href="${DOCTORALIA}" target="_blank" rel="noopener">Ver horários disponíveis</a></aside></div></section>
<section class="faq"><div class="wrap faq-grid"><h2 class="section-title">Dúvidas frequentes</h2>${faqMarkup(p.faq)}</div></section>
<section class="related"><div class="wrap"><h2 class="section-title">Outras áreas de acompanhamento</h2><div class="related-grid">${related(p)}</div></div></section>
<section class="final"><div class="wrap"><h2>Vamos construir um cuidado que faça sentido para a sua vida?</h2><p>Confira os horários disponíveis ou converse pelo WhatsApp antes de agendar.</p><div class="actions" style="justify-content:center"><a class="btn outline" href="${DOCTORALIA}" target="_blank" rel="noopener">Agendar consulta</a><a class="btn outline" href="${WHATSAPP}" target="_blank" rel="noopener">Tirar dúvidas no WhatsApp</a></div></div></section>
</main>
<footer class="footer"><div class="wrap"><div class="footer-grid"><span>Vitória Braga · Nutricionista · CRN-RS 21802D</span><span>R. Gomes Jardim, 301 - Sala 407 · Porto Alegre/RS</span><a href="/nutricionista-online/">Atendimento online para todo o Brasil</a></div><div class="legal">Conteúdo informativo. O acompanhamento nutricional é individualizado e não substitui avaliação de outros profissionais de saúde quando necessária.</div></div></footer>
<script>
(function(){function send(n,a){if(typeof gtag!=='function')return;gtag('event',n,{cta_location:a.closest('header')?'header':a.closest('.hero')?'hero':a.closest('.final')?'bottom_cta':'page',cta_label:(a.textContent||'').trim(),link_url:a.href,page_location:location.href,transport_type:'beacon'})}document.addEventListener('click',function(e){const a=e.target.closest&&e.target.closest('a');if(!a)return;const h=a.href||'',l=(a.textContent||'').toLowerCase();if(h.includes('wa.me/'))send('click_whatsapp',a);else if(h.includes('doctoralia.com.br'))send(l.includes('avalia')?'click_doctoralia_reviews':'click_agendar',a)},true)})();
</script>
</body></html>`;
}

for (const p of pages) {
  const dir = path.join(distDir, p.slug);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(p), 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', ...pages.map(p=>p.slug + '/')].map(slug=>`  <url><loc>${BASE}/${slug}</loc><changefreq>${slug ? 'monthly' : 'weekly'}</changefreq><priority>${slug ? '0.9' : '1.0'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

console.log('Páginas SEO geradas: Home + 4 especialidades + atendimento online.');