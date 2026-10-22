import LegalLayout from "../../components/LegalLayout";

const sections = [
  { id: "qui", titre: "Qui sommes-nous ?", contenu: (
    <>
      <p><strong>IRAKY Delivery</strong> est une plateforme de coursiers basée à Toliara (Madagascar). Elle met en relation des clients et des coursiers locaux pour les démarches et livraisons du quotidien.</p>
      <p>Cette page explique quelles données nous collectons, pourquoi, et comment vous gardez le contrôle dessus.</p>
    </>
  )},
  { id: "donnees", titre: "Données que nous collectons", contenu: (
    <>
      <ul>
        <li><strong>Compte :</strong> nom, prénom, numéro de téléphone, adresse e-mail et mot de passe.</li>
        <li><strong>Profil :</strong> photo de profil, si vous en ajoutez une.</li>
        <li><strong>Coursiers :</strong> informations nécessaires à la vérification du profil et au suivi de l’abonnement.</li>
        <li><strong>Commandes :</strong> adresses de départ et de livraison, description du service, tarif, date et statut.</li>
        <li><strong>Position :</strong> localisation utilisée pour le suivi d’une commande en temps réel.</li>
        <li><strong>Messages :</strong> échanges entre un client et le coursier qui prend sa commande.</li>
        <li><strong>Paiements :</strong> références des paiements d’abonnement et de commandes.</li>
        <li><strong>Abonnement au portail :</strong> un identifiant anonyme propre à l’appareil, utilisé pour ne compter qu’une fois chaque abonné.</li>
      </ul>
    </>
  )},
  { id: "usage", titre: "Pourquoi nous les utilisons", contenu: (
    <ul>
      <li>Créer et sécuriser votre compte.</li>
      <li>Traiter les commandes, les attribuer à un coursier et assurer leur suivi.</li>
      <li>Vous envoyer des notifications liées à vos commandes.</li>
      <li>Vérifier les profils des coursiers pour la sécurité des clients.</li>
      <li>Établir des statistiques globales, comme le nombre d’abonnés du portail.</li>
      <li>Prévenir la fraude et les abus.</li>
    </ul>
  )},
  { id: "partage", titre: "Avec qui nous les partageons", contenu: (
    <>
      <p>Nous <strong>ne vendons jamais</strong> vos données personnelles.</p>
      <ul>
        <li>Le coursier qui prend une commande voit les informations utiles à sa réalisation : nom, adresse, détails du service.</li>
        <li>Le client voit le nom, la photo et la position du coursier pendant la mission.</li>
        <li>Nos prestataires techniques (hébergement, envoi de notifications) traitent les données pour notre compte.</li>
        <li>Nous pouvons communiquer des données si la loi ou une autorité compétente nous y oblige.</li>
      </ul>
    </>
  )},
  { id: "conservation", titre: "Durée de conservation", contenu: (
    <p>Vos données sont conservées tant que votre compte est actif, puis pendant la durée nécessaire à nos obligations légales et à la résolution d’éventuels litiges. Vous pouvez demander la suppression de votre compte à tout moment.</p>
  )},
  { id: "securite", titre: "Sécurité", contenu: (
    <p>Nous mettons en place des mesures techniques pour protéger vos données : connexion sécurisée, mots de passe protégés, accès limité selon le rôle (client, coursier, administrateur). Aucun système n’est infaillible : choisissez un mot de passe unique et ne le partagez pas.</p>
  )},
  { id: "droits", titre: "Vos droits", contenu: (
    <>
      <p>Vous pouvez à tout moment :</p>
      <ul>
        <li>consulter et corriger vos informations depuis « Mon profil » ;</li>
        <li>demander une copie des données vous concernant ;</li>
        <li>demander la suppression de votre compte et de vos données ;</li>
        <li>vous opposer à certains traitements, comme les notifications.</li>
      </ul>
      <p>Pour exercer ces droits, écrivez-nous à <a href="mailto:irakydelivery@gmail.com">irakydelivery@gmail.com</a>.</p>
    </>
  )},
  { id: "stockage", titre: "Stockage local et cookies", contenu: (
    <p>Le site enregistre dans votre navigateur uniquement ce qui est nécessaire à son fonctionnement : votre session, votre langue, votre thème clair ou sombre, l’état de votre abonnement au portail et certaines préférences d’affichage. Nous n’utilisons pas de cookies publicitaires.</p>
  )},
  { id: "mineurs", titre: "Mineurs", contenu: (
    <p>Le service s’adresse aux personnes majeures. Si un mineur utilise la plateforme, il doit le faire sous la responsabilité d’un parent ou tuteur.</p>
  )},
  { id: "modifs", titre: "Modifications", contenu: (
    <p>Nous pouvons mettre à jour cette politique. La date de dernière mise à jour figure en haut de la page ; en cas de changement important, nous vous en informerons sur la plateforme.</p>
  )},
  { id: "contact", titre: "Nous contacter", contenu: (
    <ul>
      <li><strong>E-mail :</strong> <a href="mailto:irakydelivery@gmail.com">irakydelivery@gmail.com</a></li>
      <li><strong>Téléphone :</strong> +261 38 21 266 83</li>
      <li><strong>Adresse :</strong> Enceinte Score BazarBe, Toliara, Madagascar</li>
    </ul>
  )},
];

export default function Confidentialite() {
  return (
    <LegalLayout
      eyebrow="CONFIDENTIALITÉ"
      titre="Politique de confidentialité"
      intro="Vos données servent à faire fonctionner IRAKY Delivery, et uniquement à cela. Voici, simplement, ce que nous collectons et ce que vous pouvez en faire."
      maj="22 octobre 2026"
      sections={sections}
      autre={{ to: "/conditions", label: "Lire les conditions d’utilisation" }}
    />
  );
}
