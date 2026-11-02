// Fusionne la liste recue du serveur avec les messages en cours d'envoi de CETTE conversation :
// le message provisoire ne disparait pas pendant l'envoi et n'est jamais en double.
export function fusionnerEnvois(precedent, recus, commandeId) {
  if (!Array.isArray(recus)) return recus;
  const avant = Array.isArray(precedent) ? precedent : [];
  const restants = avant.filter((m) => m && m._sending && String(m._cmd) === String(commandeId));
  if (restants.length === 0) return recus;
  const connus = new Set(avant.map((m) => String(m.id)));
  recus.filter((m) => !connus.has(String(m.id))).forEach((m) => {
    const i = restants.findIndex((t) => t.texte === m.texte && String(t.sender_id) === String(m.sender_id));
    if (i >= 0) restants.splice(i, 1);
  });
  return restants.length ? [...recus, ...restants] : recus;
}
