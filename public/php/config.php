<?php
/**
 * zumano.ch - Zentrale PHP Konfiguration
 * Atelier Zäzilia «Zuzu» Jenni · Richterswil ZH
 */

// Fehlerberichterstattung (im Live-Betrieb auf 0 setzen)
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Zeitzone Schweiz
date_default_timezone_set('Europe/Zurich');

// Empfänger für Kontakt- und Bestellanfragen
define('ATELIER_EMAIL', 'zzjenni@gmail.com');
define('ATELIER_NAME', 'Atelier ZUMANO · Zäzilia Jenni');
define('ATELIER_PHONE', '078 818 06 36');
define('ATELIER_ADDRESS', '8805 Richterswil am Zürichsee, Schweiz');
define('WEBSITE_URL', 'https://zumano.ch');

// Optionaler Gemini API Key für PHP-gestützte Bildideen-Generierung
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');

// Speicherpfad für Daten & Uploads
define('DATA_DIR', __DIR__ . '/../data/');
define('UPLOADS_DIR', __DIR__ . '/../uploads/');

// CORS-Header für flexible API-Nutzung
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// JSON-Antwort Hilfsfunktion
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
