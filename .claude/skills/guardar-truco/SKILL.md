---
name: guardar-truco
description: Guarda lo aprendido para que no se pierda. Úsala al terminar algo que salió bien después de probar varias cosas, cuando el dueño diga "guarda esto" o "recuérdalo", o cuando una tarea se repite por segunda vez.
---

# Guardar el truco

Decide dónde va lo aprendido:

- **Es un dato, una decisión o un error** («la cuenta buena es r98161525-ui», «NVIDIA solo acepta 1024») → añade al final de `MEMORY.md`:

  ```
  ## AAAA-MM-DD HH:MM
  - Decisión / Acuerdo / Error: ... → solución: ...
  ```

- **Es una receta de pasos que se va a repetir** («cómo subir a GitHub sin git») → si ya hay una skill parecida en `.claude/skills/`, mejórala; si no, crea `.claude/skills/<nombre-corto>/SKILL.md` con:
  - frontmatter `name` y `description` (qué hace y CUÁNDO usarla, en una o dos frases),
  - los pasos exactos que funcionaron, con comandos probados,
  - las trampas en las que se cayó.

Reglas:
- Solo lo que no se deduce del código. Nada de resúmenes del repositorio.
- Nunca guardes llaves, tokens, contraseñas ni correos.
- Comprueba cada comando antes de guardarlo; no inventes.
- Avisa al dueño en una línea: «Guardé el truco en …».
