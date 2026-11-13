---
name: probar-estudio
description: Comprueba que el Estudio de Caricaturas no se rompió: arranca el servidor local sin abrir navegador, prueba la página y el paso a NVIDIA, y lo apaga. Úsala después de cualquier cambio en index.html o servidor.ps1, o cuando el dueño pregunte si funciona.
---

# Probar el Estudio

No hay tests automáticos. Esta es la comprobación mínima (PowerShell, en la carpeta del proyecto):

```powershell
$env:ESTUDIO_NO_ABRIR=1
$p = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','servidor.ps1' -PassThru -WindowStyle Hidden
Start-Sleep 3
(Invoke-WebRequest http://localhost:8765/ -UseBasicParsing).StatusCode          # debe ser 200
try { Invoke-WebRequest http://localhost:8765/nvidia/black-forest-labs/flux.1-schnell -Method POST -Body '{"prompt":"x"}' -Headers @{Authorization='Bearer nvapi-falsa'} -UseBasicParsing }
catch { [int]$_.Exception.Response.StatusCode }                                  # debe ser 403, no 502
Stop-Process -Id $p.Id -Confirm:$false
```

- 200 y 403: todo bien. 502: el servidor no llega a NVIDIA.
- Si el puerto 8765 está ocupado, el dueño tiene el Estudio abierto: no lo cierres, prueba contra el que ya está.
- Cuéntale el resultado al dueño en una frase sencilla.
