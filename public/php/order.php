<?php
/**
 * zumano.ch - Shop Bestellungsabwicklung & Checkout Handler (PHP)
 * Empfängt Warenkorb & Kundendaten, berechnet Totale in CHF,
 * generiert Bestellnummer, sendet Bestätigungsmails und speichert Bestellung.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Nur POST-Anfragen erlaubt'], 405);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$customer = $data['customer'] ?? [];
$items = $data['items'] ?? [];
$paymentMethod = $data['paymentMethod'] ?? 'twint';
$subtotal = floatval($data['subtotal'] ?? 0);
$shipping = floatval($data['shipping'] ?? 0);
$total = floatval($data['total'] ?? ($subtotal + $shipping));
$notes = trim($data['notes'] ?? '');

$name = trim($customer['name'] ?? '');
$email = filter_var(trim($customer['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$address = trim($customer['address'] ?? '');
$zipCity = trim($customer['zipCity'] ?? '');
$phone = trim($customer['phone'] ?? '');

if (empty($name) || !$email || empty($address) || empty($items)) {
    sendJsonResponse([
        'success' => false,
        'error' => 'Bitte alle Pflichtfelder (Name, E-Mail, Lieferadresse, Produkte) ausfüllen.'
    ], 400);
}

// Bestellnummer generieren (z.B. ZUMANO-2026-8492)
$orderId = 'ZUMANO-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));
$orderDate = date('d.m.Y H:i');

// Bestellungsdaten vorbereiten
$orderRecord = [
    'orderId' => $orderId,
    'orderDate' => $orderDate,
    'customer' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'zipCity' => $zipCity,
    ],
    'paymentMethod' => $paymentMethod,
    'subtotal' => $subtotal,
    'shipping' => $shipping,
    'total' => $total,
    'currency' => 'CHF',
    'notes' => $notes,
    'items' => $items,
    'status' => 'received',
];

// In lokaler JSON-Datei archivieren (falls Verzeichnis existiert)
$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$ordersFile = $dataDir . '/orders.json';
$existingOrders = [];
if (file_exists($ordersFile)) {
    $existingOrders = json_decode(file_get_contents($ordersFile), true) ?: [];
}
array_unshift($existingOrders, $orderRecord);
@file_put_contents($ordersFile, json_encode($existingOrders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Positionen HTML für E-Mail aufbereiten
$itemsHtml = '';
foreach ($items as $item) {
    $prodTitle = htmlspecialchars($item['product']['title'] ?? 'Kunstwerk');
    $variant = !empty($item['selectedVariant']['name']) ? ' (' . htmlspecialchars($item['selectedVariant']['name']) . ')' : '';
    $customText = !empty($item['customText']) ? '<br><small style="color:#C49A6C;">Widmung: «' . htmlspecialchars($item['customText']) . '»</small>' : '';
    $qty = intval($item['quantity'] ?? 1);
    $price = floatval($item['product']['priceChf'] ?? 0) + floatval($item['selectedVariant']['priceExtraChf'] ?? 0);
    $lineTotal = $price * $qty;

    $itemsHtml .= '
    <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E5DF;">
            <strong>' . $prodTitle . '</strong>' . $variant . $customText . '
        </td>
        <td style="padding:10px;text-align:center;border-bottom:1px solid #E8E5DF;">' . $qty . '×</td>
        <td style="padding:10px 0;text-align:right;border-bottom:1px solid #E8E5DF;">' . number_format($lineTotal, 2, '.', '’') . ' CHF</td>
    </tr>';
}

$paymentLabels = [
    'twint' => 'TWINT (Schweizer Sofortzahlung)',
    'invoice' => 'QR-Rechnung (Beilage / PDF)',
    'card' => 'Kreditkarte / Apple Pay',
    'cash' => 'Barzahlung bei Abholung im Atelier Richterswil',
];
$paymentLabel = $paymentLabels[$paymentMethod] ?? $paymentMethod;

// E-Mail an Atelier Zuzu
$to = ATELIER_EMAIL;
$mailSubject = "Neue Bestellung " . $orderId . " von " . $name . " (" . number_format($total, 2, '.', '’') . " CHF)";
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . ATELIER_NAME . ' <no-reply@zumano.ch>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
];

$emailHtml = '
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>' . $mailSubject . '</title></head>
<body style="font-family:sans-serif;background:#F9F8F5;padding:20px;color:#2D2D2D;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E8E5DF;border-radius:12px;overflow:hidden;">
        <div style="background:#728675;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;font-family:Georgia,serif;">zumano.ch · Neue Bestellung</h2>
            <p style="margin:4px 0 0 0;font-size:13px;">Bestell-Nr. ' . $orderId . ' | ' . $orderDate . '</p>
        </div>
        <div style="padding:24px;">
            <h3 style="color:#728675;border-bottom:1px solid #eee;padding-bottom:6px;">Kunde:</h3>
            <p>
                <strong>' . htmlspecialchars($name) . '</strong><br>
                ' . htmlspecialchars($address) . '<br>
                ' . htmlspecialchars($zipCity) . '<br>
                E-Mail: <a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a><br>
                ' . (!empty($phone) ? 'Telefon: ' . htmlspecialchars($phone) . '<br>' : '') . '
                Zahlart: <strong>' . htmlspecialchars($paymentLabel) . '</strong>
            </p>

            <h3 style="color:#728675;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:24px;">Bestellte Kunstwerke:</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                ' . $itemsHtml . '
                <tr>
                    <td colspan="2" style="padding:12px 0 4px;font-weight:bold;text-align:right;">Zwischensumme:</td>
                    <td style="padding:12px 0 4px;text-align:right;">' . number_format($subtotal, 2, '.', '’') . ' CHF</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:4px 0;text-align:right;color:#666;">Versand (Schweiz):</td>
                    <td style="padding:4px 0;text-align:right;color:#666;">' . ($shipping == 0 ? 'Kostenlos' : number_format($shipping, 2, '.', '’') . ' CHF') . '</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:10px 0;font-size:16px;font-weight:bold;color:#728675;text-align:right;border-top:2px solid #728675;">Gesamttotal:</td>
                    <td style="padding:10px 0;font-size:16px;font-weight:bold;color:#728675;text-align:right;border-top:2px solid #728675;">' . number_format($total, 2, '.', '’') . ' CHF</td>
                </tr>
            </table>

            ' . (!empty($notes) ? '<p style="background:#FAF9F6;padding:12px;border-radius:6px;margin-top:20px;"><strong>Kundenhinweis:</strong><br>' . nl2br(htmlspecialchars($notes)) . '</p>' : '') . '
        </div>
    </div>
</body>
</html>';

@mail($to, $mailSubject, $emailHtml, implode("\r\n", $headers));

// Bestätigungs-Mail an den Kunden
$custHeaders = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . ATELIER_NAME . ' <' . ATELIER_EMAIL . '>',
    'X-Mailer: PHP/' . phpversion(),
];
$custSubject = "Bestellbestätigung " . $orderId . " – Atelier zumano.ch";
$custHtml = '
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family:Georgia,serif;background:#F9F8F5;padding:20px;color:#262826;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E8E5DF;border-radius:12px;padding:30px;">
        <h2 style="color:#728675;margin-top:0;">Herzlichen Dank für deine Bestellung, ' . htmlspecialchars($name) . '!</h2>
        <p>Ich habe deine Bestellung <strong>' . $orderId . '</strong> erhalten und bereite dein handgemachtes Unikat im Atelier in Richterswil sorgfältig vor.</p>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:24px 0;font-family:sans-serif;">
            ' . $itemsHtml . '
            <tr>
                <td colspan="2" style="padding:10px 0;font-weight:bold;text-align:right;font-size:15px;color:#728675;">Totalbetrag:</td>
                <td style="padding:10px 0;font-weight:bold;text-align:right;font-size:15px;color:#728675;">' . number_format($total, 2, '.', '’') . ' CHF</td>
            </tr>
        </table>

        <div style="background:#FAF9F6;padding:16px;border-radius:8px;font-family:sans-serif;font-size:13px;color:#555;">
            <strong>Gewählte Zahlart:</strong> ' . htmlspecialchars($paymentLabel) . '<br>
            <strong>Lieferadresse:</strong> ' . htmlspecialchars($name) . ', ' . htmlspecialchars($address) . ', ' . htmlspecialchars($zipCity) . '
        </div>

        <p style="margin-top:24px;">Bei Fragen oder individuellen Wünschen erreichst du mich jederzeit unter <a href="tel:0788180636" style="color:#728675;">078 818 06 36</a> oder per Antwort auf diese Mail.</p>

        <p style="margin-top:30px;border-top:1px solid #eee;padding-top:16px;">
            Mit herzlichen Grüssen,<br>
            <strong>Zäzilia «Zuzu» Jenni</strong><br>
            <span style="font-size:13px;color:#6B726B;">zumano.ch · Atelier Richterswil am Zürichsee</span>
        </p>
    </div>
</body>
</html>';

@mail($email, $custSubject, $custHtml, implode("\r\n", $custHeaders));

sendJsonResponse([
    'success' => true,
    'orderId' => $orderId,
    'orderDate' => $orderDate,
    'total' => $total,
    'currency' => 'CHF',
    'message' => 'Deine Bestellung wurde erfolgreich aufgegeben! Eine Bestätigung wurde an ' . $email . ' gesendet.',
]);
