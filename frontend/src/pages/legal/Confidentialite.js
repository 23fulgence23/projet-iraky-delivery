import { useTranslation } from "react-i18next";
import LegalLayout from "../../components/LegalLayout";
import { rich } from "../../components/legalRich";

export default function Confidentialite() {
  const { t } = useTranslation();
  const P = (k) => <p>{rich(t(k))}</p>;
  const L = (keys) => <ul>{keys.map((k) => <li key={k}>{rich(t(k))}</li>)}</ul>;
  const mail = <a href="mailto:irakydelivery@gmail.com">irakydelivery@gmail.com</a>;

  const sections = [
    { id: "qui", titre: t("Qui sommes-nous ?"), contenu: (<>
      {P("**IRAKY Delivery** est une plateforme de coursiers basée à Toliara (Madagascar). Elle met en relation des clients et des coursiers locaux pour les démarches et livraisons du quotidien.")}
      {P("Cette page explique quelles données nous collectons, pourquoi, et comment vous gardez le contrôle dessus.")}
    </>) },
    { id: "donnees", titre: t("Données que nous collectons"), contenu: L([
      "**Compte :** nom, prénom, numéro de téléphone, adresse e-mail et mot de passe.",
      "**Profil :** photo de profil, si vous en ajoutez une.",
      "**Coursiers :** informations nécessaires à la vérification du profil et au suivi de l'abonnement.",
      "**Commandes :** adresses de départ et de livraison, description du service, tarif, date et statut.",
      "**Position :** localisation utilisée pour le suivi d'une commande en temps réel.",
      "**Messages :** échanges entre un client et le coursier qui prend sa commande.",
      "**Paiements :** références des paiements d'abonnement et de commandes.",
      "**Abonnement au portail :** un identifiant anonyme propre à l'appareil, utilisé pour ne compter qu'une fois chaque abonné.",
    ]) },
    { id: "usage", titre: t("Pourquoi nous les utilisons"), contenu: L([
      "Créer et sécuriser votre compte.",
      "Traiter les commandes, les attribuer à un coursier et assurer leur suivi.",
      "Vous envoyer des notifications liées à vos commandes.",
      "Vérifier les profils des coursiers pour la sécurité des clients.",
      "Établir des statistiques globales, comme le nombre d'abonnés du portail.",
      "Prévenir la fraude et les abus.",
    ]) },
    { id: "partage", titre: t("Avec qui nous les partageons"), contenu: (<>
      {P("Nous **ne vendons jamais** vos données personnelles.")}
      {L([
        "Le coursier qui prend une commande voit les informations utiles à sa réalisation : nom, adresse, détails du service.",
        "Le client voit le nom, la photo et la position du coursier pendant la mission.",
        "Nos prestataires techniques (hébergement, envoi de notifications) traitent les données pour notre compte.",
        "Nous pouvons communiquer des données si la loi ou une autorité compétente nous y oblige.",
      ])}
    </>) },
    { id: "conservation", titre: t("Durée de conservation"), contenu:
      P("Vos données sont conservées tant que votre compte est actif, puis pendant la durée nécessaire à nos obligations légales et à la résolution d'éventuels litiges. Vous pouvez demander la suppression de votre compte à tout moment.") },
    { id: "securite", titre: t("Sécurité"), contenu:
      P("Nous mettons en place des mesures techniques pour protéger vos données : connexion sécurisée, mots de passe protégés, accès limité selon le rôle (client, coursier, administrateur). Aucun système n'est infaillible : choisissez un mot de passe unique et ne le partagez pas.") },
    { id: "droits", titre: t("Vos droits"), contenu: (<>
      {P("Vous pouvez à tout moment :")}
      {L([
        "consulter et corriger vos informations depuis « Mon profil » ;",
        "demander une copie des données vous concernant ;",
        "demander la suppression de votre compte et de vos données ;",
        "vous opposer à certains traitements, comme les notifications.",
      ])}
      <p>{t("Pour exercer ces droits, écrivez-nous à")} {mail}.</p>
    </>) },
    { id: "stockage", titre: t("Stockage local et cookies"), contenu:
      P("Le site enregistre dans votre navigateur uniquement ce qui est nécessaire à son fonctionnement : votre session, votre langue, votre thème clair ou sombre, l'état de votre abonnement au portail et certaines préférences d'affichage. Nous n'utilisons pas de cookies publicitaires.") },
    { id: "mineurs", titre: t("Mineurs"), contenu:
      P("Le service s'adresse aux personnes majeures. Si un mineur utilise la plateforme, il doit le faire sous la responsabilité d'un parent ou tuteur.") },
    { id: "modifs", titre: t("Modifications"), contenu:
      P("Nous pouvons mettre à jour cette politique. La date de dernière mise à jour figure en haut de la page ; en cas de changement important, nous vous en informerons sur la plateforme.") },
    { id: "contact", titre: t("Nous contacter"), contenu: (
      <ul>
        <li><strong>{t("E-mail :")}</strong> {mail}</li>
        <li><strong>{t("Téléphone :")}</strong> +261 38 21 266 83</li>
        <li><strong>{t("Adresse :")}</strong> Enceinte Score BazarBe, Toliara, Madagascar</li>
      </ul>
    ) },
  ];

  return (
    <LegalLayout
      eyebrow={t("CONFIDENTIALITÉ")}
      titre={t("Politique de confidentialité")}
      intro={t("Vos données servent à faire fonctionner IRAKY Delivery, et uniquement à cela. Voici, simplement, ce que nous collectons et ce que vous pouvez en faire.")}
      maj={t("22 octobre 2026")}
      sections={sections}
      autre={{ to: "/conditions", label: t("Lire les conditions d'utilisation") }}
    />
  );
}
