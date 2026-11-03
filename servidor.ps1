# Pequeño servidor local del Estudio de Caricaturas.
# Muestra la página en http://localhost:8765 y hace de intermediario con NVIDIA,
# que no deja que una página web le hable directamente.
# Solo escucha en esta computadora (localhost) y solo reenvía a ai.api.nvidia.com.

$port = 8765
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
  $listener.Start()
} catch {
  # Ya estaba abierto en otra ventana: solo abrimos el navegador.
  Start-Process "http://localhost:$port/"
  exit
}
if (-not $env:ESTUDIO_NO_ABRIR) { Start-Process "http://localhost:$port/" }
Write-Host "Listo. La pagina esta en http://localhost:$port/"
Write-Host "Deja esta ventana abierta mientras usas el Estudio. Para apagarlo, cierrala."

$types = @{ ".html" = "text/html; charset=utf-8"; ".md" = "text/plain; charset=utf-8" }

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = $req.Url.AbsolutePath
    if ($path.StartsWith("/nvidia/") -and $req.HttpMethod -eq "POST") {
      $target = "https://ai.api.nvidia.com/v1/genai/" + $path.Substring(8)
      $reader = New-Object IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)
      $bytes = [Text.Encoding]::UTF8.GetBytes($reader.ReadToEnd())
      $up = [Net.HttpWebRequest]::Create($target)
      $up.Method = "POST"
      $up.ContentType = "application/json"
      $up.Accept = "application/json"
      $up.Timeout = 120000
      $up.Headers.Add("Authorization", $req.Headers["Authorization"])
      $up.ContentLength = $bytes.Length
      $stream = $up.GetRequestStream(); $stream.Write($bytes, 0, $bytes.Length); $stream.Close()
      try { $answer = $up.GetResponse() }
      catch [Net.WebException] { $answer = $_.Exception.Response; if (-not $answer) { throw } }
      $res.StatusCode = [int]$answer.StatusCode
      $res.ContentType = $answer.ContentType
      $answer.GetResponseStream().CopyTo($res.OutputStream)
      $answer.Close()
    } else {
      $file = if ($path -eq "/") { "index.html" } else { [Uri]::UnescapeDataString($path.TrimStart("/")) }
      $full = [IO.Path]::GetFullPath((Join-Path $root $file))
      $ext = [IO.Path]::GetExtension($full).ToLower()
      if ($full.StartsWith($root) -and $types.ContainsKey($ext) -and (Test-Path $full -PathType Leaf)) {
        $data = [IO.File]::ReadAllBytes($full)
        $res.ContentType = $types[$ext]
        $res.OutputStream.Write($data, 0, $data.Length)
      } else {
        $res.StatusCode = 404
      }
    }
  } catch {
    $res.StatusCode = 502
  } finally {
    $res.Close()
  }
}
