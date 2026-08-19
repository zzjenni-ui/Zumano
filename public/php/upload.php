<?php
/**
 * zumano.ch - Datei- & Video-Upload Handler (PHP)
 * Unterstützt den Upload von Werkstatt-Videos (MP4, MOV) und Kunstwerk-Fotos (JPG, PNG, WebP)
 * mit Sicherheitsprüfungen und Größenbeschränkungen.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Nur POST-Anfragen erlaubt'], 405);
}

$uploadsDir = __DIR__ . '/../uploads';
if (!file_exists($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorCode = $_FILES['file']['error'] ?? 'Keine Datei übertragen';
    sendJsonResponse(['success' => false, 'error' => 'Upload fehlgeschlagen (Code: ' . $errorCode . ')'], 400);
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileSize = $file['size'];
$fileTmp = $file['tmp_name'];

// Maximale Dateigröße: 50 MB
$maxSize = 50 * 1024 * 1024;
if ($fileSize > $maxSize) {
    sendJsonResponse(['success' => false, 'error' => 'Die Datei ist zu gross (max. 50 MB erlaubt)'], 400);
}

// Erlaubte Endungen
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'];
$ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions)) {
    sendJsonResponse(['success' => false, 'error' => 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WEBP, MP4, MOV, WEBM'], 400);
}

// Eindeutigen sicheren Dateinamen generieren
$safeName = 'upload_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $ext;
$targetPath = $uploadsDir . '/' . $safeName;

if (move_uploaded_file($fileTmp, $targetPath)) {
    $fileUrl = '/uploads/' . $safeName;
    sendJsonResponse([
        'success' => true,
        'url' => $fileUrl,
        'fileName' => $safeName,
        'size' => $fileSize,
        'type' => in_array($ext, ['mp4', 'mov', 'webm']) ? 'video' : 'image',
        'message' => 'Datei erfolgreich hochgeladen',
    ]);
} else {
    sendJsonResponse(['success' => false, 'error' => 'Fehler beim Speichern der Datei auf dem Server'], 500);
}
