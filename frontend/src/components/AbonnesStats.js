import { FiTrendingUp, FiUsers, FiBell, FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useAbonnes from "../hooks/useAbonnes";
import "../Theme.css";
import "../App.css";

const nf = (n) => new Intl.NumberFormat("fr-FR").format(n);

export default function AbonnesStats() {
  const { t } = useTranslation();
  const { stats, abonne, envoi, erreur, sabonner } = useAbonnes();
  const taux = stats ? stats.taux_croissance : null;

  return (
    <section style={{ backgroundColor: "var(--iraky-deep)", padding: "56px 0" }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="iraky-card p-4 p-md-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="iraky-eyebrow mb-3">{t("LA COMMUNAUTÉ IRAKY")}</div>
              <div className="d-flex align-items-end flex-wrap gap-3">
                <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: "clamp(40px, 8vw, 64px)", lineHeight: 1, color: "var(--iraky-ink)" }}>
                  {stats ? nf(stats.total) : "—"}
                </div>
                <div style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: 15, paddingBottom: 8 }}>
                  {t("abonnés")}
                </div>
                {taux !== null && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8,
                    padding: "5px 12px", borderRadius: 999, fontFamily: "var(--f-mono)", fontSize: 12.5, fontWeight: 700,
                    color: "var(--iraky-route)", backgroundColor: "var(--iraky-route-soft)",
                  }}>
                    <FiTrendingUp /> +{nf(taux)} % {t("ce mois-ci")}
                  </span>
                )}
              </div>
              {stats && (
                <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: 13.5, margin: "16px 0 0" }}>
                  <FiUsers style={{ verticalAlign: "-2px", marginRight: 6, color: "var(--iraky-gold)" }} />
                  {nf(stats.utilisateurs)} {t("clients et coursiers")} · {nf(stats.visiteurs)} {t("visiteurs abonnés")} · +{nf(stats.nouveaux_mois)} {t("ce mois-ci")}
                </p>
              )}
            </div>

            <div className="col-lg-5 text-lg-end">
              {abonne ? (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 999,
                  border: "1px solid var(--iraky-gold-line)", color: "var(--iraky-gold)",
                  fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14,
                }}>
                  <FiCheck /> {t("Vous êtes abonné, merci !")}
                </div>
              ) : (
                <>
                  <button className="iraky-btn-gold" onClick={sabonner} disabled={envoi}
                    style={{ padding: "13px 28px", fontSize: 14.5, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <FiBell /> {envoi ? t("Un instant…") : t("S'abonner")}
                  </button>
                  {erreur && (
                    <div style={{ color: "var(--iraky-muted)", fontSize: 12.5, marginTop: 10 }}>
                      {t("Impossible pour le moment, réessayez dans un instant.")}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
