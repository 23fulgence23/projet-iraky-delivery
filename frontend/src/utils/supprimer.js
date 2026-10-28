import Swal from "sweetalert2";
import i18n from "../i18n";

const t = (k, o) => i18n.t(k, o);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const base = () => ({
  background: "var(--d-card)",
  color: "var(--d-text)",
  customClass: { popup: "swal-iraky" },
});

// Fenetre de succes unique (creation, modification, suppression). Jamais d'identifiant.
export function notifierSucces(texte, titre) {
  return Swal.fire({
    ...base(), icon: "success", title: titre || t("Succès"),
    text: texte, timer: 1800, showConfirmButton: false,
  });
}

// Confirmation -> action -> succes (ou erreur). L'identifiant n'est jamais affiche.
export default async function supprimer({ nom, libelle, action, texteSucces }) {
  const objet = nom ? "<b>" + esc(nom) + "</b>" : (libelle || t("cet élément"));
  const { isConfirmed } = await Swal.fire({
    ...base(),
    icon: "warning",
    title: t("Confirmer la suppression"),
    html: t("Voulez-vous vraiment supprimer {{objet}} ?", { objet, interpolation: { escapeValue: false } }) +
      "<br/>" + t("Cette action est définitive."),
    showCancelButton: true,
    confirmButtonText: t("Oui, supprimer"),
    cancelButtonText: t("Annuler"),
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    reverseButtons: true,
    focusCancel: true,
  });
  if (!isConfirmed) return false;

  try {
    await action();
  } catch (e) {
    await Swal.fire({
      ...base(), icon: "error", title: t("Erreur"),
      text: (e && e.message) || t("La suppression a échoué."),
      confirmButtonColor: "#FFD700",
    });
    return false;
  }

  await notifierSucces(texteSucces || t("Supprimé avec succès."), t("Supprimé"));
  return true;
}

// Suppression d'une notification : meme code pour admin, coursier et client
export function supprimerNotification({ id, url, headers, onSuccess }) {
  return supprimer({
    libelle: t("cette notification"),
    texteSucces: t("Notification supprimée avec succès."),
    action: async () => {
      const r = await fetch(url + "/" + id, { method: "DELETE", headers });
      if (!r.ok) throw new Error(t("La suppression a échoué."));
      if (onSuccess) onSuccess();
    },
  });
}

// Suppression groupee : selection ou tout. Un seul dialogue, un seul succes.
// action() doit renvoyer { ok, echecs } ou lever une erreur.
export async function supprimerPlusieurs({ n, tout, libelle, action, onSuccess }) {
  const message = tout
    ? t("Voulez-vous vraiment supprimer tout : {{libelle}} ({{n}}) ?", { libelle, n })
    : t("Voulez-vous vraiment supprimer la sélection ({{n}}) : {{libelle}} ?", { libelle, n });
  const { isConfirmed } = await Swal.fire({
    ...base(),
    icon: "warning",
    title: t("Confirmer la suppression"),
    html: esc(message) + "<br/>" + t("Cette action est définitive."),
    showCancelButton: true,
    confirmButtonText: tout ? t("Oui, tout supprimer") : t("Oui, supprimer"),
    cancelButtonText: t("Annuler"),
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    reverseButtons: true,
    focusCancel: true,
  });
  if (!isConfirmed) return false;

  let res;
  try {
    res = await action();
  } catch (e) {
    await Swal.fire({
      ...base(), icon: "error", title: t("Erreur"),
      text: (e && e.message) || t("La suppression a échoué."),
      confirmButtonColor: "#FFD700",
    });
    return false;
  }
  const ok = res && typeof res.ok === "number" ? res.ok : n;
  const echecs = res && res.echecs ? res.echecs : 0;
  if (onSuccess) onSuccess();

  if (echecs > 0) {
    await Swal.fire({
      ...base(), icon: "warning", title: t("Suppression partielle"),
      text: t("{{ok}} supprimé(s), {{echecs}} échec(s).", { ok, echecs }),
      confirmButtonColor: "#FFD700",
    });
  } else {
    await notifierSucces(t("{{n}} élément(s) supprimé(s) avec succès.", { n: ok }), t("Supprimé"));
  }
  return true;
}

// Plusieurs appels de suppression simple (clients, commandes...) : regles du serveur conservees
export async function supprimerParLots(ids, appel) {
  const r = await Promise.allSettled(ids.map((id) => appel(id)));
  const ok = r.filter((x) => x.status === "fulfilled" && x.value === true).length;
  return { ok, echecs: ids.length - ok };
}

// Notifications : meme code pour le coursier et le client
export function supprimerNotificationsGroupe({ ids, tout, nb, url, headers, onSuccess }) {
  return supprimerPlusieurs({
    n: nb, tout, libelle: t("notifications"), onSuccess,
    action: async () => {
      const r = await fetch(url + (tout ? "/supprimer-tout" : "/supprimer-selection"), {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(tout ? {} : { ids }),
      });
      if (!r.ok) throw new Error(t("La suppression a échoué."));
      return { ok: nb, echecs: 0 };
    },
  });
}
