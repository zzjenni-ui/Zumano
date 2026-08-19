<?php
/**
 * zumano.ch - Kontakt- & Auftragsanfrage Handler (PHP)
 * Empfängt Formulardaten und versendet formatierte E-Mails an Zuzu und Bestätigungen an Kunden.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Nur POST-Anfragen erlaubt'], 405);
}

// JSON Payload oder Standard Form-Data einlesen
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$name = trim($data['name'] ?? '');
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = trim($data['phone'] ?? '');
$subject = trim($data['subject'] ?? 'Allgemeine Anfrage via zumano.ch');
$message = trim($data['message'] ?? '');
$commissionDetails = trim($data['commissionDetails'] ?? '');
$preferredDate = trim($data['preferredDate'] ?? '');

if (empty($name) || !$email || empty($message)) {
    sendJsonResponse([
        'success' => false,
        'error' => 'Bitte fülle Name, eine gültige E-Mail-Adresse und deine Nachricht aus.'
    ], 400);
}

// E-Mail an Atelier ZUMANO erstellen
$to = ATELIER_EMAIL;
$mailSubject = "Neue Anfrage auf zumano.ch: " . ($subject ?: 'Kontaktanfrage von ' . $name);

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: ' . ATELIER_NAME . ' <no-reply@zumano.ch>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$emailHtml = '
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>' . htmlspecialchars($mailSubject) . '</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #F9F8F5; margin: 0; padding: 20px; color: #262826; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E5DF; border-radius: 12px; overflow: hidden; }
        .header { background: #728675; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-family: Georgia, serif; font-weight: normal; }
        .header p { margin: 4px 0 0 0; opacity: 0.9; font-size: 13px; }
        .body { padding: 28px; }
        .field { margin-bottom: 16px; }
        .label { font-weight: bold; font-size: 12px; color: #728675; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 15px; line-height: 1.5; color: #2D2D2D; }
        .highlight-box { background: #FAF9F6; border-left: 4px solid #C49A6C; padding: 14px; margin-top: 16px; border-radius: 4px; }
        .footer { background: #F9F8F5; border-top: 1px solid #E8E5DF; padding: 16px; text-align: center; font-size: 12px; color: #6B726B; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>zumano.ch</h1>
            <p>Neue Atelier-Anfrage eingetroffen</p>
        </div>
        <div class="body">
            <div class="field">
                <div class="label">Absender:</div>
                <div class="value"><strong>' . htmlspecialchars($name) . '</strong> (' . htmlspecialchars($email) . ')</div>
            </div>
            ' . (!empty($phone) ? '
            <div class="field">
                <div class="label">Telefonnummer:</div>
                <div class="value">' . htmlspecialchars($phone) . '</div>
            </div>' : '') . '
            <div class="field">
                <div class="label">Betreff / Thema:</div>
                <div class="value">' . htmlspecialchars($subject) . '</div>
            </div>
            <div class="field">
                <div class="label">Nachricht:</div>
                <div class="value" style="white-space: pre-line;">' . nl2br(htmlspecialchars($message)) . '</div>
            </div>
            ' . (!empty($commissionDetails) ? '
            <div class="highlight-box">
                <div class="label" style="color: #C49A6C;">Übernommene Konzeptdaten aus dem Customizer:</div>
                <div class="value" style="font-size: 13px;">' . nl2br(htmlspecialchars($commissionDetails)) . '</div>
            </div>' : '') . '
        </div>
        <div class="footer">
            Atelier Zäzilia Jenni · 8805 Richterswil am Zürichsee · 078 818 06 36
        </div>
    </div>
</body>
</html>
';

// Mail versenden
$mailSent = @mail($to, $mailSubject, $emailHtml, implode("\r\n", $headers));

// Optional: Automatische Bestätigung an den Kunden
if ($mailSent) {
    $autoReplySubject = "Danke für deine Nachricht an das Atelier ZUMANO";
    $autoReplyHeaders = [];
    $autoReplyHeaders[] = 'MIME-Version: 1.0';
    $autoReplyHeaders[] = 'Content-Type: text/html; charset=UTF-8';
    $autoReplyHeaders[] = 'From: ' . ATELIER_NAME . ' <' . ATELIER_EMAIL . '>';
    $autoReplyHeaders[] = 'X-Mailer: PHP/' . phpversion();

    $autoReplyHtml = '
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;background:#F9F8F5;padding:20px;color:#262826;}.card{background:#fff;border:1px solid #E8E5DF;border-radius:12px;padding:30px;max-width:550px;margin:0 auto;}</style></head>
    <body>
        <div class="card">
            <h2 style="color:#728675;margin-top:0;">Liebe/r ' . htmlspecialchars($name) . ',</h2>
            <p>vielen herzlichen Dank für deine Nachricht an mein Atelier in Richterswil!</p>
            <p>Ich habe deine Anfrage erhalten und melde mich schnellstmöglich (meist innerhalb von 24–48 Stunden) persönlich bei dir, um alle Details oder Wünsche zu besprechen.</p>
            <p style="margin-top:24px;">Herzliche Grüsse,<br><strong>Zäzilia «Zuzu» Jenni</strong><br><span style="font-size:13px;color:#6B726B;">Atelier zumano.ch · Richterswil ZH · 078 818 06 36</span></p>
        </div>
    </body>
    </html>';

    @mail($email, $autoReplySubject, $autoReplyHtml, implode("\r\n", $autoReplyHeaders));
}

sendJsonResponse([
    'success' => true,
    'message' => 'Vielen Dank für deine Nachricht! Ich melde mich schnellstmöglich bei dir.',
    'mailSent' => $mailSent,
    'timestamp' => date('c'),
]);
