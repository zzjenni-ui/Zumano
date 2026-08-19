<?php
/**
 * zumano.ch - PHP Entrypoint & SPA Wrapper
 * Atelier Zäzilia Jenni · Richterswil ZH
 */
require_once __DIR__ . '/php/config.php';

// Dynamische Meta-Informationen für Social Sharing (WhatsApp, Facebook, Pinterest)
$pageTitle = "zumano.ch · Atelier Zäzilia Jenni | Aquarelle, Lettering & Holztafeln";
$pageDesc = "Handgemalte Aquarellkunst, modernes Hand-Lettering, personalisierte Holztafeln & Workshops im Atelier Richterswil am Zürichsee.";
$pageImage = WEBSITE_URL . "/preview.jpg";
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($pageDesc); ?>" />

    <!-- OpenGraph für Social Media & WhatsApp Vorschau -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?php echo WEBSITE_URL; ?>" />
    <meta property="og:title" content="<?php echo htmlspecialchars($pageTitle); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($pageDesc); ?>" />
    <meta property="og:image" content="<?php echo $pageImage; ?>" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700&family=Caveat:wght@400;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Serverseitige PHP Konfiguration an das Frontend übergeben -->
    <script>
      window.ZUMANO_CONFIG = {
        serverType: 'PHP',
        atelierEmail: '<?php echo ATELIER_EMAIL; ?>',
        atelierPhone: '<?php echo ATELIER_PHONE; ?>',
        version: '<?php echo date("YmdHi"); ?>',
        apiEndpoint: '/php/'
      };
    </script>
  </head>
  <body class="bg-[#F9F8F5] text-[#262826] antialiased">
    <div id="root"></div>

    <?php
    // Überprüfen ob kompilierte Vite-Dateien vorhanden sind
    $distIndex = __DIR__ . '/index.html';
    if (file_exists($distIndex)) {
        $htmlContent = file_get_contents($distIndex);
        // Script- und Style-Tags aus dem dist/index.html extrahieren und einbinden
        preg_match_all('/<script\b[^>]*>(.*?)<\/script>/is', $htmlContent, $scripts);
        preg_match_all('/<link\b[^>]*rel="stylesheet"[^>]*>/is', $htmlContent, $styles);
        
        foreach ($styles[0] as $styleTag) {
            echo $styleTag . "\n";
        }
        foreach ($scripts[0] as $scriptTag) {
            echo $scriptTag . "\n";
        }
    } else {
        // Fallback für Vite Dev / Standard
        echo '<script type="module" src="/src/main.tsx"></script>';
    }
    ?>
  </body>
</html>
