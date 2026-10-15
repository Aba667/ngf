<?php
/**
 * Envoie une demande d'information produit depuis le catalogue Victorinox.
 * Les photos sélectionnées sont intégrées au message en images MIME inline.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

function repondreJson(int $code, bool $succes, string $message): void
{
    http_response_code($code);
    echo json_encode(
        ['success' => $succes, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

function texteSecurise($valeur, int $maximum): string
{
    if (!is_scalar($valeur)) {
        return '';
    }
    $texte = strip_tags((string) $valeur);
    $texte = preg_replace('/[\r\n\t]+/u', ' ', $texte) ?? '';
    return mb_substr(trim($texte), 0, $maximum);
}

function echapperHtml(string $valeur): string
{
    return htmlspecialchars($valeur, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    repondreJson(405, false, 'Méthode non autorisée.');
}

$requete = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($requete)) {
    repondreJson(400, false, 'La demande reçue est incomplète.');
}

/* Le champ leurre est invisible pour les clients et rempli par certains robots. */
if (texteSecurise($requete['website'] ?? '', 160) !== '') {
    repondreJson(200, true, 'Votre demande a bien été envoyée.');
}

$nom = texteSecurise($requete['name'] ?? '', 120);
$email = texteSecurise($requete['email'] ?? '', 160);
$telephone = texteSecurise($requete['phone'] ?? '', 40);
$messageClient = texteSecurise($requete['message'] ?? '', 1200);
$produit = is_array($requete['product'] ?? null) ? $requete['product'] : [];
$nomProduit = texteSecurise($produit['name'] ?? '', 180);
$reference = texteSecurise($produit['reference'] ?? '', 80);
$prix = texteSecurise($produit['price'] ?? '', 80);
$description = texteSecurise($produit['description'] ?? '', 1500);

if ($nom === '' || $nomProduit === '' || $reference === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repondreJson(422, false, 'Vérifiez votre nom, votre adresse e-mail et la fiche produit.');
}

$dossierPhotos = realpath(__DIR__ . '/photos');
$photos = [];
$tailleTotale = 0;
$imagesTransmises = is_array($produit['images'] ?? null) ? $produit['images'] : [];
$imagesTransmises = array_values(array_filter($imagesTransmises, 'is_string'));
foreach (array_slice(array_unique($imagesTransmises), 0, 5) as $nomFichier) {
    if (!is_string($nomFichier)
        || !preg_match('/\A[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp|gif)\z/i', $nomFichier)
        || $dossierPhotos === false) {
        continue;
    }

    $chemin = realpath($dossierPhotos . DIRECTORY_SEPARATOR . $nomFichier);
    if ($chemin === false
        || strpos($chemin, $dossierPhotos . DIRECTORY_SEPARATOR) !== 0
        || !is_file($chemin)) {
        continue;
    }

    $mime = function_exists('mime_content_type') ? mime_content_type($chemin) : '';
    $taille = filesize($chemin);
    $mimesAutorises = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!is_string($mime)
        || !in_array($mime, $mimesAutorises, true)
        || $taille === false
        || $taille > 4 * 1024 * 1024
        || $tailleTotale + $taille > 8 * 1024 * 1024) {
        continue;
    }

    $contenu = file_get_contents($chemin);
    if ($contenu === false) {
        continue;
    }

    $photos[] = [
        'name' => $nomFichier,
        'mime' => $mime,
        'cid' => 'ngf-coutellerie-' . count($photos) . '@ngf-groupe.com',
        'content' => $contenu,
    ];
    $tailleTotale += $taille;
}

$destinataire = 'Victorinoxsenegal.nfg@gmail.com';
$expediteur = 'devis@ngf-groupe.com';
$sujet = 'Demande d’information produit, ' . $reference . ' - ' . $nomProduit;

$corpsTexte = "Bonjour l’équipe commerciale de Coutellerie Victorinox Sénégal,\n\n"
    . "Je souhaite obtenir des informations complémentaires sur le produit suivant :\n"
    . "Produit : {$nomProduit}\nRéférence : {$reference}\n";
if ($prix !== '') {
    $corpsTexte .= "Prix indiqué sur le site : {$prix}\n";
}
if ($description !== '') {
    $corpsTexte .= "Description : {$description}\n";
}
if ($photos) {
    $corpsTexte .= "Photos du produit :\n";
    foreach ($photos as $photo) {
        $corpsTexte .= 'https://coutellerie.ngf-groupe.com/photos/' . rawurlencode($photo['name']) . "\n";
    }
}
$corpsTexte .= "\nPourriez-vous me confirmer son prix, sa disponibilité et le délai de livraison ?\n";
if ($messageClient !== '') {
    $corpsTexte .= "\nMessage complémentaire :\n{$messageClient}\n";
}
$corpsTexte .= "\nJe vous remercie par avance pour votre retour.\n\nBien cordialement,\n{$nom}\n";

$nomHtml = echapperHtml($nom);
$emailHtml = echapperHtml($email);
$telephoneHtml = echapperHtml($telephone);
$nomProduitHtml = echapperHtml($nomProduit);
$referenceHtml = echapperHtml($reference);
$prixHtml = echapperHtml($prix);
$descriptionHtml = echapperHtml($description);
$messageHtml = nl2br(echapperHtml($messageClient));
$photosHtml = '';
foreach ($photos as $index => $photo) {
    $cid = echapperHtml($photo['cid']);
    $photosHtml .= '<a href="https://coutellerie.ngf-groupe.com/photos/' . rawurlencode($photo['name']) . '" style="display:inline-block;margin:8px 10px 8px 0">'
        . '<img src="cid:' . $cid . '" alt="' . $nomProduitHtml . '" width="150" style="display:block;width:150px;max-width:100%;height:auto;border:0;border-radius:6px"></a>';
}
if ($photosHtml === '') {
    $photosHtml = '<p style="color:#64748b">Aucune photo exploitable n’est disponible pour cette référence.</p>';
}

$coordonneesHtml = '<tr><th align="left" style="padding:4px 12px 4px 0">Nom</th><td style="padding:4px 0">' . $nomHtml . '</td></tr>'
    . '<tr><th align="left" style="padding:4px 12px 4px 0">E-mail</th><td style="padding:4px 0">' . $emailHtml . '</td></tr>';
if ($telephone !== '') {
    $coordonneesHtml .= '<tr><th align="left" style="padding:4px 12px 4px 0">Téléphone</th><td style="padding:4px 0">' . $telephoneHtml . '</td></tr>';
}

$html = '<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:14px/1.6 Arial,sans-serif;color:#10233e">'
    . '<p>Bonjour l’équipe commerciale de Coutellerie Victorinox Sénégal,</p>'
    . '<p>Je souhaite obtenir des informations complémentaires sur ce produit :</p>'
    . '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px"><tr><th align="left" style="padding:4px 12px 4px 0">Produit</th><td style="padding:4px 0">' . $nomProduitHtml . '</td></tr>'
    . '<tr><th align="left" style="padding:4px 12px 4px 0">Référence</th><td style="padding:4px 0">' . $referenceHtml . '</td></tr>'
    . ($prix !== '' ? '<tr><th align="left" style="padding:4px 12px 4px 0">Prix indiqué</th><td style="padding:4px 0">' . $prixHtml . '</td></tr>' : '')
    . '</table>'
    . ($description !== '' ? '<p>' . $descriptionHtml . '</p>' : '')
    . '<h3>Photos du produit</h3>' . $photosHtml
    . '<p>Pourriez-vous me confirmer son prix, sa disponibilité et le délai de livraison ?</p>'
    . ($messageClient !== '' ? '<h3>Message complémentaire</h3><p>' . $messageHtml . '</p>' : '')
    . '<h3>Coordonnées du client</h3><table>' . $coordonneesHtml . '</table>'
    . '<p>Je vous remercie par avance pour votre retour.<br><br>Bien cordialement,<br>' . $nomHtml . '</p></body></html>';

$boundaryAlternatif = '=_NGF_ALT_' . bin2hex(random_bytes(12));
$boundaryLie = '=_NGF_REL_' . bin2hex(random_bytes(12));
$corps = '--' . $boundaryLie . "\r\n"
    . 'Content-Type: multipart/alternative; boundary="' . $boundaryAlternatif . '"' . "\r\n\r\n"
    . '--' . $boundaryAlternatif . "\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($corpsTexte), 76, "\r\n")
    . '--' . $boundaryAlternatif . "\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($html), 76, "\r\n")
    . '--' . $boundaryAlternatif . "--\r\n";

foreach ($photos as $photo) {
    $corps .= '--' . $boundaryLie . "\r\n"
        . 'Content-Type: ' . $photo['mime'] . '; name="' . $photo['name'] . '"' . "\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . 'Content-ID: <' . $photo['cid'] . ">\r\n"
        . 'Content-Disposition: inline; filename="' . $photo['name'] . '"' . "\r\n\r\n"
        . chunk_split(base64_encode($photo['content']), 76, "\r\n");
}
$corps .= '--' . $boundaryLie . "--\r\n";

$entetes = [
    'From: Coutellerie Victorinox Sénégal <' . $expediteur . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/related; type="multipart/alternative"; boundary="' . $boundaryLie . '"',
];
$objetEncode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';
if (!mail($destinataire, $objetEncode, $corps, implode("\r\n", $entetes))) {
    repondreJson(500, false, 'L’envoi n’a pas abouti. Réessayez ou utilisez votre application e-mail.');
}

repondreJson(200, true, 'Votre demande a bien été envoyée avec les photos du produit.');
