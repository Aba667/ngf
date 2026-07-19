<?php
/**
 * GROUPE NGF, Demande de devis depuis la boutique.
 *
 * Reçoit la liste des produits sélectionnés (champ « produits », rempli par
 * boutique.js) et les coordonnées du client, puis envoie l'e-mail avec la
 * mention DEMANDE DE DEVIS.
 *
 * ⚠️ Avant la mise en ligne : créer devis@ngf-groupe.com dans cPanel
 *    (le From doit appartenir au domaine, sinon SPF/DKIM échouent).
 */

declare(strict_types=1);

$DESTINATAIRE = 'depcom@ngomfreres.com';   // l'adresse affichée sur le site
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

/* Obligatoires */
$nom      = champ('nom', 120);
$email    = champ('email', 160);
$produits = trim(mb_substr((string) ($_POST['produits'] ?? ''), 0, 4000));

if ($nom === '' || $produits === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
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

/**
 * Aligne la colonne « : » sur l'étiquette la plus longue.
 * str_pad() compterait les octets, pas les lettres accentuées.
 */
function bloc(array $paires): string
{
    $largeur = max(array_map('mb_strlen', array_keys($paires)));
    $lignes = [];
    foreach ($paires as $etiquette => $valeur) {
        $lignes[] = $etiquette
                  . str_repeat(' ', $largeur - mb_strlen($etiquette))
                  . " : {$valeur}";
    }
    return implode("\n", $lignes);
}

$paires = ['Nom' => $nom, 'E-mail' => $email]
        + array_filter($facultatifs, static fn($v) => $v !== '');

$precisions = trim(mb_substr((string) ($_POST['precisions'] ?? ''), 0, 2000));

$corps = "DEMANDE DE DEVIS, Boutique en ligne ngf-groupe.com\n"
       . str_repeat('-', 50) . "\n\n"
       . bloc($paires) . "\n\n"
       . "Produits demandés :\n"
       . $produits . "\n";

if ($precisions !== '') {
    $corps .= "\nPrécisions du client :\n{$precisions}\n";
}

$corps .= "\n→ Merci de répondre au client avec prix et disponibilités.\n";

$entetes = [
    'From: Groupe NGF, Boutique <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$objet = '=?UTF-8?B?' . base64_encode('DEMANDE DE DEVIS, Boutique, ' . $nom) . '?=';

$ok = mail($DESTINATAIRE, $objet, $corps, implode("\r\n", $entetes));

header('Location: index.html?devis=' . ($ok ? 'ok' : 'err'));
exit;
