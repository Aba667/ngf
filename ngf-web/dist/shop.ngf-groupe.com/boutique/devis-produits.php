<?php
/**
 * GROUPE NGF, Demande de devis depuis la boutique.
 * Les articles sélectionnés sont transmis avec leur description et le nom du
 * fichier photo. Les visuels disponibles sont intégrés au mail en images inline.
 */

declare(strict_types=1);

$DESTINATAIRE = 'ngfdepcom@ngomfreres.com';
$EXPEDITEUR   = 'devis@ngf-groupe.com';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: index.html');
    exit;
}

/* Champ leurre rempli = robot */
if (!empty($_POST['website'])) {
    header('Location: index.html?devis=ok');
    exit;
}

function champ(string $nom, int $max): string
{
    $v = trim((string) ($_POST[$nom] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v);
    return mb_substr($v, 0, $max);
}

function valeurProduit($valeur, int $max): string
{
    if (!is_scalar($valeur)) {
        return '';
    }
    $v = strip_tags((string) $valeur);
    $v = preg_replace('/[\r\n\t]+/u', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

function echapperHtml(string $valeur): string
{
    return htmlspecialchars($valeur, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* Obligatoires */
$nom = champ('nom', 120);
$email = champ('email', 160);
$produitsBrut = trim(mb_substr((string) ($_POST['produits'] ?? ''), 0, 250000));

if ($nom === '' || $produitsBrut === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html?devis=err');
    exit;
}

/* Facultatifs : seuls ceux qui sont remplis apparaissent dans l'e-mail */
$facultatifs = [
    'Téléphone'  => champ('telephone', 40),
    'Entreprise' => champ('entreprise', 120),
    'Ville/Pays' => champ('ville', 80),
    'Secteur'    => champ('secteur', 60),
    'Délai'      => champ('delai', 60),
    'Retrait'    => champ('livraison', 60),
];

/** Aligne la colonne « : » sur la largeur réelle des étiquettes. */
function bloc(array $paires): string
{
    $largeur = max(array_map('mb_strlen', array_keys($paires)));
    $lignes = [];
    foreach ($paires as $etiquette => $valeur) {
        $lignes[] = $etiquette . str_repeat(' ', $largeur - mb_strlen($etiquette)) . " : {$valeur}";
    }
    return implode("\n", $lignes);
}

$paires = ['Nom' => $nom, 'E-mail' => $email]
        + array_filter($facultatifs, static fn($v) => $v !== '');
$precisions = champ('precisions', 2000);

$articles = [];
$emailImages = [];
$emailImageIds = [];
$tailleTotaleImages = 0;
$articlesJson = json_decode($produitsBrut, true);
$formatCatalogue = is_array($articlesJson) && json_last_error() === JSON_ERROR_NONE;
if ($formatCatalogue) {
    foreach (array_slice($articlesJson, 0, 500) as $entree) {
        if (!is_array($entree)) {
            continue;
        }
        $nomProduit = valeurProduit($entree['name'] ?? '', 180);
        if ($nomProduit === '') {
            continue;
        }
        $reference = valeurProduit($entree['ref'] ?? '', 80);
        $description = valeurProduit($entree['desc'] ?? '', 600);
        $quantite = max(1, min(9999, (int) ($entree['qty'] ?? 1)));

        $imageBrute = valeurProduit($entree['img'] ?? '', 180);
        $imageNom = basename(str_replace('\\', '/', $imageBrute));
        $imageUrl = '';
        $imageCid = '';
        $cheminPhotoReel = realpath(__DIR__ . '/../assets/img/products/' . $imageNom);
        $dossierPhotosReel = realpath(__DIR__ . '/../assets/img/products');
        $nomPhotoAutorise = $imageBrute === $imageNom
            || $imageBrute === 'assets/img/products/' . $imageNom;
        if ($imageBrute !== ''
            && $nomPhotoAutorise
            && preg_match('/\\A[a-zA-Z0-9._-]+\\.(?:jpe?g|png|webp|gif)\\z/i', $imageNom)
            && $cheminPhotoReel !== false
            && $dossierPhotosReel !== false
            && strpos($cheminPhotoReel, $dossierPhotosReel . DIRECTORY_SEPARATOR) === 0
            && is_file($cheminPhotoReel)) {
            $imageUrl = 'https://shop.ngf-groupe.com/assets/img/products/' . rawurlencode($imageNom);

            if (isset($emailImageIds[$imageNom])) {
                $imageCid = $emailImageIds[$imageNom];
            } else {
                $mime = function_exists('mime_content_type') ? mime_content_type($cheminPhotoReel) : '';
                $taille = filesize($cheminPhotoReel);
                $mimesAutorises = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (is_string($mime)
                    && in_array($mime, $mimesAutorises, true)
                    && $taille !== false
                    && $taille <= 5 * 1024 * 1024
                    && $tailleTotaleImages + $taille <= 8 * 1024 * 1024) {
                    $imageCid = 'ngf-photo-' . count($emailImages) . '@ngf-groupe.com';
                    $emailImageIds[$imageNom] = $imageCid;
                    $emailImages[] = [
                        'path' => $cheminPhotoReel,
                        'name' => $imageNom,
                        'mime' => $mime,
                        'cid' => $imageCid,
                    ];
                    $tailleTotaleImages += $taille;
                }
            }
        }

        $articles[] = [
            'name' => $nomProduit,
            'ref' => $reference,
            'desc' => $description,
            'qty' => $quantite,
            'image' => $imageUrl,
            'imageCid' => $imageCid,
        ];
    }
}

$articlesTexte = [];
$articlesHtml = '';
if ($articles) {
    foreach ($articles as $article) {
        $ligne = $article['qty'] . ' × ' . $article['name'];
        if ($article['ref'] !== '') {
            $ligne .= ' (réf. ' . $article['ref'] . ')';
        }
        $texteArticle = [$ligne];
        if ($article['desc'] !== '') {
            $texteArticle[] = 'Description : ' . $article['desc'];
        }
        $texteArticle[] = $article['image'] !== ''
            ? 'Photo : ' . $article['image']
            : 'Photo : non disponible dans le catalogue';
        $articlesTexte[] = implode("\n", $texteArticle);

        $nomHtml = echapperHtml($article['name']);
        $refHtml = echapperHtml($article['ref']);
        $descHtml = echapperHtml($article['desc']);
        if ($article['imageCid'] !== '') {
            $urlHtml = echapperHtml($article['image']);
            $cidHtml = echapperHtml($article['imageCid']);
            $photoHtml = '<a href="' . $urlHtml . '"><img src="cid:' . $cidHtml
                . '" alt="' . $nomHtml . '" width="150" style="display:block;width:150px;max-width:100%;height:auto;border:0"></a>';
        } elseif ($article['image'] !== '') {
            $urlHtml = echapperHtml($article['image']);
            $photoHtml = '<a href="' . $urlHtml . '"><img src="' . $urlHtml
                . '" alt="' . $nomHtml . '" width="150" style="display:block;width:150px;max-width:100%;height:auto;border:0"></a>';
        } else {
            $photoHtml = '<p style="color:#64748b">Photo non disponible dans le catalogue</p>';
        }
        $articlesHtml .= '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;border-bottom:1px solid #e2e8f0"><tr>'
            . '<td valign="top" style="width:170px;padding:10px">' . $photoHtml . '</td>'
            . '<td valign="top" style="padding:10px;font:14px/1.5 Arial,sans-serif">'
            . '<strong>' . $article['qty'] . ' × ' . $nomHtml . '</strong>'
            . ($refHtml !== '' ? '<br><span>Référence : ' . $refHtml . '</span>' : '')
            . ($descHtml !== '' ? '<p style="margin:8px 0">' . $descHtml . '</p>' : '')
            . '</td></tr></table>';
    }
    $produitsTexte = implode("\n\n", $articlesTexte);
} else {
    /* Compatibilité avec les demandes envoyées avant la mise à jour du script. */
    $produitsTexte = $produitsBrut;
    $articlesHtml = '<pre style="white-space:pre-wrap">' . echapperHtml($produitsBrut) . '</pre>';
}

$corpsTexte = "Bonjour l’équipe commerciale du Groupe NGF,\n\n"
       . "Vous avez reçu une nouvelle demande de devis depuis la boutique en ligne.\n\n"
       . bloc($paires) . "\n\n"
       . "Produits demandés :\n"
       . $produitsTexte . "\n";
if ($precisions !== '') {
    $corpsTexte .= "\nPrécisions du client :\n{$precisions}\n";
}
$corpsTexte .= "\nJe vous remercie par avance de bien vouloir confirmer au client les prix, les disponibilités et les délais de livraison.\n\n"
       . "Bien cordialement,\nL’équipe de la boutique NGF\n";

$pairesHtml = '';
foreach ($paires as $etiquette => $valeur) {
    $pairesHtml .= '<tr><th align="left" style="padding:4px 12px 4px 0">'
        . echapperHtml((string) $etiquette) . '</th><td style="padding:4px 0">'
        . echapperHtml((string) $valeur) . '</td></tr>';
}
$html = '<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:14px/1.5 Arial,sans-serif;color:#10233e">'
      . '<p>Bonjour l’équipe commerciale du Groupe NGF,</p>'
      . '<p>Vous avez reçu une nouvelle demande de devis depuis la boutique en ligne.</p>'
      . '<table>' . $pairesHtml . '</table>'
      . '<h3>Produits demandés</h3>' . $articlesHtml
      . ($precisions !== '' ? '<h3>Précisions du client</h3><p>' . echapperHtml($precisions) . '</p>' : '')
      . '<p>Merci de confirmer au client les prix, les disponibilités et les délais de livraison.</p>'
      . '<p>Bien cordialement,<br>L’équipe de la boutique NGF</p></body></html>';

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

foreach ($emailImages as $image) {
    $contenuImage = file_get_contents($image['path']);
    if ($contenuImage === false) {
        continue;
    }
    $corps .= '--' . $boundaryLie . "\r\n"
           . 'Content-Type: ' . $image['mime'] . '; name="' . $image['name'] . '"' . "\r\n"
           . "Content-Transfer-Encoding: base64\r\n"
           . 'Content-ID: <' . $image['cid'] . ">\r\n"
           . 'Content-Disposition: inline; filename="' . $image['name'] . '"' . "\r\n\r\n"
           . chunk_split(base64_encode($contenuImage), 76, "\r\n");
}
$corps .= '--' . $boundaryLie . "--\r\n";

$entetes = [
    'From: Groupe NGF, Boutique <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/related; type="multipart/alternative"; boundary="' . $boundaryLie . '"',
];
$objet = '=?UTF-8?B?' . base64_encode('DEMANDE DE DEVIS, Boutique, ' . $nom) . '?=';
$ok = mail($DESTINATAIRE, $objet, $corps, implode("\r\n", $entetes));

header('Location: index.html?devis=' . ($ok ? 'ok' : 'err'));
exit;
