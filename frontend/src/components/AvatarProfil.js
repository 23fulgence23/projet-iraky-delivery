import { useRef, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";

const TAILLE = 256;

// Recadre au centre en carré 256x256 et renvoie une data URL JPEG (~20-30 Ko)
function reduireImage(fichier) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier);
    const img = new Image();
    img.onload = () => {
      const cote = Math.min(img.width, img.height);
      const sx = (img.width - cote) / 2;
      const sy = (img.height - cote) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = TAILLE;
      canvas.height = TAILLE;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TAILLE, TAILLE);
      ctx.drawImage(img, sx, sy, cote, cote, 0, 0, TAILLE, TAILLE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible. Essayez un fichier JPG, PNG ou WebP."));
    };
    img.src = url;
  });
}

// Avatar rond simple (photo ou initiales)
export function AvatarRond({ photo, initiales, size = 38, fontSize = 15, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
      background: "linear-gradient(135deg,#FFD700,#ff8c00)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#000", fontWeight: 800, fontSize, ...style,
    }}>
      {photo
        ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initiales}
    </div>
  );
}

// Avatar de la page profil + bouton "Modifier la photo"
export function AvatarProfilEditable({ photo, initiales, apiUrl, onSaved }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const choisir = async (e) => {
    const fichier = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!fichier) return;
    if (!fichier.type.startsWith("image/")) {
      setErreur("Choisissez une image (JPG, PNG ou WebP).");
      return;
    }
    setErreur("");
    setLoading(true);
    try {
      const dataUrl = await reduireImage(fichier);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/profil/photo`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ photo_profil: dataUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Échec de l'envoi de la photo.");
      onSaved(data.photo_profil || dataUrl);
    } catch (err) {
      setErreur(err.message || "Erreur lors de l'envoi de la photo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "0 auto 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
          background: "linear-gradient(135deg,#FFD700,#ff8c00)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, fontWeight: 800, color: "#000", boxShadow: "0 0 30px #FFD70044",
          opacity: loading ? 0.5 : 1 }}>
          {photo
            ? <img src={photo} alt="Photo de profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initiales}
        </div>
        <button type="button" onClick={() => inputRef.current && inputRef.current.click()}
          disabled={loading} aria-label="Modifier la photo de profil"
          style={{ position: "absolute", right: -2, bottom: -2, width: 30, height: 30,
            borderRadius: "50%", border: "2px solid #131330", backgroundColor: "#FFD700",
            color: "#000", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: loading ? "default" : "pointer", padding: 0 }}>
          <MdPhotoCamera style={{ fontSize: 16 }} />
        </button>
      </div>
      <button type="button" onClick={() => inputRef.current && inputRef.current.click()}
        disabled={loading}
        style={{ background: "none", border: "none", color: "#FFD700", fontSize: 12,
          cursor: loading ? "default" : "pointer", textDecoration: "underline", padding: 0 }}>
        {loading ? "Envoi en cours..." : (photo ? "Modifier la photo" : "Ajouter une photo")}
      </button>
      {erreur && <small style={{ color: "#ef4444", fontSize: 11 }}>{erreur}</small>}
      <input ref={inputRef} type="file" accept="image/*" onChange={choisir} style={{ display: "none" }} />
    </div>
  );
}
