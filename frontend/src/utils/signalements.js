export const MOTIFS = [
  { code: "retard", label: "Retard" },
  { code: "injoignable", label: "Personne injoignable" },
  { code: "comportement", label: "Comportement inapproprié" },
  { code: "non_conforme", label: "Service non conforme" },
  { code: "paiement", label: "Problème de paiement ou de tarif" },
  { code: "autre", label: "Autre problème" },
];

export const STATUTS = {
  nouveau:  { label: "Nouveau",  color: "#ef4444" },
  en_cours: { label: "En cours", color: "#f59e0b" },
  resolu:   { label: "Résolu",   color: "#10b981" },
  rejete:   { label: "Rejeté",   color: "#888888" },
};

export const libelleMotif = (code) => (MOTIFS.find((m) => m.code === code) || { label: code }).label;
