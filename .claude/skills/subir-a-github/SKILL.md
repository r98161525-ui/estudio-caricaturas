---
name: subir-a-github
description: Sube o actualiza un archivo del Estudio de Caricaturas en GitHub sin git (por la web, con el navegador de la app) y comprueba que quedó idéntico. Úsala cuando el dueño pida subir, publicar o guardar cambios en GitHub.
---

# Subir un archivo a GitHub (sin git)

En esta PC no hay git. Se sube por la web de GitHub con el navegador de la app (herramientas `mcp__Claude_Browser__*`).

1. **Cuenta correcta.** Abre `https://github.com/r98161525-ui/estudio-caricaturas` y comprueba con JavaScript que `document.querySelector('meta[name="user-login"]').content` es `r98161525-ui`.
   - Si no hay sesión o es otra cuenta (el dueño tiene una segunda cuenta de GitHub), para y pide al dueño que cierre sesión y entre con `r98161525-ui`. Nunca cierres sesión ni escribas contraseñas tú. Nunca hagas «Fork».
2. **Abrir el editor.** Archivo nuevo: `/new/main?filename=RUTA`. Archivo existente: `/edit/main/RUTA`.
3. **Poner el contenido.** Pasa el archivo local en base64 (`[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([IO.File]::ReadAllText(...)))`) y decódalo en la página con `TextDecoder`. Reemplaza TODO el texto con la vista de CodeMirror:
   ```js
   let x = document.querySelector('.cm-content').cmTile; while (x && !x.view) x = x.parent;
   x.view.dispatch({changes: {from: 0, to: x.view.state.doc.length, insert: texto}});
   // comprobar: x.view.state.doc.toString() === texto
   ```
   Trampa (13/11/2026): en archivos que ya existen, `selectAll` + `ClipboardEvent('paste')` NO reemplaza, AÑADE el texto y queda duplicado. El pegado sintético solo sirve en archivos nuevos.
4. **Commit.** Pulsa «Commit changes...». Mensaje en español: el campo viene relleno («Update X»), así que pon el valor con el setter nativo de `value` + evento `input` (escribir encima lo concatena) y comprueba que quedó bien antes de pulsar. En la descripción: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commit directo a `main`.
5. **Verificar.** Descarga `https://raw.githubusercontent.com/r98161525-ui/estudio-caricaturas/main/RUTA?x=<timestamp>` y compáralo con el texto local: tiene que ser idéntico. Si cambió `index.html`, comprueba también que la página pública ya tiene el cambio (los despliegues de Pages a veces fallan: relanza «pages-build-deployment»).
6. Apunta el cambio en `NOTAS.md` en español sencillo.
