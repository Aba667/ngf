<?php
/**
 * GROUPE NGF, Demande de devis depuis la boutique.
 * Les articles sélectionnés sont transmis avec leur description et le nom du
 * fichier photo. Les visuels existants sont affichés dans le mail HTML.
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
        if ($imageBrute !== ''
            && $imageNom === $imageBrute
            && preg_match('/\\A[a-zA-Z0-9._-]+\\.(?:jpe?g|png|webp|gif)\\z/i', $imageNom)
            && is_file(__DIR__ . '/../assets/img/products/' . $imageNom)) {
            $imageUrl = 'https://shop.ngf-groupe.com/assets/img/products/' . rawurlencode($imageNom);
        }

        $articles[] = [
            'name' => $nomProduit,
            'ref' => $reference,
            'desc' => $description,
            'qty' => $quantite,
            'image' => $imageUrl,
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
        if ($article['image'] !== '') {
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

$corpsTexte = "DEMANDE DE DEVIS, Boutique en ligne ngf-groupe.com\n"
       . str_repeat('-', 50) . "\n\n"
       . bloc($paires) . "\n\n"
       . "Produits demandés :\n"
       . $produitsTexte . "\n";
if ($precisions !== '') {
    $corpsTexte .= "\nPrécisions du client :\n{$precisions}\n";
}
$corpsTexte .= "\n→ Merci de répondre au client avec prix et disponibilités.\n";

$pairesHtml = '';
foreach ($paires as $etiquette => $valeur) {
    $pairesHtml .= '<tr><th align="left" style="padding:4px 12px 4px 0">'
        . echapperHtml((string) $etiquette) . '</th><td style="padding:4px 0">'
        . echapperHtml((string) $valeur) . '</td></tr>';
}
$html = '<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:14px/1.5 Arial,sans-serif;color:#10233e">'
      . '<h2>Demande de devis, boutique NGF</h2><table>' . $pairesHtml . '</table>'
      . '<h3>Produits demandés</h3>' . $articlesHtml
      . ($precisions !== '' ? '<h3>Précisions du client</h3><p>' . echapperHtml($precisions) . '</p>' : '')
      . '<p>Merci de répondre au client avec prix et disponibilités.</p></body></html>';

$boundary = '=_NGF_' . bin2hex(random_bytes(16));
$corps = '--' . $boundary . "\r\n"
       . "Content-Type: text/plain; charset=UTF-8\r\n"
       . "Content-Transfer-Encoding: base64\r\n\r\n"
       . chunk_split(base64_encode($corpsTexte), 76, "\r\n")
       . '--' . $boundary . "\r\n"
       . "Content-Type: text/html; charset=UTF-8\r\n"
       . "Content-Transfer-Encoding: base64\r\n\r\n"
       . chunk_split(base64_encode($html), 76, "\r\n")
       . '--' . $boundary . "--\r\n";

$entetes = [
    'From: Groupe NGF, Boutique <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
];
$objet = '=?UTF-8?B?' . base64_encode('DEMANDE DE DEVIS, Boutique, ' . $nom) . '?=';
$ok = mail($DESTINATAIRE, $objet, $corps, implode("\r\n", $entetes));

header('Location: index.html?devis=' . ($ok ? 'ok' : 'err'));
exit;
