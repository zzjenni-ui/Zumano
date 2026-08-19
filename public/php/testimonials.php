<?php
/**
 * zumano.ch - Kundenmeinungen API Handler (PHP)
 * Ermöglicht das Abrufen und Einreichen von Kundenstimmen mit persistenter JSON-Speicherung.
 */

require_once __DIR__ . '/config.php';

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$reviewsFile = $dataDir . '/testimonials.json';

// GET: Vorhandene Kundenstimmen abrufen
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $customReviews = [];
    if (file_exists($reviewsFile)) {
        $customReviews = json_decode(file_get_contents($reviewsFile), true) ?: [];
    }
    sendJsonResponse([
        'success' => true,
        'testimonials' => $customReviews,
    ]);
}

// POST: Neue Kundenstimme einreichen
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?: $_POST;

    $author = trim($data['author'] ?? '');
    $location = trim($data['location'] ?? 'Schweiz');
    $projectType = trim($data['projectType'] ?? 'Atelier-Auftrag');
    $rating = intval($data['rating'] ?? 5);
    $comment = trim($data['comment'] ?? '');

    if (empty($author) || empty($comment)) {
        sendJsonResponse(['success' => false, 'error' => 'Name und Erfahrungsbericht sind erforderlich.'], 400);
    }

    $newReview = [
        'id' => 'testi-php-' . time() . '-' . rand(100, 999),
        'author' => htmlspecialchars($author),
        'location' => htmlspecialchars($location),
        'avatarUrl' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'rating' => max(1, min(5, $rating)),
        'date' => 'Heute',
        'projectType' => htmlspecialchars($projectType),
        'comment' => '«' . htmlspecialchars($comment) . '»',
        'verifiedBuyer' => true,
        'artworkPhotoUrl' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        'createdAt' => date('c'),
    ];

    $existing = [];
    if (file_exists($reviewsFile)) {
        $existing = json_decode(file_get_contents($reviewsFile), true) ?: [];
    }
    array_unshift($existing, $newReview);
    @file_put_contents($reviewsFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Zuzu kurz per Mail benachrichtigen
    $mailBody = "Neue Kundenbewertung auf zumano.ch von " . $author . " (" . $rating . " Sterne):\n\n" . $comment;
    @mail(ATELIER_EMAIL, "Neue Kundenbewertung auf zumano.ch", $mailBody);

    sendJsonResponse([
        'success' => true,
        'testimonial' => $newReview,
        'message' => 'Vielen herzlichen Dank für dein Feedback!',
    ]);
}
