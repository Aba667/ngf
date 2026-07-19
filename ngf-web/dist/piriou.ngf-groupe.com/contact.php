<?php
/**
 * Traitement du formulaire de contact d'une filiale.
 * Ce fichier est GÉNÉRÉ par build.py pour chaque filiale (destinataire injecté).
 * Ne pas éditer dans dist/ : modifier filiales/contact.php.tpl puis relancer le build.
 *
 * Hébergement o2switch (mail() disponible). Le message est envoyé à l'adresse
 * de la filiale, avec Reply-To sur le visiteur pour répondre directement.
 */

declare(strict_types=1);

$DESTINATAIRE = 'depcom@ngomfreres.com';
$FILIALE      = 'Piriou Ngom Sénégal';
$EXPEDITEUR   = 'depcom@ngomfreres.com';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: contact.html');
    exit;
}

/* Champ leurre rempli = robot */
if (!empty($_POST['website'])) {
    header('Location: contact.html?envoye=1');
    exit;
}

function champ(string $nom, int $max): string
{
    $v = trim((string) ($_POST[$nom] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v);   // pas d'injection d'en-têtes
    return mb_substr($v, 0, $max);
}

$nom     = champ('nom', 120);
$email   = champ('email', 160);
$tel     = champ('telephone', 40);
$sujet   = champ('sujet', 140);
$message = trim(mb_substr((string) ($_POST['message'] ?? ''), 0, 4000));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?erreur=1');
    exit;
}

$paires = ['Nom' => $nom, 'E-mail' => $email];
if ($tel !== '')   { $paires['Téléphone'] = $tel; }
if ($sujet !== '') { $paires['Objet'] = $sujet; }

$largeur = max(array_map('mb_strlen', array_keys($paires)));
$lignes = [];
foreach ($paires as $etiquette => $valeur) {
    $lignes[] = $etiquette . str_repeat(' ', $largeur - mb_strlen($etiquette)) . " : {$valeur}";
}

$corps = "Nouveau message, {$FILIALE}\n"
       . str_repeat('-', 46) . "\n\n"
       . implode("\n", $lignes) . "\n\n"
       . "Message :\n{$message}\n";

$entetes = [
    'From: ' . $FILIALE . ' <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$objet = '=?UTF-8?B?' . base64_encode('Contact ' . $FILIALE . ' : ' . ($sujet !== '' ? $sujet : $nom)) . '?=';

$ok = mail($DESTINATAIRE, $objet, $corps, implode("\r\n", $entetes));

header('Location: contact.html?' . ($ok ? 'envoye=1' : 'erreur=1'));
exit;
