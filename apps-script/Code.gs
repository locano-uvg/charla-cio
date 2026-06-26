/**
 * Google Apps Script — Actividad QR Phishing Demo
 * CIO for a Day · UVG · julio 2026
 *
 * INSTRUCCIONES DE DEPLOY:
 * 1. Abre Google Sheets → Extensions → Apps Script
 * 2. Pega este archivo como Code.gs
 * 3. Crea una hoja llamada "datos" en el Spreadsheet
 * 4. Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copia la URL del Web App
 * 6. Pega la URL en charla-cio/index.html (var STATS_URL)
 *    y en charla-cio/qr-bienvenida/index.html y qr-registro/index.html (var STATS_URL)
 *
 * IMPORTANTE: Borrar todos los datos del Sheet después de la charla.
 */

var SHEET_NAME = "datos";

var HEADERS = [
  "Timestamp", "Tipo", "Nombre", "Grado / Carnet",
  "Colegio / Carrera", "Correo", "WhatsApp",
  "Carreras de interés", "Motivación / Observaciones"
];

/**
 * Recibe eventos desde las landing pages (safe_hit y registro_bachillerato).
 * Usa Content-Type: text/plain para evitar preflight CORS.
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      new Date(),
      body.type        || "",
      body.nombre      || "",
      body.grado       || body.carnet    || "",
      body.colegio     || body.carrera   || "",
      body.correo      || "",
      body.whatsapp    || "",
      body.carreras    || body.curso     || "",
      body.motivacion  || body.anio      || "",
    ]);

    return buildResponse({ ok: true });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  }
}

/**
 * Devuelve el conteo de hits por tipo.
 * Usado por la presentación para mostrar estadísticas en tiempo real.
 * Cuenta "phish_submit" y "registro_bachillerato" como envíos del formulario falso.
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) return buildResponse({ safeHits: 0, phishSubmits: 0 });

    var data = sheet.getDataRange().getValues();

    var safeHits     = 0;
    var phishSubmits = 0;
    for (var i = 1; i < data.length; i++) {
      var tipo = data[i][1];
      if (tipo === "safe_hit")                           safeHits++;
      if (tipo === "phish_submit" ||
          tipo === "registro_bachillerato")              phishSubmits++;
    }

    return buildResponse({ safeHits: safeHits, phishSubmits: phishSubmits });
  } catch (err) {
    return buildResponse({ safeHits: 0, phishSubmits: 0, error: err.message });
  }
}

/** Helper: respuesta JSON con headers CORS */
function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
