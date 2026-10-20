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
│   └── app.js            # Interacciones, presupuesto y envío a WhatsApp
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
