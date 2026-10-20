// Comprobaciones de seguridad y calidad (sin dependencias):  npm run check
// Falla (exit 1) si encuentra scripts/estilos en línea, recursos externos o posibles secretos.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skip = new Set(['.git', 'node_modules', '.github', 'fonts', 'img']);
const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    if (skip.has(name)) return [];
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(root);
const rel = f => path.relative(root, f).split(path.sep).join('/');

// 1) HTML: nada en línea, nada externo, referencias locales válidas
for (const f of files.filter(f => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  if (/<script(?![^>]*\ssrc=)/i.test(html)) errors.push(`${rel(f)}: <script> en línea (la CSP lo bloquea)`);
  if (/<style[\s>]/i.test(html)) errors.push(`${rel(f)}: <style> en línea`);
  if (/\sstyle\s*=/i.test(html)) errors.push(`${rel(f)}: atributo style="" en línea`);
  if (/\son[a-z]+\s*=\s*["']/i.test(html)) errors.push(`${rel(f)}: manejador on...="" en línea`);
  if (!/Content-Security-Policy/i.test(html)) errors.push(`${rel(f)}: falta la meta Content-Security-Policy`);

  for (const m of html.matchAll(/<(script|link|img)\b[^>]*?\s(?:src|href)="([^"]+)"/gi)) {
    const [, tag, url] = m;
    if (/^https?:\/\//i.test(url)) errors.push(`${rel(f)}: recurso externo <${tag}> → ${url}`);
    else if (!/^(#|mailto:|data:)/.test(url) && !existsSync(path.join(path.dirname(f), url.split(/[?#]/)[0])))
      errors.push(`${rel(f)}: referencia rota → ${url}`);
  }
  for (const m of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/gi)) {
    if (!/rel="[^"]*noopener/.test(m[1])) errors.push(`${rel(f)}: enlace target="_blank" sin rel="noopener"`);
  }
}

// 2) JS: patrones peligrosos
for (const f of files.filter(f => rel(f).startsWith('js/') && f.endsWith('.js'))) {
  const js = readFileSync(f, 'utf8');
  if (/\beval\s*\(|new Function\s*\(|document\.write\s*\(/.test(js)) errors.push(`${rel(f)}: eval / new Function / document.write`);
}

// 3) Posibles secretos en cualquier archivo de texto
const secretPatterns = [
  [/AKIA[0-9A-Z]{16}/, 'clave de AWS'],
  [/ghp_[A-Za-z0-9]{30,}/, 'token de GitHub'],
  [/sk_live_[A-Za-z0-9]{10,}/, 'clave secreta de Stripe'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'token de Slack'],
  [/AIza[0-9A-Za-z_-]{35}/, 'clave de API de Google'],
];
for (const f of files.filter(f => /\.(html|css|js|mjs|json|md|txt|yml|yaml)$/.test(f) || f.endsWith('_headers'))) {
  const txt = readFileSync(f, 'utf8');
  for (const [re, name] of secretPatterns) if (re.test(txt)) errors.push(`${rel(f)}: posible ${name}`);
}
for (const f of files.filter(f => /(^|\/)\.env/.test(rel(f)))) errors.push(`${rel(f)}: archivo .env en el repositorio`);

// 4) Recordatorios de configuración (avisos, no fallos)
const app = readFileSync(path.join(root, 'js/app.js'), 'utf8');
if (/email:\s*''/.test(app)) warnings.push('js/app.js: CONTACT.email está vacío (es opcional)');
if (!/whatsapp:\s*'\d{8,15}'/.test(app)) warnings.push('js/app.js: CONTACT.whatsapp no es un número válido (solo dígitos, con código de país)');

warnings.forEach(w => console.log('AVISO  ' + w));
if (errors.length) {
  errors.forEach(e => console.error('ERROR  ' + e));
  console.error(`\n${errors.length} problema(s).`);
  process.exit(1);
}
console.log(`OK  Todo correcto (${files.length} archivos revisados).`);
