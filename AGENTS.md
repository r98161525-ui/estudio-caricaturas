# Contrato del proyecto — Estudio de Caricaturas

## Para qué existe y quién lo usa
- Crea caricaturas con IA para el canal de YouTube del dueño (miniaturas, Shorts) y para el bot de Telegram.
- El dueño no programa: háblale en español sencillo, pasos cortos, y pregunta antes de usar cualquier servicio de pago.
- Público en https://r98161525-ui.github.io/estudio-caricaturas/ (GitHub Pages sirve `main` tal cual, sin compilar).

## Cómo arrancarlo
- Web: doble clic en `index.html` (todo menos NVIDIA) o `Iniciar Estudio.bat` (servidor en http://localhost:8765, necesario para NVIDIA).
- Bot: `bot/worker.js` vive en Cloudflare Workers; el código se pega a mano en el editor de Cloudflare (ver `bot/COMO-INSTALAR.md`).

## Cómo comprobar que nada se rompió (no hay tests automáticos)
- Servidor sin abrir navegador:
  `$env:ESTUDIO_NO_ABRIR=1; Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','servidor.ps1'`
  luego `Invoke-WebRequest http://localhost:8765/` debe dar 200.
- POST a `http://localhost:8765/nvidia/black-forest-labs/flux.1-schnell` con llave falsa debe dar 403 (no 502): prueba que el servidor llega a NVIDIA.
- Abrir la página y crear una imagen en modo gratis; mirar la consola del navegador sin errores.
- Tras subir a GitHub: comprobar que el enlace público ya tiene el cambio (los despliegues de Pages a veces fallan; se relanza "pages-build-deployment").

## Qué no se toca
- Llaves y tokens: nunca en archivos ni en GitHub (el repo es público). Las llaves viven en el navegador; `BOT_TOKEN` y `POLLINATIONS_KEY` solo como secretos en Cloudflare.
- Nombres de `localStorage` (`caricaturas-llaves`, `caricaturas-servicio`, `caricaturas-ultima-gratis`) y la base `estudio-caricaturas` de IndexedDB: si cambian, el dueño pierde llaves e historial.
- Tabla `pedidos` de la base D1 del bot: son datos reales; no borrar ni cambiar columnas.
- `servidor.ps1` solo escucha en localhost y solo reenvía a `ai.api.nvidia.com`; no abrirlo a otras direcciones.
- `mesa-de-produccion.html` es copia del artifact real; los datos no están aquí.

## Errores en los que ya caímos
- NVIDIA y OpenAI bloquean llamadas desde el navegador: por eso existe `servidor.ps1`.
- NVIDIA FLUX solo acepta cuadrados de 1024: se pide cuadrado y la página recorta.
- Pollinations gratis da 1 imagen cada ~45 s (`FREE_GAP`); antes devuelve el aviso "Free limit reached".
- Pollinations sin llave responde 402 desde Cloudflare: el bot dibuja con Workers AI (enlace `AI`).
- Abrir con `index.html` y con `localhost` guarda llaves e historial por separado.
- En esta PC no hay git: los cambios se suben desde la web de GitHub.
- `NOTAS.md` es el historial para el dueño: actualízalo en español sencillo con cada cambio.
