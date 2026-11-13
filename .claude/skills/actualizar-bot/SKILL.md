---
name: actualizar-bot
description: Guía para cambiar el bot de Telegram del Estudio (Cloudflare Worker estudio-caricaturas-bot) y comprobar que sigue respondiendo y guardando pedidos. Úsala cuando el dueño pida cambiar algo del bot.
---

# Actualizar el bot de Telegram

El bot vive en Cloudflare Workers (`estudio-caricaturas-bot.r98161525.workers.dev`). El código está en `bot/worker.js`.

1. Edita `bot/worker.js` en la carpeta. No toques la tabla `pedidos` ni sus columnas: son datos reales.
2. **El editor de Cloudflare no deja que Claude pegue código.** Abre el archivo en el Bloc de notas (`notepad bot\worker.js`) y pide al dueño: Ctrl+A, Ctrl+C, y en Cloudflare → Edit code, Ctrl+A, Ctrl+V → **Deploy**.
3. Secretos (`BOT_TOKEN`, `POLLINATIONS_KEY`): los pone siempre el dueño en Settings → Variables and Secrets. Nunca en archivos ni en el chat.
4. Para forzar un reinicio sin cambiar código: añade o cambia una variable normal (p. ej. `ULTIMO_REINICIO=fecha`) con «Add variable and deploy». Cambiar Traces no reinicia.
5. Prueba: que el dueño mande al bot un dibujo («un gato astronauta») y después `/historial`; el pedido nuevo tiene que salir con ✅.
6. Sube `bot/worker.js` a GitHub con la skill `subir-a-github` y apúntalo en `NOTAS.md`.

Las sesiones de Cloudflare (entra con Google) y GitHub en el navegador de la app se pierden entre días: si piden entrar, pídeselo al dueño.
