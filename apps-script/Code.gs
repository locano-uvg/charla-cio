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

/**
 * Recibe eventos desde las landing pages (safe_hit y phish_submit).
 * Soporta preflight CORS automáticamente.
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp", "Tipo", "Nombre", "Carnet", "Correo",
        "WhatsApp", "Carrera", "Año", "Curso"
      ]);
    }

    sheet.appendRow([
      new Date(),
      body.type    || "",
      body.nombre  || "",
      body.carnet  || "",
      body.correo  || "",
      body.whatsapp || "",
      body.carrera || "",
      body.anio    || "",
      body.curso   || "",
    ]);

    return buildResponse({ ok: true });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  }
}

/**
 * Devuelve el conteo de hits por tipo.
 * Usado por la presentación para mostrar estadísticas en tiempo real.
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) return buildResponse({ safeHits: 0, phishSubmits: 0 });

    var data = sheet.getDataRange().getValues();

    /* Empieza en fila 2 para saltar encabezados */
    var safeHits    = 0;
    var phishSubmits = 0;
    for (var i = 1; i < data.length; i++) {
      var tipo = data[i][1];
      if (tipo === "safe_hit")     safeHits++;
      if (tipo === "phish_submit") phishSubmits++;
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
