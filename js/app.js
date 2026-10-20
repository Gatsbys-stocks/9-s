/* 9's — interactions */

// ⚠️ Datos de contacto y presupuesto: edítalos aquí
const CONTACT = {
  whatsapp: '34662925875',   // número que recibe los mensajes (código de país + número, sin + ni espacios)
  email: '',                 // opcional: si lo pones, aparece en el pie de página
};
const BUDGET = { min: 90, max: 1200, start: 300, currency: '€', quick: [90, 150, 300, 600, 1200] };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WhatsApp helper ---------- */
const WA_OK = /^\d{8,15}$/.test(CONTACT.whatsapp); // solo dígitos: evita que se cuele nada raro en la URL
const waUrl = text => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
function openWhatsApp(text) {
  if (!WA_OK) { alert('Falta configurar el número de WhatsApp en app.js'); return; }
  const w = window.open(waUrl(text), '_blank', 'noopener');
  if (!w) location.href = waUrl(text); // popup bloqueado → misma pestaña
}

/* ---------- nav ---------- */
const burger = $('#burger'), links = $('#navLinks');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
document.addEventListener('click', e => { if (links.classList.contains('open') && !e.target.closest('.nav')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
$('#year').textContent = new Date().getFullYear();
if (/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(CONTACT.email)) {
  // DOM APIs en vez de innerHTML: el correo nunca se interpreta como HTML
  const a = document.createElement('a');
  a.href = 'mailto:' + CONTACT.email; a.textContent = CONTACT.email;
  $('#footMail').append('Escríbenos a ', a);
}

const navEl = $('.nav'), bar = $('#progressBar');
function onScroll() {
  navEl.classList.toggle('scrolled', scrollY > 24);
  const wb = $('#waBtn'); if (wb) wb.classList.toggle('show', scrollY > 500);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .05, rootMargin: '0px 0px -40px 0px' });
$$('.rv').forEach(el => io.observe(el));

/* ---------- cursor shine on glass cards ---------- */
if (matchMedia('(hover:hover)').matches) {
  addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('.card, .idea, .commit');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
}

/* ---------- hero: typed code, bubble, head tilt ---------- */
const typedLines = [
  '<span class="c">// 9\'s · tu web, bien hecha</span>',
  '<span class="k">const</span> equipo = <span class="s">"9\'s"</span>;',
  '<span class="k">const</span> mapache = <span class="k">new</span> <span class="f">Debug</span>();',
  '',
  '<span class="k">await</span> mapache.<span class="f">construir</span>({',
  '  proyecto: <span class="s">"tu idea"</span>,',
  '  reservas: <span class="k">true</span>,',
  '  cafe: <span class="k">Infinity</span>',
  '});',
];
(function typeHero() {
  const out = $('#typed'), full = typedLines.join('\n');
  if (reduceMotion) { out.innerHTML = full; return; }
  let i = 0;
  const tick = () => {
    if (i >= full.length) return;
    if (full[i] === '<') i = full.indexOf('>', i);
    i++;
    const part = full.slice(0, i);
    const opens = (part.match(/<span/g) || []).length, closes = (part.match(/<\/span>/g) || []).length;
    out.innerHTML = part + '</span>'.repeat(Math.max(0, opens - closes));
    setTimeout(tick, full[i - 1] === '\n' ? 180 : 26 + Math.random() * 30);
  };
  setTimeout(tick, 700);
})();

const sayings = ['// compilando café…', '// git push --force (jamás)', '// npm install paciencia', '// 0 errores, 0 warnings', '// funciona en mi máquina ✓', '// pidiendo más café…'];
let sIdx = 0;
setInterval(() => { sIdx = (sIdx + 1) % sayings.length; $('#bubble').textContent = sayings[sIdx]; }, 3400);

if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  const hr = $('#heroRaccoon'), stage = $('#pedestal');
  addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * .7)) / (innerWidth / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * .45)) / (innerHeight / 2)));
    hr.style.transform = `rotate(${nx * 4}deg) translate(${nx * 6}px, ${ny * 3}px)`;
  }, { passive: true });
}

/* ---------- service + idea buttons → WhatsApp ---------- */
$$('.wa-go').forEach(b => b.addEventListener('click', () => {
  openWhatsApp(`Hola 9's 👋 me interesa ${b.dataset.msg}. ¿Me das más información?`);
}));

/* ---------- floating WhatsApp button ---------- */
if (WA_OK) {
  const wa = $('#waBtn');
  wa.href = waUrl("Hola 9's 👋 quiero cotizar una página web");
  wa.hidden = false;
}

/* ---------- budget slider + message → WhatsApp ---------- */
const range = $('#budget'), valEl = $('#budgetVal'), msgEl = $('#cMsg'), nameEl = $('#cName'), prev = $('#waPreview'), quick = $('#budgetQuick'), st = $('#formStatus');
const money = n => `${n.toLocaleString('es-ES')} ${BUDGET.currency}`;
range.min = BUDGET.min; range.max = BUDGET.max; range.value = BUDGET.start;
$('#scaleMin').textContent = money(BUDGET.min); $('#scaleMax').textContent = money(BUDGET.max);
quick.innerHTML = BUDGET.quick.map(n => `<button type="button" data-v="${n}" aria-pressed="false">${n === BUDGET.min ? 'Desde ' : ''}${money(n)}</button>`).join('');

function buildMessage() {
  const n = nameEl.value.trim(), d = msgEl.value.trim(), b = +range.value;
  const label = b >= BUDGET.max ? `${money(b)} o más` : money(b);
  return `Hola 9's 👋${n ? ` Soy ${n}.` : ''} Quiero una página web.\n\n💰 Presupuesto: ${label}\n📝 Lo que necesito: ${d || '…'}`;
}
function renderBudget() {
  const b = +range.value;
  valEl.textContent = money(b);
  range.style.setProperty('--pct', ((b - BUDGET.min) / (BUDGET.max - BUDGET.min) * 100) + '%');
  $$('button', quick).forEach(x => x.setAttribute('aria-pressed', +x.dataset.v === b));
  prev.textContent = buildMessage();
}
range.addEventListener('input', renderBudget);
[nameEl, msgEl].forEach(el => el.addEventListener('input', () => { el.classList.remove('invalid'); st.textContent = ''; renderBudget(); }));
quick.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; range.value = b.dataset.v; renderBudget(); });
renderBudget();

$('#budgetForm').addEventListener('submit', e => {
  e.preventDefault();
  if (msgEl.value.trim().length < 5) {
    msgEl.classList.add('invalid'); msgEl.focus();
    st.textContent = '// cuéntame en pocas palabras qué quieres';
    return;
  }
  st.textContent = '// abriendo WhatsApp…';
  openWhatsApp(buildMessage());
});
