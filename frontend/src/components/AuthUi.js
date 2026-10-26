import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdVisibility, MdVisibilityOff, MdErrorOutline, MdArrowBack } from "react-icons/md";
import logo from "../logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import "../pages/auth/Auth.css";

// Retire les emojis d'un texte (les anciennes traductions en contiennent)
export const sans = (txt) =>
  String(txt).replace(/\p{Extended_Pictographic}\uFE0F?/gu, "").replace(/\s{2,}/g, " ").trim();

export function AuthShell({ children, maxWidth = 450 }) {
  const { t } = useTranslation();
  return (
    <div className="au-page">
      <div className="au-bg" aria-hidden="true">
        <span className="au-blob b1" /><span className="au-blob b2" /><span className="au-blob b3" />
        <span className="au-grid" />
      </div>
      <Link to="/" className="au-back"><MdArrowBack /> {t("Retour au portail")}</Link>
      <div className="au-top"><ThemeToggle size={38} /><LanguageSwitcher /></div>
      <div className="au-card" style={{ maxWidth }}>{children}</div>
    </div>
  );
}

export function AuthHead({ titre, sousTitre }) {
  return (
    <div className="au-head">
      <img src={logo} alt="IRAKY" className="au-logo" />
      <h1 className="au-title">{titre}</h1>
      <p className="au-sub">{sousTitre}</p>
    </div>
  );
}

export function Champ({ label, required, Icon, error, password, children, ...rest }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  return (
    <div className="au-field">
      {label && <label className="au-label">{label}{required && <span className="au-req">*</span>}</label>}
      {children ? children : (
        <div className="au-input-wrap">
          {Icon && <span className="au-ico"><Icon /></span>}
          <input {...rest}
            type={password ? (show ? "text" : "password") : (rest.type || "text")}
            className={"au-input" + (error ? " err" : "") + (Icon ? "" : " noicon")}
            style={password ? { paddingRight: 46 } : undefined} />
          {password && (
            <button type="button" className="au-eye" onClick={() => setShow((s) => !s)}
              aria-label={show ? t("Masquer le mot de passe") : t("Afficher le mot de passe")}>
              {show ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          )}
        </div>
      )}
      {error && <div className="au-err"><MdErrorOutline /> {t(error)}</div>}
    </div>
  );
}
