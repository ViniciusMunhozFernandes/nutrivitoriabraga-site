const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Mantém o domínio canônico oficial com www.
html = html.replaceAll('https://nutrivitoriabraga.com.br/', 'https://www.nutrivitoriabraga.com.br/');

// Substitui o rastreamento de cliques por uma versão mais robusta.
// A classificação é feita principalmente pelo destino do link, não pelo ícone clicado.
const trackingRegex = /<script>\s*\/\* GA4 conversion events \*\/[\s\S]*?<\/script>/;

const trackingScript = `<script>
/* GA4 conversion events v2 */
(function () {
  function getCtaLocation(link) {
    if (link.classList.contains('float-wa')) return 'floating_whatsapp';
    if (link.closest('header')) return 'header';
    if (link.closest('.hero')) return 'hero';
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

    // Todos os links de WhatsApp: botão da Home, CTA inferior, rodapé e ícone flutuante.
    if (href.includes('wa.me/')) {
      sendEvent('click_whatsapp', link);
      return;
    }

    // Doctoralia: avaliações ficam separadas das ações de agendamento.
    if (href.includes('doctoralia.com.br')) {
      if (href.includes('#opinions') || label.includes('avaliaç') || label.includes('avaliac') || label.includes('opini')) {
        sendEvent('click_doctoralia_reviews', link);
      } else {
        // Inclui: “Agendar consulta”, “Ver horários disponíveis” e demais CTAs de agenda.
        sendEvent('click_agendar', link);
      }
      return;
    }

    // Google Maps.
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
console.log('Pós-build aplicado: www canônico + rastreamento robusto de CTAs.');
