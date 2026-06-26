# Actividad QR — Guía de Setup Completa

Demo de phishing en vivo para la charla **CIO for a Day · UVG · julio 2026**.

> Tiempo total de setup: ~20 min la primera vez. Los días siguientes: ~5 min.

---

## Qué hace esta actividad

Al inicio de la charla se muestran **dos QRs** en la misma slide:

| QR | Lo que parece | Lo que es |
|---|---|---|
| **Bienvenida** | Agenda de la charla | Landing benigna — registra solo una visita |
| **Registro de asistencia** | Formulario oficial UVG para certificado | Formulario falso — captura datos plausibles sin pedir contraseña |

En el **Bloque 2**, antes de la sección de phishing, se revelan:
1. Cuántos escanearon cada QR (contador en vivo desde Google Sheets).
2. Qué datos se capturaron sin pedir contraseña y por qué eso ya es suficiente para atacar.
3. La lección: **el phishing real nunca pide contraseña de frente**.

Opcional: slide de **Have I Been Pwned** después del Caso 4 (contraseñas), para una demo en vivo de brechas reales.

---

## Checklist de setup (orden recomendado)

### Paso 1 — Google Apps Script (~5 min)

Sigue las instrucciones en [`apps-script/README.md`](./apps-script/README.md).

Al terminar tendrás una URL como:
```
https://script.google.com/macros/s/AKfy.../exec
```

### Paso 2 — Hostear las landing pages (~10 min)

Las dos carpetas (`qr-bienvenida/` y `qr-registro/`) necesitan estar en una URL pública para que los estudiantes puedan acceder desde sus celulares.

#### Opción A — GitHub Pages (recomendado si ya tienes el repo)

1. Asegúrate de que la carpeta `charla-cio/` esté en un repositorio de GitHub.
2. En el repo: **Settings → Pages → Source: Deploy from branch → main → / (root)**.
3. Las URLs quedarán así:
   ```
   https://TU_USUARIO.github.io/TU_REPO/charla-cio/qr-bienvenida/
   https://TU_USUARIO.github.io/TU_REPO/charla-cio/qr-registro/
   ```

#### Opción B — Cloudflare Pages (también gratuito)

1. Ve a [pages.cloudflare.com](https://pages.cloudflare.com) → Create a project → Direct upload.
2. Sube la carpeta `charla-cio/` completa.
3. Las URLs quedarán así:
   ```
   https://TU_PROYECTO.pages.dev/qr-bienvenida/
   https://TU_PROYECTO.pages.dev/qr-registro/
   ```

#### Opción C — Ngrok (solo para el día del evento, requiere laptop encendida)

```bash
npx ngrok http 8080
# En otra terminal:
cd charla-cio && python3 -m http.server 8080
```
Las URLs serán del tipo `https://xxxx.ngrok.io/qr-bienvenida/`.

### Paso 3 — Configurar las 3 variables en index.html (~2 min)

Abre `charla-cio/index.html` y busca el bloque:

```js
var QR_URL_SAFE  = "https://TU_DOMINIO/qr-bienvenida/";
var QR_URL_PHISH = "https://TU_DOMINIO/qr-registro/";
var STATS_URL    = "https://script.google.com/macros/s/TU_APPS_SCRIPT_ID/exec";
```

Reemplaza con tus URLs reales.

Haz lo mismo en:
- `qr-bienvenida/index.html` → `var STATS_URL`
- `qr-registro/index.html` → `var STATS_URL`

### Paso 4 — Generar los QRs (si necesitas imprimirlos)

Si la presentación se verá en modo offline o quieres QRs impresos como respaldo:

1. Ve a [qr-code-generator.com](https://www.qr-code-generator.com) o similar.
2. Genera un QR con la URL de bienvenida → guarda como PNG.
3. Genera un QR con la URL de registro → guarda como PNG.
4. Imprímelos en tamaño A4 o impórtales como imagen en la slide.

> Los QRs también se generan automáticamente en la slide de la presentación
> una vez que configures las variables (Paso 3).

### Paso 5 — Preparar el plan B para Have I Been Pwned

Si quieres tener un respaldo visual por si no hay wifi el día del evento:

1. Abre [haveibeenpwned.com](https://haveibeenpwned.com) en tu navegador.
2. Ingresa tu propio correo (uno que hayas tenido por 5+ años).
3. Toma captura de pantalla de los resultados.
4. Guarda como `charla-cio/assets/hibp-fallback.png`.
5. En la slide de HIBP en `index.html`, cambia:
   ```html
   style="display: none; ..."
   ```
   a:
   ```html
   style="display: block; ..."
   ```
   en el elemento `<img id="hibp-fallback" ...>`.

---

## Flujo completo el día de la charla

```
1. Abrir index.html en el navegador (pantalla del proyector)
2. Slide 2 aparece con los dos QRs generados
3. Dar ~60 segundos para que escaneen
4. Avanzar normalmente por Bloque 1
5. En Bloque 2, llegar a "¿Recuerdan los QRs?"
   → el contador se actualiza automáticamente con los datos reales
6. Mostrar las 3 slides de reveal
7. Continuar con Caso 1: phishing (conecta directamente)
8. Al llegar a Caso 4: contraseñas → demo Have I Been Pwned (opcional)
```

---

## Después de la charla

- Borrar filas de datos del Google Sheet (menú **Datos → Borrar rango**).
- Optionally desactivar el Web App deployment en Apps Script.

---

## Preguntas frecuentes

**¿Funciona sin internet el día del evento?**
Los QRs en la slide sí se renderizan (están generados al cargar la página). Los celulares de los estudiantes necesitan datos/wifi para abrir las landing pages. El contador en la slide necesita internet para consultar el Sheet; si falla, muestra "?" y puedes ingresar el número manualmente.

**¿Qué pasa si nadie escanea?**
El reveal funciona igualmente. Los contadores mostrarán 0 y puedes usarlo como punto de discusión ("nadie cayó — ¿por qué? ¿qué los detuvo?").

**¿Los datos son seguros?**
Solo se guardan en un Sheet de tu propia cuenta de Google. No se captura ninguna contraseña. El README de apps-script indica borrarlos tras el evento.
