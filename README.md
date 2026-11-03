# Estudio de Caricaturas

Página para crear caricaturas con IA a partir de una descripción: eliges estilo (3D, cómic, plastilina, anime…), textura (madera, peluche, metal, cristal…) y tamaño (miniatura de YouTube, Short o cuadrado).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El Estudio de Caricaturas (toda la página en un archivo) |
| `Iniciar Estudio.bat` | Doble clic para abrir el Estudio con su servidor local (necesario para NVIDIA) |
| `servidor.ps1` | Servidor local pequeño (PowerShell, viene con Windows) en `http://localhost:8765` |
| `mesa-de-produccion.html` | Código de la Mesa de Producción, el tablero para planificar vídeos de YouTube |
| `NOTAS.md` | Historial de cambios y pendientes |

## Cómo usarlo

1. Descarga la carpeta.
2. Doble clic en **Iniciar Estudio.bat** (o en `index.html` si no vas a usar NVIDIA).
3. Opcional: en **Ajustes**, pega una llave de Pollinations (`sk_`), Google Gemini (`AIza`), Hugging Face (`hf_`) o NVIDIA (`nvapi-`) para tener alta calidad sin marca de agua.

Las llaves y el historial se guardan solo en el navegador; no están en estos archivos.

## Mesa de Producción

La versión que funciona (con los datos guardados) está publicada como artifact de Claude. El archivo `mesa-de-produccion.html` es su código: abierto por su cuenta muestra el tablero, pero no puede guardar vídeos.
