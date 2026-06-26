# Google Apps Script — Setup

Este script recibe los datos de las landing pages y los guarda en un Google Sheet.
El contador en vivo de la presentación también consulta este script.

## Paso a paso (5 min)

### 1. Crear el Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com) y crea un nuevo archivo.
2. Renombra la primera hoja (pestaña inferior) como **`datos`** exactamente.
3. Guarda el archivo con un nombre descriptivo, por ejemplo: `CIO-for-a-Day-QR-Demo`.

### 2. Abrir el editor de Apps Script

1. En el Spreadsheet: **Extensiones → Apps Script**.
2. Borra el contenido del archivo `Code.gs` que aparece por defecto.
3. Pega el contenido del archivo `Code.gs` de esta carpeta.
4. Guarda con `Ctrl+S` (o `Cmd+S` en Mac).

### 3. Desplegar como Web App

1. Clic en **Implementar → Nueva implementación**.
2. En "Tipo de implementación" selecciona **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
4. Clic en **Implementar**.
5. Acepta los permisos que solicite (necesita acceso a Sheets).
6. **Copia la URL del Web App** — se ve así:
   ```
   https://script.google.com/macros/s/AKfycbwqgwink1ZyHf_aBx5LbwdG_X5xm8Q6mnT9stNaOGx1Wl4W3oaE194h5ZoJQQWpZkMp/exec
   ```

### 4. Pegar la URL en los archivos

Abre estos 3 archivos y reemplaza `TU_APPS_SCRIPT_ID` con la URL completa:

| Archivo                               | Variable        |
| ------------------------------------- | --------------- |
| `charla-cio/index.html`               | `var STATS_URL` |
| `charla-cio/qr-bienvenida/index.html` | `var STATS_URL` |
| `charla-cio/qr-registro/index.html`   | `var STATS_URL` |

### 5. Verificar que funciona

Abre la URL del Web App en el navegador. Debes ver:

```json
{ "safeHits": 0, "phishSubmits": 0 }
```

Si ves eso, todo está listo.

---

## Estructura del Sheet

Columnas creadas automáticamente en la hoja `datos`:

| A         | B    | C      | D      | E      | F        | G       | H   | I     |
| --------- | ---- | ------ | ------ | ------ | -------- | ------- | --- | ----- |
| Timestamp | Tipo | Nombre | Carnet | Correo | WhatsApp | Carrera | Año | Curso |

- `Tipo = safe_hit` → alguien escaneó el QR de bienvenida
- `Tipo = phish_submit` → alguien llenó el formulario de registro falso

---

## Después de la charla

**Borra todas las filas de datos** del Sheet (excepto la fila de encabezados).
Los datos de los estudiantes no deben conservarse más allá del evento.
