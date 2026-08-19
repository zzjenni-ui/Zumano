<?php
/**
 * zumano.ch - Bildideen & Gemini AI Generator Proxy (PHP)
 * Führt den KI-Kunstideen-Prompt über die Gemini API via PHP cURL aus.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Nur POST-Anfragen erlaubt'], 405);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true) ?: $_POST;

$theme = $data['theme'] ?? 'Nordische Natur & Stille';
$medium = $data['medium'] ?? 'Aquarell auf 300g Büttenpapier';
$colorMood = $data['colorMood'] ?? 'Nordisch sanft (Salbei, Sand, Nebelblau)';
$occasion = $data['occasion'] ?? 'Wohnzimmer / Kunstliebhaber';
$customText = $data['customText'] ?? '';
$roomSetting = $data['roomSetting'] ?? 'Modernes Wohnzimmer';
$format = $data['format'] ?? 'A3 (30 × 40 cm)';

$apiKey = GEMINI_API_KEY;

if (empty($apiKey)) {
    // Hochwertiges Schweizer Fallback-Konzept
    $fallbackIdea = [
        'title' => !empty($customText) ? "«{$customText}» – Sanfte Horizonte" : 'Nordische Nebelwälder & Bergruhe',
        'subTitle' => 'Aquarell & Hand-Lettering Unikat',
        'description' => "Ein harmonisches, nordisch inspiriertes Kunstwerk mit sanften Verläufen in {$colorMood}. Gemalt mit feinsten Pigmenten auf 300g/m² Büttenpapier aus dem Atelier Richterswil.",
        'technique' => $medium,
        'colorPalette' => [
            ['name' => 'Salbeigrün', 'hex' => '#7E8E7E'],
            ['name' => 'Nordic Sand', 'hex' => '#D4C7B5'],
            ['name' => 'Kaltes Nebelgrau', 'hex' => '#9BA2A6'],
            ['name' => 'Warme Ockererde', 'hex' => '#C49A6C'],
            ['name' => 'Tiefes Schieferblau', 'hex' => '#3A4651'],
        ],
        'letteringSuggestion' => !empty($customText) ? $customText : 'Zuhause ist dort, wo das Herz zur Ruhe kommt',
        'fontStyleAdvice' => 'Fließende moderne Brush-Kalligraphie kombiniert mit minimalistischer serifenloser Antiqua.',
        'framingRecommendation' => 'Schlichter Eichenholzrahmen mit 5cm säurefreiem Schrägschnitt-Passepartout.',
        'canvasVisual' => [
            'backgroundGradient' => 'linear-gradient(135deg, #E6ECE8 0%, #D8DEC9 50%, #C3B49E 100%)',
            'brushMotif' => 'Botanische Zweige, sanfte Bergkonturen und fließende Wasserfarben-Schichten',
            'accentColor' => '#7E8E7E',
        ],
        'estimatedCreationTime' => '3-5 Werktage im Atelier Richterswil',
        'recommendedPriceChf' => '185.– bis 290.– CHF (je nach Format)',
    ];

    sendJsonResponse(['success' => true, 'idea' => $fallbackIdea]);
}

// Gemini API Call via PHP cURL
$prompt = "Du bist die Schweizer Künstlerin Zäzilia 'Zuzu' Jenni vom Kunst-Atelier zumano.ch in Richterswil am Zürichsee.
Erstelle ein maßgeschneidertes Kunstwerk-Konzept für:
Thema: {$theme} | Technik: {$medium} | Farbstimmung: {$colorMood} | Anlass: {$occasion} | Wunschtext: {$customText} | Raum: {$roomSetting} | Format: {$format}

Antworte ausschließlich im JSON Format mit:
{
  \"title\": string,
  \"subTitle\": string,
  \"description\": string,
  \"technique\": string,
  \"colorPalette\": [{\"name\": string, \"hex\": string}],
  \"letteringSuggestion\": string,
  \"fontStyleAdvice\": string,
  \"framingRecommendation\": string,
  \"canvasVisual\": {\"backgroundGradient\": string, \"brushMotif\": string, \"accentColor\": string},
  \"estimatedCreationTime\": string,
  \"recommendedPriceChf\": string
}";

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'responseMimeType' => 'application/json'
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    $resData = json_decode($response, true);
    $text = $resData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
    $idea = json_decode($text, true);
    sendJsonResponse(['success' => true, 'idea' => $idea]);
} else {
    sendJsonResponse(['success' => false, 'error' => 'Gemini API Fehler', 'raw' => $response], 500);
}
