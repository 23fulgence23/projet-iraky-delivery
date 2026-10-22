import { useTranslation } from "react-i18next";
import LegalLayout from "../../components/LegalLayout";
import { rich } from "../../components/legalRich";

export default function Conditions() {
  const { t } = useTranslation();
  const P = (k) => <p>{rich(t(k))}</p>;
  const L = (keys) => <ul>{keys.map((k) => <li key={k}>{rich(t(k))}</li>)}</ul>;
  const mail = <a href="mailto:irakydelivery@gmail.com">irakydelivery@gmail.com</a>;

  const sections = [
    { id: "objet", titre: t("Objet"), contenu:
      P("Ces conditions encadrent l'utilisation du portail et des espaces **client**, **coursier** et **administrateur** d'IRAKY Delivery. En créant un compte ou en utilisant le service, vous les acceptez.") },
    { id: "compte", titre: t("Compte utilisateur"), contenu: L([
      "Les informations fournies à l'inscription doivent être exactes et à jour.",
      "Vous êtes responsable de la confidentialité de votre mot de passe et de l'activité de votre compte.",
      "Un compte est personnel : il ne peut être ni prêté ni revendu.",
    ]) },
    { id: "service", titre: t("Le service"), contenu: (<>
      {P("IRAKY Delivery met en relation des clients et des coursiers indépendants pour des services tels que : paiement de factures (JIRAMA), légalisation de CIN, démarches bancaires ou au Trésor, achats, livraison de colis et mentorat universitaire.")}
      {P("IRAKY Delivery est un **intermédiaire** : la mission est réalisée par le coursier qui l'accepte.")}
    </>) },
    { id: "commandes", titre: t("Commandes et paiement"), contenu: L([
      "Le tarif est affiché en ariary (Ar) avant la validation de la commande.",
      "Une commande peut être suivie en temps réel depuis votre espace client.",
      "Les modalités de paiement vous sont indiquées au moment de la commande.",
      "Une commande déjà prise en charge peut ne plus être annulable ou donner lieu à des frais ; contactez-nous en cas de problème.",
    ]) },
    { id: "clients", titre: t("Obligations des clients"), contenu: L([
      "Décrire précisément la mission et fournir des adresses exactes.",
      "Être joignable pendant la mission.",
      "Ne pas demander de service illégal ou dangereux.",
      "Traiter les coursiers avec respect.",
    ]) },
    { id: "coursiers", titre: t("Obligations des coursiers"), contenu: L([
      "Fournir un profil véridique et le maintenir à jour.",
      "Régler l'abonnement requis pour accéder aux missions ; un abonnement impayé peut limiter l'accès à l'espace coursier.",
      "Réaliser les missions acceptées avec soin, dans les délais annoncés.",
      "Ne jamais détourner d'argent, de documents ou de colis confiés.",
      "Respecter la réglementation en vigueur, notamment en matière de circulation.",
    ]) },
    { id: "interdits", titre: t("Comportements interdits"), contenu: L([
      "Fausse identité, informations trompeuses ou fraude.",
      "Harcèlement, insultes ou menaces envers un autre utilisateur.",
      "Tentative d'accès non autorisé à la plateforme ou perturbation de son fonctionnement.",
      "Contournement de la plateforme pour éviter les frais ou l'abonnement.",
    ]) },
    { id: "responsabilite", titre: t("Responsabilité"), contenu: (<>
      {P("Nous faisons le maximum pour assurer un service fiable, sans pouvoir garantir une disponibilité permanente (coupure réseau, maintenance, cas de force majeure).")}
      {P("IRAKY Delivery n'est pas responsable des dommages causés par un manquement d'un utilisateur à ses obligations. Tout litige peut être signalé à l'équipe, qui le traite au cas par cas.")}
    </>) },
    { id: "suspension", titre: t("Suspension et suppression"), contenu:
      P("Nous pouvons suspendre ou supprimer un compte en cas de non-respect de ces conditions, de fraude ou d'abus, après avertissement lorsque la situation le permet. Vous pouvez aussi demander la fermeture de votre compte à tout moment.") },
    { id: "pi", titre: t("Propriété intellectuelle"), contenu:
      P("Le nom, le logo, le design et les contenus du portail sont la propriété d'IRAKY Delivery. Toute reproduction sans autorisation est interdite.") },
    { id: "droit", titre: t("Droit applicable"), contenu:
      P("Ces conditions sont régies par le droit malgache. En cas de litige, nous cherchons d'abord une solution amiable ; à défaut, les tribunaux compétents de Toliara sont saisis.") },
    { id: "contact", titre: t("Nous contacter"), contenu: (
      <ul>
        <li><strong>{t("E-mail :")}</strong> {mail}</li>
        <li><strong>{t("Téléphone :")}</strong> +261 38 21 266 83</li>
      </ul>
    ) },
  ];

  return (
    <LegalLayout
      eyebrow={t("CONDITIONS")}
      titre={t("Conditions d'utilisation")}
      intro={t("Les règles simples qui permettent aux clients et aux coursiers de travailler ensemble en confiance.")}
      maj={t("22 octobre 2026")}
      sections={sections}
      autre={{ to: "/confidentialite", label: t("Lire la politique de confidentialité") }}
    />
  );
}
