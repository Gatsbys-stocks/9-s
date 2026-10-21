# 9's — Páginas web y sistemas a tu medida

Web corporativa de **9's**, un equipo que programa páginas web de todo tipo: desde una landing sencilla hasta sistemas profesionales con reservas, pagos y panel de administración. Sitio estático (HTML, CSS y JavaScript puro), sin frameworks y sin dependencias, con la mascota **Debug**, un mapache programador.

## El problema que resolví

Un equipo de desarrollo necesita una web que **explique qué hace, enseñe lo que puede construir y convierta visitas en conversaciones** — sin montar un servidor, sin pagar plataformas de terceros y sin que el cliente tenga que rellenar formularios largos. Construí una página que se explica sola y que lleva cada interés del visitante directamente al WhatsApp del equipo, con el mensaje ya escrito.

## Qué hice

- **Diseño oscuro estilo "HUD" cromado**: rejilla fina de fondo, piezas de cromo y cristal, textos en monoespaciada y titular con la palabra clave recuadrada.
- **Inicio con la mascota** sobre una peana plateada que sigue el cursor, y un recuadro donde se escribe código en tiempo real.
- **Servicios en tres tamaños** (web sencilla, profesional y sistema a medida), con una tarjeta por servicio.
- **"Lo que podemos construir para ti"**: cuatro ideas de proyecto de ejemplo. Al pulsar una, se abre WhatsApp con un mensaje listo sobre ese proyecto.
- **Barra de presupuesto (90 € – 1200 €)**: el cliente mueve la barra, describe lo que quiere y ve una **vista previa del mensaje** antes de enviarlo por WhatsApp.
- **Proceso en formato `git log`**, preguntas frecuentes (acordeón accesible) y página **404** propia.
- **Adaptado a móvil**: menú desplegable, botones táctiles grandes, botón flotante de WhatsApp que aparece al hacer scroll y respeto de las zonas seguras de iPhone.
- **Accesible**: HTML semántico, foco visible, `aria-*` en menú y controles, soporte de `prefers-reduced-motion`.

## Estructura

```
9s-web/
├── index.html            # Página principal
├── 404.html              # Página de error
├── css/
│   ├── fonts.css         # Fuentes alojadas en el repo (@font-face)
│   └── styles.css        # Estilos
├── js/
│   ├── boot.js           # Marca "con JS" antes de pintar (archivo externo por la CSP)
│   ├── app.js            # Interacciones, presupuesto y envío a WhatsApp
│   └── count.js          # GoatCounter (estadísticas de visitas), alojado en el repo
├── img/                  # Mapache Debug y favicon
├── fonts/                # Inter Tight y JetBrains Mono (SIL OFL)
├── scripts/
│   ├── serve.mjs         # Servidor local sin dependencias
│   └── check.mjs         # Comprobaciones de seguridad y calidad
├── .github/
│   ├── workflows/check.yml   # CI: ejecuta las comprobaciones en cada push/PR
│   └── dependabot.yml        # Actualiza las GitHub Actions
├── _headers              # Cabeceras de seguridad (Netlify / Cloudflare Pages)
├── robots.txt
├── SECURITY.md           # Política de seguridad
├── LICENSE
└── package.json          # Sin dependencias
```

## Configuración (solo `js/app.js`, primeras líneas)

```js
const CONTACT = {
  whatsapp: '34662925875',   // código de país + número, solo dígitos
  email: '',                 // opcional: aparece en el pie de página
};
const BUDGET = { min: 90, max: 1200, start: 300, currency: '€', quick: [90, 150, 300, 600, 1200] };
```

## Estadísticas de visitas (GoatCounter)

La web cuenta visitas con [GoatCounter](https://www.goatcounter.com): sin cookies, sin guardar datos personales y sin banner de cookies. El panel está en https://9-s.goatcounter.com.

- El script oficial está **copiado en `js/count.js`** (licencia ISC) en lugar de cargarlo desde `gc.zgo.at`: así la política de seguridad no necesita permitir scripts de terceros.
- La CSP solo permite enviar datos a `https://9-s.goatcounter.com` (`img-src` y `connect-src` en `index.html` y `_headers`).
- Si cambias el nombre de tu cuenta de GoatCounter, cambia esa URL en tres sitios: la etiqueta `<script data-goatcounter=...>` y la CSP de `index.html`, y `_headers`.
- GoatCounter no cuenta las visitas desde `localhost`. Para que no cuente tus propias visitas, abre tu web con `#toggle-goatcounter` al final de la dirección una vez en cada navegador.
- Los bloqueadores de anuncios (uBlock, etc.) pueden impedir el conteo de algunos visitantes: es normal.

## Ejecutar en local

Necesitas [Node.js](https://nodejs.org) 18 o superior (no se instala nada más):

```bash
npm start          # abre http://localhost:5173
npm run check      # comprobaciones de seguridad y calidad
```

También puedes abrir `index.html` directamente con doble clic.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `9s-web`) y sube estos archivos:

   ```bash
   git init
   git add .
   git commit -m "Primera versión de la web de 9's"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/9s-web.git
   git push -u origin main
   ```

2. En el repositorio: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, rama `main`, carpeta `/ (root)`. Guarda.
3. En un minuto tendrás la web en `https://TU-USUARIO.github.io/9s-web/`.
4. *(Opcional)* Dominio propio: en la misma pantalla escribe tu dominio y activa **Enforce HTTPS**.

> En un repositorio de proyecto la web vive en `/9s-web/`. Todas las rutas son relativas, así que funciona sin cambios. Solo la `404.html` asume que el enlace roto está en la raíz del sitio.

## Seguridad

Resumen (detalle completo en [SECURITY.md](SECURITY.md)):

- Sitio **100 % estático**: sin servidor, base de datos, cuentas ni contraseñas.
- **Sin secretos** en el repositorio (el `.gitignore` bloquea `.env`, `*.pem`, `*.key`). El número de WhatsApp es un dato público de contacto, igual que en el enlace de la web.
- **Content Security Policy estricta**: solo se ejecuta código propio; sin scripts ni estilos en línea; sin recursos de terceros.
- **Fuentes alojadas en el repo** (sin Google Fonts): no se envía la IP de los visitantes a terceros.
- **Sin `innerHTML` con datos externos**; enlaces externos con `rel="noopener noreferrer"`.
- **Cero dependencias**: no hay paquetes que puedan ser comprometidos.
- **CI** que falla si alguien introduce código en línea, recursos externos o posibles secretos.
- Los datos del formulario **no pasan por ningún servidor**: se componen en el navegador y se envían por `wa.me`.

Antes de publicar, activa en GitHub: **2FA** en tu cuenta, **Secret scanning** y **Dependabot alerts** (Settings → Code security) y **protección de la rama `main`**.

## Licencia

Código bajo licencia [MIT](LICENSE). Las ilustraciones del mapache (`img/`) son propiedad de 9's — todos los derechos reservados. Las fuentes (`fonts/`) se distribuyen bajo SIL Open Font License 1.1.
