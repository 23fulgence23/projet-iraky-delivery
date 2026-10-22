import LegalLayout from "../../components/LegalLayout";

const sections = [
  { id: "objet", titre: "Objet", contenu: (
    <p>Ces conditions encadrent l’utilisation du portail et des espaces <strong>client</strong>, <strong>coursier</strong> et <strong>administrateur</strong> d’IRAKY Delivery. En créant un compte ou en utilisant le service, vous les acceptez.</p>
  )},
  { id: "compte", titre: "Compte utilisateur", contenu: (
    <ul>
      <li>Les informations fournies à l’inscription doivent être exactes et à jour.</li>
      <li>Vous êtes responsable de la confidentialité de votre mot de passe et de l’activité de votre compte.</li>
      <li>Un compte est personnel : il ne peut être ni prêté ni revendu.</li>
    </ul>
  )},
  { id: "service", titre: "Le service", contenu: (
    <>
      <p>IRAKY Delivery met en relation des clients et des coursiers indépendants pour des services tels que : paiement de factures (JIRAMA), légalisation de CIN, démarches bancaires ou au Trésor, achats, livraison de colis et mentorat universitaire.</p>
      <p>IRAKY Delivery est un <strong>intermédiaire</strong> : la mission est réalisée par le coursier qui l’accepte.</p>
    </>
  )},
  { id: "commandes", titre: "Commandes et paiement", contenu: (
    <ul>
      <li>Le tarif est affiché en ariary (Ar) avant la validation de la commande.</li>
      <li>Une commande peut être suivie en temps réel depuis votre espace client.</li>
      <li>Les modalités de paiement vous sont indiquées au moment de la commande.</li>
      <li>Une commande déjà prise en charge peut ne plus être annulable ou donner lieu à des frais ; contactez-nous en cas de problème.</li>
    </ul>
  )},
  { id: "clients", titre: "Obligations des clients", contenu: (
    <ul>
      <li>Décrire précisément la mission et fournir des adresses exactes.</li>
      <li>Être joignable pendant la mission.</li>
      <li>Ne pas demander de service illégal ou dangereux.</li>
      <li>Traiter les coursiers avec respect.</li>
    </ul>
  )},
  { id: "coursiers", titre: "Obligations des coursiers", contenu: (
    <ul>
      <li>Fournir un profil véridique et le maintenir à jour.</li>
      <li>Régler l’abonnement requis pour accéder aux missions ; un abonnement impayé peut limiter l’accès à l’espace coursier.</li>
      <li>Réaliser les missions acceptées avec soin, dans les délais annoncés.</li>
      <li>Ne jamais détourner d’argent, de documents ou de colis confiés.</li>
      <li>Respecter la réglementation en vigueur, notamment en matière de circulation.</li>
    </ul>
  )},
  { id: "interdits", titre: "Comportements interdits", contenu: (
    <ul>
      <li>Fausse identité, informations trompeuses ou fraude.</li>
      <li>Harcèlement, insultes ou menaces envers un autre utilisateur.</li>
      <li>Tentative d’accès non autorisé à la plateforme ou perturbation de son fonctionnement.</li>
      <li>Contournement de la plateforme pour éviter les frais ou l’abonnement.</li>
    </ul>
  )},
  { id: "responsabilite", titre: "Responsabilité", contenu: (
    <>
      <p>Nous faisons le maximum pour assurer un service fiable, sans pouvoir garantir une disponibilité permanente (coupure réseau, maintenance, cas de force majeure).</p>
      <p>IRAKY Delivery n’est pas responsable des dommages causés par un manquement d’un utilisateur à ses obligations. Sont à ce titre signalés à l’équipe, qui traite chaque litige au cas par cas.</p>
    </>
  )},
  { id: "suspension", titre: "Suspension et suppression", contenu: (
    <p>Nous pouvons suspendre ou supprimer un compte en cas de non-respect de ces conditions, de fraude ou d’abus, après avertissement lorsque la situation le permet. Vous pouvez aussi demander la fermeture de votre compte à tout moment.</p>
  )},
  { id: "pi", titre: "Propriété intellectuelle", contenu: (
    <p>Le nom, le logo, le design et les contenus du portail sont la propriété d’IRAKY Delivery. Toute reproduction sans autorisation est interdite.</p>
  )},
  { id: "droit", titre: "Droit applicable", contenu: (
    <p>Ces conditions sont régies par le droit malgache. En cas de litige, nous cherchons d’abord une solution amiable ; à défaut, les tribunaux compétents de Toliara sont saisis.</p>
  )},
  { id: "contact", titre: "Nous contacter", contenu: (
    <ul>
      <li><strong>E-mail :</strong> <a href="mailto:irakydelivery@gmail.com">irakydelivery@gmail.com</a></li>
      <li><strong>Téléphone :</strong> +261 38 21 266 83</li>
    </ul>
  )},
];

export default function Conditions() {
  return (
    <LegalLayout
      eyebrow="CONDITIONS"
      titre="Conditions d’utilisation"
      intro="Les règles simples qui permettent aux clients et aux coursiers de travailler ensemble en confiance."
      maj="22 octobre 2026"
      sections={sections}
      autre={{ to: "/confidentialite", label: "Lire la politique de confidentialité" }}
    />
  );
}
