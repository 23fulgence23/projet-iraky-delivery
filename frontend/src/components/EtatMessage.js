import { MdCheck, MdDoneAll } from "react-icons/md";
import { useTranslation } from "react-i18next";

// Etat d'un message envoye : rond qui tourne (envoi), coche (envoye), double coche (vu)
export default function EtatMessage({ m }) {
  const { t } = useTranslation();
  if (!m) return null;
  if (m._sending) return <span className="msg-envoi" role="status" aria-label={t("Envoi en cours...")} />;
  if (m.vu === true) return <MdDoneAll title={t("Vu")} style={{ fontSize: 16, color: "#38bdf8", flexShrink: 0 }} />;
  return <MdCheck title={t("Envoyé")} style={{ fontSize: 16, color: "#9ca3af", flexShrink: 0 }} />;
}
