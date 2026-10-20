# Política de seguridad

## Cómo reportar una vulnerabilidad

**No abras un issue público** para temas de seguridad.

Usa el botón **"Report a vulnerability"** de la pestaña **Security** del repositorio
(*Private vulnerability reporting*). Para activarlo: **Settings → Code security →
Private vulnerability reporting → Enable**.

Responderemos lo antes posible y corregiremos el problema antes de hacerlo público.

## Qué hace este proyecto para ser seguro

- **Sitio 100 % estático**: no hay servidor, base de datos, cuentas ni contraseñas que atacar.
- **Sin secretos en el repositorio**: no hay claves de API, tokens ni credenciales. El `.gitignore` bloquea `.env`, `*.pem` y `*.key`.
- **Content Security Policy estricta** (`<meta>` en `index.html` y `_headers`): solo se ejecuta código de nuestro propio dominio, sin scripts ni estilos en línea, sin recursos de terceros.
- **Sin dependencias**: no hay `node_modules` ni paquetes que puedan ser comprometidos (`package.json` no tiene dependencias).
- **Fuentes alojadas en el propio repositorio** (sin Google Fonts): no se envía la IP de los visitantes a terceros.
- **Sin `innerHTML` con datos externos**: el contenido que viene de la configuración o del usuario se inserta con `textContent`/DOM.
- **Enlaces externos** con `rel="noopener noreferrer"`.
- **Los datos del formulario no pasan por ningún servidor**: se componen en el navegador y se envían al WhatsApp del negocio mediante `wa.me`.
- **CI** (`.github/workflows/check.yml`) que falla si alguien añade scripts/estilos en línea, referencias externas o posibles secretos.

## Lo que SÍ es público (y está bien)

Todo lo que hay en un sitio estático es visible para cualquiera. Por ejemplo, el número de
WhatsApp de `js/app.js` es el mismo que ve cualquier visitante en el enlace. Es un dato de
contacto público, no un secreto. **Nunca** pongas ahí contraseñas, tokens, claves de API ni
datos personales de clientes.

## Buenas prácticas para quien publique el sitio

1. Activa **autenticación en dos pasos (2FA)** en tu cuenta de GitHub.
2. Activa **Dependabot alerts** y **Secret scanning** (Settings → Code security).
3. Protege la rama `main` (Settings → Branches → Branch protection rules).
4. Si usas dominio propio, activa **Enforce HTTPS** en Settings → Pages.
5. No subas nunca archivos `.env` ni capturas con datos de clientes.
