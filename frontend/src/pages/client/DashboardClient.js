import React, { useState, useEffect, useRef } from "react";
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
const MOYENS = [
  { id:"pieton",  label:"Piéton",  icon:"🚶", tarif:5000,  temps:"50 min", color:"#10b981" },
  { id:"velo",    label:"Vélo",    icon:"🚲", tarif:6000,  temps:"40 min", color:"#3b82f6" },
  { id:"moto",    label:"Moto",    icon:"🏍️", tarif:8000,  temps:"25 min", color:"#f59e0b" },
  { id:"voiture", label:"Voiture", icon:"🚗", tarif:12000, temps:"20 min", color:"#ef4444" },
];

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
  const enCours = commandes.filter(c =>
    ["en_attente","negociable","accepte"].includes(c.statut)
  ).length;

  const nbMessages = commandes.filter(c =>
    c.coursier && c.statut !== "en_attente"
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
          </div>
        ))}
      </div>

      {/* bouton déconnexion */}
      <div style={{ padding:16 }}>
        <button onClick={() => { localStorage.clear(); window.location.href="/connexion"; }}
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
  const [toast, setToast]             = useState(null);
  const [serviceHov, setServiceHov]   = useState(null);
  const [moyenHov, setMoyenHov]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [chatCommande, setChatCommande] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMsg, setChatMsg]           = useState("");
  const [chatLoading, setChatLoading]   = useState(false);
  const messagesEndRef                  = useRef(null);

  const [form, setForm] = useState({
    service:"", moyen:"", detail:"", adresse_pickup:"",
    heure_publication:"", heure_debut:"", heure_livraison:"",
  });
  
  const [selectedMsgs, setSelectedMsgs] = useState(new Set());
  const [modeSelection, setModeSelection] = useState(false);

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
  fetch("http://localhost:8000/api/me", {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
  })
    .then(res => { if (res.status === 401) { localStorage.clear(); window.location.href="/connexion"; } return res.json(); })
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
    const res = await fetch(`http://localhost:8000/api/commandes/${cmd.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    });
    const data = await res.json();
    if (Array.isArray(data)) setChatMessages(data);
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
      `http://localhost:8000/api/commandes/${chatCommande.id}/messages`,
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
    fetch("http://localhost:8000/api/notifications", {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => setNotifs(Array.isArray(data) ? data : [])).catch(()=>{});

    // Commandes
    fetch("http://localhost:8000/api/commandes/mes-commandes", {
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
  const interval = setInterval(fetchAll, 2000); // ✅ toutes les 2s
  return () => clearInterval(interval);
}, []);

// ── Polling messages chat toutes les 2s ─────────────────────────
useEffect(() => {
  if (!chatCommande) return;
  const token = localStorage.getItem("token");

  const fetchMessages = () => {
    fetch(`http://localhost:8000/api/commandes/${chatCommande.id}/messages`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setChatMessages(data);
    }).catch(()=>{});
  };

  fetchMessages();
  const interval = setInterval(fetchMessages, 2000); // ✅ toutes les 2s
  return () => clearInterval(interval);
}, [chatCommande]);

  const tarifSel = MOYENS.find(m=>m.id===form.moyen)?.tarif || 0;

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
      const response = await fetch("http://localhost:8000/api/commandes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service:           SERVICES.find(s => s.id === form.service)?.label,
          moyen:             MOYENS.find(m => m.id === form.moyen)?.label,
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
    await fetch(`http://localhost:8000/api/commandes/${id}`, {
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
    const response = await fetch(`http://localhost:8000/api/commandes/${id}/terminer`, {
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
                            `http://localhost:8000/api/commandes/${cmd.id}/messages`,
                            { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }
                          );
                          const data = await res.json();
                          if (Array.isArray(data)) setChatMessages(data);
                        } catch {}

                        setOnglet("messages");
                      }

                      // Marquer comme lu
                      const token = localStorage.getItem("token");
                      await fetch(`http://localhost:8000/api/notifications/${n.id}/lu`, {
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
                  await fetch(`http://localhost:8000/api/notifications/${n.id}`, {
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
            await fetch("http://localhost:8000/api/notifications/tous-lus", {
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
                      {MOYENS.map(m=>{
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
        { Icon:MdDirectionsBike,        label:"Moyen",      val:MOYENS.find(m=>m.id===form.moyen)?.label||"—",     color:"#3b82f6" },
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

                {commandes.length===0 && (
                  <div style={{ ...card, textAlign:"center", color:"#666", padding:48 }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                    Aucune commande pour l'instant.
                    <br/>
                    <button onClick={()=>setOnglet("nouvelle")} style={{ ...btnY, marginTop:16, fontSize:13 }}>
                      Passer une commande
                    </button>
                  </div>
                )}

                {commandes.map(cmd => {
                  const svc = SERVICES.find(s=>s.label===cmd.service);
                  const moy = MOYENS.find(m=>m.label===cmd.moyen);
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
                          <StatutBadge statut={cmd.statut}/>
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

    {commandes.filter(c => c.coursier && c.statut !== "en_attente").length === 0 ? (
      <div style={{ ...card, textAlign:"center", color:"#555", padding:48 }}>
        <MdChat style={{ fontSize:56, color:"#333", marginBottom:12 }}/>
        <p>Aucune conversation active.</p>
        <p style={{ fontSize:13 }}>Vos messages apparaîtront ici lorsqu'un coursier prend votre commande.</p>
      </div>
    ) : (
      commandes.filter(c => c.coursier && c.statut !== "en_attente").map(cmd => (
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
                  `http://localhost:8000/api/commandes/${chatCommande.id}/accepter-client`,
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
                  `http://localhost:8000/api/commandes/${chatCommande.id}/refuser`,
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
                    fetch(`http://localhost:8000/api/commandes/${chatCommande.id}/messages/${msgId}`, {
                      method: "DELETE",
                      headers: { "Authorization": `Bearer ${token}` },
                    })
                  ));
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

    {commandes.filter(c=>["en_attente","negociable","accepte"].includes(c.statut)).length === 0 ? (
      <div style={{ ...card, textAlign:"center", color:"#666", padding:48 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🏁</div>
        Aucune commande active en ce moment.
      </div>
    ) : (
      commandes.filter(c=>["en_attente","negociable","accepte"].includes(c.statut)).map(cmd => {
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
              <StatutBadge statut={cmd.statut}/>
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
                    <div style={{ color:"#888", fontSize:12 }}>Coursier assigné</div>
                  </div>
                </div>

                {/* ✅ Bouton terminer — visible uniquement si statut = accepte */}
                {cmd.statut === "accepte" && (
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Confirmer la fin de la mission "${cmd.service}" ?\nLe coursier recevra 1 étoile automatiquement.`)) return;
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          `http://localhost:8000/api/commandes/${cmd.id}/terminer`,
                          {
                            method: "POST",
                            headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ note: 1 }), // ✅ 1 étoile par défaut
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          setCommandes(prev => prev.map(c =>
                            c.id === cmd.id ? { ...c, statut: "termine", note: 1 } : c
                          ));
                          showToast("🏁 Mission terminée ! Le coursier a reçu 1 ⭐");
                          // ✅ Redirige vers historique pour noter
                          setTimeout(() => setOnglet("historique"), 1500);
                        } else {
                          showToast(data.message || "Erreur", "error");
                        }
                      } catch {
                        showToast("Erreur de connexion", "error");
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
                    {/* ✅ Icône modifier/check */}
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
    )}
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

                      {/* 4 boxes react-icons */}
                      <div style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(4,1fr)",
                        gap:16,
                        marginBottom:32,
                      }} className="aide-grid">
                        {[
                          { Icon:MdPhone,    title:"Nous appeler",   desc:"+261 38 21 266 83",         color:"#10b981", bg:"#10b98115", action:"Appeler maintenant →" },
                          { Icon:MdChat,     title:"Chat en direct", desc:"Réponse en moins de 5 min", color:"#3b82f6", bg:"#3b82f615", action:"Démarrer le chat →"   },
                          { Icon:MdEmail,    title:"Email support",  desc:"irakydelivery@gmail.com",   color:"#8b5cf6", bg:"#8b5cf615", action:"Envoyer un email →"    },
                          { Icon:MdMenuBook, title:"Guide complet",  desc:"Tutoriels pas à pas",       color:"#f59e0b", bg:"#f59e0b15", action:"Lire le guide →"       },
                        ].map((item, i) => (
                          <div key={i}
                            style={{
                              backgroundColor:"#131330",
                              borderRadius:16,
                              padding:"28px 20px",
                              border:`1px solid ${item.color}30`,
                              cursor:"pointer",
                              transition:"all 0.3s ease",
                              position:"relative",
                              overflow:"hidden",
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-6px)";
                              e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}30`;
                              e.currentTarget.style.borderColor = `${item.color}66`;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
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
        <Modal onClose={()=>{ setNoteCmd(null); setNoteTmp(0); }}>
          <h5 style={{ color:"#FFD700", marginBottom:10, fontWeight:800 }}>⭐ Évaluer le coursier</h5>
          <p style={{ color:"#aaa", fontSize:14, marginBottom:20, lineHeight:1.6 }}>
            Coursier : <strong style={{ color:"#fff" }}>{noteCmd.coursier}</strong><br/>
            Service : {noteCmd.service}
          </p>
          <div style={{ marginBottom:10 }}>
            <div style={{ color:"#888", fontSize:13, marginBottom:10 }}>Votre note :</div>
            <Etoiles value={noteTmp} onChange={setNoteTmp}/>
            {noteTmp>0 && (
              <div style={{ color:"#FFD700", fontSize:13, marginTop:8 }}>
                {["","Mauvais 😞","Passable 😐","Bien 🙂","Très bien 😊","Excellent 🤩"][noteTmp]}
              </div>
            )}
          </div>
          <button onClick={()=>noterCoursier(noteCmd.id,noteTmp)}
            disabled={!noteTmp}
            style={{ ...btnY, width:"100%", marginTop:16, opacity:noteTmp?1:0.4 }}>
            Valider l'évaluation
          </button>
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
`}</style>
    </div>
  );
}

export default DashboardClient;