// Bot de Telegram del Estudio de Caricaturas.
// Funciona como "Worker" de Cloudflare (gratis): vive en la nube y responde aunque tu computadora esté apagada.
// Secretos que hay que poner en Cloudflare (Settings → Variables and Secrets):
//   BOT_TOKEN          el token que te dio @BotFather (obligatorio)
//   POLLINATIONS_KEY   tu llave sk_ de Pollinations (opcional: más calidad y otros tamaños)
// Enlace (Settings → Bindings): Workers AI con el nombre AI, para dibujar gratis con la IA de Cloudflare.
// Enlace (Settings → Bindings): base de datos D1 con el nombre DB, para guardar los pedidos (tabla "pedidos").
// Después abre una vez https://TU-WORKER.workers.dev/setup para conectarlo con Telegram.

const STYLES = [
  { words: ["plastilina", "arcilla"], name: "Plastilina", en: "claymation figure, stop-motion clay style, handmade look" },
  { words: ["anime"], name: "Anime", en: "anime style cartoon, cel shading, expressive eyes" },
  { words: ["comic"], name: "Cómic", en: "comic book cartoon, bold black outlines, flat vibrant colors, hand-drawn" },
  { words: ["juguete"], name: "Juguete", en: "vinyl toy figure, collectible toy, studio product photo" },
  { words: ["acuarela"], name: "Acuarela", en: "watercolor cartoon illustration, soft paint texture, paper grain" },
  { words: ["pixel"], name: "Pixel art", en: "pixel art cartoon, retro 16-bit video game style" },
  { words: ["clasica", "exagerada"], name: "Caricatura clásica", en: "classic exaggerated caricature, big head, small body, funny expression" },
  { words: ["3d"], name: "Animación 3D", en: "3D animated cartoon character, Pixar-like style, soft cinematic lighting, cute proportions" },
];
const DEFAULT_STYLE = STYLES[STYLES.length - 1];
const TEXTURES = [
  { words: ["madera"], en: "made entirely of carved wood, visible wood grain" },
  { words: ["peluche"], en: "made of soft fluffy plush fabric with stitches" },
  { words: ["metal"], en: "made of shiny polished chrome metal" },
  { words: ["cristal", "vidrio"], en: "made of transparent glass, refractions and reflections" },
  { words: ["piedra"], en: "carved from stone, rough rocky surface" },
  { words: ["lana"], en: "knitted from wool yarn, crochet texture" },
  { words: ["chocolate"], en: "made of glossy melted chocolate" },
  { words: ["papel"], en: "made of folded and cut paper, papercraft" },
  { words: ["hielo"], en: "made of frozen ice, frosty translucent" },
  { words: ["lava"], en: "made of glowing molten lava" },
];
// Tamaño según lo que pidas: "vertical"/"short" o "horizontal"/"miniatura"; si no, cuadrado.
const SIZES = [
  { words: ["vertical", "short"], free: [576, 1024], hq: [1080, 1920] },
  { words: ["horizontal", "miniatura"], free: [1024, 576], hq: [1920, 1080] },
];
const SQUARE = { free: [1024, 1024], hq: [1536, 1536] };

const HELP = [
  "¡Hola! Soy el bot del Estudio de Caricaturas.",
  "",
  "Escríbeme lo que quieres ver y te mando la caricatura. Por ejemplo:",
  "• un perro con sombrero de vaquero de madera",
  "• un dragón comiendo pizza, plastilina",
  "• un gato astronauta anime vertical",
  "",
  "Puedes añadir un estilo (3D, cómic, plastilina, anime, juguete, acuarela, pixel, clásica), una textura (madera, peluche, metal, cristal, piedra, lana, chocolate, papel, hielo, lava) y un tamaño (vertical para Shorts, horizontal para miniaturas).",
  "",
  "/estilos muestra la lista otra vez.",
  "/historial muestra tus últimos pedidos.",
].join("\n");

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const text = (body, status = 200) => new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });
    if (!env.BOT_TOKEN) return text("Falta el secreto BOT_TOKEN. Ponlo en Settings → Variables and Secrets de este Worker.", 500);
    const secret = await webhookSecret(env.BOT_TOKEN);

    if (url.pathname === "/setup") {
      const r = await tg(env, "setWebhook", { url: url.origin + "/webhook", secret_token: secret, allowed_updates: ["message"] });
      if (!r.ok) return text("No se pudo conectar con Telegram: " + r.description + "\nRevisa que BOT_TOKEN esté bien copiado.", 500);
      await tg(env, "setMyCommands", { commands: [
        { command: "start", description: "Cómo usar el bot" },
        { command: "estilos", description: "Estilos, texturas y tamaños" },
        { command: "historial", description: "Tus últimos pedidos" },
      ] });
      const me = await tg(env, "getMe", {});
      return text("¡Listo! Tu bot ya está conectado: https://t.me/" + me.result.username);
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== secret) return text("no", 403);
      const update = await request.json();
      // Respondemos enseguida a Telegram y dibujamos en segundo plano.
      ctx.waitUntil(handle(update, env).catch((e) => console.log("error", e && e.stack)));
      return text("ok");
    }

    return text("El bot del Estudio de Caricaturas está funcionando. Si aún no lo conectaste, abre /setup en esta misma dirección.");
  },
};

async function handle(update, env) {
  const msg = update.message;
  if (!msg || !msg.text) return;
  const chat = msg.chat.id;
  const said = msg.text.trim();
  if (/^\/(start|estilos|ayuda|help)\b/i.test(said)) return tg(env, "sendMessage", { chat_id: chat, text: HELP });
  if (/^\/historial\b/i.test(said)) return tg(env, "sendMessage", { chat_id: chat, text: await history(env, chat) });

  await tg(env, "sendChatAction", { chat_id: chat, action: "upload_photo" });
  const plain = said.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const has = (item) => item.words.some((w) => plain.includes(w));
  const style = STYLES.find(has) || DEFAULT_STYLE;
  const texture = TEXTURES.find(has);
  const size = SIZES.find(has) || SQUARE;
  const prompt = [said, style.en, texture && texture.en, "funny cartoon, vibrant colors, highly detailed, sharp focus, clean background"]
    .filter(Boolean).join(", ");
  const seed = Math.floor(Math.random() * 1e9);

  // Orden: Pollinations con tu llave (mejor calidad) → IA de Cloudflare (gratis, enlace "AI") → Pollinations sin llave.
  let image = null, code = "sin conexión";
  try {
    if (env.POLLINATIONS_KEY) {
      const [w, h] = size.hq;
      image = await fromResponse(await fetch("https://gen.pollinations.ai/image/" + encodeURIComponent(prompt) +
        "?model=zimage&width=" + w + "&height=" + h + "&seed=" + seed + "&nologo=true",
        { headers: { Authorization: "Bearer " + env.POLLINATIONS_KEY } }));
    } else if (env.AI) {
      // Este modelo dibuja cuadrados de 1024 px.
      const out = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", { prompt: prompt.slice(0, 2000), steps: 4 });
      if (out && out.image) image = { bytes: Uint8Array.from(atob(out.image), (c) => c.charCodeAt(0)), type: "image/jpeg" };
    } else {
      const [w, h] = size.free;
      image = await fromResponse(await fetch("https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
        "?width=" + w + "&height=" + h + "&seed=" + seed + "&nologo=true"));
    }
    if (image && image.error) { code = image.error; image = null; }
  } catch (e) {
    code = String((e && e.message) || e).slice(0, 80);
  }
  if (!image) {
    await save(env, chat, said, style.name, "error: " + code);
    return tg(env, "sendMessage", { chat_id: chat, text: "No pude dibujarla esta vez (" + code + "). Espera un minuto y vuelve a escribirme." });
  }

  const form = new FormData();
  form.append("chat_id", String(chat));
  form.append("caption", ("🎨 " + said + " · " + style.name).slice(0, 1000));
  form.append("photo", new Blob([image.bytes], { type: image.type }), "caricatura.jpg");
  const sent = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendPhoto", { method: "POST", body: form });
  await save(env, chat, said, style.name, sent.ok ? "ok" : "error: Telegram " + sent.status);
  if (!sent.ok) {
    await tg(env, "sendMessage", { chat_id: chat, text: "La imagen salió, pero Telegram no la aceptó. Prueba de nuevo." });
  }
}

// ---------- Base de datos (Cloudflare D1, enlace "DB") ----------
// Cada pedido se guarda en la tabla "pedidos": fecha, chat, lo que escribió, estilo y si salió bien.
const CREATE_TABLE = "CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TEXT NOT NULL, chat_id INTEGER NOT NULL, texto TEXT NOT NULL, estilo TEXT, resultado TEXT)";

async function save(env, chat, said, styleName, result) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(CREATE_TABLE).run();
    await env.DB.prepare("INSERT INTO pedidos (fecha, chat_id, texto, estilo, resultado) VALUES (?, ?, ?, ?, ?)")
      .bind(new Date().toISOString(), chat, said.slice(0, 500), styleName, result).run();
  } catch (e) {
    console.log("no se pudo guardar el pedido", e && e.message);
  }
}

async function history(env, chat) {
  if (!env.DB) return "El historial no está activado todavía (falta conectar la base de datos DB).";
  await env.DB.prepare(CREATE_TABLE).run();
  const { results } = await env.DB.prepare(
    "SELECT fecha, texto, estilo, resultado FROM pedidos WHERE chat_id = ? ORDER BY id DESC LIMIT 10").bind(chat).all();
  if (!results.length) return "Todavía no me has pedido ninguna caricatura.";
  const when = (iso) => new Date(iso).toLocaleString("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return "Tus últimos pedidos:\n\n" + results.map((r) =>
    (r.resultado === "ok" ? "✅ " : "❌ ") + when(r.fecha) + " — " + r.texto + " (" + r.estilo + ")").join("\n");
}

async function fromResponse(res) {
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.startsWith("image/")) return { error: "código " + res.status };
  return { bytes: await res.arrayBuffer(), type };
}

function tg(env, method, payload) {
  return fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
}

// Clave para que solo Telegram pueda llamar al bot. Sale del token, así no hay que guardar otro secreto.
async function webhookSecret(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("estudio-caricaturas:" + token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
}
