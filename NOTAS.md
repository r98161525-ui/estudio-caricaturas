# Estudio de Caricaturas — Notas

## Cómo abrir el proyecto
**Forma recomendada (desde la versión 4):**
1. Abre la carpeta **Estudio de Caricaturas** en tu escritorio.
2. Haz doble clic en **Iniciar Estudio.bat**. Se abre una ventana negra y, después, la página en tu navegador (dirección `http://localhost:8765`).
3. Deja la ventana negra abierta mientras usas el Estudio. Para apagarlo, ciérrala.

**Forma sencilla:** doble clic en **index.html**. Funciona todo, menos las llaves de NVIDIA.

Ojo: cada forma guarda sus propias llaves e historial. Usa siempre la misma.
Necesitas internet: las imágenes las dibujan servicios en línea.

## Lo que hicimos (versión 1, 3 de noviembre de 2026)
- Página con campo de texto grande para describir la caricatura.
- Botones de **estilo**: Animación 3D, Cómic, Plastilina, Anime, Juguete, Acuarela, Pixel art y Caricatura clásica.
- Botones de **textura** (madera, peluche, metal, cristal, chocolate…) y un campo para escribir cualquier otra.
- **Tamaños** pensados para YouTube: horizontal (miniatura), vertical (Shorts) y cuadrado.
- **Crear imagen**: genera la imagen dentro de la página en unos 5–20 segundos.
- **Crear 3 versiones**: tres variantes a la vez para elegir la mejor.
- Botones para **descargar**, **abrir en grande** y **crear otra versión**.
- Sección de **vídeo**: copia una descripción preparada para vídeo y enlaza a Luma Dream Machine, Kling y Pika.
- **Instrucciones** y ejemplos en los que se puede hacer clic.
- **Mis Creaciones**: guarda las últimas 10 imágenes en este navegador.

## Cambios (versión 2, 3 de noviembre de 2026)
- Fondo de **espacio**: cielo oscuro con estrellas que brillan y nebulosas de color.
- **Modo alta calidad** (botón arriba a la derecha): pegas una llave gratuita de Pollinations y las imágenes salen sin marca de agua, más nítidas (modelo Z-Image Turbo) y más grandes (hasta 1920×1080).
- Sin llave sigue funcionando el modo básico: gratis, pero con marca de agua y como mucho 1024 píxeles.
- El historial ahora guarda también las imágenes de alta calidad (en la base de datos del navegador).

### Cómo conseguir la llave gratuita
1. Entra en https://enter.pollinations.ai/keys y crea una cuenta (gratis).
2. Crea una llave secreta (empieza por `sk_`) y cópiala.
3. En la página, pulsa el botón **Calidad básica · mejorar**, pega la llave y pulsa **Guardar llave**.
- La cuenta da un saldo gratuito ("Pollen") que se recarga cada cierto tiempo. Si se acaba, la página avisa.
- La llave pendiente de probar: Claude no pudo probar el modo alta calidad porque no tiene llave.

## Cambios (versión 3, 3 de noviembre de 2026)
- Los **Ajustes** se ven siempre, debajo del título.
- Ahora acepta **llaves de tres servicios**. La página reconoce sola de cuál es cada llave:
  - **Pollinations** (empieza por `sk_`): gratis con cuenta. https://enter.pollinations.ai/keys
  - **Google Gemini** (empieza por `AIza`): uso gratis limitado. https://aistudio.google.com/apikey
  - **Hugging Face** (empieza por `hf_`): pocos créditos gratis al mes. https://huggingface.co/settings/tokens
- Puedes guardar varias y elegir con **Usar esta** cuál usar, o volver a la calidad básica.
- **OpenAI no se añadió:** su servicio bloquea las peticiones hechas desde una página abierta en el navegador. Haría falta un pequeño servidor (pendiente, si se quiere).
- Probado: las tres responden "llave no válida" con llaves falsas, o sea, la página llega a ellas. Falta probar con llaves reales.

## Cambios (versión 4, 3 de noviembre de 2026)
- Llaves de **NVIDIA** (empiezan por `nvapi-`), modelo FLUX.1 schnell. https://build.nvidia.com/settings/api-keys
- NVIDIA no deja que una página le hable directamente, así que se añadió un **servidor pequeño** (`servidor.ps1`), que se arranca con `Iniciar Estudio.bat`. Solo funciona en tu computadora y solo reenvía peticiones a NVIDIA.
- Probado: el servidor arranca, muestra la página, llega a NVIDIA (con llave falsa responde "no autorizado") y el historial se guarda. Falta probar con una llave real.
- Arreglo: NVIDIA daba error porque su modelo solo acepta imágenes cuadradas de 1024. Ahora se pide un cuadrado y la página lo recorta a horizontal o vertical.
- Los mensajes de error muestran un "Detalle técnico" para poder averiguar qué pasó.
- Con este mismo servidor se podría añadir OpenAI más adelante (es de pago: preguntar antes).

## Cómo funciona por dentro (en simple)
- Todo está en un solo archivo: `index.html`.
- Las imágenes las crea **Pollinations** (gratis, sin cuenta). La página traduce tus elecciones de estilo y textura a inglés, que el servicio entiende mejor.
- El historial se guarda en tu navegador. Si borras los datos del navegador o usas otro, el historial empieza vacío.

## Lo que falta / ideas para después
- Vídeo generado dentro de la página (necesitaría un servicio de pago; preguntar antes).
- Guardar estilos favoritos propios.
- Poner texto encima de la imagen para miniaturas de YouTube.
- Mejor calidad conectando un servicio de pago (opcional, preguntar antes).
