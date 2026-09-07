import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import achatImg from "../../images/achat.jpg";
import scoreImg from "../../images/score.png";
import jiramaImg from "../../images/jirama.jpg";
import bfvImg from "../../images/bfv.png";
import legalisationImg from "../../images/legalisation.png";
import educationImg from "../../images/education.jpg";
import livraisonImg from "../../images/livraison.jpg";
import bazaryImg from "../../images/bazary.jpg";
import logo from "../../images/logo.png";
import { FaBox, FaClock, FaCheckCircle, FaTimesCircle, FaUser } from "react-icons/fa";
import {
  MdDashboard,
  MdAddCircle,
  MdClose,
  MdLocationOn,
  MdListAlt,
  MdPerson,
  MdHelp,
  MdLogout,
  MdPhone,
  MdChat,
  MdEmail,
  MdMenuBook,
  MdBarChart,
  MdCampaign,
  MdSummarize,
  MdMiscellaneousServices,
  MdDirectionsBike,
  MdAttachMoney,
  MdAccessTime,
  MdLocalShipping,
  MdDescription,
  MdNotifications,
  MdCircle,
  MdDoneAll,
  MdSend,
  MdStar,
  MdDelete,
  MdArrowBack,
  MdExpandMore,
  MdInfo,
  MdCheckCircle,
  MdSupportAgent,
} from "react-icons/md";
// ══════════════════════════════════════════════
//  DONNÉES
// ══════════════════════════════════════════════
const SERVICES = [
  {
    id: "jirama",
    label: "Facture JIRAMA",
    icon: jiramaImg,
    color: "#f59e0b",
    desc: "Paiement factures eau/électricité"
  },
  {
    id: "banque",
    label: "Banque",
    icon: bfvImg,
    color: "#3b82f6",
    desc: "Retrait, dépôt, virement"
  },
  {
    id: "sacma",
    label: "Achat SACMA",
    icon: achatImg,
    color: "#10b981",
    desc: "Courses au supermarché SACMA"
  },
  {
    id: "bazary",
    label: "Bazary Be",
    icon: bazaryImg,
    color: "#8b5cf6",
    desc: "Achats au grand marché"
  },
  {
    id: "score",
    label: "Score",
    icon: scoreImg,
    color: "#ec4899",
    desc: "Shopping chez Score"
  },
  {
    id: "cin",
    label: "Légalisation CIN",
    icon: legalisationImg,
    color: "#06b6d4",
    desc: "Légalisation de documents"
  },
  {
    id: "mentor",
    label: "Mentor Universitaire",
    icon: educationImg,
    color: "#f97316",
    desc: "Accompagnement académique"
  },
  {
    id: "livraison",
    label: "Livraison de colis",
    icon: livraisonImg,
    color: "#6b7280",
    desc: "Livrez vos colis partout dans Toliara"
  }
];
// ✅ MOYENS n'est plus codé en dur — chargé dynamiquement depuis la BDD
// (voir le state `moyens` + le useEffect de fetch dans le composant).

const STATUT_CONFIG = {
  en_attente: { label:"En attente",     color:"#f59e0b", bg:"#f59e0b18", icon:"⏳", step:0 },
  negociable: { label:"En négociation", color:"#3b82f6", bg:"#3b82f618", icon:"💬", step:1 },
  accepte:    { label:"Accepté",        color:"#10b981", bg:"#10b98118", icon:"✅", step:2 },
  refuse:     { label:"Refusé",         color:"#ef4444", bg:"#ef444418", icon:"❌", step:-1 },
  termine:    { label:"Terminé",        color:"#8b5cf6", bg:"#8b5cf618", icon:"🏁", step:3 },
};

const MOCK_COMMANDES = [
  { id:1, service:"Facture JIRAMA", moyen:"Moto",    tarif:8000,  statut:"en_attente", heure_publication:"08:15", heure_debut:"08:30", heure_livraison:"09:15", detail:"Payer facture JIRAMA Tsararano", date:"2026-06-01", coursier:null,      note:null },
  { id:2, service:"Banque",         moyen:"Voiture", tarif:12000, statut:"negociable", heure_publication:"09:45", heure_debut:"10:00", heure_livraison:"11:00", detail:"Retrait BNI Toliara centre",    date:"2026-06-02", coursier:"Jean M.", note:null },
  { id:3, service:"Achat SACMA",    moyen:"Piéton",  tarif:5000,  statut:"termine",    heure_publication:"13:30", heure_debut:"14:00", heure_livraison:"14:50", detail:"Acheter riz 10kg + huile",      date:"2026-05-30", coursier:"Hery R.", note:4   },
];

const MOCK_NOTIFS = [
  { id:1, texte:"Votre commande #2 est en négociation avec Jean M.", lu:false, time:"Il y a 5 min", type:"info" },
  { id:2, texte:"Commande #3 terminée ! Notez votre coursier.",      lu:false, time:"Il y a 2h",    type:"success" },
  { id:3, texte:"Bienvenue sur IRAKY Delivery !",                    lu:true,  time:"Hier",         type:"welcome" },
];

// ══════════════════════════════════════════════
//  ÉTOILES
// ══════════════════════════════════════════════
function Etoiles({ value, onChange }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display:"flex", gap:6 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHov(i)}
          onMouseLeave={() => onChange && setHov(0)}
          style={{ fontSize:24, cursor:onChange?"pointer":"default",
            color: i<=(hov||value) ? "#FFD700":"#ffffff18",
            transition:"color 0.15s, transform 0.15s",
            display:"inline-block",
            transform: i<=(hov||value) ? "scale(1.2)":"scale(1)" }}>★</span>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════
function Modal({ children, onClose, size="md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:400,
      backgroundColor:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor:"#131330", borderRadius:20, padding:28,
        width:"100%", maxWidth: size==="lg"?640:480,
        border:"1px solid #FFD70030",
        boxShadow:"0 24px 60px rgba(0,0,0,0.7)",
        animation:"modalIn 0.25s ease",
        maxHeight:"90vh", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{
          float:"right", background:"transparent", border:"none",
          color:"#666", fontSize:22, cursor:"pointer", lineHeight:1,
          transition:"color 0.2s",
        }} onMouseEnter={e=>e.target.style.color="#fff"}
          onMouseLeave={e=>e.target.style.color="#666"}>✕</button>
        {children}
      </div>
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
      backgroundColor:s.bg, color:s.color,
      borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700,
      border:`1px solid ${s.color}44`,
      display:"inline-flex", alignItems:"center", gap:5,
    }}>
      {s.icon} {s.label}
    </span>
  );
}

// ══════════════════════════════════════════════
//  SidebarContent
// ══════════════════════════════════════════════
function SidebarContent({ onglet, setOnglet, profil, commandes }) {
  let suiviMasques = [];
  try {
    const brutS = localStorage.getItem("suivi_masques");
    suiviMasques = brutS ? JSON.parse(brutS) : [];
  } catch {}

  const enCours = commandes.filter(c =>
    ["en_attente","negociable","accepte"].includes(c.statut) && !suiviMasques.includes(c.id)
  ).length;

  let historiqueMasques = [];
  try {
    const brutH = localStorage.getItem("historique_masques");
    historiqueMasques = brutH ? JSON.parse(brutH) : [];
  } catch {}

  const nbCommandes = commandes.filter(c => !historiqueMasques.includes(c.id)).length;

  let messagesMasques = [];
  try {
    const brut = localStorage.getItem("messages_masques");
    messagesMasques = brut ? JSON.parse(brut) : [];
  } catch {}

  const nbMessages = commandes.filter(c =>
    c.coursier && c.statut !== "en_attente" && !messagesMasques.includes(c.id)
  ).length;

  const items = [
    { id:"accueil",    Icon:MdDashboard,    label:"Tableau de bord"     },
    { id:"nouvelle",   Icon:MdAddCircle,    label:"Nouvelle commande"   },
    { id:"suivi",      Icon:MdLocationOn,   label:"Suivi en temps réel" },
    { id:"historique", Icon:MdListAlt,      label:"Mes commandes"       },
    { id:"messages",   Icon:MdChat,         label:"Messages"            },
    { id:"profil",     Icon:MdPerson,       label:"Mon profil"          },
    { id:"aide",       Icon:MdHelp,         label:"Aide & Support"      },
  ];

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>

      {/* profil mini */}
      <div style={{ padding:"0 20px 20px", borderBottom:"1px solid #FFD70018", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:42, height:42, borderRadius:"50%",
            background:"linear-gradient(135deg, #FFD700, #ff8c00)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, color:"#000", fontSize:16,
            boxShadow:"0 0 12px #FFD70044",
          }}>
            {profil.prenom?.[0]}{profil.nom?.[0]}
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>
              {profil.prenom} {profil.nom}
            </div>
            <div style={{ color:"#FFD700", fontSize:11, fontWeight:600 }}>
              ✦ Client IRAKY
            </div>
          </div>
        </div>
      </div>

      {/* menu items */}
      <div style={{ flex:1, paddingTop:4 }}>
        {items.map(item => (
          <div key={item.id} onClick={() => setOnglet(item.id)}
            style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"11px 20px", cursor:"pointer", fontSize:13.5,
              backgroundColor: onglet===item.id ? "#FFD70012":"transparent",
              borderLeft: onglet===item.id ? "3px solid #FFD700":"3px solid transparent",
              color: onglet===item.id ? "#FFD700":"#8888aa",
              transition:"all 0.18s", borderRadius:"0 10px 10px 0", marginRight:8,
            }}
            onMouseEnter={e=>{ if(onglet!==item.id){
              e.currentTarget.style.backgroundColor="#ffffff08";
              e.currentTarget.style.color="#fff";
            }}}
            onMouseLeave={e=>{ if(onglet!==item.id){
              e.currentTarget.style.backgroundColor="transparent";
              e.currentTarget.style.color="#8888aa";
            }}}>
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <item.Icon style={{ fontSize:18 }}/>
              {item.label}
            </span>

            {/* Badge suivi */}
            {item.id==="suivi" && enCours>0 && (
              <span style={{ background:"#f59e0b", color:"#000", borderRadius:12,
                padding:"1px 8px", fontSize:11, fontWeight:800 }}>{enCours}</span>
            )}

            {/* Badge messages */}
            {item.id==="messages" && nbMessages>0 && (
              <span style={{ background:"#3b82f6", color:"#fff", borderRadius:12,
                padding:"1px 8px", fontSize:11, fontWeight:800 }}>{nbMessages}</span>
            )}

            {/* Badge mes commandes */}
            {item.id==="historique" && nbCommandes>0 && (
              <span style={{ background:"#10b981", color:"#000", borderRadius:12,
                padding:"1px 8px", fontSize:11, fontWeight:800 }}>{nbCommandes}</span>
            )}
          </div>
        ))}
      </div>

      {/* bouton déconnexion */}
      <div style={{ padding:16 }}>
        <button onClick={() => {
            const CLES_A_GARDER = ["suivi_masques", "historique_masques", "messages_masques", "messages_effaces"];
            const sauvegarde = {};
            CLES_A_GARDER.forEach(cle => { const v = localStorage.getItem(cle); if (v) sauvegarde[cle] = v; });
            localStorage.clear();
            Object.entries(sauvegarde).forEach(([cle, v]) => localStorage.setItem(cle, v));
            window.location.href = "/connexion";
          }}
          style={{
            width:"100%", padding:"10px", borderRadius:12,
            border:"1px solid #ef444430", backgroundColor:"#ef444410",
            color:"#ef6666", cursor:"pointer", fontWeight:700, fontSize:13,
            transition:"all 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
          onMouseEnter={e=>{ e.currentTarget.style.backgroundColor="#ef444425"; }}
          onMouseLeave={e=>{ e.currentTarget.style.backgroundColor="#ef444410"; }}>
          <MdLogout style={{ fontSize:18 }}/> Se déconnecter
        </button>
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════
//  DASHBOARD PRINCIPAL
// ══════════════════════════════════════════════
function DashboardClient() {
  const [onglet, setOnglet]           = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
const [notifs, setNotifs] = useState([]);
 const [commandes, setCommandes] = useState([]);
  const [detailCmd, setDetailCmd]     = useState(null);
  const [noteCmd, setNoteCmd]         = useState(null);
  const [noteTmp, setNoteTmp]         = useState(0);
  const [confirmDel, setConfirmDel]   = useState(null);

  // ── Masquage LOCAL du suivi (client uniquement — la commande
  // reste intacte en base pour que l'admin garde tout l'historique) ──
  const [suiviMasques, setSuiviMasques] = useState(() => {
    try {
      const brut = localStorage.getItem("suivi_masques");
      return brut ? JSON.parse(brut) : [];
    } catch { return []; }
  });
  const demanderRetraitSuivi = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Retirer de mon suivi",
      html: `Voulez-vous vraiment retirer cette commande de votre suivi en temps réel ?<br/><br/>
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
        setSuiviMasques(prev => {
          const next = [...prev, id];
          try { localStorage.setItem("suivi_masques", JSON.stringify(next)); } catch {}
          return next;
        });
        showToast("Retirée définitivement de votre suivi");
      }
    });
  };

  // ── Masquage LOCAL de "Mes commandes" ────────────
  const [historiqueMasques, setHistoriqueMasques] = useState(() => {
    try {
      const brut = localStorage.getItem("historique_masques");
      return brut ? JSON.parse(brut) : [];
    } catch { return []; }
  });

  const demanderRetraitHistorique = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Retirer de mes commandes",
      html: `Voulez-vous vraiment retirer cette commande de votre historique ?<br/><br/>
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
        setHistoriqueMasques(prev => {
          const next = [...prev, id];
          try { localStorage.setItem("historique_masques", JSON.stringify(next)); } catch {}
          return next;
        });
        showToast("Retirée définitivement de vos commandes");
      }
    });
  };

  // ── Masquage LOCAL de "Mes messages" ─────────────
  const [messagesMasques, setMessagesMasques] = useState(() => {
    try {
      const brut = localStorage.getItem("messages_masques");
      return brut ? JSON.parse(brut) : [];
    } catch { return []; }
  });

  const demanderRetraitMessage = (id) => {
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
        setMessagesMasques(prev => {
          const next = [...prev, id];
          try { localStorage.setItem("messages_masques", JSON.stringify(next)); } catch {}
          return next;
        });
        showToast("Conversation retirée définitivement");
      }
    });
  };
  const [toast, setToast]             = useState(null);
  const [serviceHov, setServiceHov]   = useState(null);
  const [moyenHov, setMoyenHov]       = useState(null);
  const [moyens, setMoyens]           = useState([]); // ✅ chargé depuis la BDD
  const [loading, setLoading]         = useState(false);
  const [chatCommande, setChatCommande] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMsg, setChatMsg]           = useState("");

  // ══════ Aide & Support : chat client ↔ support (réel, connecté à la BDD) ══════
  const [aideVue, setAideVue]               = useState("menu"); // menu | chat | guide
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportMsg, setSupportMsg]           = useState("");
  const [supportLoading, setSupportLoading]   = useState(false);
  const [supportEnvoi, setSupportEnvoi]       = useState(false);
  const [supportTyping, setSupportTyping]     = useState(false); // ✅ indicateur "l'assistant écrit..."
  const supportEndRef                         = useRef(null);
  const [guideOuvert, setGuideOuvert]         = useState(0);

  const chargerSupportMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://projet-iraky-delivery.onrender.com/api/support/messages", {
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
    const interval = setInterval(chargerSupportMessages, 3000); // ✅ polling temps réel
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
      sender_role: "client",
      created_at: new Date().toISOString(),
      envoi: true,
    };
    setSupportMessages(prev => [...prev, msgTemp]);
    setSupportMsg("");
    setSupportEnvoi(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://projet-iraky-delivery.onrender.com/api/support/messages", {
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

        // ✅ Si une réponse automatique existe, on simule une brève
        //    frappe ("l'assistant écrit...") avant de l'afficher —
        //    plus naturel qu'une apparition instantanée.
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

  // ══════ Guide interactif — contenu 100% aligné sur les fonctionnalités réelles d'IRAKY Delivery ══════
  const GUIDE_SECTIONS = [
    {
      Icon: MdAddCircle, color:"#FFD700",
      titre: "Créer une nouvelle commande",
      texte: "Depuis l'onglet « Nouvelle commande », choisissez un service (Achat, Facture JIRAMA, Banque BFV, Légalisation, Éducation, Livraison, Bazary…), précisez votre besoin puis sélectionnez un moyen de transport (Piéton, Vélo, Moto, Voiture). Votre commande apparaît ensuite en statut « En attente » jusqu'à ce qu'un coursier disponible la prenne en charge.",
    },
    {
      Icon: MdLocationOn, color:"#3b82f6",
      titre: "Suivre une commande en temps réel",
      texte: "L'onglet « Suivi en temps réel » affiche toutes vos commandes actives (en attente, en négociation, acceptées). Vous pouvez y échanger avec le coursier, accepter les conditions, et suivre l'avancement jusqu'à la livraison. Une fois le service terminé, marquez la commande comme terminée pour noter automatiquement le coursier.",
    },
    {
      Icon: MdChat, color:"#8b5cf6",
      titre: "Messagerie avec les coursiers",
      texte: "Dès qu'un coursier prend votre commande, une conversation s'ouvre dans « Mes messages ». Vous pouvez discuter des détails du service, envoyer des précisions, et supprimer un message ou une conversation entière si besoin — la suppression est définitive et reste liée à votre compte, même après déconnexion.",
    },
    {
      Icon: MdListAlt, color:"#10b981",
      titre: "Historique des commandes",
      texte: "« Mes commandes » regroupe l'historique complet : commandes terminées, refusées ou annulées. Vous pouvez retirer une commande de votre liste à tout moment (elle reste néanmoins visible côté administration à des fins de suivi).",
    },
    {
      Icon: MdNotifications, color:"#f59e0b",
      titre: "Notifications",
      texte: "La cloche en haut du tableau de bord vous informe en temps réel : nouvelle offre d'un coursier, message reçu, commande terminée. Cliquez sur une notification pour accéder directement à la commande ou conversation concernée.",
    },
    {
      Icon: MdPerson, color:"#ef4444",
      titre: "Mon profil",
      texte: "Consultez et gérez vos informations personnelles (nom, téléphone, email) depuis l'onglet « Profil ». C'est aussi ici que vous retrouverez vos statistiques : nombre de commandes, note moyenne, etc.",
    },
  ];
  const [chatLoading, setChatLoading]   = useState(false);
  const messagesEndRef                  = useRef(null);

  const [form, setForm] = useState({
    service:"", moyen:"", detail:"", adresse_pickup:"",
    heure_publication:"", heure_debut:"", heure_livraison:"",
  });
  
  const [selectedMsgs, setSelectedMsgs] = useState(new Set());
  const [modeSelection, setModeSelection] = useState(false);

  // ✅ Messages supprimés par le client — persistés en localStorage
  //    pour qu'ils ne réapparaissent jamais après déconnexion/reconnexion
  //    (même principe que "messages_masques" pour les conversations).
  const [messagesEffaces, setMessagesEffaces] = useState(() => {
    try {
      const brut = localStorage.getItem("messages_effaces");
      return brut ? JSON.parse(brut) : {};
    } catch { return {}; }
  });

  const ajouterMessagesEffaces = (commandeId, ids) => {
    setMessagesEffaces(prev => {
      const existants = prev[commandeId] || [];
      const next = { ...prev, [commandeId]: [...new Set([...existants, ...ids])] };
      try { localStorage.setItem("messages_effaces", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filtrerMessagesEffaces = (commandeId, data) => {
    const effaces = messagesEffaces[commandeId] || [];
    if (effaces.length === 0) return data;
    return data.filter(m => !effaces.includes(m.id));
  };

// ✅ Après — chargé depuis localStorage + API /me
const [profil, setProfil] = useState({
  id:        null,
  nom:       localStorage.getItem("nom")       || "",
  prenom:    localStorage.getItem("prenom")    || "",
  email:     localStorage.getItem("email")     || "",
  telephone: localStorage.getItem("telephone") || "",
  adresse:   localStorage.getItem("adresse")   || "",
  role:      localStorage.getItem("role")      || "client",
});

// ✅ Synchronise avec l'API au chargement
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetch("https://projet-iraky-delivery.onrender.com/api/me", {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
  })
    .then(res => { if (res.status === 401) {
        const CLES_A_GARDER = ["suivi_masques", "historique_masques", "messages_masques", "messages_effaces"];
        const sauvegarde = {};
        CLES_A_GARDER.forEach(cle => { const v = localStorage.getItem(cle); if (v) sauvegarde[cle] = v; });
        localStorage.clear();
        Object.entries(sauvegarde).forEach(([cle, v]) => localStorage.setItem(cle, v));
        window.location.href = "/connexion";
      } return res.json(); })
    .then(data => {
      if (!data) return;
      const p = {
         id:        data.id        || null, 
        nom:       data.nom       || "",
        prenom:    data.prenom    || "",
        email:     data.email     || "",
        telephone: data.telephone || "",
        adresse:   data.adresse   || "",
        role:      data.role      || "client",
      };
      setProfil(p);
      // ✅ Met à jour le localStorage aussi
      Object.entries(p).forEach(([k,v]) => localStorage.setItem(k, v));
    })
    .catch(err => console.error("Erreur profil :", err));
}, []);

// Ouvrir le chat d'une commande
const ouvrirChat = async (cmd) => {
  setChatCommande(cmd);
  setChatMessages([]);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://projet-iraky-delivery.onrender.com/api/commandes/${cmd.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    });
    const data = await res.json();
    if (Array.isArray(data)) setChatMessages(filtrerMessagesEffaces(cmd.id, data));
  } catch (err) {
    console.error("Erreur messages :", err);
  }
};

// Envoyer un message
const envoyerChatMsg = async () => {
  if (!chatMsg.trim() || !chatCommande) return;
  
  // ✅ Affiche le message IMMÉDIATEMENT côté UI sans attendre l'API
  const msgTemp = {
    id:          `temp_${Date.now()}`,
    texte:       chatMsg,
    sender_id:   profil.id,
    sender_role: "client",
    modifie:     false,
    lu:          false,
    time:        new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"}),
    created_at:  new Date().toISOString(),
    _sending:    true,  // flag temporaire
  };
  setChatMessages(prev => [...prev, msgTemp]);
  const texteEnvoi = chatMsg;
  setChatMsg("");         // ✅ Vide l'input immédiatement
  setChatLoading(true);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://projet-iraky-delivery.onrender.com/api/commandes/${chatCommande.id}/messages`,
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
      // ✅ Remplace le message temporaire par le vrai
      setChatMessages(prev => prev.map(m =>
        m.id === msgTemp.id
          ? { ...data.message, sender_id: profil.id }
          : m
      ));
    } else {
      // ✅ Supprime le message temporaire si erreur
      setChatMessages(prev => prev.filter(m => m.id !== msgTemp.id));
      showToast(data.message || "Erreur envoi", "error");
    }
  } catch {
    setChatMessages(prev => prev.filter(m => m.id !== msgTemp.id));
    showToast("Erreur de connexion", "error");
  }
  setChatLoading(false);
};
// Polling messages dans le chat (toutes les 5s quand ouvert)
// ── Polling global — notifs + commandes toutes les 2s ──────────
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchAll = () => {
    // Notifs
    fetch("https://projet-iraky-delivery.onrender.com/api/notifications", {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => setNotifs(Array.isArray(data) ? data : [])).catch(()=>{});

    // Commandes
    fetch("https://projet-iraky-delivery.onrender.com/api/commandes/mes-commandes", {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      setCommandes(data.map(c => ({
        ...c,
        coursier: c.coursier ? `${c.coursier.prenom} ${c.coursier.nom}` : null,
      })));
    }).catch(()=>{});
  };

  fetchAll();
  const interval = setInterval(fetchAll, 5000); // ✅ toutes les 2s
  return () => clearInterval(interval);
}, []);

// ── Charger les moyens de transport (tarifs) depuis la BDD ─────
useEffect(() => {
  const palette = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];
  fetch("https://projet-iraky-delivery.onrender.com/api/moyens-transport")
    .then(r => r.json())
    .then(data => {
      if (!Array.isArray(data)) return;
      setMoyens(data.map((m,i) => ({
        id:    m.id,                                   // ✅ id numérique réel de la BDD
        label: m.nom,
        icon:  m.icone || "🚗",
        tarif: Number(m.prix),
        temps: m.duree_estimee ? `${m.duree_estimee} min` : "—",
        color: palette[i % palette.length],
      })));
    })
    .catch(()=>{});
}, []);

// ── Polling messages chat toutes les 5s ─────────────────────────
useEffect(() => {
  if (!chatCommande) return;
  const token = localStorage.getItem("token");

  const fetchMessages = () => {
    fetch(`https://projet-iraky-delivery.onrender.com/api/commandes/${chatCommande.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setChatMessages(filtrerMessagesEffaces(chatCommande.id, data));
    }).catch(()=>{});
  };

  fetchMessages();
  const interval = setInterval(fetchMessages, 2000); // ✅ toutes les 2s
  return () => clearInterval(interval);
}, [chatCommande, messagesEffaces]);

  const tarifSel = moyens.find(m=>m.id===form.moyen)?.tarif || 0;

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  const publier = async () => {
    if (!form.service || !form.moyen || !form.detail || !form.heure_publication || !form.heure_debut || !form.heure_livraison) {
      showToast("Veuillez remplir tous les champs obligatoires", "error"); return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://projet-iraky-delivery.onrender.com/api/commandes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service:           SERVICES.find(s => s.id === form.service)?.label,
          moyen:             moyens.find(m => m.id === form.moyen)?.label,
          tarif:             tarifSel,
          detail:            form.detail,
          adresse_pickup:    form.adresse_pickup,
          heure_publication: form.heure_publication,
          heure_debut:       form.heure_debut,
          heure_livraison:   form.heure_livraison,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCommandes(prev => [data.commande, ...prev]);
        setNotifs(prev => [{
          id: Date.now(),
          texte: `Commande publiée — ${data.commande.service}`,
          lu: false, time: "À l'instant", type: "info",
        }, ...prev]);
        setForm({ service: "", moyen: "", detail: "", adresse_pickup: "", heure_publication: "", heure_debut: "", heure_livraison: "" });
        setOnglet("historique");
        showToast("🚀 Commande publiée ! Tous les coursiers ont été notifiés.");
      } else {
        showToast(data.message || "Erreur lors de la publication", "error");
      }
    } catch {
      showToast("Erreur de connexion au serveur", "error");
    }
    setLoading(false);
  };

const supprimer = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await fetch(`https://projet-iraky-delivery.onrender.com/api/commandes/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    setCommandes(prev => prev.filter(c => c.id !== id));
    setDetailCmd(null); setConfirmDel(null);
    showToast("Commande supprimée");
  } catch {
    showToast("Erreur lors de la suppression", "error");
  }
};

const noterCoursier = async (id, note) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://projet-iraky-delivery.onrender.com/api/commandes/${id}/terminer`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    });
    if (response.ok) {
      setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: "termine", note } : c));
      setNoteCmd(null); setNoteTmp(0);
      showToast("⭐ Merci pour votre évaluation !");
    }
  } catch {
    showToast("Erreur lors de l'évaluation", "error");
  }
};

  const nbNonLus = notifs.filter(n=>!n.lu).length;

  // styles
  const card = { backgroundColor:"#131330", borderRadius:18, border:"1px solid #FFD70018", padding:24, transition:"all 0.3s ease" };
  const inp  = { backgroundColor:"#0a0a1e", border:"1px solid #FFD70030", color:"#fff", borderRadius:12, padding:"11px 16px", width:"100%", fontSize:14, outline:"none", transition:"border-color 0.2s" };
  const btnY = { background:"linear-gradient(135deg,#FFD700,#ff9500)", color:"#000", border:"none", borderRadius:25, padding:"11px 28px", fontWeight:800, cursor:"pointer", fontSize:15, transition:"all 0.2s", boxShadow:"0 4px 20px #FFD70033" };

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#080820", fontFamily:"'Segoe UI', sans-serif", color:"#fff" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          backgroundColor: toast.type==="error"?"#ef4444":"#10b981",
          color:"#fff", padding:"14px 22px", borderRadius:14,
          boxShadow:"0 8px 30px rgba(0,0,0,0.4)", fontWeight:700, fontSize:14,
          animation:"slideIn 0.3s ease", display:"flex", alignItems:"center", gap:10,
          maxWidth:340,
        }}>
          {toast.type==="error"?"⚠️":"✅"} {toast.msg}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        backgroundColor:"rgba(8,8,32,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid #FFD70020", padding:"0 24px", height:66,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <button className="d-lg-none" onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{ background:"transparent", border:"1px solid #FFD70044", borderRadius:10,
            padding:"7px 10px", cursor:"pointer" }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{ width:20,height:2,backgroundColor:"#FFD700",margin:i<2?"0 0 4px 0":"0" }}/>
          ))}
        </button>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src={logo} alt="IRAKY"
              style={{ width:70, height:70, borderRadius:"50%" }}/>
            <span style={{ color:"#FFD700", fontWeight:800, fontSize:19,
              letterSpacing:-0.5 }} className="d-none d-sm-inline">
              IRAKY Delivery
            </span>
          </div>

        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          {/* cloche */}
         
          <div style={{ position:"relative", cursor:"pointer" }}
            onClick={()=>{ setNotifOpen(!notifOpen); setNotifs(p=>p.map(n=>({...n,lu:true}))); }}>
            <div style={{ width:38, height:38, borderRadius:"50%", backgroundColor:"#FFD70015",
              border:"1px solid #FFD70030", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <MdNotifications style={{ color:"#FFD700", fontSize:20 }}/>
            </div>
            {nbNonLus > 0 && (
              <span style={{
                position:"absolute", top:-2, right:-2,
                backgroundColor:"#ef4444", color:"#fff",
                borderRadius:"50%", width:19, height:19, fontSize:10, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:"2px solid #080820",
              }}>{nbNonLus}</span>
            )}
</div>
          {/* avatar */}
          <div style={{
            width:38, height:38, borderRadius:"50%",
            background:"linear-gradient(135deg,#FFD700,#ff8c00)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#000", fontWeight:800, fontSize:15,
            boxShadow:"0 0 12px #FFD70044", cursor:"pointer",
          }} onClick={()=>setOnglet("profil")}>
            {profil.prenom[0]}{profil.nom[0]}
          </div>

          <span style={{ color:"#ccc", fontSize:14 }} className="d-none d-md-inline">
            {profil.prenom}
          </span>
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
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexShrink:0 }}>
        <span style={{ color:"#FFD700", fontWeight:700, fontSize:14,
          display:"flex", alignItems:"center", gap:6 }}>
          <MdNotifications style={{ fontSize:18 }}/> Notifications
        </span>
        <span style={{ color:"#666", fontSize:12 }}>
          {notifs.filter(n => !n.lu).length} non lues
        </span>
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
              {/* Point non lu */}
              <div style={{ paddingTop:5, flexShrink:0 }}>
                <div style={{
                  width:8, height:8, borderRadius:"50%",
                  backgroundColor: n.lu ? "transparent" : "#FFD700",
                }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:n.lu?"#888":"#fff", fontSize:13,
                  margin:"0 0 4px 0", lineHeight:1.5 }}>{n.texte}</p>
                <small style={{ color:"#555", fontSize:11 }}>{n.time}</small>
              </div>
            </div>
            {/* Actions icônes */}
            <div style={{ display:"flex", gap:8, marginTop:8, paddingLeft:18 }}>
              {/* Voir → ouvre le chat si commande liée */}
                              {n.commande_id && (
                  <button
                    onClick={async () => {
                      setNotifOpen(false);

                      // ✅ Cherche la commande
                      const cmd = commandes.find(c => c.id === n.commande_id)
                              || commandes.find(c => c.id === parseInt(n.commande_id));

                      if (cmd) {
                        // ✅ Charge les messages et ouvre le chat
                        setChatMessages([]);
                        setChatCommande(cmd);

                        // Charge l'historique des messages
                        try {
                          const token = localStorage.getItem("token");
                          const res = await fetch(
                            `https://projet-iraky-delivery.onrender.com/api/commandes/${cmd.id}/messages`,
                            { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }
                          );
                          const data = await res.json();
                          if (Array.isArray(data)) setChatMessages(filtrerMessagesEffaces(cmd.id, data));
                        } catch {}

                        setOnglet("messages");
                      }

                      // Marquer comme lu
                      const token = localStorage.getItem("token");
                      await fetch(`https://projet-iraky-delivery.onrender.com/api/notifications/${n.id}/lu`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` },
                      });
                      setNotifs(p => p.map(x => x.id === n.id ? {...x, lu:true} : x));
                    }}
                    title="Voir / Répondre"
                    style={{ background:"#3b82f618", border:"1px solid #3b82f633",
                      color:"#3b82f6", borderRadius:8, padding:"4px 10px",
                      cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                    <MdChat style={{ fontSize:14 }}/> Répondre
                  </button>
                )}
                              {/* Supprimer */}
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await fetch(`https://projet-iraky-delivery.onrender.com/api/notifications/${n.id}`, {
                    method:"DELETE",
                    headers:{ "Authorization":`Bearer ${token}` },
                  });
                  setNotifs(p => p.filter(x => x.id !== n.id));
                }}
                title="Supprimer"
                style={{ background:"#ef444415", border:"1px solid #ef444430",
                  color:"#ef6666", borderRadius:8, padding:"4px 10px",
                  cursor:"pointer", fontSize:12, display:"flex",
                  alignItems:"center", gap:4 }}>
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
            await fetch("https://projet-iraky-delivery.onrender.com/api/notifications/tous-lus", {
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
      <div style={{ display:"flex", paddingTop:66 }}>

        {/* SIDEBAR desktop */}
        <aside className="d-none d-lg-block" style={{
          width:248, minHeight:"calc(100vh - 66px)",
          backgroundColor:"#0d0d28", borderRight:"1px solid #FFD70015",
          padding:"28px 0", position:"fixed", top:66, left:0, zIndex:50,
        }}>
          <SidebarContent onglet={onglet} setOnglet={setOnglet} profil={profil} commandes={commandes}/>
        </aside>

        {/* SIDEBAR mobile */}
        {sidebarOpen && (
          <>
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed",inset:0,backgroundColor:"#000a",zIndex:49 }}/>
            <aside style={{ width:248, position:"fixed", top:66, left:0, bottom:0,
              backgroundColor:"#0d0d28", borderRight:"1px solid #FFD70015",
              padding:"28px 0", zIndex:50, overflowY:"auto" }}>
              <SidebarContent onglet={onglet} setOnglet={o=>{setOnglet(o);setSidebarOpen(false);}}
                profil={profil} commandes={commandes}/>
            </aside>
          </>
        )}

        {/* MAIN */}
        <main id="main-content" style={{ flex:1, padding:"28px 20px", maxWidth:"100%" }}>
          <div style={{ maxWidth:920, margin:"0 auto" }}>

            {/* ═══ TABLEAU DE BORD ═══ */}
            {onglet==="accueil" && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <h3 style={{ color:"#fff", fontWeight:800, margin:0, fontSize:22 }}>
                    Bonjour, <span style={{ color:"#FFD700" }}>{profil.prenom}</span> 👋
                  </h3>
                  <p style={{ color:"#666", marginTop:4, fontSize:14 }}>Bienvenue sur votre espace IRAKY Delivery</p>
                </div>

                
               {/* stats colorées */}
                <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
                  {[
                    { label:"TOTAL",     val:commandes.length,                                                                            Icon:FaBox,         color:"#3b82f6" },
                    { label:"EN COURS",  val:commandes.filter(c=>["en_attente","negociable","accepte"].includes(c.statut)).length,        Icon:FaClock,       color:"#f59e0b" },
                    { label:"TERMINÉES", val:commandes.filter(c=>c.statut==="termine").length,                                            Icon:FaCheckCircle, color:"#10b981" },
                    { label:"REFUSÉES",  val:commandes.filter(c=>c.statut==="refuse").length,                                             Icon:FaTimesCircle, color:"#ef4444" },
                  ].map(s=>(
                    <div key={s.label} style={{
                      backgroundColor:"#131330",
                      borderRadius:12,
                      padding:"14px 20px",
                      border:`1px solid ${s.color}33`,
                      boxShadow:`0 4px 16px ${s.color}15`,
                      transition:"transform 0.2s, box-shadow 0.2s",
                      display:"flex", alignItems:"center", gap:16,
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${s.color}30`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 4px 16px ${s.color}15`; }}>

                      <div style={{
                        width:48, height:48, borderRadius:12,
                        backgroundColor:`${s.color}18`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                      }}>
                        <s.Icon style={{ color:s.color, fontSize:22 }}/>
                      </div>

                      <div>
                        <div style={{ color:"#fff", fontWeight:800, fontSize:26, lineHeight:1 }}>{s.val}</div>
                        <div style={{ color:"#888", fontWeight:600, fontSize:11, letterSpacing:1.5, marginTop:4 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* dernières commandes */}
                <div style={card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                                        <h5
                      style={{
                        color: "#FFD700",
                        margin: 0,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <MdListAlt style={{ fontSize: 20 }} />
                      Dernières commandes
                                   </h5>
                    <button onClick={()=>setOnglet("historique")}
                      style={{ background:"transparent", border:"1px solid #FFD70030", color:"#FFD700",
                        borderRadius:8, padding:"5px 14px", cursor:"pointer", fontSize:12 }}>
                      Voir tout
                    </button>
                  </div>
                  {commandes.slice(0,3).map(cmd=>(
                    <div key={cmd.id} onClick={()=>setDetailCmd(cmd)}
                      style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"12px 0", borderBottom:"1px solid #ffffff08", cursor:"pointer",
                        flexWrap:"wrap", gap:8 }}>
                      <div>
                        <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{cmd.service}</div>
                        <div style={{ color:"#666", fontSize:12 }}>{cmd.moyen} · {cmd.date}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <StatutBadge statut={cmd.statut}/>
                        <span style={{ color:"#FFD700", fontWeight:700, fontSize:14 }}>{cmd.tarif.toLocaleString()} Ar</span>
                      </div>
                    </div>
                  ))}
                  {commandes.length===0 && (
                    <p style={{ color:"#555", textAlign:"center", padding:"20px 0" }}>Aucune commande</p>
                  )}
                </div>

                {/* bouton rapide */}
<div style={{ display: "flex", justifyContent: "center",  marginTop:20 }}>
  <button
    onClick={() => setOnglet("nouvelle")}
    style={{
      ...btnY,
      fontSize: 16,
      padding: "14px 40px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <MdAddCircle style={{ fontSize: 20 }} />
    Passer une nouvelle commande
  </button>
</div>
              </div>
            )}

            {/* ═══ NOUVELLE COMMANDE ═══ */}
            {onglet==="nouvelle" && (
              <div>
                <h4 style={{ color:"#FFD700", marginBottom:6, fontWeight:800, fontSize:20,
  display:"flex", alignItems:"center", gap:12 }}>
  <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"#FFD70018",
    border:"1px solid #FFD70033", display:"flex", alignItems:"center",
    justifyContent:"center", flexShrink:0 }}>
    <MdAddCircle style={{ color:"#FFD700", fontSize:22 }}/>
  </div>
  Nouvelle commande
</h4>
                <p style={{ color:"#666", marginBottom:24, fontSize:14 }}>Remplissez le formulaire et publiez votre demande aux coursiers disponibles.</p>

                <div style={card}>

                  {/* ── ÉTAPE 1 : Service ── */}
                  <div style={{ marginBottom:28 }}>
                    <label style={{ color:"#FFD700", fontSize:13, fontWeight:700,
                      display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                      <span style={{ backgroundColor:"#FFD700", color:"#000", borderRadius:"50%",
                        width:22, height:22, display:"inline-flex", alignItems:"center",
                        justifyContent:"center", fontSize:12, fontWeight:800 }}>1</span>
                      Choisissez votre type de service
                    </label>

                    {/* grille 4+4 */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                      {SERVICES.map(s=>{
                        const sel = form.service===s.id;
                        const hov = serviceHov===s.id;
                        return (
                          <div key={s.id}
                            onClick={()=>setForm(f=>({...f,service:s.id}))}
                            onMouseEnter={()=>setServiceHov(s.id)}
                            onMouseLeave={()=>setServiceHov(null)}
                            style={{
                              borderRadius:16, padding:"20px 12px", textAlign:"center",
                              cursor:"pointer",
                              border: sel?`2px solid ${s.color}`:`1px solid ${hov?s.color+"44":"#ffffff12"}`,
                              background: sel?`${s.color}18`:(hov?`${s.color}0a`:"#0a0a1e"),
                              transition:"all 0.22s ease",
                              transform: sel||hov?"translateY(-3px)":"translateY(0)",
                              boxShadow: sel?`0 8px 24px ${s.color}30`:hov?`0 4px 16px ${s.color}20`:"none",
                              position:"relative", overflow:"hidden",
                            }}>
                            {sel && (
                              <div style={{ position:"absolute", top:8, right:8,
                                backgroundColor:s.color, borderRadius:"50%",
                                width:18, height:18, display:"flex", alignItems:"center",
                                justifyContent:"center", fontSize:11, fontWeight:800, color:"#000" }}>✓</div>
                            )}
                                                      <div style={{
                                        width: 70, height: 70,
                                        margin: "0 auto 10px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: `${s.color}22`,
                                      }}>
                                        {typeof s.icon === "string" && !s.icon.includes("/") ? (
                                          <span style={{ fontSize: 34 }}>{s.icon}</span>
                                        ) : (
                                          <img
                                            src={s.icon}
                                            alt={s.label}
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "cover",
                                            }}
                                          />
                                        )}
                                      </div>
                                            <div style={{ color: sel?s.color:(hov?"#fff":"#aaa"),
                              fontWeight:700, fontSize:12, lineHeight:1.3, marginBottom:6,
                              transition:"color 0.2s" }}>{s.label}</div>
                            <div style={{ color:"#555", fontSize:10, lineHeight:1.4,
                              display: sel||hov?"block":"none",
                              transition:"all 0.2s" }}>{s.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── ÉTAPE 2 : Moyen ── */}
                  <div style={{ marginBottom:28 }}>
                    <label style={{ color:"#FFD700", fontSize:13, fontWeight:700,
                      display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                      <span style={{ backgroundColor:"#FFD700", color:"#000", borderRadius:"50%",
                        width:22, height:22, display:"inline-flex", alignItems:"center",
                        justifyContent:"center", fontSize:12, fontWeight:800 }}>2</span>
                      Choisissez votre moyen de course
                    </label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                      {moyens.map(m=>{
                        const sel = form.moyen===m.id;
                        const hov = moyenHov===m.id;
                        return (
                          <div key={m.id}
                            onClick={()=>setForm(f=>({...f,moyen:m.id}))}
                            onMouseEnter={()=>setMoyenHov(m.id)}
                            onMouseLeave={()=>setMoyenHov(null)}
                            style={{
                              borderRadius:16, padding:"18px 10px", textAlign:"center",
                              cursor:"pointer",
                              border: sel?`2px solid ${m.color}`:`1px solid ${hov?m.color+"44":"#ffffff12"}`,
                              background: sel?`${m.color}18`:(hov?`${m.color}0a`:"#0a0a1e"),
                              transition:"all 0.22s ease",
                              transform: sel||hov?"translateY(-3px)":"translateY(0)",
                              boxShadow: sel?`0 8px 24px ${m.color}30`:hov?`0 4px 12px ${m.color}20`:"none",
                              position:"relative",
                            }}>
                            {sel && (
                              <div style={{ position:"absolute", top:8, right:8,
                                backgroundColor:m.color, borderRadius:"50%",
                                width:18, height:18, display:"flex", alignItems:"center",
                                justifyContent:"center", fontSize:11, color:"#000", fontWeight:800 }}>✓</div>
                            )}
                            <div style={{ fontSize:32, marginBottom:8 }}>{m.icon}</div>
                            <div style={{ color:sel?m.color:"#fff", fontWeight:700, fontSize:13 }}>{m.label}</div>
                            <div style={{ color:"#FFD700", fontSize:13, fontWeight:800, marginTop:4 }}>
                              {m.tarif.toLocaleString()} Ar
                            </div>
                            <div style={{ color:"#666", fontSize:11, marginTop:3 }}>⏱ ~{m.temps}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── ÉTAPE 3 : Détails ── */}
<div style={{ marginBottom:28 }}>
  <label style={{ color:"#FFD700", fontSize:13, fontWeight:700,
    display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
    <span style={{ backgroundColor:"#FFD700", color:"#000", borderRadius:"50%",
      width:22, height:22, display:"inline-flex", alignItems:"center",
      justifyContent:"center", fontSize:12, fontWeight:800 }}>3</span>
    Détails de la commande
  </label>

  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

    {/* Description */}
    <div style={{ gridColumn:"1/-1" }}>
      <label style={{ color:"#aaa", fontSize:12, display:"flex",
        alignItems:"center", gap:6, marginBottom:6 }}>
        <MdDescription style={{ color:"#FFD700", fontSize:15 }}/>
        Description de la course
        <span style={{ color:"#ef4444" }}>*</span>
      </label>
      <textarea value={form.detail}
        onChange={e=>setForm(f=>({...f,detail:e.target.value}))}
        placeholder="Ex: Payer facture JIRAMA N°12345, acheter riz 5kg + huile 2L..."
        rows={3}
        style={{ ...inp, resize:"vertical" }}
        onFocus={e=>e.target.style.borderColor="#FFD700"}
        onBlur={e=>e.target.style.borderColor="#FFD70030"}
      />
    </div>

    {/* Adresse */}
    <div style={{ gridColumn:"1/-1" }}>
      <label style={{ color:"#aaa", fontSize:12, display:"flex",
        alignItems:"center", gap:6, marginBottom:6 }}>
        <MdLocationOn style={{ color:"#f59e0b", fontSize:15 }}/>
        Adresse de prise en charge
      </label>
      <input type="text" value={form.adresse_pickup}
        onChange={e=>setForm(f=>({...f,adresse_pickup:e.target.value}))}
        placeholder="Ex: Rue de l'Église, Toliara centre..."
        style={inp}
        onFocus={e=>e.target.style.borderColor="#FFD700"}
        onBlur={e=>e.target.style.borderColor="#FFD70030"}
      />
    </div>

    {/* Heure publication */}
    <div>
      <label style={{ color:"#aaa", fontSize:12, display:"flex",
        alignItems:"center", gap:6, marginBottom:6 }}>
        <MdCampaign style={{ color:"#8b5cf6", fontSize:15 }}/>
        Heure de publication
        <span style={{ color:"#ef4444" }}>*</span>
      </label>
      <input type="time" value={form.heure_publication}
        onChange={e=>setForm(f=>({...f,heure_publication:e.target.value}))}
        style={inp}
        onFocus={e=>e.target.style.borderColor="#FFD700"}
        onBlur={e=>e.target.style.borderColor="#FFD70030"}
      />
      <small style={{ color:"#555", fontSize:11, marginTop:4, display:"block" }}>
        Heure à laquelle vous publiez l'annonce
      </small>
    </div>

    {/* Heure début */}
    <div>
      <label style={{ color:"#aaa", fontSize:12, display:"flex",
        alignItems:"center", gap:6, marginBottom:6 }}>
        <MdAccessTime style={{ color:"#f59e0b", fontSize:15 }}/>
        Heure de début souhaitée
        <span style={{ color:"#ef4444" }}>*</span>
      </label>
      <input type="time" value={form.heure_debut}
        onChange={e=>setForm(f=>({...f,heure_debut:e.target.value}))}
        style={inp}
        onFocus={e=>e.target.style.borderColor="#FFD700"}
        onBlur={e=>e.target.style.borderColor="#FFD70030"}
      />
      <small style={{ color:"#555", fontSize:11, marginTop:4, display:"block" }}>
        Quand souhaitez-vous que le coursier parte ?
      </small>
    </div>

    {/* Heure livraison */}
    <div>
      <label style={{ color:"#aaa", fontSize:12, display:"flex",
        alignItems:"center", gap:6, marginBottom:6 }}>
        <MdLocalShipping style={{ color:"#ec4899", fontSize:15 }}/>
        Heure de livraison souhaitée
        <span style={{ color:"#ef4444" }}>*</span>
      </label>
      <input type="time" value={form.heure_livraison}
        onChange={e=>setForm(f=>({...f,heure_livraison:e.target.value}))}
        style={inp}
        onFocus={e=>e.target.style.borderColor="#FFD700"}
        onBlur={e=>e.target.style.borderColor="#FFD70030"}
      />
      <small style={{ color:"#555", fontSize:11, marginTop:4, display:"block" }}>
        Heure limite de livraison
      </small>
    </div>

  </div>
</div>
{form.service && form.moyen && (
  <div style={{ background:"linear-gradient(135deg,#FFD70012,#ff950008)",
    border:"1px solid #FFD70030", borderRadius:14, padding:18, marginBottom:24 }}>

    {/* Titre récap */}
    <div style={{ color:"#FFD700", fontWeight:700, marginBottom:12, fontSize:14,
      display:"flex", alignItems:"center", gap:8 }}>
      <MdSummarize style={{ fontSize:18 }}/> Récapitulatif de la commande
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
      {[
        { Icon:MdMiscellaneousServices, label:"Service",    val:SERVICES.find(s=>s.id===form.service)?.label||"—", color:"#FFD700" },
        { Icon:MdDirectionsBike,        label:"Moyen",      val:moyens.find(m=>m.id===form.moyen)?.label||"—",     color:"#3b82f6" },
        { Icon:MdAttachMoney,           label:"Tarif",      val:`${tarifSel.toLocaleString()} Ar`,                  color:"#10b981" },
        { Icon:MdCampaign,              label:"Publie à",   val:form.heure_publication||"—",                        color:"#8b5cf6" },
        { Icon:MdAccessTime,            label:"Début",      val:form.heure_debut||"—",                              color:"#f59e0b" },
        { Icon:MdLocalShipping,         label:"Livraison",  val:form.heure_livraison||"—",                          color:"#ec4899" },
      ].map(({Icon, label, val, color})=>(
        <div key={label} style={{ backgroundColor:"#0a0a1e40", borderRadius:10,
          padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
            backgroundColor:`${color}18`, border:`1px solid ${color}33`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon style={{ color:color, fontSize:16 }}/>
          </div>
          <div>
            <div style={{ color:"#666", fontSize:11 }}>{label}</div>
            <div style={{ color:"#FFD700", fontWeight:700, fontSize:13, marginTop:2 }}>{val}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

<button onClick={publier} disabled={loading}
  style={{ ...btnY, width:"100%", fontSize:16, padding:"15px", opacity:loading?0.7:1,
    display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
  {loading
    ? <><MdAccessTime style={{ fontSize:20 }}/> Publication en cours...</>
    : <><MdCampaign   style={{ fontSize:22 }}/> Publier la commande aux coursiers</>
  }
</button>
                </div>
              </div>
            )}

            {/* ═══ HISTORIQUE ═══ */}
            {onglet==="historique" && (
              <div>
                            <h4 style={{ color:"#FFD700", marginBottom:6, fontWeight:800, fontSize:20,
              display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"#FFD70018",
                border:"1px solid #FFD70033", display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0 }}>
                <MdListAlt style={{ color:"#FFD700", fontSize:22 }}/>
              </div>
              Mes commandes
            </h4>
                <p style={{ color:"#666", marginBottom:24, fontSize:14 }}>{commandes.length} commande(s) au total</p>

                {commandes.filter(c=>!historiqueMasques.includes(c.id)).length===0 && (
                  <div style={{ ...card, textAlign:"center", color:"#666", padding:48 }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                    Aucune commande pour l'instant.
                    <br/>
                    <button onClick={()=>setOnglet("nouvelle")} style={{ ...btnY, marginTop:16, fontSize:13 }}>
                      Passer une commande
                    </button>
                  </div>
                )}

                {commandes.filter(c=>!historiqueMasques.includes(c.id)).map(cmd => {
                  const svc = SERVICES.find(s=>s.label===cmd.service);
                  const moy = moyens.find(m=>m.label===cmd.moyen);
                  return (
                    <div key={cmd.id} style={{ ...card, marginBottom:14, cursor:"pointer",
                      transition:"all 0.2s" }}
                      onClick={()=>setDetailCmd(cmd)}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor="#FFD70033"; e.currentTarget.style.transform="translateY(-1px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="#FFD70018"; e.currentTarget.style.transform="translateY(0)"; }}>

                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                        <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      {/* ✅ Même logique que nouvelle commande */}
                      <div style={{
                        width:40, height:40, borderRadius:"50%", overflow:"hidden", flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        backgroundColor: svc ? `${svc.color}22` : "#ffffff11",
                      }}>
                        {svc ? (
                          typeof svc.icon === "string" && !svc.icon.includes("/") ? (
                            <span style={{ fontSize:20 }}>{svc.icon}</span>
                          ) : (
                            <img src={svc.icon} alt={svc.label}
                              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          )
                        ) : (
                          <span style={{ fontSize:20 }}>📦</span>
                        )}
                      </div>
                      <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{cmd.service}</span>
                    </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                            <span style={{ color:"#888", fontSize:12 }}>
                              {moy?.icon} {cmd.moyen}
                            </span>
                            <span style={{ color:"#888", fontSize:12 }}>📅 {cmd.date}</span>
                            {cmd.heure_publication && (
                              <span style={{ color:"#888", fontSize:12 }}>📢 Publié à {cmd.heure_publication}</span>
                            )}
                            <span style={{ color:"#888", fontSize:12 }}>🕐 {cmd.heure_debut} → {cmd.heure_livraison}</span>
                          </div>
                          {cmd.coursier && (
                            <div style={{ color:"#aaa", fontSize:13, marginTop:8 }}>
                              👤 Coursier : <strong style={{ color:"#FFD700" }}>{cmd.coursier}</strong>
                            </div>
                          )}
                          <div style={{ color:"#666", fontSize:12, marginTop:6,
                            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:320 }}>
                            {cmd.detail}
                          </div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
                            <StatutBadge statut={cmd.statut}/>
                            <button
                              onClick={e=>{ e.stopPropagation(); demanderRetraitHistorique(cmd.id); }}
                              title="Retirer de mes commandes (reste visible côté admin)"
                              style={{ background:"#ef444415", border:"1px solid #ef444430",
                                color:"#ef6666", borderRadius:8, width:28, height:28, cursor:"pointer",
                                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <MdDelete style={{ fontSize:14 }}/>
                            </button>
                          </div>
                          <div style={{ color:"#FFD700", fontWeight:800, marginTop:8, fontSize:16 }}>
                            {cmd.tarif.toLocaleString()} Ar
                          </div>
                        </div>
                      </div>

                      {/* noter */}
                      {cmd.statut==="termine" && (
                        <div style={{ marginTop:14, borderTop:"1px solid #FFD70010", paddingTop:14 }}>
                          {cmd.note ? (
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <span style={{ color:"#888", fontSize:13 }}>Votre évaluation :</span>
                              <Etoiles value={cmd.note}/>
                            </div>
                          ) : (
                            <button onClick={e=>{ e.stopPropagation(); setNoteCmd(cmd); }}
                              style={{ ...btnY, padding:"7px 18px", fontSize:13 }}>
                              ⭐ Évaluer le coursier
                            </button>
                          )}
                        </div>
                      )}

                      {/* supprimer */}
                      {(cmd.statut==="en_attente"||cmd.statut==="refuse") && (
                        <div style={{ marginTop:10 }}>
                          <button onClick={e=>{ e.stopPropagation(); setConfirmDel(cmd.id); }}
                            style={{ backgroundColor:"#ef444415", color:"#ef6666",
                              border:"1px solid #ef444430", borderRadius:8,
                              padding:"6px 16px", fontSize:12, cursor:"pointer", fontWeight:700 }}>
                            🗑 Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ═══ MESSAGES ═══ */}
{/* ═══ MESSAGES CLIENT ═══ */}
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
      Vos conversations avec les coursiers
    </p>

    {commandes.filter(c => c.coursier && c.statut !== "en_attente" && !messagesMasques.includes(c.id)).length === 0 ? (
      <div style={{ ...card, textAlign:"center", color:"#555", padding:48 }}>
        <MdChat style={{ fontSize:56, color:"#333", marginBottom:12 }}/>
        <p>Aucune conversation active.</p>
        <p style={{ fontSize:13 }}>Vos messages apparaîtront ici lorsqu'un coursier prend votre commande.</p>
      </div>
    ) : (
      commandes.filter(c => c.coursier && c.statut !== "en_attente" && !messagesMasques.includes(c.id)).map(cmd => (
        <div key={cmd.id}
          onClick={() => { setChatCommande(cmd); setChatMessages([]); }}
          style={{ ...card, marginBottom:14, cursor:"pointer",
            borderLeft:`4px solid ${STATUT_CONFIG[cmd.statut]?.color||"#FFD700"}`,
            transition:"all 0.2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,215,0,0.1)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:46, height:46, borderRadius:"50%",
                background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, color:"#000", fontSize:16, flexShrink:0 }}>
                {cmd.coursier?.[0]}
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{cmd.coursier}</div>
                <div style={{ color:"#888", fontSize:12 }}>{cmd.service} · {cmd.date}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ backgroundColor:STATUT_CONFIG[cmd.statut]?.bg,
                color:STATUT_CONFIG[cmd.statut]?.color,
                borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700,
                border:`1px solid ${STATUT_CONFIG[cmd.statut]?.color}44` }}>
                {STATUT_CONFIG[cmd.statut]?.icon} {STATUT_CONFIG[cmd.statut]?.label}
              </span>
              <div style={{ backgroundColor:"#3b82f618", border:"1px solid #3b82f633",
                color:"#3b82f6", borderRadius:10, padding:"7px 16px",
                fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                <MdChat style={{ fontSize:16 }}/> Ouvrir
              </div>
              {/* supprimer */}
              <button
                onClick={e=>{ e.stopPropagation(); demanderRetraitMessage(cmd.id); }}
                title="Supprimer cette conversation (reste visible côté admin)"
                style={{ background:"#ef444415", border:"1px solid #ef444430",
                  color:"#ef6666", borderRadius:8, width:28, height:28, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <MdDelete style={{ fontSize:14 }}/>
              </button>
            </div>
          </div>
        </div>
      ))
    )}

    {/* Fenêtre chat fixe en bas — même style coursier */}
    {chatCommande && (
      <div style={{ position:"fixed", bottom:0, right:20, width:400, zIndex:300,
        backgroundColor:"#131330", border:"1px solid #FFD70030",
        borderRadius:"16px 16px 0 0", boxShadow:"0 -8px 40px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #FFD70018",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"linear-gradient(135deg,#FFD70015,#ff950008)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%",
              background:"linear-gradient(135deg,#FFD700,#ff8c00)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, color:"#000", fontSize:14 }}>
              {chatCommande.coursier?.[0]}
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{chatCommande.coursier}</div>
              <div style={{ color:"#10b981", fontSize:11, display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#10b981" }}/>
                {chatCommande.service}
              </div>
            </div>
          </div>
          <button onClick={() => { setChatCommande(null); setChatMessages([]); }}
            style={{ background:"transparent", border:"none", color:"#666", fontSize:20, cursor:"pointer" }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="#666"}>✕</button>
        </div>

        {/* Accord client */}
        <div style={{ padding:"10px 14px", backgroundColor:"#0a0a1e",
          borderBottom:"1px solid #FFD70018" }}>
          <div style={{ color:"#aaa", fontSize:11, marginBottom:6, fontWeight:600 }}>
            Accord de service :
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                const res = await fetch(
                  `https://projet-iraky-delivery.onrender.com/api/commandes/${chatCommande.id}/accepter-client`,
                  { method:"POST", headers:{ "Authorization":`Bearer ${token}`, "Accept":"application/json" } }
                );
                const data = await res.json();
                if (res.ok) {
                  setChatCommande(prev => ({...prev, accord_client:true, statut:data.commande?.statut||prev.statut}));
                  showToast("✅ Vous avez accepté l'accord !");
                } else {
                  showToast(data.message||"Erreur", "error");
                }
              }}
              disabled={chatCommande.accord_client}
              style={{ padding:"6px 14px", borderRadius:16, fontWeight:700, fontSize:12, border:"none",
                cursor:chatCommande.accord_client?"not-allowed":"pointer",
                backgroundColor:chatCommande.accord_client?"#10b981":"#10b98122",
                color:chatCommande.accord_client?"#fff":"#10b981" }}>
              {chatCommande.accord_client ? "✅ Accepté" : "✅ Accepter"}
            </button>
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                const res = await fetch(
                  `https://projet-iraky-delivery.onrender.com/api/commandes/${chatCommande.id}/refuser`,
                  { method:"POST", headers:{ "Authorization":`Bearer ${token}`, "Accept":"application/json" } }
                );
                if (res.ok) {
                  setChatCommande(prev => ({...prev, statut:"en_attente", accord_client:false, accord_coursier:false}));
                  showToast("❌ Accord refusé", "error");
                }
              }}
              style={{ padding:"6px 14px", borderRadius:16, fontWeight:700, fontSize:12,
                border:"none", cursor:"pointer", backgroundColor:"#ef444422", color:"#ef4444" }}>
              ❌ Refuser
            </button>
          </div>
          <div style={{ marginTop:6, display:"flex", gap:12 }}>
            <span style={{ fontSize:11, color:chatCommande.accord_client?"#10b981":"#666" }}>
              {chatCommande.accord_client?"✅":"⬜"} Client
            </span>
            <span style={{ fontSize:11, color:chatCommande.accord_coursier?"#10b981":"#666" }}>
              {chatCommande.accord_coursier?"✅":"⬜"} Coursier
            </span>
          </div>
        </div>

        {/* Messages */}
       {/* ✅ Barre d'outils */}
        <div style={{ padding:"8px 14px", backgroundColor:"#0d0d22",
          borderBottom:"1px solid #FFD70010", display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#666", fontSize:11 }}>{chatMessages.length} message(s)</span>
          <div style={{ display:"flex", gap:8 }}>
            {modeSelection && selectedMsgs.size > 0 && (
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await Promise.all([...selectedMsgs].map(msgId =>
                    fetch(`https://projet-iraky-delivery.onrender.com/api/commandes/${chatCommande.id}/messages/${msgId}`, {
                      method: "DELETE",
                      headers: { "Authorization": `Bearer ${token}` },
                    })
                  ));
                  // ✅ Persiste la suppression côté client (localStorage) pour
                  //    que ces messages ne reviennent jamais, même si l'API
                  //    les renvoie encore après déconnexion/reconnexion.
                  ajouterMessagesEffaces(chatCommande.id, [...selectedMsgs]);
                  setChatMessages(prev => prev.filter(m => !selectedMsgs.has(m.id)));
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
              onClick={() => { setModeSelection(!modeSelection); setSelectedMsgs(new Set()); }}
              style={{ background: modeSelection ? "#FFD70020" : "transparent",
                border:`1px solid ${modeSelection ? "#FFD70044" : "#ffffff20"}`,
                color: modeSelection ? "#FFD700" : "#666",
                borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:11 }}>
              {modeSelection ? "✕ Annuler" : "☑ Sélectionner"}
            </button>
          </div>
        </div>

        {/* ✅ Messages */}
        <div style={{ height:240, overflowY:"auto", padding:14,
          display:"flex", flexDirection:"column", gap:10 }}>
          {chatMessages.length === 0 && (
            <div style={{ color:"#555", textAlign:"center", fontSize:13, marginTop:40 }}>
              Commencez la conversation
            </div>
          )}
          {chatMessages.map((m, i) => {
            const isClient = m.sender_role === "client"
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
                  justifyContent: isClient ? "flex-end" : "flex-start",
                  cursor: modeSelection ? "pointer" : "default",
                  opacity: modeSelection && !isSelected ? 0.6 : 1,
                }}>
                {modeSelection && (
                  <div style={{ width:18, height:18, borderRadius:4, flexShrink:0,
                    border:`2px solid ${isSelected ? "#FFD700" : "#444"}`,
                    backgroundColor: isSelected ? "#FFD700" : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginRight:8, alignSelf:"center", fontSize:11, color:"#000" }}>
                    {isSelected && "✓"}
                  </div>
                )}
                {!isClient && !modeSelection && (
                  <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                    background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, color:"#000", fontSize:11, marginRight:6, alignSelf:"flex-end" }}>
                    {chatCommande.coursier?.[0]}
                  </div>
                )}
                <div style={{
                  backgroundColor: isSelected ? "#FFD70033"
                    : isClient ? "#FFD70022" : "#1a1a35",
                  border:`1px solid ${isSelected ? "#FFD700" : isClient ? "#FFD70044" : "#ffffff15"}`,
                  borderRadius: isClient ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding:"9px 14px", maxWidth:"75%",
                  transition:"all 0.15s",
                }}>
                  <div style={{ color:"#fff", fontSize:13, lineHeight:1.5 }}>{m.texte}</div>
                  <div style={{ color:"#666", fontSize:10, marginTop:3, textAlign:"right",
                    display:"flex", gap:6, justifyContent:"flex-end", alignItems:"center" }}>
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

        {/* ✅ Input — envoyerChatMsg + chatMsg */}
        <div style={{ padding:"10px 14px", borderTop:"1px solid #FFD70018", display:"flex", gap:8 }}>
          <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&chatMsg.trim()&&envoyerChatMsg()}
            placeholder="Écrire au coursier..."
            style={{ flex:1, backgroundColor:"#0a0a1e", border:"1px solid #FFD70030",
              color:"#fff", borderRadius:12, padding:"9px 14px", fontSize:13, outline:"none" }}
            onFocus={e=>e.target.style.borderColor="#FFD700"}
            onBlur={e=>e.target.style.borderColor="#FFD70030"}
          />
          <button onClick={envoyerChatMsg}
            disabled={!chatMsg.trim() || chatLoading}
            style={{
              background:"linear-gradient(135deg,#FFD700,#ff9500)",
              color:"#000", border:"none", borderRadius:12, padding:"9px 14px",
              cursor: chatMsg.trim() && !chatLoading ? "pointer" : "not-allowed",
              opacity: chatMsg.trim() ? 1 : 0.4,
              display:"flex", alignItems:"center", justifyContent:"center",
              minWidth:42,
            }}>
            {chatLoading
              ? <div style={{ width:16, height:16, border:"2px solid #000",
                  borderTop:"2px solid transparent", borderRadius:"50%",
                  animation:"spin 0.6s linear infinite" }}/>
              : <MdSend style={{ fontSize:18 }}/>
            }
          </button>
        </div>
      </div>
    )}
  </div>
)}
            {/* ═══ SUIVI ═══ */}
{/* ═══ SUIVI ═══ */}
{onglet === "suivi" && (
  <div>
    <h4 style={{ color:"#FFD700", marginBottom:6, fontWeight:800, fontSize:20,
      display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"#FFD70018",
        border:"1px solid #FFD70033", display:"flex", alignItems:"center",
        justifyContent:"center", flexShrink:0 }}>
        <MdLocationOn style={{ color:"#FFD700", fontSize:22 }}/>
      </div>
      Suivi en temps réel
    </h4>
    <p style={{ color:"#666", marginBottom:24, fontSize:14 }}>Commandes actives en ce moment</p>

    {(() => {
      // ✅ Exclut aussi les commandes masquées localement par le client
      // (n'affecte que cet affichage — la BDD et l'admin ne sont jamais touchés)
      const suiviActif = commandes.filter(c =>
        ["en_attente","negociable","accepte"].includes(c.statut) && !suiviMasques.includes(c.id)
      );
      return suiviActif.length === 0 ? (
      <div style={{ ...card, textAlign:"center", color:"#666", padding:48 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🏁</div>
        Aucune commande active en ce moment.
      </div>
    ) : (
      suiviActif.map(cmd => {
        const steps = ["en_attente","negociable","accepte","termine"];
        const idx   = steps.indexOf(cmd.statut);
        return (
          <div key={cmd.id} style={{ ...card, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              flexWrap:"wrap", gap:10, marginBottom:20 }}>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{cmd.service}</div>
                <div style={{ color:"#888", fontSize:13, marginTop:4 }}>
                  {cmd.moyen} · 📢 {cmd.heure_publication} · 🕐 {cmd.heure_debut} → {cmd.heure_livraison}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <StatutBadge statut={cmd.statut}/>
                <button
                  onClick={()=>demanderRetraitSuivi(cmd.id)}
                  title="Retirer de mon suivi (reste visible côté admin)"
                  style={{ background:"#ef444415", border:"1px solid #ef444430",
                    color:"#ef6666", borderRadius:8, width:32, height:32, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <MdDelete style={{ fontSize:16 }}/>
                </button>
              </div>
            </div>

            {/* Barre progression */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:10 }}>
              {steps.map((s, i) => {
                const done = i <= idx;
                return (
                  <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{
                      width:36, height:36, borderRadius:"50%", flexShrink:0,
                      background: done ? "linear-gradient(135deg,#FFD700,#ff9500)" : "#1a1a35",
                      border: done ? "none" : "2px solid #ffffff15",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14, fontWeight:800, color:done?"#000":"#444",
                      boxShadow: done ? "0 0 12px #FFD70055" : "none",
                      transition:"all 0.4s",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    {i < 3 && (
                      <div style={{
                        flex:1, height:4, borderRadius:2,
                        background: i < idx ? "linear-gradient(90deg,#FFD700,#ff9500)" : "#ffffff0f",
                        transition:"all 0.4s",
                      }}/>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              {["En attente","Négociation","Accepté","Terminé"].map((l, i) => (
                <span key={l} style={{ fontSize:11, color:i<=idx?"#FFD700":"#444",
                  flex:1, textAlign:i===0?"left":i===3?"right":"center",
                  fontWeight:i<=idx?600:400 }}>{l}</span>
              ))}
            </div>

            {/* Coursier assigné */}
                {cmd.coursier && (
                  <div style={{ marginTop:8, padding:14,
                    background:"linear-gradient(135deg,#FFD70010,#ff950008)",
                    borderRadius:12, border:"1px solid #FFD70025",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    flexWrap:"wrap", gap:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%",
                        background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontWeight:800, color:"#000", fontSize:14 }}>
                        {cmd.coursier[0]}
                      </div>
                      <div>
                        <div style={{ color:"#FFD700", fontWeight:700, fontSize:14 }}>{cmd.coursier}</div>
                        {/* ✅ Étoile du coursier directement visible */}
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <Etoiles value={cmd.coursier_note || 0}/>
                          <span style={{ color:"#888", fontSize:11 }}>({cmd.coursier_note || 0}/5)</span>
                        </div>
                      </div>
                    </div>

                {/* ✅ Bouton terminer — visible uniquement si statut = accepte */}
{cmd.statut === "accepte" && (
  <button
    onClick={async () => {
      const { isConfirmed } = await Swal.fire({
        title: "Terminer la mission ?",
        html: `Confirmer la fin de la mission <b>"${cmd.service}"</b> ?<br/>
          Le coursier recevra 1 étoile automatiquement.`,
        background: "#131330",
        color: "#fff",
        showCancelButton: true,
        confirmButtonText: "Oui, terminer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#333355",
        reverseButtons: true,
        customClass: { popup: "swal-iraky" },
      });
      if (!isConfirmed) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://projet-iraky-delivery.onrender.com/api/commandes/${cmd.id}/terminer`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ note: 1 }),
          }
        );
        const data = await res.json();
          if (res.ok) {
            // ✅ Efface immédiatement la commande du suivi
            setCommandes(prev => prev.filter(c => c.id !== cmd.id));
            // ✅ Retour direct au tableau de bord sans délai
            setOnglet("accueil");
            showToast("🏁 Mission terminée ! Le coursier a reçu 1 ⭐", "success");

          // ✅ Refetch immédiat pour éviter toute désync avec le polling
          const resFresh = await fetch("https://projet-iraky-delivery.onrender.com/api/commandes/mes-commandes", {
            headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
          });
          const fresh = await resFresh.json();
          if (Array.isArray(fresh)) {
            setCommandes(fresh.map(c => ({
              ...c,
              coursier: c.coursier ? `${c.coursier.prenom} ${c.coursier.nom}` : null,
              coursier_note: c.coursier_note ?? null,
            })));
          }

          setTimeout(() => setOnglet("historique"), 1500);
        } else {
          // ✅ Affiche le vrai message d'erreur backend (pas générique)
          showToast(data.message || "Erreur lors de la finalisation", "error");
          console.error("Erreur terminer():", data);
        }
      } catch (err) {
        showToast("Erreur de connexion", "error");
        console.error(err);
      }
    }}
    style={{
      background: "linear-gradient(135deg,#10b981,#059669)",
      color: "#fff", border: "none", borderRadius: 12,
      padding: "10px 20px", cursor: "pointer",
      fontWeight: 700, fontSize: 13,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 16px #10b98133",
      transition: "all 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Marquer comme terminé
  </button>
)}
              </div>
            )}
          </div>
        );
      })
    );
    })()}
  </div>
)}

            {/* ═══ PROFIL ═══ */}
            {onglet==="profil" && (
              <div>
               
                    <h4 style={{ color:"#FFD700", marginBottom:24, fontWeight:800, fontSize:20,
                      display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{
                        width:38, height:38, borderRadius:10,
                        backgroundColor:"#FFD70018",
                        border:"1px solid #FFD70033",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                      }}>
                        <MdPerson style={{ color:"#FFD700", fontSize:22 }}/>
                      </div>
                      Mon profil
                    </h4>
                <div style={card}>
                  <div style={{ textAlign:"center", marginBottom:28 }}>
                    <div style={{
                      width:90, height:90, borderRadius:"50%",
                      background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                      margin:"0 auto 14px",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:36, fontWeight:800, color:"#000",
                      boxShadow:"0 0 30px #FFD70044",
                    }}>
                      {profil.prenom[0]}{profil.nom[0]}
                    </div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>
                      {profil.prenom?.[0]}{profil.nom?.[0]}
                    </div>
                    <div style={{ marginTop:6 }}>
                      <span style={{ backgroundColor:"#FFD70018", color:"#FFD700",
                        borderRadius:20, padding:"3px 14px", fontSize:12, border:"1px solid #FFD70033" }}>
                        ✦ Client IRAKY
                      </span>
                    </div>
                  </div>
            {[
              { Icon:MdPerson,     label:"Nom",       val:profil.nom,       color:"#FFD700" },
              { Icon:FaUser,       label:"Prénom",    val:profil.prenom,    color:"#3b82f6" },
              { Icon:MdEmail,      label:"Email",     val:profil.email,     color:"#8b5cf6" },
              { Icon:MdPhone,      label:"Téléphone", val:profil.telephone, color:"#10b981" },
              { Icon:MdLocationOn, label:"Adresse",   val:profil.adresse,   color:"#f59e0b" },
            ].map(({Icon, label, val, color})=>(
              <div key={label} style={{ backgroundColor:"#0a0a1e", borderRadius:12,
                padding:"14px 18px", border:"1px solid #FFD70018",
                transition:"all 0.2s", display:"flex", alignItems:"center", gap:14 }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#FFD70033"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#FFD70018"}>

                {/* Icône colorée */}
                <div style={{
                  width:40, height:40, borderRadius:10, flexShrink:0,
                  backgroundColor:`${color}18`,
                  border:`1px solid ${color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon style={{ color:color, fontSize:20 }}/>
                </div>

                <div>
                  <div style={{ color:"#666", fontSize:11, marginBottom:3 }}>{label}</div>
                  <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{val}</div>
                </div>
              </div>
            ))}

                  <div style={{ background:"linear-gradient(135deg,#FFD70012,#ff950008)",
                    borderRadius:14, padding:20, border:"1px solid #FFD70025" }}>

                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                      <div style={{
                        width:36, height:36, borderRadius:10,
                        backgroundColor:"#FFD70018",
                        border:"1px solid #FFD70033",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                      }}>
                        <MdBarChart style={{ color:"#FFD700", fontSize:20 }}/>
                      </div>
                      <span style={{ color:"#FFD700", fontWeight:700, fontSize:15 }}>
                        Mes statistiques
                      </span>
                    </div>
                        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                          {[
                            { label:"TOTAL",     val:commandes.length,                                                                            Icon:FaBox,         color:"#3b82f6" },
                            { label:"EN COURS",  val:commandes.filter(c=>["en_attente","negociable","accepte"].includes(c.statut)).length,        Icon:FaClock,       color:"#f59e0b" },
                            { label:"TERMINÉES", val:commandes.filter(c=>c.statut==="termine").length,                                            Icon:FaCheckCircle, color:"#10b981" },
                            { label:"REFUSÉES",  val:commandes.filter(c=>c.statut==="refuse").length,                                             Icon:FaTimesCircle, color:"#ef4444" },
                          ].map(s=>(
                            <div key={s.label} style={{
                              backgroundColor:"#131330",
                              borderRadius:12,
                              padding:"14px 20px",
                              border:`1px solid ${s.color}33`,
                              boxShadow:`0 4px 16px ${s.color}15`,
                              transition:"transform 0.2s, box-shadow 0.2s",
                              display:"flex", alignItems:"center", gap:16,
                            }}
                            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${s.color}30`; }}
                            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 4px 16px ${s.color}15`; }}>
                              <div style={{
                                width:48, height:48, borderRadius:12,
                                backgroundColor:`${s.color}18`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                flexShrink:0,
                              }}>
                                <s.Icon style={{ color:s.color, fontSize:22 }}/>
                              </div>
                              <div>
                                <div style={{ color:"#fff", fontWeight:800, fontSize:26, lineHeight:1 }}>{s.val}</div>
                                <div style={{ color:"#888", fontWeight:600, fontSize:11, letterSpacing:1.5, marginTop:4 }}>{s.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                  </div>
                </div>
              </div>
            )}

                  {/* ═══ AIDE ═══ */}
                  {onglet === "aide" && (
                    <div>
                  <h4 style={{ color:"#FFD700", marginBottom:6, fontWeight:800, fontSize:20,
                    display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"#FFD70018",
                      border:"1px solid #FFD70033", display:"flex", alignItems:"center",
                      justifyContent:"center", flexShrink:0 }}>
                      <MdHelp style={{ color:"#FFD700", fontSize:22 }}/>
                    </div>
                    Aide & Support
                  </h4>
                      <p style={{ color:"#666", marginBottom:28, fontSize:14 }}>
                        Comment pouvons-nous vous aider ?
                      </p>

                      {aideVue === "menu" && (<>
                      {/* 4 boxes react-icons */}
                      <div style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(4,1fr)",
                        gap:16,
                        marginBottom:32,
                      }} className="aide-grid">
                        {[
                          { Icon:MdPhone,    title:"Nous appeler",   desc:"+261 38 21 266 83",         color:"#10b981", bg:"#10b98115", action:"Appeler maintenant →",
                            onClick:() => { window.location.href = "tel:+261382126683"; } },
                          { Icon:MdChat,     title:"Chat en direct", desc:"Réponse en moins de 5 min", color:"#3b82f6", bg:"#3b82f615", action:"Démarrer le chat →",
                            onClick:() => setAideVue("chat") },
                          { Icon:MdEmail,    title:"Email support",  desc:"irakydelivery@gmail.com",   color:"#8b5cf6", bg:"#8b5cf615", action:"Envoyer un email →",
                            onClick:() => { window.location.href = `mailto:irakydelivery@gmail.com?subject=${encodeURIComponent("Support IRAKY Delivery - "+(profil.nom||""))}`; } },
                          { Icon:MdMenuBook, title:"Guide complet",  desc:"Tutoriels pas à pas",       color:"#f59e0b", bg:"#f59e0b15", action:"Lire le guide →",
                            onClick:() => { setGuideOuvert(0); setAideVue("guide"); } },
                        ].map((item, i) => (
                          <div key={i}
                            onClick={item.onClick}
                            className="aide-card-anim"
                            style={{
                              backgroundColor:"#131330",
                              borderRadius:16,
                              padding:"28px 20px",
                              border:`1px solid ${item.color}30`,
                              cursor:"pointer",
                              transition:"all 0.3s ease",
                              position:"relative",
                              overflow:"hidden",
                              animationDelay:`${i*0.08}s`,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-6px) scale(1.015)";
                              e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}30`;
                              e.currentTarget.style.borderColor = `${item.color}66`;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0) scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.borderColor = `${item.color}30`;
                            }}
                          >
                            {/* Cercle décoratif */}
                            <div style={{
                              position:"absolute", top:-20, right:-20,
                              width:80, height:80, borderRadius:"50%",
                              backgroundColor:`${item.color}10`,
                            }}/>

                            {/* Icône */}
                            <div style={{
                              width:56, height:56, borderRadius:14,
                              backgroundColor:item.bg,
                              border:`1px solid ${item.color}33`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              marginBottom:16,
                            }}>
                              <item.Icon style={{ color:item.color, fontSize:26 }}/>
                            </div>

                            <div style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:6 }}>
                              {item.title}
                            </div>
                            <div style={{ color:"#888", fontSize:12, lineHeight:1.5, marginBottom:14 }}>
                              {item.desc}
                            </div>
                            <div style={{ color:item.color, fontSize:12, fontWeight:700 }}>
                              {item.action}
                            </div>

                            {/* Barre colorée bas */}
                            <div style={{
                              position:"absolute", bottom:0, left:0, right:0, height:3,
                              background:`linear-gradient(90deg,${item.color},transparent)`,
                            }}/>
                          </div>
                        ))}
                      </div>

                      {/* FAQ */}
                      <div style={{ ...card }}>
                        <div style={{
                          color:"#FFD700", fontWeight:700, marginBottom:16, fontSize:15,
                          display:"flex", alignItems:"center", gap:8,
                        }}>
                          <MdMenuBook style={{ fontSize:20 }}/> Questions fréquentes
                        </div>
                        {[
                          ["Comment fonctionne IRAKY Delivery ?", "Vous publiez une commande, un coursier disponible la prend en charge et effectue le service pour vous."],
                          ["Combien coûte le service ?",           "Les tarifs varient selon le moyen : Piéton 5000 Ar, Vélo 6000 Ar, Moto 8000 Ar, Voiture 12000 Ar."],
                          ["Puis-je annuler une commande ?",       "Oui, vous pouvez supprimer une commande en statut 'En attente' ou 'Refusée'."],
                          ["Comment noter un coursier ?",          "Après qu'une commande soit 'Terminée', un bouton d'évaluation apparaît dans vos commandes."],
                        ].map(([q, a], i) => (
                          <details key={i} style={{
                            marginBottom:10, backgroundColor:"#0a0a1e",
                            borderRadius:12, border:"1px solid #FFD70015", padding:"14px 18px",
                          }}>
                            <summary style={{
                              color:"#fff", fontWeight:600, cursor:"pointer", fontSize:14,
                              listStyle:"none", display:"flex",
                              justifyContent:"space-between", alignItems:"center",
                            }}>
                              {q}
                              <span style={{ color:"#FFD700", fontSize:18 }}>+</span>
                            </summary>
                            <p style={{
                              color:"#888", fontSize:13, marginTop:10,
                              lineHeight:1.6, marginBottom:0,
                            }}>{a}</p>
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
                          display:"flex", flexDirection:"column",
                        }}>
                          {/* Header */}
                          <div style={{
                            display:"flex", alignItems:"center", gap:12,
                            padding:"16px 18px", borderBottom:"1px solid #3b82f625",
                            background:"linear-gradient(135deg,#3b82f618,#8b5cf610)",
                          }}>
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

                          {/* Messages */}
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
                                <p style={{ fontSize:13 }}>Bonjour {profil.nom} 👋<br/>Posez-nous votre question, notre équipe vous répond ici.</p>
                              </div>
                            )}
                            {supportMessages.map((m, i) => {
                              const isClient = m.sender_role === "client"
                                || (profil.id && parseInt(m.sender_id) === parseInt(profil.id));
                              const estBot = !isClient && (m.bot || m.sender_id === null || m.sender_id === undefined);
                              return (
                                <div key={m.id || i} className="aide-msg-in"
                                  style={{ display:"flex", justifyContent: isClient ? "flex-end" : "flex-start" }}>
                                  {!isClient && (
                                    <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                                      background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                                      display:"flex", alignItems:"center", justifyContent:"center",
                                      marginRight:6, alignSelf:"flex-end" }}>
                                      <MdSupportAgent style={{ color:"#fff", fontSize:13 }}/>
                                    </div>
                                  )}
                                  <div style={{
                                    backgroundColor: isClient ? "#3b82f622" : "#1a1a35",
                                    border:`1px solid ${m.echec ? "#ef4444" : isClient ? "#3b82f644" : "#ffffff15"}`,
                                    borderRadius: isClient ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    padding:"9px 14px", maxWidth:"75%", opacity: m.envoi ? 0.6 : 1,
                                  }}>
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

                          {/* Input */}
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
                                minWidth:44, transition:"transform 0.15s",
                              }}
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
                              Ce guide couvre toutes les fonctionnalités de votre espace client IRAKY Delivery.
                              Cliquez sur une section pour dérouler les explications.
                            </div>
                          </div>

                          {GUIDE_SECTIONS.map((s, i) => {
                            const ouvert = guideOuvert === i;
                            return (
                              <div key={i} className="aide-card-anim" style={{
                                animationDelay:`${i*0.06}s`,
                                backgroundColor:"#131330", borderRadius:14,
                                border:`1px solid ${ouvert ? s.color+"55" : "#ffffff15"}`,
                                marginBottom:12, overflow:"hidden",
                                transition:"border-color 0.25s",
                              }}>
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
                                  overflow:"hidden",
                                }}>
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
      {detailCmd && (
        <Modal onClose={()=>setDetailCmd(null)} size="lg">
          <h5 style={{ color:"#FFD700", marginBottom:20, fontWeight:800, fontSize:17,
            display:"flex", alignItems:"center", gap:12 }}>
            {(() => {
              const svc = SERVICES.find(s => s.label === detailCmd.service);
              if (!svc) return <span>📦</span>;
              return typeof svc.icon === "string" && !svc.icon.includes("/") ? (
                <span style={{ fontSize:22 }}>{svc.icon}</span>
              ) : (
                <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden",
                  backgroundColor:`${svc.color}22`, flexShrink:0 }}>
                  <img src={svc.icon} alt={svc.label}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
              );
            })()}
            {detailCmd.service}
          </h5>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
            {[
              ["Moyen",              detailCmd.moyen],
              ["Tarif",              `${detailCmd.tarif?.toLocaleString()} Ar`],
              ["Statut",             STATUT_CONFIG[detailCmd.statut]?.label],
              ["Date",               detailCmd.date],
              ["Heure publication",  detailCmd.heure_publication||"—"],
              ["Heure de début",     detailCmd.heure_debut],
              ["Heure de livraison", detailCmd.heure_livraison],
              ["Coursier",           detailCmd.coursier||"Non assigné"],
            ].map(([k,v])=>(
              <div key={k} style={{ padding:"10px 0", borderBottom:"1px solid #ffffff08" }}>
                <div style={{ color:"#666", fontSize:11, marginBottom:3 }}>{k}</div>
                <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:"12px 16px", backgroundColor:"#0a0a1e",
            borderRadius:12, border:"1px solid #FFD70018" }}>
            <div style={{ color:"#666", fontSize:11, marginBottom:4 }}>Description</div>
            <div style={{ color:"#fff", fontSize:13, lineHeight:1.6 }}>{detailCmd.detail}</div>
          </div>
          {detailCmd.note && (
            <div style={{ marginTop:14 }}>
              <div style={{ color:"#888", fontSize:13, marginBottom:6 }}>Évaluation donnée :</div>
              <Etoiles value={detailCmd.note}/>
            </div>
          )}
        </Modal>
      )}

      {/* MODAL NOTE */}
{noteCmd && (
  <Modal onClose={() => {}} size="md"> {/* onClose vide = impossible de fermer sans noter */}
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "linear-gradient(135deg,#FFD700,#ff9500)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px", boxShadow: "0 0 24px #FFD70055",
      }}>
        <MdStar style={{ fontSize: 32, color: "#000" }} />
      </div>

      <h5 style={{ color: "#FFD700", fontWeight: 800, marginBottom: 6 }}>
        Mission terminée !
      </h5>
      <p style={{ color: "#aaa", fontSize: 14, marginBottom: 4 }}>
        Coursier : <strong style={{ color: "#fff" }}>{noteCmd.coursier}</strong>
      </p>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
        Merci de noter le service rendu — une note est obligatoire.
      </p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <Etoiles value={noteTmp} onChange={setNoteTmp} />
      </div>

      {noteTmp > 0 && (
        <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
          {["", "Mauvais 😞", "Passable 😐", "Bien 🙂", "Très bien 😊", "Excellent 🤩"][noteTmp]}
        </div>
      )}

      <button
        onClick={() => noterCoursier(noteCmd.id, noteTmp)}
        disabled={!noteTmp}
        style={{
          ...btnY, width: "100%", fontSize: 15,
          opacity: noteTmp ? 1 : 0.4,
          cursor: noteTmp ? "pointer" : "not-allowed",
        }}
      >
        Confirmer la note
      </button>
    </div>
  </Modal>
)}

      {/* MODAL SUPPRESSION */}
      {confirmDel && (
        <Modal onClose={()=>setConfirmDel(null)}>
          <h5 style={{ color:"#ef4444", marginBottom:12, fontWeight:800 }}>🗑 Confirmer la suppression</h5>
          <p style={{ color:"#aaa", fontSize:14, marginBottom:24, lineHeight:1.6 }}>
            Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.
          </p>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={()=>setConfirmDel(null)}
              style={{ flex:1, padding:"12px", borderRadius:12, border:"1px solid #ffffff20",
                backgroundColor:"transparent", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              Annuler
            </button>
            <button onClick={()=>supprimer(confirmDel)}
              style={{ flex:1, padding:"12px", borderRadius:12, border:"none",
                backgroundColor:"#ef4444", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              Supprimer
            </button>
          </div>
        </Modal>
      )}


 <style>{`
  @keyframes slideIn { from{transform:translateY(-16px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes modalIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

  @media(min-width:992px){
    #main-content{ margin-left:248px !important; }
  }

  @media(max-width:768px){
    #main-content{ margin-left:0 !important; }
    .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
    .services-grid{ grid-template-columns:repeat(2,1fr) !important; }
    .moyens-grid  { grid-template-columns:repeat(2,1fr) !important; }
    .aide-grid    { grid-template-columns:repeat(2,1fr) !important; }
  }

@keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

  @media(max-width:480px){
    .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
    .services-grid{ grid-template-columns:repeat(2,1fr) !important; }
    .moyens-grid  { grid-template-columns:repeat(2,1fr) !important; }
    .aide-grid    { grid-template-columns:1fr !important; }
  }

   { box-sizing:border-box; }
  body { overflow-x:hidden; }
  input[type=time]::-webkit-calendar-picker-indicator{ filter:invert(1) brightness(0.6); }
  textarea:focus, input:focus { border-color:#FFD700 !important; }
  details summary::-webkit-details-marker { display:none; }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* ══ Aide & Support ══ */
  .aide-card-anim { opacity:0; animation: aideCardIn 0.5s ease forwards; }
  @keyframes aideCardIn { from{opacity:0; transform:translateY(18px) scale(0.97)} to{opacity:1; transform:translateY(0) scale(1)} }

  .aide-fade-in { opacity:0; animation: aideFadeIn 0.35s ease forwards; }
  @keyframes aideFadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }

  .aide-msg-in { opacity:0; animation: aideMsgIn 0.3s ease forwards; }
  @keyframes aideMsgIn { from{opacity:0; transform:translateY(10px) scale(0.98)} to{opacity:1; transform:translateY(0) scale(1)} }

  .aide-dot-online { display:inline-block; width:7px; height:7px; border-radius:50%;
    background:#3b82f6; box-shadow:0 0 0 0 #3b82f680; animation: aidePulse 1.6s infinite; }
  @keyframes aidePulse {
    0%   { box-shadow:0 0 0 0 #3b82f660; }
    70%  { box-shadow:0 0 0 6px #3b82f600; }
    100% { box-shadow:0 0 0 0 #3b82f600; }
  }

  .aide-typing-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6;
    display:inline-block; animation: aideTypingBounce 1s infinite ease-in-out; }
  @keyframes aideTypingBounce {
    0%, 60%, 100% { transform:translateY(0); opacity:0.5; }
    30%           { transform:translateY(-5px); opacity:1; }
  }
`}</style>
    </div>
  );
}

export default DashboardClient;