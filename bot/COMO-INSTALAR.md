# Bot de Telegram del Estudio de Caricaturas

Le escribes al bot lo que quieres ver ("un gato astronauta de plastilina") y te contesta con la caricatura.
Vive en la nube (Cloudflare Workers, gratis), así que responde aunque tu computadora esté apagada.

## 1. Crear el bot en Telegram
1. Abre Telegram y busca **@BotFather**.
2. Escríbele `/newbot`.
3. Ponle un nombre (ej. *Estudio de Caricaturas*) y un usuario que termine en `bot` (ej. `caricaturas_nikol_bot`).
4. Te da un **token** (algo como `123456789:AAH...`). Guárdalo. **No lo compartas ni lo subas a GitHub.**

## 2. Poner el bot en la nube (Cloudflare)
1. Crea una cuenta gratis en https://dash.cloudflare.com/sign-up
2. Ve a **Workers & Pages** → **Create** → **Start with Hello World** → ponle de nombre `estudio-caricaturas-bot` → **Deploy**.
3. Pulsa **Edit code**. Borra todo lo que hay y pega el contenido de `worker.js` (esta misma carpeta). Pulsa **Deploy**.
4. Vuelve al Worker → **Settings** → **Runtime variables and secrets** → **Add variable**:
   - Key `BOT_TOKEN`, Value: tu token de BotFather, marca **Secret** y pulsa **Add variable and deploy**.
   - (Opcional) Key `POLLINATIONS_KEY`, Value: tu llave `sk_` de Pollinations, también **Secret**. Da más calidad y otros tamaños.
5. En **Settings** → **Bindings** → **Add binding**:
   - **Workers AI**, nombre `AI`. Es la IA gratuita de Cloudflare que dibuja las caricaturas.
   - **D1 database**, nombre `DB`, eligiendo una base creada en **Storage & databases → D1** (aquí: `estudio-caricaturas-db`). Guarda los pedidos en la tabla `pedidos`, que el bot crea solo.

## 3. Conectarlo
Abre en el navegador la dirección de tu Worker terminada en `/setup`, por ejemplo:
`https://estudio-caricaturas-bot.TU-USUARIO.workers.dev/setup`

Debe decir "¡Listo! Tu bot ya está conectado: https://t.me/..." Ese es el enlace público de tu bot.

## Uso
- Escribe cualquier descripción. Puedes añadir estilo (3D, cómic, plastilina, anime, juguete, acuarela, pixel, clásica), textura (madera, peluche, metal, cristal…) y tamaño (vertical, horizontal).
- `/start` o `/estilos` muestran la ayuda.
- `/historial` muestra tus últimos 10 pedidos, leídos de la base de datos.
- Para ver todos los pedidos: Cloudflare → **D1** → `estudio-caricaturas-db` → **Console** → `SELECT * FROM pedidos;`
- Sin `POLLINATIONS_KEY` ni `AI`, el bot intenta Pollinations sin llave, que desde Cloudflare suele fallar (código 402).
