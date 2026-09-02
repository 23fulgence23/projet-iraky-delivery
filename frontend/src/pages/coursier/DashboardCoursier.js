import { useState, useEffect, useRef  } from "react";
import Swal from "sweetalert2";
import logo from "../../images/logo.png";
import EtoilesAvecTrophees from "../../pages/etoiles/EtoilesAvecTrophees";
import {
  MdDashboard, MdLocationOn, MdListAlt, MdPerson, MdHelp,
  MdLogout, MdNotifications, MdDeliveryDining, MdCheckCircle,
  MdChat, MdSend, MdBarChart, MdAccessTime, MdAttachMoney,
  MdLocalShipping, MdCampaign, MdThumbUp, MdClose,
  MdDirectionsBike, MdStar, MdStarBorder, MdWork,
  MdPhone, MdEmail, MdBadge, MdVerified,MdDoneAll,
  MdDelete, MdArrowBack, MdSupportAgent, MdInfo, MdMenuBook, MdExpandMore,
} from "react-icons/md";

// ══════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════
const MOCK_PUBLICATIONS = [
  {
    id: 1, service: "Facture JIRAMA", moyen: "Moto", tarif: 8000,
    statut: "en_attente", heure_publication: "08:15",
    heure_debut: "08:30", heure_livraison: "09:15",
    detail: "Payer facture JIRAMA Tsararano, montant environ 45 000 Ar",
    adresse_pickup: "Rue de l'Église, Toliara centre",
    date: "2026-06-04", client: "Tony R.", client_id: 1,
    color: "#f59e0b",
  },
  {
    id: 2, service: "Banque BFV", moyen: "Voiture", tarif: 12000,
    statut: "en_attente", heure_publication: "09:45",
    heure_debut: "10:00", heure_livraison: "11:00",
    detail: "Retrait BNI Toliara centre, montant 200 000 Ar",
    adresse_pickup: "Avenue Gallieni, Toliara",
    date: "2026-06-04", client: "Marie S.", client_id: 2,
    color: "#3b82f6",
  },
  {
    id: 3, service: "Achat SACMA", moyen: "Piéton", tarif: 5000,
    statut: "en_attente", heure_publication: "11:00",
    heure_debut: "11:30", heure_livraison: "12:30",
    detail: "Acheter riz 10kg + huile 2L + savon",
    adresse_pickup: "Quartier Mahavatse, Toliara",
    date: "2026-06-04", client: "Jean P.", client_id: 3,
    color: "#10b981",
  },
  {
    id: 4, service: "Légalisation CIN", moyen: "Moto", tarif: 8000,
    statut: "en_attente", heure_publication: "13:00",
    heure_debut: "13:30", heure_livraison: "15:00",
    detail: "Légaliser CIN à la commune, 3 exemplaires",
    adresse_pickup: "Rue Docteur Berge, Toliara",
    date: "2026-06-04", client: "Hery M.", client_id: 4,
    color: "#06b6d4",
  },
];

const MOCK_MESSAGES = [
  { id: 1, from: "client",   texte: "Bonjour, êtes-vous disponible ?",      time: "08:20" },
  { id: 2, from: "coursier", texte: "Oui, je suis disponible !",            time: "08:21" },
  { id: 3, from: "client",   texte: "Parfait, pouvez-vous partir à 08h30 ?", time: "08:22" },
];

const STATUT_CONFIG = {
  en_attente: { label: "En attente",     color: "#f59e0b", bg: "#f59e0b18", icon: <MdAccessTime/> },
  negociable: { label: "En négociation", color: "#3b82f6", bg: "#3b82f618", icon: <MdChat/> },
  accepte:    { label: "Accepté",        color: "#10b981", bg: "#10b98118", icon: <MdCheckCircle/> },
  refuse:     { label: "Refusé",         color: "#ef4444", bg: "#ef444418", icon: <MdClose/> },
  termine:    { label: "Terminé",        color: "#8b5cf6", bg: "#8b5cf618", icon: <MdStar/> },
};

const BASE_URL = "http://localhost:8000";

// ══════════════════════════════════════════════
//  ÉTOILES
// ══════════════════════════════════════════════
function Etoiles({ value }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        i <= value
          ? <MdStar     key={i} style={{ color: "#FFD700", fontSize: 18 }}/>
          : <MdStarBorder key={i} style={{ color: "#444",   fontSize: 18 }}/>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
//  BADGE STATUT
// ══════════════════════════════════════════════
function StatutBadge({ statut }) {
  const s = STATUT_CONFIG[statut];
  if (!s) return null;
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color,
      borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700,
      border: `1px solid ${s.color}44`,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      {s.icon} {s.label}
    </span>
  );
}

// ══════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════
function Modal({ children, onClose, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 400,
      backgroundColor: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: "#131330", borderRadius: 20, padding: 28,
        width: "100%", maxWidth: size === "lg" ? 640 : 480,
        border: "1px solid #FFD70030", boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        animation: "modalIn 0.25s ease", maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          float: "right", background: "transparent", border: "none",
          color: "#666", fontSize: 22, cursor: "pointer",
        }}
          onMouseEnter={e => e.target.style.color = "#fff"}
          onMouseLeave={e => e.target.style.color = "#666"}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════
function SidebarContent({ onglet, setOnglet, profil, missions }) {
  let missionsMasques = [];
  try {
    const brutM = localStorage.getItem("coursier_missions_masques");
    missionsMasques = brutM ? JSON.parse(brutM) : [];
  } catch {}

  let messagesMasquesCoursier = [];
  try {
    const brutMsg = localStorage.getItem("coursier_messages_masques");
    messagesMasquesCoursier = brutMsg ? JSON.parse(brutMsg) : [];
  } catch {}

  const items = [
    { id: "accueil",      Icon: MdDashboard,      label: "Tableau de bord"      },
    { id: "missions",     Icon: MdDeliveryDining, label: "Missions disponibles" },
    { id: "mes_missions", Icon: MdWork,           label: "Mes missions"         },
    { id: "messages",     Icon: MdChat,           label: "Messages"             },
    { id: "profil",       Icon: MdPerson,         label: "Mon profil"           },
    { id: "aide",         Icon: MdHelp,           label: "Aide & Support"       },
  ];
  const enCours = missions.filter(m => ["negociable","accepte"].includes(m.statut) && !missionsMasques.includes(m.id)).length;
  // ✅ nbMessages DANS le composant
  const nbMessages = missions.filter(m => m.statut !== "en_attente" && !messagesMasquesCoursier.includes(m.id)).length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #FFD70018", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "linear-gradient(135deg,#FFD700,#ff8c00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#000", fontSize: 17,
            boxShadow: "0 0 14px #FFD70044",
          }}>
            {profil.prenom?.[0]}{profil.nom?.[0]}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{profil.prenom} {profil.nom}</div>
            <div style={{ color: "#FFD700", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <MdDeliveryDining style={{ fontSize: 13 }}/> Coursier IRAKY
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, paddingTop: 4 }}>
        {items.map(item => (
          <div key={item.id} onClick={() => setOnglet(item.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 20px", cursor: "pointer", fontSize: 13.5,
              backgroundColor: onglet === item.id ? "#FFD70012" : "transparent",
              borderLeft: onglet === item.id ? "3px solid #FFD700" : "3px solid transparent",
              color: onglet === item.id ? "#FFD700" : "#8888aa",
              transition: "all 0.18s", borderRadius: "0 10px 10px 0", marginRight: 8,
            }}
            onMouseEnter={e => { if (onglet !== item.id) { e.currentTarget.style.backgroundColor = "#ffffff08"; e.currentTarget.style.color = "#fff"; }}}
            onMouseLeave={e => { if (onglet !== item.id) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8888aa"; }}}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <item.Icon style={{ fontSize: 18 }}/> {item.label}
            </span>
            {item.id === "mes_missions" && enCours > 0 && (
              <span style={{ background: "#f59e0b", color: "#000", borderRadius: 12,
                padding: "1px 8px", fontSize: 11, fontWeight: 800 }}>{enCours}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <button onClick={() => {
            const CLES_A_GARDER = ["coursier_missions_masques", "coursier_messages_masques"];
            const sauvegarde = {};
            CLES_A_GARDER.forEach(cle => { const v = localStorage.getItem(cle); if (v) sauvegarde[cle] = v; });
            localStorage.clear();
            Object.entries(sauvegarde).forEach(([cle, v]) => localStorage.setItem(cle, v));
            window.location.href = "/connexion";
          }}
          style={{
            width: "100%", padding: "10px", borderRadius: 12,
            border: "1px solid #ef444430", backgroundColor: "#ef444410",
            color: "#ef6666", cursor: "pointer", fontWeight: 700, fontSize: 13,
            transition: "all 0.2s", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ef444425"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ef444410"}>
          <MdLogout style={{ fontSize: 18 }}/> Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════
function DashboardCoursier() {
  const [onglet, setOnglet]             = useState("accueil");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [toast, setToast]               = useState(null);
 const [publications, setPublications] = useState([]);
  const [missions, setMissions]         = useState([]);
  const [chatModal, setChatModal]       = useState(null);
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg]             = useState("");
  const [detailModal, setDetailModal]   = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [selectedMsgs, setSelectedMsgs] = useState(new Set());
  const [modeSelection, setModeSelection] = useState(false);
  const [profil, setProfil] = useState({
    id: null,
    nom: "", prenom: "", email: "", telephone: "",
    adresse: "", cin: "",
    photo_recto: null,
    photo_verso: null,
    note: 0, nb_missions: 0, nb_terminees: 0,
  });
  const [profilLoading, setProfilLoading] = useState(true);

  // ── Aide & Support (identique au dashboard client, contenu adapté coursier) ──
  const [aideVue, setAideVue]                 = useState("menu"); // menu | chat | guide
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportMsg, setSupportMsg]           = useState("");
  const [supportLoading, setSupportLoading]   = useState(false);
  const [supportEnvoi, setSupportEnvoi]       = useState(false);
  const [supportTyping, setSupportTyping]     = useState(false);
  const supportEndRef                         = useRef(null);
  const [guideOuvert, setGuideOuvert]         = useState(0);

  const chargerSupportMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/support/messages`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      const data = await res.json();
      if (Array.isArray(data)) setSupportMessages(data);
    } catch (err) {
      console.error("Erreur chargement support :", err);
    } finally {
      setSupportLoading(false);
    }
  };

  useEffect(() => {
    if (aideVue !== "chat") return;
    setSupportLoading(true);
    chargerSupportMessages();
    const interval = setInterval(chargerSupportMessages, 3000);
    return () => clearInterval(interval);
  }, [aideVue]);

  useEffect(() => {
    if (aideVue === "chat") supportEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [supportMessages, aideVue]);

  const envoyerSupportMsg = async () => {
    if (!supportMsg.trim() || supportEnvoi) return;
    const texte = supportMsg.trim();
    const msgTemp = {
      id: `tmp-${Date.now()}`,
      texte,
      sender_role: "client", // même colonne backend, générique à tout utilisateur connecté
      created_at: new Date().toISOString(),
      envoi: true,
    };
    setSupportMessages(prev => [...prev, msgTemp]);
    setSupportMsg("");
    setSupportEnvoi(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/support/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ texte }),
      });
      const data = await res.json();
      if (res.ok) {
        setSupportMessages(prev => prev.map(m => m.id === msgTemp.id ? { ...data.message, envoi:false } : m));
        if (data.bot) {
          setSupportTyping(true);
          setTimeout(() => {
            setSupportTyping(false);
            setSupportMessages(prev => [...prev, { ...data.bot, bot:true }]);
          }, 900);
        }
      } else {
        setSupportMessages(prev => prev.map(m => m.id === msgTemp.id ? { ...m, echec:true, envoi:false } : m));
      }
    } catch (err) {
      setSupportMessages(prev => prev.map(m => m.id === msgTemp.id ? { ...m, echec:true, envoi:false } : m));
      console.error("Erreur envoi support :", err);
    } finally {
      setSupportEnvoi(false);
    }
  };

  // ══════ Guide interactif — contenu aligné sur les fonctionnalités réelles de l'espace coursier ══════
  const GUIDE_SECTIONS_COURSIER = [
    {
      Icon: MdDeliveryDining, color:"#FFD700",
      titre: "Trouver une mission disponible",
      texte: "L'onglet « Missions disponibles » liste toutes les commandes publiées par les clients, en attente d'un coursier. Consultez le détail (service, tarif, adresse, horaires) puis cliquez sur « Je prends cette mission » pour la réserver.",
    },
    {
      Icon: MdWork, color:"#3b82f6",
      titre: "Suivre mes missions",
      texte: "« Mes missions » regroupe toutes les missions que vous avez prises, avec leur progression (négociation, accepté, terminé). Discutez avec le client, validez l'accord de service, puis la mission passe automatiquement à « Terminé » une fois le client satisfait.",
    },
    {
      Icon: MdChat, color:"#8b5cf6",
      titre: "Messagerie avec les clients",
      texte: "Dès qu'une mission est prise, une conversation s'ouvre dans « Messages ». Vous pouvez échanger les détails du service et retirer une conversation de votre liste si besoin — le retrait est définitif et lié à votre compte, même après déconnexion.",
    },
    {
      Icon: MdStar, color:"#f59e0b",
      titre: "Notes, trophées et statistiques",
      texte: "Chaque mission terminée est notée par le client (1 à 5 étoiles). Vos notes s'accumulent en trophées, visibles dans « Mon profil », aux côtés de votre nombre total de missions effectuées et de votre note moyenne.",
    },
    {
      Icon: MdAttachMoney, color:"#10b981",
      titre: "Droit d'entrée et abonnement",
      texte: "L'accès à la plateforme nécessite un droit d'entrée unique de 10 000 Ar, puis un abonnement mensuel de 10 000 Ar pour continuer à recevoir des offres. Sans renouvellement, votre compte est automatiquement désactivé.",
    },
    {
      Icon: MdPerson, color:"#ef4444",
      titre: "Mon profil",
      texte: "Consultez et gérez vos informations personnelles (nom, téléphone, email, CIN) depuis l'onglet « Profil ». Vous y retrouvez aussi vos statistiques : nombre de missions, note moyenne, trophées.",
    },
  ];

  // ✅ CORRECTION PRINCIPALE : fetch profil corrigé
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/connexion";
      return;
    }

    fetch(`${BASE_URL}/api/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    })
      .then(async res => {
        // ✅ Gestion 401 correcte — on ne continue pas avec res.json()
        if (res.status === 401) {
          const CLES_A_GARDER = ["coursier_missions_masques", "coursier_messages_masques"];
          const sauvegarde = {};
          CLES_A_GARDER.forEach(cle => { const v = localStorage.getItem(cle); if (v) sauvegarde[cle] = v; });
          localStorage.clear();
          Object.entries(sauvegarde).forEach(([cle, v]) => localStorage.setItem(cle, v));
          window.location.href = "/connexion";
          return null; // ✅ stoppe la chaîne
        }
        return res.json();
      })
      .then(data => {
        if (!data) return; // ✅ si null (cas 401), on sort

        console.log("Profil reçu :", data); // ✅ debug — vérifiez dans la console

        setProfil({
          id:           data.id            || null,
          nom:          data.nom          || "",
          prenom:       data.prenom       || "",
          email:        data.email        || "",
          telephone:    data.telephone    || "",
          adresse:      data.adresse      || "",
          cin:          data.cin          || "",
          // ✅ photo_recto et photo_verso uniquement — plus photo_identite
          photo_recto:  data.photo_recto  || null,
          photo_verso:  data.photo_verso  || null,
          note:         data.note         || 0,
          nb_missions:  data.nb_missions  || 0,
          nb_terminees: data.nb_terminees || 0,
          trophees:          data.trophees          || 0,
          etoiles_actuelles: data.etoiles_actuelles  || 0,
        });
        setProfilLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement profil :", err);
        setProfilLoading(false);
      });
  }, []);

// ── Polling global toutes les 2s ─────────────────
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchAll = () => {
    // Notifications
    fetch(`${BASE_URL}/api/notifications`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setNotifs(data);
    }).catch(() => {});

    // Publications disponibles
    fetch(`${BASE_URL}/api/commandes/disponibles`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      setPublications(data.map(c => ({
        ...c,
        client: c.client ? `${c.client.prenom} ${c.client.nom[0]}.` : "Client",
        color: "#f59e0b",
      })));
    }).catch(() => {});

    // Mes missions
    fetch(`${BASE_URL}/api/commandes/mes-missions`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      setMissions(data.map(c => ({
        ...c,
        client: c.client ? `${c.client.prenom} ${c.client.nom[0]}.` : "Client",
      })));
    }).catch(() => {});
  };

  fetchAll();
  const interval = setInterval(fetchAll, 5000);
  return () => clearInterval(interval);
}, []);

// ── Polling messages chat toutes les 2s ──────────
useEffect(() => {
  if (!chatModal) return;
  const token = localStorage.getItem("token");

  const fetchMessages = () => {
    fetch(`${BASE_URL}/api/commandes/${chatModal.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setMessages(data);
    }).catch(() => {});
  };

  fetchMessages();
  const interval = setInterval(fetchMessages, 2000);
  return () => clearInterval(interval);
}, [chatModal]);

  const nbNonLus = notifs.filter(n => !n.lu).length;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Masquage LOCAL de "Mes missions" (coursier uniquement — la
  // mission reste intacte en base pour que l'admin garde tout l'historique) ──
  const [missionsMasques, setMissionsMasques] = useState(() => {
    try {
      const brut = localStorage.getItem("coursier_missions_masques");
      return brut ? JSON.parse(brut) : [];
    } catch { return []; }
  });

  const demanderRetraitMission = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Retirer de mes missions",
      html: `Voulez-vous vraiment retirer cette mission de votre liste ?<br/><br/>
        <span style="color:#ef4444;font-weight:700;">Cette action est définitive</span> :
        elle ne réapparaîtra plus jamais sur cet écran, même après une reconnexion.<br/>
        Elle restera toutefois visible et suivie normalement côté administration.`,
      background: "#131330",
      color: "#fff",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonText: "Retirer définitivement",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#333355",
      reverseButtons: true,
      customClass: { popup: "swal-iraky" },
    }).then((result) => {
      if (result.isConfirmed) {
        setMissionsMasques(prev => {
          const next = [...prev, id];
          try { localStorage.setItem("coursier_missions_masques", JSON.stringify(next)); } catch {}
          return next;
        });
        showToast("Retirée définitivement de vos missions");
      }
    });
  };

  // ── Masquage LOCAL de "Messages" (coursier) ──────
  const [messagesMasquesCoursier, setMessagesMasquesCoursier] = useState(() => {
    try {
      const brut = localStorage.getItem("coursier_messages_masques");
      return brut ? JSON.parse(brut) : [];
    } catch { return []; }
  });

  const demanderRetraitMessageCoursier = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Retirer cette conversation",
      html: `Voulez-vous vraiment retirer cette conversation de votre liste de messages ?<br/><br/>
        <span style="color:#ef4444;font-weight:700;">Cette action est définitive</span> :
        elle ne réapparaîtra plus jamais sur cet écran, même après une reconnexion.<br/>
        Elle restera toutefois visible et suivie normalement côté administration.`,
      background: "#131330",
      color: "#fff",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonText: "Retirer définitivement",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#333355",
      reverseButtons: true,
      customClass: { popup: "swal-iraky" },
    }).then((result) => {
      if (result.isConfirmed) {
        setMessagesMasquesCoursier(prev => {
          const next = [...prev, id];
          try { localStorage.setItem("coursier_messages_masques", JSON.stringify(next)); } catch {}
          return next;
        });
        showToast("Conversation retirée définitivement");
      }
    });
  };

const prendreMission = async (pub) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/api/commandes/${pub.id}/prendre`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      const mission = { ...pub, statut: "negociable", client: pub.client };
      setMissions(prev => [mission, ...prev]);
      setPublications(prev => prev.filter(p => p.id !== pub.id));
      setNotifs(prev => [{
        id: Date.now(),
        texte: `Vous avez pris la mission : ${pub.service} — En négociation`,
        lu: false, time: "À l'instant",
      }, ...prev]);
      showToast(`Mission "${pub.service}" prise !`);
      setOnglet("mes_missions");
    } else {
      showToast(data.message || "Erreur", "error");
    }
  } catch {
    showToast("Erreur de connexion", "error");
  }
};


// ✅ Référence pour scroll automatique
const messagesEndRef = useRef(null);

// ✅ Charger les messages quand on ouvre le chat
const ouvrirChat = async (mission) => {
  setChatModal(mission);
  setMessages([]);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/commandes/${mission.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    });
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
  } catch (err) {
    console.error("Erreur chargement messages :", err);
  }
};

// ✅ Envoyer message via API
const envoyerMessage = async () => {
  if (!newMsg.trim() || !chatModal) return;

  // ✅ Affichage immédiat
  const msgTemp = {
    id:          `temp_${Date.now()}`,
    texte:       newMsg,
    sender_id:   profil.id,
    sender_role: "coursier",
    modifie:     false,
    lu:          false,
    time:        new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"}),
    created_at:  new Date().toISOString(),
    _sending:    true,
  };
  setMessages(prev => [...prev, msgTemp]);
  const texteEnvoi = newMsg;
  setNewMsg("");  // ✅ Vide immédiatement

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${BASE_URL}/api/commandes/${chatModal.id}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texte: texteEnvoi }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      // ✅ Remplace le temporaire
      setMessages(prev => prev.map(m =>
        m.id === msgTemp.id
          ? { ...data.message, sender_id: profil.id }
          : m
      ));
    } else {
      setMessages(prev => prev.filter(m => m.id !== msgTemp.id));
      showToast(data.message || "Erreur envoi", "error");
    }
  } catch {
    setMessages(prev => prev.filter(m => m.id !== msgTemp.id));
    showToast("Erreur de connexion", "error");
  }
};

// ✅ Changer statut accord (accepte/refuse)

const changerStatutAccord = async (commandeId, nouveauStatut) => {
  try {
    const token = localStorage.getItem("token");
    const endpoint = nouveauStatut === "accepte"
      ? `${BASE_URL}/api/commandes/${commandeId}/accepter-coursier`  // ✅ CORRECT
      : `${BASE_URL}/api/commandes/${commandeId}/refuser`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      setMissions(prev => prev.map(m =>
        m.id === commandeId
          ? { ...m, statut: data.commande?.statut || nouveauStatut,
              accord_coursier: true }
          : m
      ));
      setChatModal(prev => ({
        ...prev,
        statut: data.commande?.statut || nouveauStatut,
        accord_coursier: true,
      }));
      showToast(
        nouveauStatut === "accepte"
          ? "✅ Accord accepté — client notifié !"
          : "❌ Mission refusée — client notifié",
        nouveauStatut === "accepte" ? "success" : "error"
      );
    } else {
      // ✅ Affiche le message d'erreur Laravel (ex: "Le client doit accepter en premier")
      showToast(data.message || "Erreur", "error");
    }
  } catch {
    showToast("Erreur de connexion", "error");
  }
};
  const card = { backgroundColor: "#131330", borderRadius: 18, border: "1px solid #FFD70018", padding: 24, transition: "all 0.3s ease" };
  const inp  = { backgroundColor: "#0a0a1e", border: "1px solid #FFD70030", color: "#fff", borderRadius: 12, padding: "11px 16px", width: "100%", fontSize: 14, outline: "none" };
  const btnY = { background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000", border: "none", borderRadius: 25, padding: "11px 28px", fontWeight: 800, cursor: "pointer", fontSize: 15, transition: "all 0.2s", boxShadow: "0 4px 20px #FFD70033" };

  // ✅ Composant photo CIN réutilisable
  const PhotoCIN = ({ chemin, label, couleur }) => (
    <div style={{ backgroundColor: "#0a0a1e", borderRadius: 14,
      border: `1px solid ${couleur}22`, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${couleur}18`,
        color: "#aaa", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <MdBadge style={{ color: couleur }}/> {label}
      </div>
      {chemin ? (
        <img
          src={`${BASE_URL}/storage/${chemin}`}
          alt={label}
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          onError={e => {
            // ✅ Si l'image ne charge pas, affiche un message d'erreur
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div style={{
        height: 180,
        display: chemin ? "none" : "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8, color: "#555",
      }}>
        <MdBadge style={{ fontSize: 40 }}/>
        <span style={{ fontSize: 12 }}>Non fourni</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080820", fontFamily: "'Segoe UI', sans-serif", color: "#fff" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          backgroundColor: toast.type === "error" ? "#ef4444" : "#10b981",
          color: "#fff", padding: "14px 22px", borderRadius: 14,
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)", fontWeight: 700, fontSize: 14,
          animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 10, maxWidth: 340,
        }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "rgba(8,8,32,0.97)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #FFD70020", padding: "0 24px", height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "transparent", border: "1px solid #FFD70044", borderRadius: 10, padding: "7px 10px", cursor: "pointer" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 20, height: 2, backgroundColor: "#FFD700", margin: i < 2 ? "0 0 4px 0" : "0" }}/>
          ))}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="IRAKY" style={{ width: 60, height: 60, borderRadius: "50%" }}/>
          <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 19 }} className="d-none d-sm-inline">
            IRAKY Delivery
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative", cursor: "pointer" }}
            onClick={() => { setNotifOpen(!notifOpen); setNotifs(p => p.map(n => ({ ...n, lu: true }))); }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#FFD70015",
              border: "1px solid #FFD70030", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdNotifications style={{ color: "#FFD700", fontSize: 20 }}/>
            </div>
            {nbNonLus > 0 && (
              <span style={{
                position: "absolute", top: -2, right: -2,
                backgroundColor: "#ef4444", color: "#fff", borderRadius: "50%",
                width: 19, height: 19, fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #080820",
              }}>{nbNonLus}</span>
            )}
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg,#FFD700,#ff8c00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
            boxShadow: "0 0 12px #FFD70044",
          }} onClick={() => setOnglet("profil")}>
            {profil.prenom?.[0]}{profil.nom?.[0]}
          </div>
          <span style={{ color: "#ccc", fontSize: 14 }} className="d-none d-md-inline">{profil.prenom}</span>
        </div>
      </nav>

      {/* NOTIFS PANEL */}
                  {notifOpen && (
                    <>
                      <div onClick={() => setNotifOpen(false)}
                        style={{ position:"fixed", inset:0, zIndex:149 }}/>
                      <div style={{
                        position:"fixed", top:74, right:20, zIndex:150,
                        backgroundColor:"#131330", border:"1px solid #FFD70025",
                        borderRadius:16, width:360, maxHeight:480,
                        boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
                        display:"flex", flexDirection:"column", overflow:"hidden",
                      }}>
                        {/* Header */}
                        <div style={{ padding:"14px 18px", borderBottom:"1px solid #FFD70018",
                          display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                          <span style={{ color:"#FFD700", fontWeight:700, fontSize:14,
                            display:"flex", alignItems:"center", gap:6 }}>
                            <MdNotifications style={{ fontSize:18 }}/> Notifications
                          </span>
                          <span style={{ color:"#666", fontSize:12 }}>{nbNonLus} non lues</span>
                        </div>

                        {/* Liste */}
                        <div style={{ overflowY:"auto", flex:1 }}>
                          {notifs.length === 0 && (
                            <div style={{ padding:24, textAlign:"center", color:"#555", fontSize:13 }}>
                              Aucune notification
                            </div>
                          )}
                          {notifs.map(n => (
                            <div key={n.id} style={{
                              padding:"12px 18px", borderBottom:"1px solid #ffffff08",
                              backgroundColor: n.lu ? "transparent" : "#FFD70008",
                            }}>
                              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                                <div style={{ paddingTop:5, flexShrink:0 }}>
                                  <div style={{ width:8, height:8, borderRadius:"50%",
                                    backgroundColor: n.lu ? "transparent" : "#FFD700" }}/>
                                </div>
                                <div style={{ flex:1 }}>
                                  <p style={{ color:n.lu?"#888":"#fff", fontSize:13,
                                    margin:"0 0 4px 0", lineHeight:1.5 }}>{n.texte}</p>
                                  <small style={{ color:"#555", fontSize:11 }}>{n.time}</small>
                                </div>
                              </div>
                              {/* Actions */}
                              <div style={{ display:"flex", gap:8, marginTop:8, paddingLeft:18 }}>
                                {n.commande_id && (
                                  <button
                                    onClick={async () => {
                                      setNotifOpen(false);

                                      // ✅ Cherche la mission correspondante
                                      const mission = missions.find(m => m.id === n.commande_id)
                                                  || missions.find(m => m.id === parseInt(n.commande_id));

                                      if (mission) {
                                        // ✅ Ouvre le chat avec historique
                                        await ouvrirChat(mission);
                                        setOnglet("messages");
                                      }

                                      // Marquer comme lu
                                      const token = localStorage.getItem("token");
                                      await fetch(`${BASE_URL}/api/notifications/${n.id}/lu`, {
                                        method: "POST",
                                        headers: { "Authorization": `Bearer ${token}` },
                                      });
                                      setNotifs(p => p.map(x => x.id === n.id ? {...x, lu:true} : x));
                                    }}
                                    style={{ background:"#3b82f618", border:"1px solid #3b82f633",
                                      color:"#3b82f6", borderRadius:8, padding:"4px 10px",
                                      cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                                    <MdChat style={{ fontSize:14 }}/> Répondre
                                  </button>
                                )}
                                
                                <button
                                  onClick={async () => {
                                    const token = localStorage.getItem("token");
                                    await fetch(`${BASE_URL}/api/notifications/${n.id}`, {
                                      method:"DELETE",
                                      headers:{ "Authorization":`Bearer ${token}` },
                                    });
                                    setNotifs(p => p.filter(x => x.id !== n.id));
                                  }}
                                  style={{ background:"#ef444415", border:"1px solid #ef444430",
                                    color:"#ef6666", borderRadius:8, padding:"4px 10px",
                                    cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                                  <MdClose style={{ fontSize:14 }}/> Supprimer
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div style={{ padding:"10px 18px", borderTop:"1px solid #FFD70018",
                          display:"flex", justifyContent:"center", flexShrink:0 }}>
                          <span
                            onClick={async () => {
                              const token = localStorage.getItem("token");
                              await fetch(`${BASE_URL}/api/notifications/tous-lus`, {
                                method:"POST",
                                headers:{ "Authorization":`Bearer ${token}` },
                              });
                              setNotifs(p => p.map(n => ({...n, lu:true})));
                            }}
                            style={{ color:"#FFD700", fontSize:12, cursor:"pointer",
                              display:"inline-flex", alignItems:"center", gap:6 }}>
                            <MdDoneAll style={{ fontSize:16 }}/> Tout marquer comme lu
                          </span>
                        </div>
                      </div>
                    </>
                  )}
      {/* LAYOUT */}
      <div style={{ display: "flex", paddingTop: 66 }}>

        {/* SIDEBAR desktop */}
        <aside className="d-none d-lg-block" style={{
          width: 248, minHeight: "calc(100vh - 66px)", backgroundColor: "#0d0d28",
          borderRight: "1px solid #FFD70015", padding: "28px 0",
          position: "fixed", top: 66, left: 0, zIndex: 50,
        }}>
          <SidebarContent onglet={onglet} setOnglet={setOnglet} profil={profil} missions={missions}/>
        </aside>

        {/* SIDEBAR mobile */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "#000a", zIndex: 49 }}/>
            <aside style={{ width: 248, position: "fixed", top: 66, left: 0, bottom: 0,
              backgroundColor: "#0d0d28", borderRight: "1px solid #FFD70015",
              padding: "28px 0", zIndex: 50, overflowY: "auto" }}>
              <SidebarContent onglet={onglet} setOnglet={o => { setOnglet(o); setSidebarOpen(false); }}
                profil={profil} missions={missions}/>
            </aside>
          </>
        )}

        {/* MAIN */}
        <main id="main-content" style={{ flex: 1, padding: "28px 20px", maxWidth: "100%" }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>

            {/* ═══ TABLEAU DE BORD ═══ */}
            {onglet === "accueil" && (
              <div>
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ color: "#fff", fontWeight: 800, margin: 0, fontSize: 22 }}>
                    Bonjour, <span style={{ color: "#FFD700" }}>{profil.prenom}</span> 👋
                  </h3>
                  <p style={{ color: "#666", marginTop: 4, fontSize: 14 }}>Bienvenue sur votre espace coursier IRAKY</p>
                </div>

                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
                  {[
                    { label: "MISSIONS",  val: profil.nb_missions,  Icon: MdDeliveryDining, color: "#3b82f6" },
                    { label: "EN COURS",  val: missions.filter(m => ["negociable","accepte"].includes(m.statut)).length, Icon: MdAccessTime, color: "#f59e0b" },
                    { label: "TERMINÉES", val: profil.nb_terminees, Icon: MdCheckCircle,    color: "#10b981" },
                    { label: "MA NOTE",   val: `${profil.note}/5`,  Icon: MdStar,           color: "#FFD700" },
                  ].map(s => (
                    <div key={s.label} style={{
                      backgroundColor: "#131330", borderRadius: 12, padding: "14px 20px",
                      border: `1px solid ${s.color}33`, boxShadow: `0 4px 16px ${s.color}15`,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      display: "flex", alignItems: "center", gap: 16,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}15`; }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${s.color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.Icon style={{ color: s.color, fontSize: 24 }}/>
                      </div>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{s.val}</div>
                        <div style={{ color: "#888", fontWeight: 600, fontSize: 11, letterSpacing: 1.5, marginTop: 4 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFD70018",
                      border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MdBarChart style={{ color: "#FFD700", fontSize: 20 }}/>
                    </div>
                    <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 15 }}>Ma réputation</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <EtoilesAvecTrophees trophees={profil.trophees} etoilesActuelles={profil.etoiles_actuelles} />
                    <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 20 }}>{profil.note}/5</span>
                    <span style={{ color: "#888", fontSize: 13 }}>basé sur {profil.nb_terminees} missions terminées</span>
                  </div>
                </div>

                <div style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h5 style={{ color: "#FFD700", margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                      <MdCampaign style={{ fontSize: 20 }}/> Missions disponibles
                    </h5>
                    <button onClick={() => setOnglet("missions")}
                      style={{ background: "transparent", border: "1px solid #FFD70030", color: "#FFD700",
                        borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 12 }}>
                      Voir tout
                    </button>
                  </div>
                  {publications.slice(0, 3).map(pub => (
                    <div key={pub.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 0", borderBottom: "1px solid #ffffff08", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{pub.service}</div>
                        <div style={{ color: "#666", fontSize: 12 }}>{pub.moyen} · {pub.client} · {pub.heure_debut}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#FFD700", fontWeight: 700 }}>{pub.tarif.toLocaleString()} Ar</span>
                        <button onClick={() => prendreMission(pub)} style={{ ...btnY, padding: "6px 14px", fontSize: 12 }}>
                          <MdThumbUp style={{ fontSize: 14, marginRight: 4 }}/> Je prends
                        </button>
                      </div>
                    </div>
                  ))}
                  {publications.length === 0 && (
                    <p style={{ color: "#555", textAlign: "center", padding: "20px 0" }}>Aucune mission disponible</p>
                  )}
                </div>
              </div>
            )}

            {/* ═══ MISSIONS DISPONIBLES ═══ */}
            {onglet === "missions" && (
              <div>
                <h4 style={{ color: "#FFD700", marginBottom: 6, fontWeight: 800, fontSize: 20,
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFD70018",
                    border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdCampaign style={{ color: "#FFD700", fontSize: 22 }}/>
                  </div>
                  Missions disponibles
                </h4>
                <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
                  {publications.length} mission(s) en attente de coursier
                </p>

                {publications.length === 0 && (
                  <div style={{ ...card, textAlign: "center", color: "#666", padding: 48 }}>
                    <MdDeliveryDining style={{ fontSize: 56, color: "#333", marginBottom: 12 }}/>
                    <p>Aucune mission disponible pour l'instant.</p>
                  </div>
                )}

                {publications.map(pub => (
                  <div key={pub.id} style={{ ...card, marginBottom: 16, borderLeft: `4px solid ${pub.color}` }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${pub.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{pub.service}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                          <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><MdPerson style={{ color: pub.color }}/> {pub.client}</span>
                          <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><MdDirectionsBike style={{ color: pub.color }}/> {pub.moyen}</span>
                          <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><MdAccessTime style={{ color: pub.color }}/> {pub.heure_debut} → {pub.heure_livraison}</span>
                          <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><MdLocationOn style={{ color: pub.color }}/> {pub.adresse_pickup}</span>
                        </div>
                        <div style={{ color: "#aaa", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{pub.detail}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{pub.tarif.toLocaleString()} Ar</div>
                        <StatutBadge statut={pub.statut}/>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => prendreMission(pub)} style={{ ...btnY, padding: "10px 22px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <MdThumbUp style={{ fontSize: 18 }}/> Je prends cette mission
                      </button>
                      <button onClick={() => setDetailModal(pub)}
                        style={{ background: "transparent", border: "1px solid #FFD70033", color: "#FFD700",
                          borderRadius: 25, padding: "10px 22px", cursor: "pointer", fontWeight: 700, fontSize: 14,
                          display: "flex", alignItems: "center", gap: 8 }}>
                        <MdListAlt style={{ fontSize: 18 }}/> Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ═══ MES MISSIONS ═══ */}
            {onglet === "mes_missions" && (
              <div>
                <h4 style={{ color: "#FFD700", marginBottom: 6, fontWeight: 800, fontSize: 20,
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#3b82f618",
                    border: "1px solid #3b82f633", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdWork style={{ color: "#3b82f6", fontSize: 22 }}/>
                  </div>
                  Mes missions
                </h4>
                <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>{missions.filter(m=>!missionsMasques.includes(m.id)).length} mission(s) assignée(s)</p>

                {missions.filter(m=>!missionsMasques.includes(m.id)).length === 0 && (
                  <div style={{ ...card, textAlign: "center", color: "#666", padding: 48 }}>
                    <MdWork style={{ fontSize: 56, color: "#333", marginBottom: 12 }}/>
                    <p>Vous n'avez pas encore pris de mission.</p>
                    <button onClick={() => setOnglet("missions")} style={{ ...btnY, marginTop: 16, fontSize: 13 }}>
                      Voir les missions disponibles
                    </button>
                  </div>
                )}

                {missions.filter(m=>!missionsMasques.includes(m.id)).map(mission => {
                  const steps = ["en_attente","negociable","accepte","termine"];
                  const idx   = steps.indexOf(mission.statut);
                  return (
                    <div key={mission.id} style={{ ...card, marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{mission.service}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                            <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                              <MdPerson style={{ color: "#FFD700" }}/> Client : <strong style={{ color: "#FFD700" }}>{mission.client}</strong>
                            </span>
                            <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                              <MdAttachMoney style={{ color: "#10b981" }}/> {mission.tarif.toLocaleString()} Ar
                            </span>
                            <span style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                              <MdAccessTime style={{ color: "#f59e0b" }}/> {mission.heure_debut} → {mission.heure_livraison}
                            </span>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <StatutBadge statut={mission.statut}/>
                          <button
                            onClick={()=>demanderRetraitMission(mission.id)}
                            title="Retirer de mes missions (reste visible côté admin)"
                            style={{ background:"#ef444415", border:"1px solid #ef444430",
                              color:"#ef6666", borderRadius:8, width:30, height:30, cursor:"pointer",
                              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <MdDelete style={{ fontSize:15 }}/>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        {steps.map((s, i) => {
                          const done = i <= idx;
                          return (
                            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                background: done ? "linear-gradient(135deg,#FFD700,#ff9500)" : "#1a1a35",
                                border: done ? "none" : "2px solid #ffffff15",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, fontWeight: 800, color: done ? "#000" : "#444",
                                boxShadow: done ? "0 0 12px #FFD70055" : "none", transition: "all 0.4s",
                              }}>
                                {done ? "✓" : i + 1}
                              </div>
                              {i < 3 && (
                                <div style={{ flex: 1, height: 4, borderRadius: 2,
                                  background: i < idx ? "linear-gradient(90deg,#FFD700,#ff9500)" : "#ffffff0f",
                                  transition: "all 0.4s" }}/>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        {["En attente","Négociation","Accepté","Terminé"].map((l, i) => (
                          <span key={l} style={{ fontSize: 10, color: i <= idx ? "#FFD700" : "#444",
                            flex: 1, textAlign: i === 0 ? "left" : i === 3 ? "right" : "center",
                            fontWeight: i <= idx ? 600 : 400 }}>{l}</span>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => setChatModal(mission)}
                          style={{ background: "#3b82f618", border: "1px solid #3b82f633",
                            color: "#3b82f6", borderRadius: 12, padding: "8px 18px",
                            cursor: "pointer", fontWeight: 700, fontSize: 13,
                            display: "flex", alignItems: "center", gap: 6 }}>
                          <MdChat style={{ fontSize: 16 }}/> Message client
                        </button>
                      </div>

                      {mission.statut === "termine" && (
                        <div style={{ marginTop: 14, padding: 14, backgroundColor: "#FFD70011",
                          borderRadius: 12, border: "1px solid #FFD70025" }}>
                          <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <MdStar style={{ fontSize: 18 }}/> Évaluation reçue du client
                          </div>
                          <Etoiles value={mission.note || 0}/>
                          {!mission.note && <small style={{ color: "#888", fontSize: 12 }}>En attente d'évaluation...</small>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
              {/* ═══ MESSAGES COURSIER ═══ */}
              {onglet === "messages" && (
                <div>
                  <h4 style={{ color:"#FFD700", marginBottom:6, fontWeight:800, fontSize:20,
                    display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"#3b82f618",
                      border:"1px solid #3b82f633", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <MdChat style={{ color:"#3b82f6", fontSize:22 }}/>
                    </div>
                    Mes messages
                  </h4>
                  <p style={{ color:"#555", marginBottom:24, fontSize:14 }}>
                    Vos conversations avec les clients
                  </p>

                  {missions.filter(m => m.statut !== "en_attente" && !messagesMasquesCoursier.includes(m.id)).length === 0 ? (
                    <div style={{ ...card, textAlign:"center", color:"#555", padding:48 }}>
                      <MdChat style={{ fontSize:56, color:"#333", marginBottom:12 }}/>
                      <p>Aucune conversation active.</p>
                    </div>
                  ) : (
                    missions.filter(m => m.statut !== "en_attente" && !messagesMasquesCoursier.includes(m.id)).map(mission => (
                      <div key={mission.id}
                        onClick={() => { ouvrirChat(mission); }}
                        style={{ ...card, marginBottom:14, cursor:"pointer",
                          borderLeft:`4px solid ${STATUT_CONFIG[mission.statut]?.color||"#FFD700"}`,
                          transition:"all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,215,0,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                            <div style={{ width:46, height:46, borderRadius:"50%",
                              background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontWeight:800, color:"#fff", fontSize:16, flexShrink:0 }}>
                              {mission.client?.[0]}
                            </div>
                            <div>
                              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{mission.client}</div>
                              <div style={{ color:"#888", fontSize:12 }}>{mission.service} · {mission.date}</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <StatutBadge statut={mission.statut}/>
                            <button
                              onClick={e=>{ e.stopPropagation(); demanderRetraitMessageCoursier(mission.id); }}
                              title="Retirer de mes messages (reste visible côté admin)"
                              style={{ background:"#ef444415", border:"1px solid #ef444430",
                                color:"#ef6666", borderRadius:8, width:30, height:30, cursor:"pointer",
                                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <MdDelete style={{ fontSize:15 }}/>
                            </button>
                            <div style={{ backgroundColor:"#3b82f618", border:"1px solid #3b82f633",
                              color:"#3b82f6", borderRadius:10, padding:"7px 16px",
                              fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                              <MdChat style={{ fontSize:16 }}/> Ouvrir
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Fenêtre chat fixe en bas */}
                  {chatModal && (
                    <div style={{ position:"fixed", bottom:0, right:20, width:400, zIndex:300,
                      backgroundColor:"#131330", border:"1px solid #FFD70030",
                      borderRadius:"16px 16px 0 0", boxShadow:"0 -8px 40px rgba(0,0,0,0.6)" }}>

                      {/* Header */}
                      <div style={{ padding:"14px 18px", borderBottom:"1px solid #FFD70018",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        background:"linear-gradient(135deg,#FFD70015,#ff950008)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:"50%",
                            background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontWeight:800, color:"#fff", fontSize:14 }}>
                            {chatModal.client?.[0]}
                          </div>
                          <div>
                            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{chatModal.client}</div>
                            <div style={{ color:"#10b981", fontSize:11, display:"flex", alignItems:"center", gap:4 }}>
                              <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#10b981" }}/>
                              {chatModal.service}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => { setChatModal(null); setMessages([]); }}
                          style={{ background:"transparent", border:"none", color:"#666",
                            fontSize:20, cursor:"pointer" }}
                          onMouseEnter={e=>e.target.style.color="#fff"}
                          onMouseLeave={e=>e.target.style.color="#666"}>✕</button>
                      </div>

                      {/* Accord coursier */}
                      <div style={{ padding:"10px 14px", backgroundColor:"#0a0a1e",
                        borderBottom:"1px solid #FFD70018" }}>
                        <div style={{ color:"#aaa", fontSize:11, marginBottom:6, fontWeight:600 }}>
                          Accord de service :
                        </div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <button
                            onClick={async () => {
                              if (!chatModal.accord_client) {
                                showToast("🔒 Le client doit accepter en premier", "error");
                                return;
                              }
                              const token = localStorage.getItem("token");
                              const res = await fetch(
                                `${BASE_URL}/api/commandes/${chatModal.id}/accepter-coursier`,
                                { method:"POST", headers:{ "Authorization":`Bearer ${token}` } }
                              );
                              const data = await res.json();
                              if (res.ok) {
                                setChatModal(prev => ({...prev, accord_coursier:true, statut:"accepte"}));
                                setMissions(prev => prev.map(m =>
                                  m.id === chatModal.id ? {...m, statut:"accepte", accord_coursier:true} : m
                                ));
                                showToast("✅ Accord validé — statut : Accepté !");
                              } else {
                                showToast(data.message || "Erreur", "error");
                              }
                            }}
                            disabled={chatModal.accord_coursier || !chatModal.accord_client}
                            style={{
                              padding:"6px 14px", borderRadius:16, fontWeight:700, fontSize:12,
                              border:"none",
                              cursor: (!chatModal.accord_client || chatModal.accord_coursier) ? "not-allowed" : "pointer",
                              backgroundColor: chatModal.accord_coursier ? "#10b981"
                                : !chatModal.accord_client ? "#ffffff11" : "#10b98122",
                              color: chatModal.accord_coursier ? "#fff"
                                : !chatModal.accord_client ? "#555" : "#10b981",
                            }}>
                            {chatModal.accord_coursier ? "✅ Accepté"
                              : !chatModal.accord_client ? "🔒 Attendre client" : "✅ Accepter"}
                          </button>
                          <button
                            onClick={async () => {
                              const token = localStorage.getItem("token");
                              const res = await fetch(
                                `${BASE_URL}/api/commandes/${chatModal.id}/refuser`,
                                { method:"POST", headers:{ "Authorization":`Bearer ${token}` } }
                              );
                              if (res.ok) {
                                setMissions(prev => prev.filter(m => m.id !== chatModal.id));
                                setChatModal(null);
                                setMessages([]);
                                showToast("❌ Mission refusée — remise en attente", "error");
                              }
                            }}
                            style={{ padding:"6px 14px", borderRadius:16, fontWeight:700, fontSize:12,
                              border:"none", cursor:"pointer",
                              backgroundColor:"#ef444422", color:"#ef4444" }}>
                            ❌ Refuser
                          </button>
                        </div>
                        <div style={{ marginTop:6, display:"flex", gap:12 }}>
                          <span style={{ fontSize:11, color: chatModal.accord_client ? "#10b981" : "#666" }}>
                            {chatModal.accord_client ? "✅" : "⬜"} Client
                          </span>
                          <span style={{ fontSize:11, color: chatModal.accord_coursier ? "#10b981" : "#666" }}>
                            {chatModal.accord_coursier ? "✅" : "⬜"} Coursier
                          </span>
                        </div>
                      </div>

                      {/* Messages */}
{/* ✅ Barre d'outils messages */}
                      <div style={{ padding:"8px 14px", backgroundColor:"#0d0d22",
                        borderBottom:"1px solid #FFD70010", display:"flex",
                        justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color:"#666", fontSize:11 }}>
                          {messages.length} message(s)
                        </span>
                        <div style={{ display:"flex", gap:8 }}>
                          {modeSelection && selectedMsgs.size > 0 && (
                            <button
                              onClick={async () => {
                                const token = localStorage.getItem("token");
                                await Promise.all([...selectedMsgs].map(msgId =>
                                  fetch(`${BASE_URL}/api/commandes/${chatModal.id}/messages/${msgId}`, {
                                    method: "DELETE",
                                    headers: { "Authorization": `Bearer ${token}` },
                                  })
                                ));
                                setMessages(prev => prev.filter(m => !selectedMsgs.has(m.id)));
                                setSelectedMsgs(new Set());
                                setModeSelection(false);
                                showToast("Messages supprimés");
                              }}
                              style={{ background:"#ef444420", border:"1px solid #ef444430",
                                color:"#ef6666", borderRadius:8, padding:"4px 12px",
                                cursor:"pointer", fontSize:11, fontWeight:700 }}>
                              🗑 Supprimer ({selectedMsgs.size})
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setModeSelection(!modeSelection);
                              setSelectedMsgs(new Set());
                            }}
                            style={{ background: modeSelection ? "#FFD70020" : "transparent",
                              border:`1px solid ${modeSelection ? "#FFD70044" : "#ffffff20"}`,
                              color: modeSelection ? "#FFD700" : "#666",
                              borderRadius:8, padding:"4px 10px",
                              cursor:"pointer", fontSize:11 }}>
                            {modeSelection ? "✕ Annuler" : "☑ Sélectionner"}
                          </button>
                        </div>
                      </div>

                      {/* ✅ Messages avec scroll + sélection */}
                      <div style={{ height:240, overflowY:"auto", padding:14,
                        display:"flex", flexDirection:"column", gap:10 }}>
                        {messages.length === 0 && (
                          <div style={{ color:"#555", textAlign:"center", fontSize:13, marginTop:40 }}>
                            Commencez la conversation
                          </div>
                        )}
                        {messages.map((m, i) => {
                          const isCoursier = m.sender_role === "coursier"
                            || (profil.id && parseInt(m.sender_id) === parseInt(profil.id));
                          const isSelected = selectedMsgs.has(m.id);

                          return (
                            <div key={m.id || i}
                              onClick={() => {
                                if (!modeSelection) return;
                                setSelectedMsgs(prev => {
                                  const next = new Set(prev);
                                  if (next.has(m.id)) next.delete(m.id);
                                  else next.add(m.id);
                                  return next;
                                });
                              }}
                              style={{
                                display:"flex",
                                justifyContent: isCoursier ? "flex-end" : "flex-start",
                                cursor: modeSelection ? "pointer" : "default",
                                opacity: modeSelection && !isSelected ? 0.6 : 1,
                              }}>

                              {/* Checkbox sélection */}
                              {modeSelection && (
                                <div style={{ width:18, height:18, borderRadius:4, flexShrink:0,
                                  border:`2px solid ${isSelected ? "#FFD700" : "#444"}`,
                                  backgroundColor: isSelected ? "#FFD700" : "transparent",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  marginRight:8, alignSelf:"center", fontSize:11, color:"#000" }}>
                                  {isSelected && "✓"}
                                </div>
                              )}

                              {!isCoursier && !modeSelection && (
                                <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                                  background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontWeight:800, color:"#fff", fontSize:11,
                                  marginRight:6, alignSelf:"flex-end" }}>
                                  {chatModal.client?.[0]}
                                </div>
                              )}

                              <div style={{
                                backgroundColor: isSelected ? "#FFD70033"
                                  : isCoursier ? "#FFD70022" : "#1a1a35",
                                border:`1px solid ${isSelected ? "#FFD700"
                                  : isCoursier ? "#FFD70044" : "#ffffff15"}`,
                                borderRadius: isCoursier
                                  ? "16px 16px 4px 16px"
                                  : "16px 16px 16px 4px",
                                padding:"9px 14px", maxWidth:"75%",
                                transition:"all 0.15s",
                              }}>
                                <div style={{ color:"#fff", fontSize:13, lineHeight:1.5 }}>
                                  {m.texte}
                                </div>
                                <div style={{ color:"#666", fontSize:10, marginTop:3,
                                  textAlign:"right", display:"flex", gap:6,
                                  justifyContent:"flex-end", alignItems:"center" }}>
                                  {m.modifie && <span style={{ color:"#888" }}>modifié ·</span>}
                                  {m.time || (m.created_at
                                    ? new Date(m.created_at).toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})
                                    : "")}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef}/>
                      </div>

                      {/* Input — ✅ corrigé : newMsg + envoyerMessage */}
                      <div style={{ padding:"10px 14px", borderTop:"1px solid #FFD70018",
                        display:"flex", gap:8 }}>
                        <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                          onKeyDown={e => e.key==="Enter" && newMsg.trim() && envoyerMessage()}
                          placeholder="Écrire au client..."
                          style={{ flex:1, backgroundColor:"#0a0a1e", border:"1px solid #FFD70030",
                            color:"#fff", borderRadius:12, padding:"9px 14px",
                            fontSize:13, outline:"none" }}
                          onFocus={e=>e.target.style.borderColor="#FFD700"}
                          onBlur={e=>e.target.style.borderColor="#FFD70030"}
                        />
                        <button onClick={envoyerMessage}
                          disabled={!newMsg.trim()}
                          style={{
                            background:"linear-gradient(135deg,#FFD700,#ff9500)",
                            color:"#000", border:"none", borderRadius:12, padding:"9px 14px",
                            cursor: newMsg.trim() ? "pointer" : "not-allowed",
                            opacity: newMsg.trim() ? 1 : 0.4,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            minWidth:42,
                          }}>
                          <MdSend style={{ fontSize:18 }}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            {/* ═══ PROFIL ═══ */}
            {onglet === "profil" && (
              <div>
                <h4 style={{ color: "#FFD700", marginBottom: 24, fontWeight: 800, fontSize: 20,
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFD70018",
                    border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdPerson style={{ color: "#FFD700", fontSize: 22 }}/>
                  </div>
                  Mon profil
                </h4>

                <div style={{ backgroundColor: "#131330", borderRadius: 18, border: "1px solid #FFD70018", padding: 24 }}>

                  {/* Avatar */}
                  <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: "50%",
                      background: "linear-gradient(135deg,#FFD700,#ff8c00)",
                      margin: "0 auto 14px", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 36, fontWeight: 800, color: "#000",
                      boxShadow: "0 0 30px #FFD70044",
                    }}>
                      {profil.prenom?.[0]}{profil.nom?.[0]}
                    </div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{profil.prenom} {profil.nom}</div>
                    <div style={{ marginTop: 8, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                      <span style={{ backgroundColor: "#FFD70018", color: "#FFD700", borderRadius: 20,
                        padding: "3px 14px", fontSize: 12, border: "1px solid #FFD70033",
                        display: "flex", alignItems: "center", gap: 5 }}>
                        <MdDeliveryDining style={{ fontSize: 14 }}/> Coursier IRAKY
                      </span>
                      <span style={{ backgroundColor: "#10b98118", color: "#10b981", borderRadius: 20,
                        padding: "3px 14px", fontSize: 12, border: "1px solid #10b98133",
                        display: "flex", alignItems: "center", gap: 5 }}>
                        <MdVerified style={{ fontSize: 14 }}/> Vérifié
                      </span>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                      <Etoiles value={profil.note}/>
                    </div>
                  </div>

                  {profilLoading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                      <MdAccessTime style={{ fontSize: 40, marginBottom: 10 }}/>
                      <p>Chargement du profil...</p>
                    </div>
                  ) : (
                    <>
                      {/* Infos personnelles */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginBottom: 24 }}>
                        {[
                          { Icon: MdPerson,     label: "Nom",       val: profil.nom,       color: "#FFD700" },
                          { Icon: MdPerson,     label: "Prénom",    val: profil.prenom,    color: "#3b82f6" },
                          { Icon: MdEmail,      label: "Email",     val: profil.email,     color: "#8b5cf6" },
                          { Icon: MdPhone,      label: "Téléphone", val: profil.telephone, color: "#10b981" },
                          { Icon: MdLocationOn, label: "Adresse",   val: profil.adresse,   color: "#f59e0b" },
                          { Icon: MdBadge,      label: "N° CIN",    val: profil.cin,       color: "#06b6d4" },
                        ].map(({ Icon, label, val, color }) => (
                          <div key={label} style={{ backgroundColor: "#0a0a1e", borderRadius: 12,
                            padding: "14px 18px", border: "1px solid #FFD70018",
                            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#FFD70033"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#FFD70018"}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                              backgroundColor: `${color}18`, border: `1px solid ${color}33`,
                              display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon style={{ color, fontSize: 20 }}/>
                            </div>
                            <div>
                              <div style={{ color: "#666", fontSize: 11, marginBottom: 3 }}>{label}</div>
                              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{val || "—"}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ✅ Photos CIN avec composant réutilisable */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#06b6d418",
                            border: "1px solid #06b6d433", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MdBadge style={{ color: "#06b6d4", fontSize: 20 }}/>
                          </div>
                          <span style={{ color: "#06b6d4", fontWeight: 700, fontSize: 15 }}>
                            Photos pièce d'identité (CIN)
                          </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                          {/* ✅ Seulement recto et verso — photo_identite supprimée */}
                          <PhotoCIN chemin={profil.photo_recto} label="CIN Recto" couleur="#06b6d4" />
                          <PhotoCIN chemin={profil.photo_verso} label="CIN Verso" couleur="#8b5cf6" />
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div style={{ background: "linear-gradient(135deg,#FFD70012,#ff950008)",
                        borderRadius: 14, padding: 20, border: "1px solid #FFD70025" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFD70018",
                            border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MdBarChart style={{ color: "#FFD700", fontSize: 20 }}/>
                          </div>
                          <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 15 }}>Mes statistiques</span>
                        </div>
                        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                          {[
                            { label: "TOTAL",     val: profil.nb_missions,  Icon: MdDeliveryDining, color: "#3b82f6" },
                            { label: "TERMINÉES", val: profil.nb_terminees, Icon: MdCheckCircle,    color: "#10b981" },
                            { label: "EN COURS",  val: missions.filter(m => ["negociable","accepte"].includes(m.statut)).length, Icon: MdAccessTime, color: "#f59e0b" },
                            { label: "MA NOTE",   val: `${profil.note}/5`,  Icon: MdStar,           color: "#FFD700" },
                          ].map(s => (
                            <div key={s.label} style={{
                              backgroundColor: "#131330", borderRadius: 12, padding: "14px 20px",
                              border: `1px solid ${s.color}33`, boxShadow: `0 4px 16px ${s.color}15`,
                              transition: "transform 0.2s", display: "flex", alignItems: "center", gap: 14 }}
                              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${s.color}18`,
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <s.Icon style={{ color: s.color, fontSize: 22 }}/>
                              </div>
                              <div>
                                <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{s.val}</div>
                                <div style={{ color: "#888", fontWeight: 600, fontSize: 10, letterSpacing: 1.5, marginTop: 4 }}>{s.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ═══ AIDE ═══ */}
            {onglet === "aide" && (
              <div>
                <h4 style={{ color: "#FFD700", marginBottom: 6, fontWeight: 800, fontSize: 20,
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#10b98118",
                    border: "1px solid #10b98133", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdHelp style={{ color: "#10b981", fontSize: 22 }}/>
                  </div>
                  Aide & Support
                </h4>
                <p style={{ color: "#666", marginBottom: 28, fontSize: 14 }}>Comment pouvons-nous vous aider ?</p>

                {aideVue === "menu" && (<>
                <div className="aide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
                  {[
                    { Icon: MdPhone,    title: "Nous appeler",   desc: "+261 38 21 266 83",         color: "#10b981", bg: "#10b98115", action: "Appeler maintenant →",
                      onClick: () => { window.location.href = "tel:+261382126683"; } },
                    { Icon: MdChat,     title: "Chat en direct", desc: "Réponse en moins de 5 min", color: "#3b82f6", bg: "#3b82f615", action: "Démarrer le chat →",
                      onClick: () => setAideVue("chat") },
                    { Icon: MdEmail,    title: "Email support",  desc: "irakydelivery@gmail.com",   color: "#8b5cf6", bg: "#8b5cf615", action: "Envoyer un email →",
                      onClick: () => { window.location.href = `mailto:irakydelivery@gmail.com?subject=${encodeURIComponent("Support IRAKY Delivery - "+(profil.nom||""))}`; } },
                    { Icon: MdMenuBook, title: "Guide coursier", desc: "Tutoriels pas à pas",       color: "#f59e0b", bg: "#f59e0b15", action: "Lire le guide →",
                      onClick: () => { setGuideOuvert(0); setAideVue("guide"); } },
                  ].map((item, i) => (
                    <div key={i} onClick={item.onClick} className="aide-card-anim"
                      style={{ backgroundColor: "#131330", borderRadius: 16, padding: "28px 20px",
                      border: `1px solid ${item.color}30`, cursor: "pointer",
                      transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                      animationDelay: `${i*0.08}s` }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.015)"; e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}30`; e.currentTarget.style.borderColor = `${item.color}66`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)";    e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${item.color}30`; }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80,
                        borderRadius: "50%", backgroundColor: `${item.color}10` }}/>
                      <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: item.bg,
                        border: `1px solid ${item.color}33`, display: "flex", alignItems: "center",
                        justifyContent: "center", marginBottom: 16 }}>
                        <item.Icon style={{ color: item.color, fontSize: 26 }}/>
                      </div>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                      <div style={{ color: "#888", fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>{item.desc}</div>
                      <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.action}</div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                        background: `linear-gradient(90deg,${item.color},transparent)` }}/>
                    </div>
                  ))}
                </div>

                {/* FAQ */}
                <div style={{ ...card }}>
                  <div style={{ color:"#FFD700", fontWeight:700, marginBottom:16, fontSize:15,
                    display:"flex", alignItems:"center", gap:8 }}>
                    <MdMenuBook style={{ fontSize:20 }}/> Questions fréquentes
                  </div>
                  {[
                    ["Comment prendre une mission ?", "Allez dans « Missions disponibles », consultez le détail d'une offre puis cliquez sur « Je prends cette mission »."],
                    ["Comment sont calculés mes gains ?", "Le tarif affiché sur chaque mission (selon le moyen : Piéton 5000 Ar, Vélo 6000 Ar, Moto 8000 Ar, Voiture 12000 Ar) vous revient intégralement."],
                    ["Que se passe-t-il si je n'ai pas renouvelé mon abonnement ?", "Votre compte est automatiquement désactivé et vous ne pouvez plus recevoir de nouvelles offres tant que l'abonnement mensuel n'est pas réglé."],
                    ["Comment ma note est-elle calculée ?", "Chaque mission terminée est notée de 1 à 5 étoiles par le client. Votre note moyenne et vos trophées apparaissent dans « Mon profil »."],
                  ].map(([q, a], i) => (
                    <details key={i} style={{ marginBottom:10, backgroundColor:"#0a0a1e",
                      borderRadius:12, border:"1px solid #FFD70015", padding:"14px 18px" }}>
                      <summary style={{ color:"#fff", fontWeight:600, cursor:"pointer", fontSize:14,
                        listStyle:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        {q}
                        <span style={{ color:"#FFD700", fontSize:18 }}>+</span>
                      </summary>
                      <p style={{ color:"#888", fontSize:13, marginTop:10, lineHeight:1.6, marginBottom:0 }}>{a}</p>
                    </details>
                  ))}
                </div>
                </>)}

                {/* ══════════════ CHAT SUPPORT — réel, connecté à la BDD ══════════════ */}
                {aideVue === "chat" && (
                  <div className="aide-fade-in" style={{
                    backgroundColor:"#131330", borderRadius:18,
                    border:"1px solid #3b82f630", overflow:"hidden",
                    boxShadow:"0 16px 44px #3b82f620",
                    display:"flex", flexDirection:"column" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12,
                      padding:"16px 18px", borderBottom:"1px solid #3b82f625",
                      background:"linear-gradient(135deg,#3b82f618,#8b5cf610)" }}>
                      <button onClick={()=>setAideVue("menu")}
                        style={{ background:"#ffffff10", border:"1px solid #ffffff20",
                          borderRadius:10, width:34, height:34, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"#fff", flexShrink:0 }}>
                        <MdArrowBack style={{ fontSize:18 }}/>
                      </button>
                      <div style={{ width:40, height:40, borderRadius:"50%",
                        background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0, boxShadow:"0 0 0 3px #3b82f620" }}>
                        <MdSupportAgent style={{ color:"#fff", fontSize:20 }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>Support IRAKY Delivery</div>
                        <div style={{ color:"#3b82f6", fontSize:11, display:"flex", alignItems:"center", gap:5 }}>
                          <span className="aide-dot-online"/> En ligne · répond sous 5 min
                        </div>
                      </div>
                    </div>

                    <div style={{ height:320, overflowY:"auto", padding:16,
                      display:"flex", flexDirection:"column", gap:10 }}>
                      {supportLoading && supportMessages.length === 0 && (
                        <div style={{ margin:"auto", color:"#555", fontSize:13, display:"flex",
                          flexDirection:"column", alignItems:"center", gap:10 }}>
                          <div style={{ width:22, height:22, border:"3px solid #3b82f640",
                            borderTop:"3px solid #3b82f6", borderRadius:"50%",
                            animation:"spin 0.7s linear infinite" }}/>
                          Chargement de la conversation...
                        </div>
                      )}
                      {!supportLoading && supportMessages.length === 0 && (
                        <div style={{ margin:"auto", textAlign:"center", color:"#555" }}>
                          <MdSupportAgent style={{ fontSize:40, color:"#3b82f660", marginBottom:8 }}/>
                          <p style={{ fontSize:13 }}>Bonjour {profil.prenom} 👋<br/>Posez-nous votre question, notre équipe vous répond ici.</p>
                        </div>
                      )}
                      {supportMessages.map((m, i) => {
                        const estMoi = m.sender_role === "client"
                          || (profil.id && parseInt(m.sender_id) === parseInt(profil.id));
                        const estBot = !estMoi && (m.bot || m.sender_id === null || m.sender_id === undefined);
                        return (
                          <div key={m.id || i} className="aide-msg-in"
                            style={{ display:"flex", justifyContent: estMoi ? "flex-end" : "flex-start" }}>
                            {!estMoi && (
                              <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                                background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                marginRight:6, alignSelf:"flex-end" }}>
                                <MdSupportAgent style={{ color:"#fff", fontSize:13 }}/>
                              </div>
                            )}
                            <div style={{
                              backgroundColor: estMoi ? "#3b82f622" : "#1a1a35",
                              border:`1px solid ${m.echec ? "#ef4444" : estMoi ? "#3b82f644" : "#ffffff15"}`,
                              borderRadius: estMoi ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                              padding:"9px 14px", maxWidth:"75%", opacity: m.envoi ? 0.6 : 1 }}>
                              {estBot && (
                                <div style={{ color:"#3b82f6", fontSize:10, fontWeight:700,
                                  marginBottom:4, display:"flex", alignItems:"center", gap:4 }}>
                                  🤖 Assistant automatique
                                </div>
                              )}
                              <div style={{ color:"#fff", fontSize:13, lineHeight:1.5 }}>{m.texte}</div>
                              <div style={{ color: m.echec ? "#ef6666" : "#666", fontSize:10, marginTop:3,
                                textAlign:"right" }}>
                                {m.echec ? "Échec de l'envoi" : (m.time || (m.created_at
                                  ? new Date(m.created_at).toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})
                                  : "..."))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {supportTyping && (
                        <div className="aide-msg-in" style={{ display:"flex", justifyContent:"flex-start" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                            background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            marginRight:6, alignSelf:"flex-end" }}>
                            <MdSupportAgent style={{ color:"#fff", fontSize:13 }}/>
                          </div>
                          <div style={{ backgroundColor:"#1a1a35", border:"1px solid #ffffff15",
                            borderRadius:"16px 16px 16px 4px", padding:"12px 16px",
                            display:"flex", gap:4, alignItems:"center" }}>
                            <span className="aide-typing-dot"/>
                            <span className="aide-typing-dot" style={{ animationDelay:"0.15s" }}/>
                            <span className="aide-typing-dot" style={{ animationDelay:"0.3s" }}/>
                          </div>
                        </div>
                      )}
                      <div ref={supportEndRef}/>
                    </div>

                    <div style={{ padding:"12px 16px", borderTop:"1px solid #3b82f620",
                      display:"flex", gap:10 }}>
                      <input value={supportMsg} onChange={e=>setSupportMsg(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&supportMsg.trim()&&envoyerSupportMsg()}
                        placeholder="Écrivez votre message au support..."
                        style={{ flex:1, backgroundColor:"#0a0a1e", border:"1px solid #3b82f640",
                          color:"#fff", borderRadius:12, padding:"10px 14px", fontSize:13, outline:"none",
                          transition:"border-color 0.2s" }}
                        onFocus={e=>e.target.style.borderColor="#3b82f6"}
                        onBlur={e=>e.target.style.borderColor="#3b82f640"}
                      />
                      <button onClick={envoyerSupportMsg}
                        disabled={!supportMsg.trim() || supportEnvoi}
                        style={{
                          background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                          color:"#fff", border:"none", borderRadius:12, padding:"10px 16px",
                          cursor: supportMsg.trim() && !supportEnvoi ? "pointer" : "not-allowed",
                          opacity: supportMsg.trim() ? 1 : 0.4,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          minWidth:44, transition:"transform 0.15s" }}
                        onMouseEnter={e=>{ if(supportMsg.trim()) e.currentTarget.style.transform="scale(1.06)"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; }}>
                        {supportEnvoi
                          ? <div style={{ width:16, height:16, border:"2px solid #fff",
                              borderTop:"2px solid transparent", borderRadius:"50%",
                              animation:"spin 0.6s linear infinite" }}/>
                          : <MdSend style={{ fontSize:18 }}/>
                        }
                      </button>
                    </div>
                  </div>
                )}

                {/* ══════════════ GUIDE INTERACTIF ══════════════ */}
                {aideVue === "guide" && (
                  <div className="aide-fade-in">
                    <button onClick={()=>setAideVue("menu")}
                      style={{ background:"#ffffff10", border:"1px solid #ffffff20",
                        borderRadius:10, padding:"8px 16px", cursor:"pointer",
                        color:"#fff", display:"flex", alignItems:"center", gap:8,
                        fontSize:12, marginBottom:18 }}>
                      <MdArrowBack style={{ fontSize:16 }}/> Retour
                    </button>

                    <div style={{ ...card, marginBottom:18, background:"linear-gradient(135deg,#f59e0b18,#131330)",
                      border:"1px solid #f59e0b30", display:"flex", alignItems:"center", gap:14 }}>
                      <MdInfo style={{ color:"#f59e0b", fontSize:28, flexShrink:0 }}/>
                      <div style={{ color:"#ccc", fontSize:13, lineHeight:1.6 }}>
                        Ce guide couvre toutes les fonctionnalités de votre espace coursier IRAKY Delivery.
                        Cliquez sur une section pour dérouler les explications.
                      </div>
                    </div>

                    {GUIDE_SECTIONS_COURSIER.map((s, i) => {
                      const ouvert = guideOuvert === i;
                      return (
                        <div key={i} className="aide-card-anim" style={{
                          animationDelay:`${i*0.06}s`,
                          backgroundColor:"#131330", borderRadius:14,
                          border:`1px solid ${ouvert ? s.color+"55" : "#ffffff15"}`,
                          marginBottom:12, overflow:"hidden",
                          transition:"border-color 0.25s" }}>
                          <div onClick={()=>setGuideOuvert(ouvert ? -1 : i)}
                            style={{ display:"flex", alignItems:"center", gap:14,
                              padding:"16px 18px", cursor:"pointer" }}>
                            <div style={{ width:42, height:42, borderRadius:12, flexShrink:0,
                              backgroundColor:`${s.color}18`, border:`1px solid ${s.color}33`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <s.Icon style={{ color:s.color, fontSize:20 }}/>
                            </div>
                            <div style={{ flex:1, color:"#fff", fontWeight:700, fontSize:14 }}>
                              {s.titre}
                            </div>
                            <MdExpandMore style={{ color: ouvert ? s.color : "#666", fontSize:22,
                              transition:"transform 0.3s", transform: ouvert ? "rotate(180deg)" : "rotate(0)" }}/>
                          </div>
                          <div style={{
                            maxHeight: ouvert ? 200 : 0,
                            opacity: ouvert ? 1 : 0,
                            transition:"max-height 0.35s ease, opacity 0.3s ease",
                            overflow:"hidden" }}>
                            <div style={{ padding:"0 18px 18px 74px", color:"#999",
                              fontSize:13, lineHeight:1.7, display:"flex", gap:8 }}>
                              <MdCheckCircle style={{ color:s.color, fontSize:15, flexShrink:0, marginTop:2 }}/>
                              <span>{s.texte}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL DÉTAIL */}
      {detailModal && (
        <Modal onClose={() => setDetailModal(null)} size="lg">
          <h5 style={{ color: "#FFD700", marginBottom: 20, fontWeight: 800, fontSize: 17,
            display: "flex", alignItems: "center", gap: 10 }}>
            <MdDeliveryDining style={{ fontSize: 22 }}/> {detailModal.service}
          </h5>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              ["Client",          detailModal.client],
              ["Moyen",           detailModal.moyen],
              ["Tarif",           `${detailModal.tarif?.toLocaleString()} Ar`],
              ["Date",            detailModal.date],
              ["Heure début",     detailModal.heure_debut],
              ["Heure livraison", detailModal.heure_livraison],
              ["Adresse pickup",  detailModal.adresse_pickup],
              ["Statut",          STATUT_CONFIG[detailModal.statut]?.label],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                <div style={{ color: "#666", fontSize: 11, marginBottom: 3 }}>{k}</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "12px 16px", backgroundColor: "#0a0a1e",
            borderRadius: 12, border: "1px solid #FFD70018" }}>
            <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>Description</div>
            <div style={{ color: "#fff", fontSize: 13, lineHeight: 1.6 }}>{detailModal.detail}</div>
          </div>
          <button onClick={() => { prendreMission(detailModal); setDetailModal(null); }}
            style={{ ...btnY, width: "100%", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <MdThumbUp style={{ fontSize: 18 }}/> Je prends cette mission
          </button>
        </Modal>
      )}

      {/* MODAL CHAT */}

      <style>{`
        @keyframes slideIn { from{transform:translateY(-16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes modalIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
        @media(min-width:992px){ #main-content{ margin-left:248px !important; } }
        @media(max-width:768px){
          #main-content{ margin-left:0 !important; }
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .aide-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .aide-grid { grid-template-columns:1fr !important; }
        }
         { box-sizing:border-box; }
        body { overflow-x:hidden; }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

export default DashboardCoursier;