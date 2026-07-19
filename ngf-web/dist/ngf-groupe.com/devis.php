<?php
/**
 * GROUPE NGF, Traitement du formulaire de devis (devis.html).
 *
 * Hébergement : o2switch (mail() disponible).
 * La demande est envoyée à l'adresse du Groupe, avec Reply-To sur le visiteur.
 */

declare(strict_types=1);

$DESTINATAIRE = 'depcom@ngomfreres.com';   // l'adresse affichée sur le site
$EXPEDITEUR   = 'depcom@ngomfreres.com';

/* Uniquement des requêtes POST du formulaire */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: devis.html');
    exit;
}

/* Champ leurre rempli = robot : on prétend que tout va bien */
if (!empty($_POST['website'])) {
    header('Location: devis.html?envoye=1');
    exit;
}

function champ(string $nom, int $max): string
{
    $v = trim((string) ($_POST[$nom] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v);   // pas d'injection d'en-têtes
    return mb_substr($v, 0, $max);
}

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

/* Obligatoires */
$nom     = champ('nom', 120);
$email   = champ('email', 160);
$sujet   = champ('sujet', 120);
$message = trim(mb_substr((string) ($_POST['message'] ?? ''), 0, 4000));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: devis.html?erreur=1');
    exit;
}

/* Facultatifs : seuls ceux qui sont remplis apparaissent dans l'e-mail */
$facultatifs = [
    'Société'    => champ('societe', 120),
    'Téléphone'  => champ('telephone', 40),
    'Ville/Pays' => champ('ville', 80),
    'Secteur'    => champ('secteur', 60),
    'Délai'      => champ('delai', 60),
    'Budget'     => champ('budget', 60),
];

$paires = ['Nom' => $nom, 'E-mail' => $email]
        + array_filter($facultatifs, static fn($v) => $v !== '')
        + ['Objet' => $sujet];

$corps = "Nouvelle demande de devis, site ngf-groupe.com\n"
       . str_repeat('-', 46) . "\n\n"
       . bloc($paires) . "\n\n"
       . "Message :\n{$message}\n";

$entetes = [
    'From: Groupe NGF, Devis <' . $EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$objet = '=?UTF-8?B?' . base64_encode('Devis, ' . $sujet . ', ' . $nom) . '?=';

$ok = mail($DESTINATAIRE, $objet, $corps, implode("\r\n", $entetes));

header('Location: devis.html?' . ($ok ? 'envoye=1' : 'erreur=1'));
exit;
