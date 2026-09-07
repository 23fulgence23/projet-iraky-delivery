import { useState, useEffect } from "react";
import logo from "../../images/logo.png";
import {
  MdDashboard, MdPeople, MdDeliveryDining, MdListAlt, MdSettings,
  MdLogout, MdNotifications, MdCheckCircle, MdCancel, MdVisibility,
  MdBlock, MdVerified, MdEmail, MdPhone, MdBadge, MdStar,
  MdAttachMoney, MdSchedule, MdSearch, MdAdminPanelSettings,
  MdWarning, MdBarChart, MdPieChart, MdShowChart, MdDelete, MdDoneAll,MdClose,
  MdEdit, MdPersonAdd, MdAdd,
  MdHistory, MdEmojiEvents, MdMilitaryTech, MdWorkHistory, MdFilterList,
  MdForum,
} from "react-icons/md";

const BASE_URL = "https://projet-iraky-delivery.onrender.com";

// ══════════════════════════════════════════════
//  COULEURS STATUT — style original inchangé
// ══════════════════════════════════════════════
const STATUT_COLORS = {
  actif:      { color:"#10b981", bg:"#10b98118", label:"Actif"      },
  inactif:    { color:"#ef4444", bg:"#ef444418", label:"Inactif"    },
  paye:       { color:"#10b981", bg:"#10b98118", label:"Payé"       },
  impaye:     { color:"#ef4444", bg:"#ef444418", label:"Impayé"     },
  attente:    { color:"#f59e0b", bg:"#f59e0b18", label:"En attente" },
  en_attente: { color:"#f59e0b", bg:"#f59e0b18", label:"En attente" },
  negociable: { color:"#3b82f6", bg:"#3b82f618", label:"Négociation"},
  accepte:    { color:"#10b981", bg:"#10b98118", label:"Accepté"    },
  refuse:     { color:"#ef4444", bg:"#ef444418", label:"Refusé"     },
  termine:    { color:"#8b5cf6", bg:"#8b5cf618", label:"Terminé"    },
};

function StatutBadge({ statut }) {
  const s = STATUT_COLORS[statut] || { color:"#888", bg:"#88888818", label: statut };
  return (
    <span style={{ backgroundColor:s.bg, color:s.color, borderRadius:20,
      padding:"3px 12px", fontSize:11, fontWeight:700, border:`1px solid ${s.color}44` }}>
      {s.label}
    </span>
  );
}

// ══════════════════════════════════════════════
//  MODAL — style original inchangé
// ══════════════════════════════════════════════
function Modal({ children, onClose, size="md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:400,
      backgroundColor:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        backgroundColor:"#0f1128", borderRadius:20, padding:28,
        width:"100%", maxWidth:size==="lg"?700:size==="xl"?900:500,
        border:"1px solid #FFD70030", boxShadow:"0 32px 80px rgba(0,0,0,0.8)",
        animation:"modalIn 0.25s ease", maxHeight:"92vh", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{ float:"right", background:"transparent",
          border:"none", color:"#555", fontSize:22, cursor:"pointer" }}
          onMouseEnter={e=>e.target.style.color="#fff"}
          onMouseLeave={e=>e.target.style.color="#555"}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  BARCHART — style original inchangé
// ══════════════════════════════════════════════
function BarChart({ data, color="#FFD700", height=80 }) {
  const max = Math.max(...data.map(d=>d.val), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", borderRadius:"4px 4px 0 0",
            backgroundColor:`${color}22`, position:"relative", height:height-20 }}>
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              backgroundColor:color, borderRadius:"4px 4px 0 0",
              height:`${(d.val/max)*100}%`,
              transition:"height 0.8s ease",
              boxShadow:`0 0 8px ${color}66`,
            }}/>
          </div>
          <span style={{ color:"#666", fontSize:9, fontWeight:600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
//  DONUT CHART — style original inchangé
// ══════════════════════════════════════════════
function DonutChart({ segments, size=120 }) {
  const total = segments.reduce((s,seg)=>s+seg.val, 0) || 1;
  let cumul = 0;
  const r = 40, cx = 60, cy = 60, stroke = 14;
  const circumference = 2*Math.PI*r;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a35" strokeWidth={stroke}/>
      {segments.map((seg,i) => {
        const dash = (seg.val/total)*circumference;
        const offset = circumference - cumul*(circumference/total) - circumference*0.25;
        cumul += seg.val;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference-dash}`}
            strokeDashoffset={-offset + circumference*0.25}
            style={{ transition:"stroke-dasharray 1s ease" }}/>
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill="#FFD700" fontSize="14" fontWeight="800">{total}</text>
      <text x={cx} y={cy+14} textAnchor="middle" dominantBaseline="middle"
        fill="#666" fontSize="8">TOTAL</text>
    </svg>
  );
}

// ══════════════════════════════════════════════
//  SIDEBAR — style original inchangé
// ══════════════════════════════════════════════
function SidebarContent({ onglet, setOnglet, stats, supportNonLus }) {
  const items = [
    { id:"accueil",   Icon:MdDashboard,      label:"Tableau de bord",  badge:0                        },
    { id:"clients",   Icon:MdPeople,         label:"Clients",           badge:stats.clients_inactifs   },
    { id:"coursiers", Icon:MdDeliveryDining, label:"Coursiers",         badge:stats.coursiers_inactifs },
    { id:"commandes", Icon:MdListAlt,        label:"Commandes",         badge:0                        },
    { id:"paiements", Icon:MdAttachMoney,    label:"Abonnements",       badge:0                        },
    { id:"historique",Icon:MdHistory,        label:"Historique",        badge:0                        },
    { id:"support",   Icon:MdForum,          label:"Support Chat",      badge:supportNonLus || 0       },
    { id:"settings",  Icon:MdSettings,       label:"Paramètres",        badge:0                        },
  ];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"0 20px 24px", borderBottom:"1px solid #FFD70018", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:12,
            background:"linear-gradient(135deg,#FFD700,#ff4500)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 16px #FFD70055" }}>
            <MdAdminPanelSettings style={{ color:"#000", fontSize:26 }}/>
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>Administrateur</div>
            <div style={{ color:"#FFD700", fontSize:11, fontWeight:600 }}>IRAKY Delivery</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, paddingTop:4 }}>
        {items.map(item => (
          <div key={item.id} onClick={()=>setOnglet(item.id)}
            style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px 20px", cursor:"pointer", fontSize:13.5,
              backgroundColor:onglet===item.id?"#FFD70012":"transparent",
              borderLeft:onglet===item.id?"3px solid #FFD700":"3px solid transparent",
              color:onglet===item.id?"#FFD700":"#8888aa",
              transition:"all 0.18s", borderRadius:"0 10px 10px 0", marginRight:8,
            }}
            onMouseEnter={e=>{ if(onglet!==item.id){ e.currentTarget.style.backgroundColor="#ffffff08"; e.currentTarget.style.color="#fff"; }}}
            onMouseLeave={e=>{ if(onglet!==item.id){ e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#8888aa"; }}}>
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <item.Icon style={{ fontSize:18 }}/> {item.label}
            </span>
            {item.badge > 0 && (
              <span style={{ background:"#ef4444", color:"#fff", borderRadius:12,
                padding:"1px 8px", fontSize:11, fontWeight:800 }}>{item.badge}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding:16 }}>
        <button onClick={()=>{ localStorage.clear(); window.location.href="/connexion"; }}
          style={{ width:"100%", padding:"10px", borderRadius:12,
            border:"1px solid #ef444430", backgroundColor:"#ef444410",
            color:"#ef6666", cursor:"pointer", fontWeight:700, fontSize:13,
            transition:"all 0.2s", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8 }}
          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#ef444425"}
          onMouseLeave={e=>e.currentTarget.style.backgroundColor="#ef444410"}>
          <MdLogout style={{ fontSize:18 }}/> Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════
function DashboardAdmin() {
  const [onglet, setOnglet]           = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [toast, setToast]             = useState(null);

  // ── Données réelles BDD ─────────────────────────
  const [stats, setStats]           = useState({
    clients_actifs:0, clients_inactifs:0,
    coursiers_actifs:0, coursiers_inactifs:0,
    coursiers_en_attente:0,                    // ← NOUVEAU CHAMP
    total_commandes:0, revenus:0,
    abonnes_payes:0, abonnes_impayes:0,
  });
  const [clients, setClients]           = useState([]);
  const [coursiers, setCoursiers]       = useState([]);
  const [commandes, setCommandes]       = useState([]);
  const [chartMensuel, setChartMensuel] = useState([]);
  const [chartServices, setChartServices] = useState([]);
  const [notifs, setNotifs]             = useState([]);
  const [loading, setLoading]           = useState(true);

  // ── UI ──────────────────────────────────────────
  const [detailUser, setDetailUser]       = useState(null);
  const [search, setSearch]               = useState("");
  const [filtreStatut, setFiltreStatut]   = useState("tous");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmNotifDel, setConfirmNotifDel] = useState(null);
  const [abonnPage, setAbonnPage]         = useState(1);
  const ABONNES_PAR_PAGE = 6;
  const [coursierVerif, setCoursierVerif] = useState(null); // ✅ modal vérification
  const [msgRejet, setMsgRejet]           = useState("");    // ✅ message de rejet
  const [coursiersEnAttente, setCoursiersEnAttente] = useState([]); // ✅ liste

  // ── Gestion des admins ──────────────────────────
  const [admins, setAdmins]               = useState([]);
  const [adminModal, setAdminModal]       = useState(null); // "ajouter" | "modifier" | null
  const [adminForm, setAdminForm]         = useState({ id:null, nom:"", prenom:"", email:"", telephone:"", password:"" });
  const [adminEnvoi, setAdminEnvoi]       = useState(false);
  const [adminErreur, setAdminErreur]     = useState("");
  const [confirmDeleteAdmin, setConfirmDeleteAdmin] = useState(null);

  // ── Gestion des moyens de transport (tarifs) ─────
  const [moyens, setMoyens]               = useState([]);
  const [moyenModal, setMoyenModal]       = useState(null); // "ajouter" | "modifier" | null
  const [moyenForm, setMoyenForm]         = useState({ id:null, nom:"", icone:"", prix:"", duree_estimee:"" });
  const [moyenEnvoi, setMoyenEnvoi]       = useState(false);
  const [moyenErreur, setMoyenErreur]     = useState("");
  const [confirmDeleteMoyen, setConfirmDeleteMoyen] = useState(null);

  // ── CRUD Commandes ──────────────────────────────
  const [pageCommande, setPageCommande]   = useState(1);
  const [cmdModal, setCmdModal]           = useState(null);
  const [cmdForm, setCmdForm]             = useState({ id:null, client_id:"", service:"", moyen:"", tarif:"", detail:"", adresse_pickup:"", statut:"en_attente", coursier_id:"" });
  const [cmdEnvoi, setCmdEnvoi]           = useState(false);
  const [cmdErreur, setCmdErreur]         = useState("");
  const [confirmDeleteCmd, setConfirmDeleteCmd] = useState(null);

  // ── Support Chat (admin) ─────────────────────────
  const [supportConvs, setSupportConvs]       = useState([]);   // liste des conversations (1 par client)
  const [supportSelected, setSupportSelected] = useState(null); // client_id ouvert
  const [supportMessages, setSupportMessages] = useState([]);   // messages du client ouvert
  const [supportReply, setSupportReply]       = useState("");
  const [supportEnvoi, setSupportEnvoi]       = useState(false);
  const [supportLoading, setSupportLoading]   = useState(false);
  const [supportPdfLoading, setSupportPdfLoading] = useState(false);
  const supportNonLus = supportConvs.reduce((total, c) => total + (c.non_lus || 0), 0);

  // ── CRUD Clients + pagination ───────────────────
  const [pageClient, setPageClient]         = useState(1);
  const [pageCoursier, setPageCoursier]     = useState(1);
  const [clientModal, setClientModal]     = useState(null); // "ajouter" | "modifier" | null
  const [clientForm, setClientForm]       = useState({ id:null, nom:"", prenom:"", email:"", telephone:"", adresse:"", password:"" });
  const [clientEnvoi, setClientEnvoi]     = useState(false);
  const [clientErreur, setClientErreur]   = useState("");

  // ── CRUD Coursiers ────────────────────────────────
  const [coursierModal, setCoursierModal]   = useState(null); // "ajouter" | "modifier" | null
  const [coursierForm, setCoursierForm]     = useState({ id:null, nom:"", prenom:"", email:"", telephone:"", adresse:"", cin:"", password:"" });
  const [coursierEnvoi, setCoursierEnvoi]   = useState(false);
  const [coursierErreur, setCoursierErreur] = useState("");

  // ── Historique / Classements ─────────────────────
  const [histLoading, setHistLoading]       = useState(false);
  const [topCoursiers, setTopCoursiers]     = useState([]);
  const [topClients, setTopClients]         = useState([]);
  const [anciensCoursiers, setAnciensCoursiers] = useState([]);
  const [anciensClients, setAnciensClients] = useState([]);
  const [histMois, setHistMois]             = useState("");   // "" = tous
  const [histAnnee, setHistAnnee]           = useState("");   // "" = toutes
  const [limMissions, setLimMissions]       = useState(10);
  const [limClientsTop, setLimClientsTop]   = useState(10);
  const [limAnciens, setLimAnciens]         = useState(10);

  const fetchHistorique = async () => {
    setHistLoading(true);
    try {
      const params = new URLSearchParams({
        limite_missions: limMissions,
        limite_clients:  limClientsTop,
        limite_anciens:  limAnciens,
      });
      if (histMois)  params.append("mois", histMois);
      if (histAnnee) params.append("annee", histAnnee);
      const res = await fetch(`${BASE_URL}/api/admin/historique?${params.toString()}`, { headers: getHeaders() });
      if (res.ok) {
        const d = await res.json();
        setTopCoursiers(d.top_coursiers || []);
        setTopClients(d.top_clients || []);
        setAnciensCoursiers(d.anciens_coursiers || []);
        setAnciensClients(d.anciens_clients || []);
      }
    } catch (e) { console.error(e); }
    setHistLoading(false);
  };

  const getHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
  });

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  // ── Fetch toutes données ────────────────────────
 const fetchAll = async () => {
  try {
    const h = getHeaders();
    const [sR, mR, svR, cR, clR, coR, nR, eaR, adR, tR] = await Promise.all([
      fetch(`${BASE_URL}/api/admin/stats`,                {headers: h}),
      fetch(`${BASE_URL}/api/admin/commandes-mensuelles`, {headers: h}),
      fetch(`${BASE_URL}/api/admin/services-populaires`,  {headers: h}),
      fetch(`${BASE_URL}/api/admin/dernieres-commandes`,  {headers: h}),
      fetch(`${BASE_URL}/api/admin/clients`,              {headers: h}),
      fetch(`${BASE_URL}/api/admin/coursiers`,            {headers: h}),
      fetch(`${BASE_URL}/api/admin/notifications`,        {headers: h}),
      fetch(`${BASE_URL}/api/admin/coursiers-en-attente`, {headers: h}), // ✅ inclus dans le Promise.all
      fetch(`${BASE_URL}/api/admin/admins`,               {headers: h}), // ✅ liste des admins
      fetch(`${BASE_URL}/api/admin/moyens-transport`,     {headers: h}), // ✅ liste des moyens de transport
    ]);
    if (sR.ok)   setStats(await sR.json());
    if (mR.ok)   setChartMensuel(await mR.json());
    if (svR.ok)  setChartServices(await svR.json());
    if (cR.ok)   setCommandes(await cR.json());
    if (clR.ok)  setClients(await clR.json());
    if (coR.ok)  setCoursiers(await coR.json());
    if (nR.ok)   setNotifs(await nR.json());
    if (eaR.ok)  setCoursiersEnAttente(await eaR.json()); // ✅ h est bien défini ici
    if (adR.ok)  setAdmins(await adR.json());
    if (tR.ok)   setMoyens(await tR.json());
  } catch(e) { console.error(e); }
  setLoading(false);
};

  useEffect(() => {
    if (!localStorage.getItem("token")) { window.location.href="/connexion"; return; }
    fetchAll();
    // Polling notifications + stats toutes les 2s
    const iv = setInterval(() => {
      const h = getHeaders();
      fetch(`${BASE_URL}/api/admin/notifications`, {headers:h})
        .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setNotifs(d); }).catch(()=>{});
      fetch(`${BASE_URL}/api/admin/stats`, {headers:h})
        .then(r=>r.json()).then(d=>setStats(d)).catch(()=>{});
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // ── Recharger l'historique à l'ouverture de l'onglet ou changement de filtre ──
  useEffect(() => {
    if (onglet === "historique") fetchHistorique();
  }, [onglet, histMois, histAnnee, limMissions, limClientsTop, limAnciens]);

  // ── Support Chat : liste des conversations ───────
  const fetchSupportConvs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/support/conversations`, { headers: getHeaders() });
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d)) setSupportConvs(d);
      }
    } catch (e) { console.error(e); }
  };

  // ── Support Chat : messages d'une conversation précise ──
  const fetchSupportMessages = async (clientId) => {
    setSupportLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/support/conversations/${clientId}`, { headers: getHeaders() });
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d)) setSupportMessages(d);
      }
    } catch (e) { console.error(e); }
    setSupportLoading(false);
  };

  const ouvrirConversation = (clientId) => {
    setSupportSelected(clientId);
    fetchSupportMessages(clientId);
  };

  const envoyerReponseSupport = async () => {
    if (!supportReply.trim() || !supportSelected || supportEnvoi) return;
    setSupportEnvoi(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/support/conversations/${supportSelected}/repondre`, {
        method: "POST",
        headers: { ...getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ texte: supportReply.trim() }),
      });
      if (res.ok) {
        setSupportReply("");
        fetchSupportMessages(supportSelected);
        fetchSupportConvs();
        showToast("Réponse envoyée");
      } else {
        showToast("Erreur lors de l'envoi", "error");
      }
    } catch (e) { console.error(e); showToast("Erreur lors de l'envoi", "error"); }
    setSupportEnvoi(false);
  };

  // ── Support Chat : export PDF (toutes conversations, ou une seule si clientId fourni) ──
  const exporterSupportPdf = async (clientId = null) => {
    setSupportPdfLoading(true);
    try {
      const url = clientId
        ? `${BASE_URL}/api/admin/support/export-pdf?client_id=${clientId}`
        : `${BASE_URL}/api/admin/support/export-pdf`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) { showToast("Erreur lors de l'export PDF", "error"); setSupportPdfLoading(false); return; }
      const blob = await res.blob();
      const lien = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(blob);
      lien.href = objectUrl;
      lien.download = clientId
        ? `conversation-support-client-${clientId}.pdf`
        : `conversations-support-iraky.pdf`;
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      window.URL.revokeObjectURL(objectUrl);
      showToast("PDF téléchargé");
    } catch (e) { console.error(e); showToast("Erreur lors de l'export PDF", "error"); }
    setSupportPdfLoading(false);
  };

  // ── Recharger la liste des conversations à l'ouverture de l'onglet + polling ──
  useEffect(() => {
    if (onglet !== "support") return;
    fetchSupportConvs();
    const iv = setInterval(() => {
      fetchSupportConvs();
      if (supportSelected) fetchSupportMessages(supportSelected);
    }, 3000);
    return () => clearInterval(iv);
  }, [onglet, supportSelected]);

  const nbNonLus = notifs.filter(n=>!n.lu).length;

  // ── Toggle statut ───────────────────────────────
  const toggleStatut = async (id, nom) => {
    const res = await fetch(`${BASE_URL}/api/admin/toggle-statut/${id}`, {
      method:"POST", headers:getHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      setClients(prev=>prev.map(c=>c.id===id?{...c,statut:data.statut}:c));
      setCoursiers(prev=>prev.map(c=>c.id===id?{...c,statut:data.statut}:c));
      showToast(`Statut de ${nom} mis à jour`);
      // Refresh stats
      fetch(`${BASE_URL}/api/admin/stats`, {headers:getHeaders()})
        .then(r=>r.json()).then(d=>setStats(d)).catch(()=>{});
    }
  };

  // ── Supprimer utilisateur ───────────────────────
  const deleteUser = async (id, nom) => {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method:"DELETE", headers:getHeaders(),
    });
    if (res.ok) {
      setClients(prev=>prev.filter(c=>c.id!==id));
      setCoursiers(prev=>prev.filter(c=>c.id!==id));
      setConfirmDelete(null);
      showToast(`${nom} supprimé`);
      fetch(`${BASE_URL}/api/admin/stats`, {headers:getHeaders()})
        .then(r=>r.json()).then(d=>setStats(d)).catch(()=>{});
    } else {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  // ── Supprimer notif ─────────────────────────────
  const deleteNotif = async (id) => {
    await fetch(`${BASE_URL}/api/admin/notifications/${id}`, {
      method:"DELETE", headers:getHeaders(),
    });
    setNotifs(prev=>prev.filter(n=>n.id!==id));
    setConfirmNotifDel(null);
  };

  // ── Marquer tout lu ─────────────────────────────
  const marquerTousLus = async () => {
    await fetch(`${BASE_URL}/api/admin/notifications/tous-lus`, {
      method:"POST", headers:getHeaders(),
    });
    setNotifs(prev=>prev.map(n=>({...n,lu:true})));
  };

  // ── Gestion des admins : ouvrir modal ───────────
  const ouvrirAjoutAdmin = () => {
    setAdminForm({ id:null, nom:"", prenom:"", email:"", telephone:"", password:"" });
    setAdminErreur("");
    setAdminModal("ajouter");
  };
  const ouvrirModifierAdmin = (a) => {
    setAdminForm({ ...a, password:"" });
    setAdminErreur("");
    setAdminModal("modifier");
  };

  // ── Gestion des admins : créer / modifier ───────
  const soumettreAdmin = async (e) => {
    e.preventDefault();
    setAdminErreur("");
    setAdminEnvoi(true);
    try {
      const url = adminModal==="ajouter"
        ? `${BASE_URL}/api/admin/admins`
        : `${BASE_URL}/api/admin/admins/${adminForm.id}`;
      const method = adminModal==="ajouter" ? "POST" : "PUT";
      const payload = { ...adminForm };
      if (adminModal==="modifier" && !payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { ...getHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        // Laravel renvoie souvent { message, errors: { champ: [messages] } }
        // en cas d'erreur 422 — on affiche le premier message précis s'il existe.
        const premierMsg = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        setAdminErreur(premierMsg || data.message || "Une erreur est survenue.");
        return;
      }

      setAdminModal(null);
      showToast(adminModal==="ajouter" ? "Admin créé avec succès" : "Admin modifié avec succès");
      fetch(`${BASE_URL}/api/admin/admins`, {headers:getHeaders()})
        .then(r=>r.json()).then(d=>setAdmins(d)).catch(()=>{});
    } catch (err) {
      setAdminErreur("Erreur réseau, veuillez réessayer.");
    } finally {
      setAdminEnvoi(false);
    }
  };

  // ── Gestion des admins : supprimer ──────────────
  const supprimerAdmin = async (id, nom) => {
    const res = await fetch(`${BASE_URL}/api/admin/admins/${id}`, {
      method:"DELETE", headers:getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      setAdmins(prev=>prev.filter(a=>a.id!==id));
      setConfirmDeleteAdmin(null);
      showToast(`${nom} supprimé`);
    } else {
      showToast(data.message || "Suppression impossible", "error");
      setConfirmDeleteAdmin(null);
    }
  };

  // ── Gestion des moyens de transport : ouvrir modal
  const ouvrirAjoutMoyen = () => {
    setMoyenForm({ id:null, nom:"", icone:"", prix:"", duree_estimee:"" });
    setMoyenErreur("");
    setMoyenModal("ajouter");
  };
  const ouvrirModifierMoyen = (m) => {
    setMoyenForm({ id:m.id, nom:m.nom, icone:m.icone||"", prix:m.prix, duree_estimee:m.duree_estimee||"" });
    setMoyenErreur("");
    setMoyenModal("modifier");
  };

  // ── Gestion des moyens de transport : créer / modifier
  const soumettreMoyen = async (e) => {
    e.preventDefault();
    setMoyenErreur("");
    setMoyenEnvoi(true);
    try {
      const url = moyenModal==="ajouter"
        ? `${BASE_URL}/api/admin/moyens-transport`
        : `${BASE_URL}/api/admin/moyens-transport/${moyenForm.id}`;
      const method = moyenModal==="ajouter" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { ...getHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(moyenForm),
      });
      const data = await res.json();
      if (!res.ok) {
        const premierMsg = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        setMoyenErreur(premierMsg || data.message || "Une erreur est survenue.");
        return;
      }

      setMoyenModal(null);
      showToast(moyenModal==="ajouter" ? "Moyen de transport créé avec succès" : "Moyen de transport modifié avec succès");
      fetch(`${BASE_URL}/api/admin/moyens-transport`, {headers:getHeaders()})
        .then(r=>r.json()).then(d=>setMoyens(d)).catch(()=>{});
    } catch (err) {
      setMoyenErreur("Erreur réseau, veuillez réessayer.");
    } finally {
      setMoyenEnvoi(false);
    }
  };

  // ── Gestion des moyens de transport : supprimer ──
  const supprimerMoyen = async (id, nom) => {
    const res = await fetch(`${BASE_URL}/api/admin/moyens-transport/${id}`, {
      method:"DELETE", headers:getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      setMoyens(prev=>prev.filter(m=>m.id!==id));
      setConfirmDeleteMoyen(null);
      showToast(`${nom} supprimé`);
    } else {
      showToast(data.message || "Suppression impossible", "error");
      setConfirmDeleteMoyen(null);
    }
  };

  // ── Handlers CRUD Commandes ────────────────────
  const sauvegarderCommande = async () => {
    if (!cmdForm.client_id || !cmdForm.service || !cmdForm.moyen || !cmdForm.tarif) {
      setCmdErreur("Client, service, moyen et tarif sont obligatoires."); return;
    }
    setCmdEnvoi(true); setCmdErreur("");
    const url = cmdModal === "modifier"
      ? `${BASE_URL}/api/admin/commandes/${cmdForm.id}`
      : `${BASE_URL}/api/admin/commandes`;
    const method = cmdModal === "modifier" ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method, headers:{ ...getHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(cmdForm),
      });
      const data = await res.json();
      if (res.ok) {
        if (cmdModal === "ajouter") {
          const newCmd = {
            ...data.commande,
            client: clients.find(c=>c.id===parseInt(cmdForm.client_id))
              ? `${clients.find(c=>c.id===parseInt(cmdForm.client_id)).prenom} ${clients.find(c=>c.id===parseInt(cmdForm.client_id)).nom}`
              : `Client #${cmdForm.client_id}`,
            coursier: null, date: new Date().toISOString().slice(0,10),
          };
          setCommandes(prev=>[newCmd,...prev]);
        } else {
          setCommandes(prev=>prev.map(c=>c.id===cmdForm.id
            ? { ...c, ...cmdForm,
                client: clients.find(cl=>cl.id===parseInt(cmdForm.client_id))
                  ? `${clients.find(cl=>cl.id===parseInt(cmdForm.client_id)).prenom} ${clients.find(cl=>cl.id===parseInt(cmdForm.client_id)).nom}`
                  : c.client }
            : c));
        }
        setCmdModal(null);
        showToast(cmdModal==="ajouter" ? "Commande créée !" : "Commande modifiée !");
      } else {
        setCmdErreur(data.message || "Erreur lors de l'opération");
      }
    } catch { setCmdErreur("Erreur réseau"); }
    setCmdEnvoi(false);
  };

  // ── Handlers CRUD Clients ────────────────────────
  const sauvegarderClient = async () => {
    if (!clientForm.nom || !clientForm.prenom || !clientForm.email ||
        (clientModal==="ajouter" && !clientForm.password)) {
      setClientErreur("Nom, prénom, email" + (clientModal==="ajouter" ? " et mot de passe" : "") + " sont obligatoires.");
      return;
    }
    setClientEnvoi(true); setClientErreur("");
    const url = clientModal === "modifier"
      ? `${BASE_URL}/api/admin/users/${clientForm.id}`
      : `${BASE_URL}/api/admin/clients`;
    const method = clientModal === "modifier" ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method, headers:{ ...getHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(clientForm),
      });
      const data = await res.json();
      if (res.ok) {
        if (clientModal === "ajouter") {
          setClients(prev=>[{ ...data.user, commandes:0 }, ...prev]);
        } else {
          setClients(prev=>prev.map(c=>c.id===clientForm.id ? { ...c, ...clientForm } : c));
        }
        setClientModal(null);
        showToast(clientModal==="ajouter" ? "Client créé !" : "Client modifié !");
      } else {
        const premierMsg = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        setClientErreur(premierMsg || data.message || "Erreur lors de l'opération");
      }
    } catch { setClientErreur("Erreur réseau"); }
    setClientEnvoi(false);
  };

  // ── Handlers CRUD Coursiers ──────────────────────
  const sauvegarderCoursier = async () => {
    if (!coursierForm.nom || !coursierForm.prenom || !coursierForm.email ||
        (coursierModal==="ajouter" && !coursierForm.password)) {
      setCoursierErreur("Nom, prénom, email" + (coursierModal==="ajouter" ? " et mot de passe" : "") + " sont obligatoires.");
      return;
    }
    setCoursierEnvoi(true); setCoursierErreur("");
    const url = coursierModal === "modifier"
      ? `${BASE_URL}/api/admin/users/${coursierForm.id}`
      : `${BASE_URL}/api/admin/coursiers`;
    const method = coursierModal === "modifier" ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method, headers:{ ...getHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(coursierForm),
      });
      const data = await res.json();
      if (res.ok) {
        if (coursierModal === "ajouter") {
          setCoursiers(prev=>[{ ...data.user, missions:0 }, ...prev]);
        } else {
          setCoursiers(prev=>prev.map(c=>c.id===coursierForm.id ? { ...c, ...coursierForm } : c));
        }
        setCoursierModal(null);
        showToast(coursierModal==="ajouter" ? "Coursier créé !" : "Coursier modifié !");
      } else {
        const premierMsg = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        setCoursierErreur(premierMsg || data.message || "Erreur lors de l'opération");
      }
    } catch { setCoursierErreur("Erreur réseau"); }
    setCoursierEnvoi(false);
  };

  const supprimerCommande = async (id) => {
    const res = await fetch(`${BASE_URL}/api/admin/commandes/${id}`, {
      method:"DELETE", headers:getHeaders(),
    });
    if (res.ok) {
      setCommandes(prev=>prev.filter(c=>c.id!==id));
      setConfirmDeleteCmd(null);
      showToast("Commande supprimée");
    } else {
      showToast("Suppression impossible","error");
      setConfirmDeleteCmd(null);
    }
  };

  // Styles originaux inchangés
  const card = { backgroundColor:"#0f1128", borderRadius:18, border:"1px solid #FFD70018", padding:24, transition:"all 0.3s ease" };
  const inp  = { backgroundColor:"#080820", border:"1px solid #FFD70030", color:"#fff", borderRadius:12, padding:"10px 16px", fontSize:13, outline:"none", width:"100%" };
  const btnY = { background:"linear-gradient(135deg,#FFD700,#ff9500)", color:"#000", border:"none", borderRadius:10, padding:"8px 20px", fontWeight:800, cursor:"pointer", fontSize:13, transition:"all 0.2s" };

  // Pagination abonnements
  const totalAbonnPages = Math.ceil(coursiers.length / ABONNES_PAR_PAGE);
  const coursiersPage   = coursiers.slice((abonnPage-1)*ABONNES_PAR_PAGE, abonnPage*ABONNES_PAR_PAGE);

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#080820", fontFamily:"'Segoe UI', sans-serif", color:"#fff" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          backgroundColor:toast.type==="error"?"#ef4444":"#10b981",
          color:"#fff", padding:"14px 22px", borderRadius:14,
          boxShadow:"0 8px 30px rgba(0,0,0,0.5)", fontWeight:700, fontSize:14,
          animation:"slideIn 0.3s ease", display:"flex", alignItems:"center", gap:10, maxWidth:360,
        }}>
          {toast.type==="error"?"⚠️":"✅"} {toast.msg}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        backgroundColor:"rgba(8,8,32,0.98)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid #FFD70025", padding:"0 24px", height:66,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <button className="d-lg-none" onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{ background:"transparent", border:"1px solid #FFD70044", borderRadius:10, padding:"7px 10px", cursor:"pointer" }}>
          {[0,1,2].map(i=><div key={i} style={{ width:20,height:2,backgroundColor:"#FFD700",margin:i<2?"0 0 4px 0":"0" }}/>)}
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src={logo} alt="IRAKY" style={{ width:50,height:50,borderRadius:"50%" }}/>
          <div>
            <div style={{ color:"#FFD700", fontWeight:800, fontSize:17 }}>IRAKY Admin</div>
            <div style={{ color:"#555", fontSize:11 }}>Panneau de contrôle</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          {/* Cloche notifs — polling 2s */}
          <div style={{ position:"relative", cursor:"pointer" }}
            onClick={()=>setNotifOpen(!notifOpen)}>
            <div style={{ width:38,height:38,borderRadius:"50%",backgroundColor:"#FFD70015",
              border:"1px solid #FFD70030",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <MdNotifications style={{ color:"#FFD700", fontSize:20 }}/>
            </div>
            {nbNonLus>0 && (
              <span style={{ position:"absolute",top:-2,right:-2,backgroundColor:"#ef4444",
                color:"#fff",borderRadius:"50%",width:19,height:19,fontSize:10,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #080820" }}>
                {nbNonLus}
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10,
            backgroundColor:"#FFD70015", border:"1px solid #FFD70033",
            borderRadius:12, padding:"6px 14px" }}>
            <MdAdminPanelSettings style={{ color:"#FFD700", fontSize:20 }}/>
            <span style={{ color:"#FFD700", fontWeight:700, fontSize:13 }}>Admin</span>
          </div>
        </div>
      </nav>

      {/* NOTIFS PANEL */}
      {notifOpen && (
        <>
          <div onClick={()=>setNotifOpen(false)} style={{ position:"fixed",inset:0,zIndex:149 }}/>
          <div style={{
            position:"fixed",top:74,right:20,zIndex:150,
            backgroundColor:"#0f1128",border:"1px solid #FFD70025",
            borderRadius:16,width:380,maxHeight:500,
            boxShadow:"0 16px 48px rgba(0,0,0,0.7)",
            display:"flex",flexDirection:"column",overflow:"hidden",
          }}>
            <div style={{ padding:"14px 18px",borderBottom:"1px solid #FFD70018",
              display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
              <span style={{ color:"#FFD700",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6 }}>
                <MdNotifications style={{ fontSize:18 }}/> Notifications
                {nbNonLus>0 && <span style={{ backgroundColor:"#ef4444",color:"#fff",borderRadius:10,
                  padding:"0 6px",fontSize:11,fontWeight:800 }}>{nbNonLus}</span>}
              </span>
              <button onClick={marquerTousLus}
                style={{ background:"transparent",border:"none",color:"#FFD700",
                  cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:4 }}>
                <MdDoneAll style={{ fontSize:14 }}/> Tout lire
              </button>
            </div>
            <div style={{ overflowY:"auto",flex:1 }}>
              {notifs.length===0 && (
                <div style={{ padding:24,textAlign:"center",color:"#555",fontSize:13 }}>Aucune notification</div>
              )}
              {notifs.map(n=>(
                <div key={n.id} style={{
                  padding:"10px 16px",borderBottom:"1px solid #ffffff08",
                  backgroundColor:n.lu?"transparent":"#FFD70008",
                  borderLeft:n.type==="warning"?"3px solid #f59e0b"
                    :n.type==="success"?"3px solid #10b981":"3px solid #3b82f6",
                }}>
                  <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
                    <div style={{ paddingTop:4,flexShrink:0 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",
                        backgroundColor:n.lu?"transparent":"#FFD700" }}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:n.lu?"#888":"#fff",fontSize:12,margin:"0 0 3px 0",lineHeight:1.5 }}>{n.texte}</p>
                      <small style={{ color:"#555",fontSize:10 }}>{n.time}</small>
                    </div>
                    {/* Actions icônes uniquement */}
                    {/* Actions icônes */}
<div style={{ display:"flex",gap:4,flexShrink:0 }}>
  {/* Voir : coursier en attente OU commande liée */}
{n.texte?.includes("coursier inscrit") || n.texte?.includes("Nouveau coursier") ? (
  <button
    onClick={async () => {
      setNotifOpen(false);
      const res = await fetch(`${BASE_URL}/api/admin/coursiers-en-attente`, { headers: getHeaders() });
      const data = await res.json();
      setCoursiersEnAttente(data);

      if (!Array.isArray(data) || data.length === 0) {
        showToast("Ce coursier a déjà été traité (validé ou rejeté).", "error");
        return;
      }

      // Cible précisément via user_id_cible si dispo, sinon prend le plus récent
      const cible = n.user_id_cible
        ? data.find(c => c.id === n.user_id_cible)
        : data[0];

      if (cible) {
        setCoursierVerif(cible);
      } else {
        // Le coursier ciblé n'est plus en attente — propose le plus récent à la place
        showToast("Ce dossier a déjà été traité — voici le dossier le plus récent en attente.", "error");
        setCoursierVerif(data[0]);
      }
    }}
    title="Voir le dossier"
    style={{ background:"#f59e0b18", border:"1px solid #f59e0b33",
      color:"#f59e0b", borderRadius:6, padding:"4px 7px", cursor:"pointer",
      display:"flex", alignItems:"center" }}>
    <MdVisibility style={{ fontSize:13 }}/>
  </button>
) : n.commande_id ? (
    <button onClick={()=>{ setNotifOpen(false); setOnglet("commandes"); }}
      title="Voir commande"
      style={{ background:"#3b82f618", border:"1px solid #3b82f633",
        color:"#3b82f6", borderRadius:6, padding:"4px 7px", cursor:"pointer",
        display:"flex", alignItems:"center" }}>
      <MdVisibility style={{ fontSize:13 }}/>
    </button>
  ) : null}

  {/* ✅ Supprimer — toujours présent */}
  <button
    onClick={() => setConfirmNotifDel(n.id)}
    title="Supprimer"
    style={{ background:"#ef444415", border:"1px solid #ef444430",
      color:"#ef6666", borderRadius:6, padding:"4px 7px", cursor:"pointer",
      display:"flex", alignItems:"center" }}>
    <MdDelete style={{ fontSize:13 }}/>
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* LAYOUT */}
      <div style={{ display:"flex", paddingTop:66 }}>

        {/* SIDEBAR desktop */}
        <aside className="d-none d-lg-block" style={{
          width:252,minHeight:"calc(100vh - 66px)",backgroundColor:"#0a0a20",
          borderRight:"1px solid #FFD70015",padding:"28px 0",
          position:"fixed",top:66,left:0,zIndex:50,
        }}>
          <SidebarContent onglet={onglet} setOnglet={setOnglet} stats={stats} supportNonLus={supportNonLus}/>
        </aside>

        {/* SIDEBAR mobile */}
        {sidebarOpen && (
          <>
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed",inset:0,backgroundColor:"#000a",zIndex:49 }}/>
            <aside style={{ width:252,position:"fixed",top:66,left:0,bottom:0,
              backgroundColor:"#0a0a20",borderRight:"1px solid #FFD70015",
              padding:"28px 0",zIndex:50,overflowY:"auto" }}>
              <SidebarContent onglet={onglet} setOnglet={o=>{setOnglet(o);setSidebarOpen(false);}} stats={stats} supportNonLus={supportNonLus}/>
            </aside>
          </>
        )}

        {/* MAIN */}
        <main id="main-content" style={{ flex:1,padding:"28px 20px",maxWidth:"100%" }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>

            {loading && (
              <div style={{ textAlign:"center",padding:80,color:"#555" }}>
                <div style={{ width:40,height:40,border:"3px solid #FFD70033",
                  borderTop:"3px solid #FFD700",borderRadius:"50%",
                  animation:"spin 1s linear infinite",margin:"0 auto 16px" }}/>
                Chargement des données...
              </div>
            )}

            {/* ═══ TABLEAU DE BORD — données BDD ═══ */}
            {onglet==="accueil" && !loading && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <h3 style={{ color:"#fff",fontWeight:800,margin:0,fontSize:24 }}>
                    Tableau de bord <span style={{ color:"#FFD700" }}>Admin</span>
                  </h3>
                  <p style={{ color:"#555",marginTop:4,fontSize:14 }}>Vue d'ensemble de la plateforme IRAKY Delivery</p>
                </div>

                {/* ────────────────────────────────────────────
                    RANGÉE 1 — 4 KPI principaux (BDD)
                    CORRIGÉ : chaque champ pointe vers la bonne
                    clé renvoyée par /api/admin/stats
                ──────────────────────────────────────────── */}
                <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20 }}>
                  {[
                    {
                      label:"CLIENTS ACTIFS",
                      val: stats.clients_actifs,          // ← clé exacte BDD
                      sub:"clients activés",
                      Icon:MdPeople,
                      color:"#3b82f6",
                    },
                    {
                      label:"COURSIERS ACTIFS",
                      val: stats.coursiers_actifs,        // ← clé exacte BDD
                      sub:"coursiers disponibles",
                      Icon:MdDeliveryDining,
                      color:"#FFD700",
                    },
                    {
                      label:"TOTAL COMMANDES",
                      val: stats.total_commandes,         // ← clé exacte BDD
                      sub:"toutes commandes clients",
                      Icon:MdListAlt,
                      color:"#10b981",
                    },
                    {
                      label:"REVENUS TOTAUX",
                      val: `${((stats.revenus||0)/1000).toFixed(0)}k Ar`, // ← clé exacte BDD
                      sub:"missions terminées",
                      Icon:MdAttachMoney,
                      color:"#8b5cf6",
                    },
                  ].map(s=>(
                    <div key={s.label} style={{
                      ...card, display:"flex",alignItems:"center",gap:16,
                      border:`1px solid ${s.color}33`, boxShadow:`0 4px 20px ${s.color}15`,
                      transition:"transform 0.2s,box-shadow 0.2s",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${s.color}30`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow=`0 4px 20px ${s.color}15`; }}>
                      <div style={{ width:52,height:52,borderRadius:14,backgroundColor:`${s.color}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        boxShadow:`0 0 16px ${s.color}22` }}>
                        <s.Icon style={{ color:s.color,fontSize:26 }}/>
                      </div>
                      <div>
                        <div style={{ color:"#fff",fontWeight:800,fontSize:26,lineHeight:1 }}>{s.val}</div>
                        <div style={{ color:"#888",fontWeight:600,fontSize:10,letterSpacing:1.5,marginTop:3 }}>{s.label}</div>
                        <div style={{ color:s.color,fontSize:11,marginTop:2 }}>{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ────────────────────────────────────────────
                    RANGÉE 2 — 3 alertes (BDD)
                    CORRIGÉ :
                    • "CLIENTS INACTIFS"     → stats.clients_inactifs
                    • "COURSIERS EN ATTENTE" → stats.coursiers_en_attente  (nouveau champ)
                    • "ABONNEMENTS IMPAYÉS"  → stats.abonnes_impayes
                ──────────────────────────────────────────── */}
                <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 }}>
                  {[
                    {
                      label:"CLIENTS INACTIFS",
                      val:   stats.clients_inactifs,        // ← clé exacte BDD
                      color:"#3b82f6",
                      Icon:MdPeople,
                      action:()=>setOnglet("clients"),
                      sub:"à réactiver →",
                    },
                    {
                      label:"COURSIERS EN ATTENTE",
                      val:   stats.coursiers_en_attente,    // ← NOUVEAU champ BDD
                      color:"#f59e0b",
                      Icon:MdDeliveryDining,
                      action:()=>setOnglet("coursiers"),
                      sub:"à valider →",
                    },
                    {
                      label:"ABONNEMENTS IMPAYÉS",
                      val:   stats.abonnes_impayes,         // ← clé exacte BDD
                      color:"#ef4444",
                      Icon:MdAttachMoney,
                      action:()=>setOnglet("paiements"),
                      sub:"à recouvrer →",
                    },
                  ].map(s=>(
                    <div key={s.label} onClick={s.action} style={{
                      ...card, display:"flex",alignItems:"center",gap:16,
                      border:`1px solid ${s.color}33`, cursor:"pointer",
                      transition:"transform 0.2s,box-shadow 0.2s",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${s.color}30`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}>
                      <div style={{ width:48,height:48,borderRadius:12,backgroundColor:`${s.color}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <s.Icon style={{ color:s.color,fontSize:24 }}/>
                      </div>
                      <div>
                        <div style={{ color:"#fff",fontWeight:800,fontSize:26,lineHeight:1 }}>{s.val}</div>
                        <div style={{ color:"#888",fontWeight:600,fontSize:10,letterSpacing:1.5,marginTop:3 }}>{s.label}</div>
                        <div style={{ color:s.color,fontSize:11,marginTop:2 }}>{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphiques BDD */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:24 }}
                  className="charts-grid">
                  {/* Histogramme commandes mensuelles BDD */}
                  <div style={{ ...card,gridColumn:"span 2" }} className="chart-span2">
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ width:34,height:34,borderRadius:10,backgroundColor:"#FFD70018",
                          border:"1px solid #FFD70033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <MdBarChart style={{ color:"#FFD700",fontSize:18 }}/>
                        </div>
                        <span style={{ color:"#FFD700",fontWeight:700,fontSize:14 }}>Commandes mensuelles 2026</span>
                      </div>
                      <span style={{ color:"#555",fontSize:12 }}>12 derniers mois</span>
                    </div>
                    <BarChart data={chartMensuel.length?chartMensuel:[{label:"—",val:0}]} color="#FFD700" height={120}/>
                  </div>

                  {/* ────────────────────────────────────────────
                      DONUT — CORRIGÉ
                      Les 4 segments pointent vers les clés exactes
                      de stats (BDD). Le total au centre = somme
                      réelle clients+coursiers.
                  ──────────────────────────────────────────── */}
                  <div style={card}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
                      <div style={{ width:34,height:34,borderRadius:10,backgroundColor:"#8b5cf618",
                        border:"1px solid #8b5cf633",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <MdPieChart style={{ color:"#8b5cf6",fontSize:18 }}/>
                      </div>
                      <span style={{ color:"#8b5cf6",fontWeight:700,fontSize:14 }}>Utilisateurs</span>
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
                      <DonutChart segments={[
                        { val: stats.clients_actifs    || 0, color:"#3b82f6" },  // ← BDD exact
                        { val: stats.clients_inactifs  || 0, color:"#1e3a5f" },  // ← BDD exact
                        { val: stats.coursiers_actifs  || 0, color:"#FFD700" },  // ← BDD exact
                        { val: stats.coursiers_inactifs|| 0, color:"#ef4444" },  // ← BDD exact
                      ]} size={110}/>
                      <div style={{ display:"flex",flexDirection:"column",gap:6,width:"100%" }}>
                        {[
                          { label:"Clients actifs",     val: stats.clients_actifs    || 0, color:"#3b82f6" },
                          { label:"Clients inactifs",   val: stats.clients_inactifs  || 0, color:"#1e3a5f" },
                          { label:"Coursiers actifs",   val: stats.coursiers_actifs  || 0, color:"#FFD700" },
                          { label:"Coursiers inactifs", val: stats.coursiers_inactifs|| 0, color:"#ef4444" },
                        ].map(s=>(
                          <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                              <div style={{ width:8,height:8,borderRadius:"50%",backgroundColor:s.color }}/>
                              <span style={{ color:"#888",fontSize:11 }}>{s.label}</span>
                            </div>
                            <span style={{ color:"#fff",fontWeight:700,fontSize:12 }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services populaires BDD */}
                <div style={{ ...card,marginBottom:24 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
                    <div style={{ width:34,height:34,borderRadius:10,backgroundColor:"#10b98118",
                      border:"1px solid #10b98133",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <MdShowChart style={{ color:"#10b981",fontSize:18 }}/>
                    </div>
                    <span style={{ color:"#10b981",fontWeight:700,fontSize:14 }}>Services les plus demandés</span>
                  </div>
                  <BarChart data={chartServices.length?chartServices:[{label:"—",val:0}]} color="#10b981" height={100}/>
                  <div style={{ display:"flex",justifyContent:"space-around",marginTop:8,flexWrap:"wrap",gap:6 }}>
                    {chartServices.map((s,i)=>(
                      <span key={i} style={{ color:"#555",fontSize:10 }}>{s.full||s.label}</span>
                    ))}
                  </div>
                </div>

                {/* Dernières commandes BDD */}
                <div style={card}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
                    <h5 style={{ color:"#FFD700",margin:0,fontWeight:700,display:"flex",alignItems:"center",gap:8 }}>
                      <MdListAlt style={{ fontSize:20 }}/> Dernières commandes
                    </h5>
                    <button onClick={()=>setOnglet("commandes")}
                      style={{ background:"transparent",border:"1px solid #FFD70030",color:"#FFD700",
                        borderRadius:8,padding:"5px 14px",cursor:"pointer",fontSize:12 }}>
                      Voir tout
                    </button>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                      <thead>
                        <tr style={{ borderBottom:"1px solid #FFD70018" }}>
                          {["Service","Client","Coursier","Tarif","Statut","Date"].map(h=>(
                            <th key={h} style={{ color:"#555",fontWeight:600,padding:"8px 12px",
                              textAlign:"left",fontSize:11,letterSpacing:1 }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {commandes.slice(0,8).map(cmd=>(
                          <tr key={cmd.id} style={{ borderBottom:"1px solid #ffffff06" }}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                            <td style={{ padding:"10px 12px",color:"#fff",fontWeight:600 }}>{cmd.service}</td>
                            <td style={{ padding:"10px 12px",color:"#aaa" }}>{cmd.client}</td>
                            <td style={{ padding:"10px 12px",color:"#aaa" }}>{cmd.coursier||"—"}</td>
                            <td style={{ padding:"10px 12px",color:"#FFD700",fontWeight:700 }}>{(cmd.tarif||0).toLocaleString()} Ar</td>
                            <td style={{ padding:"10px 12px" }}><StatutBadge statut={cmd.statut}/></td>
                            <td style={{ padding:"10px 12px",color:"#555",fontSize:12 }}>{cmd.date}</td>
                          </tr>
                        ))}
                        {commandes.length===0 && (
                          <tr><td colSpan={6} style={{ padding:24,textAlign:"center",color:"#555" }}>Aucune commande</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CLIENTS — données BDD ═══ */}
            {onglet==="clients" && !loading && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#3b82f618",
                    border:"1px solid #3b82f633",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdPeople style={{ color:"#3b82f6",fontSize:22 }}/>
                  </div>
                  Gestion des clients
                  {/* ✅ Bouton Ajouter */}
                  <button onClick={()=>{ setClientModal("ajouter"); setClientForm({id:null,nom:"",prenom:"",email:"",telephone:"",adresse:"",password:""}); setClientErreur(""); }}
                    style={{ marginLeft:"auto",background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",
                      border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13,
                      display:"flex",alignItems:"center",gap:6 }}>
                    <MdAdd style={{ fontSize:18 }}/> Ajouter
                  </button>
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{clients.length} client(s) enregistré(s)</p>

                <div style={{ display:"flex",gap:12,marginBottom:20,flexWrap:"wrap" }}>
                  <div style={{ flex:1,position:"relative",minWidth:200 }}>
                    <MdSearch style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#555",fontSize:18 }}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Rechercher un client..."
                      style={{ ...inp,paddingLeft:40 }}/>
                  </div>
                  <select value={filtreStatut} onChange={e=>setFiltreStatut(e.target.value)}
                    style={{ ...inp,width:"auto",cursor:"pointer" }}>
                    <option value="tous">Tous</option>
                    <option value="actif">Actifs</option>
                    <option value="inactif">Inactifs</option>
                  </select>
                </div>

                {(() => {
                  const CLIENT_PAR_PAGE = 5;
                  const clientsFiltres = clients.filter(c=>(filtreStatut==="tous"||c.statut===filtreStatut)&&
                    (c.nom+c.prenom+c.email).toLowerCase().includes(search.toLowerCase()));
                  const totalPagesClient = Math.ceil(clientsFiltres.length / CLIENT_PAR_PAGE);
                  const clientsPageData = clientsFiltres.slice((pageClient-1)*CLIENT_PAR_PAGE, pageClient*CLIENT_PAR_PAGE);
                  return (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #FFD70018" }}>
                        {["Nom","Email","Téléphone","Commandes","Statut","Inscrit le","Actions"].map(h=>(
                          <th key={h} style={{ color:"#555",fontWeight:600,padding:"10px 14px",
                            textAlign:"left",fontSize:11,letterSpacing:1,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clientsPageData.map(c=>(
                        <tr key={c.id} style={{ borderBottom:"1px solid #ffffff06" }}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                              <div style={{ width:34,height:34,borderRadius:"50%",
                                background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontWeight:800,color:"#fff",fontSize:13,flexShrink:0 }}>
                                {(c.prenom||"?")[0]}{(c.nom||"?")[0]}
                              </div>
                              <div>
                                <div style={{ color:"#fff",fontWeight:600 }}>{c.prenom} {c.nom}</div>
                                <div style={{ color:"#555",fontSize:11 }}>{c.adresse}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{c.email}</td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{c.telephone}</td>
                          <td style={{ padding:"12px 14px",color:"#FFD700",fontWeight:700 }}>{c.commandes}</td>
                          <td style={{ padding:"12px 14px" }}><StatutBadge statut={c.statut}/></td>
                          <td style={{ padding:"12px 14px",color:"#555",fontSize:12 }}>{c.created_at}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",gap:6 }}>
                              <button onClick={()=>setDetailUser({...c,type:"client"})}
                                title="Voir"
                                style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdVisibility style={{ fontSize:15 }}/>
                              </button>
                              {/* ✅ Modifier */}
                              <button onClick={()=>{
                                setClientModal("modifier");
                                setClientForm({ id:c.id, nom:c.nom||"", prenom:c.prenom||"", email:c.email||"",
                                  telephone:c.telephone||"", adresse:c.adresse||"", password:"" });
                                setClientErreur("");
                              }} title="Modifier"
                                style={{ backgroundColor:"#8b5cf618",border:"1px solid #8b5cf633",
                                  color:"#8b5cf6",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdEdit style={{ fontSize:15 }}/>
                              </button>
                              <button onClick={()=>toggleStatut(c.id,`${c.prenom} ${c.nom}`)}
                                title={c.statut==="actif"?"Désactiver":"Activer"}
                                style={{ backgroundColor:c.statut==="actif"?"#ef444418":"#10b98118",
                                  border:`1px solid ${c.statut==="actif"?"#ef444433":"#10b98133"}`,
                                  color:c.statut==="actif"?"#ef4444":"#10b981",
                                  borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                {c.statut==="actif"?<MdBlock style={{ fontSize:15 }}/>:<MdCheckCircle style={{ fontSize:15 }}/>}
                              </button>
                              <button onClick={()=>setConfirmDelete({id:c.id,nom:`${c.prenom} ${c.nom}`})}
                                title="Supprimer"
                                style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",
                                  color:"#ef4444",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdDelete style={{ fontSize:15 }}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clientsFiltres.length===0 && (
                    <div style={{ textAlign:"center",padding:32,color:"#555" }}>Aucun client trouvé</div>
                  )}

                  {/* Pagination — 5 par page, même style que Commandes */}
                  {totalPagesClient > 1 && (
                    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:6,marginTop:20 }}>
                      <button onClick={()=>setPageClient(p=>Math.max(1,p-1))} disabled={pageClient===1}
                        style={{ background:pageClient===1?"#1a1a35":"#FFD70022",color:pageClient===1?"#444":"#FFD700",
                          border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageClient===1?"not-allowed":"pointer",fontWeight:700 }}>
                        ‹
                      </button>
                      {Array.from({length:totalPagesClient},(_,i)=>i+1).map(p=>(
                        <button key={p} onClick={()=>setPageClient(p)}
                          style={{ background:p===pageClient?"linear-gradient(135deg,#FFD700,#ff9500)":"#1a1a35",
                            color:p===pageClient?"#000":"#aaa",border:"1px solid #FFD70033",
                            borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:700,minWidth:34 }}>
                          {p}
                        </button>
                      ))}
                      <button onClick={()=>setPageClient(p=>Math.min(totalPagesClient,p+1))} disabled={pageClient===totalPagesClient}
                        style={{ background:pageClient===totalPagesClient?"#1a1a35":"#FFD70022",color:pageClient===totalPagesClient?"#444":"#FFD700",
                          border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageClient===totalPagesClient?"not-allowed":"pointer",fontWeight:700 }}>
                        ›
                      </button>
                    </div>
                  )}
                </div>
                  );
                })()}
              </div>
            )}

            {/* ═══ COURSIERS — données BDD ═══ */}
            {onglet==="coursiers" && !loading && (() => {
              const COURSIER_PAR_PAGE = 5;
              const coursiersFiltres = coursiers.filter(c =>
                (filtreStatut==="tous" || c.statut===filtreStatut) &&
                (c.nom+c.prenom+c.email).toLowerCase().includes(search.toLowerCase())
              );
              const totalPagesCoursier = Math.ceil(coursiersFiltres.length / COURSIER_PAR_PAGE);
              const coursierPageData = coursiersFiltres.slice(
                (pageCoursier-1)*COURSIER_PAR_PAGE, pageCoursier*COURSIER_PAR_PAGE
              );
              return (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#FFD70018",
                    border:"1px solid #FFD70033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdDeliveryDining style={{ color:"#FFD700",fontSize:22 }}/>
                  </div>
                  Gestion des coursiers
                  {/* ✅ Bouton Ajouter */}
                  <button onClick={()=>{ setCoursierModal("ajouter"); setCoursierForm({id:null,nom:"",prenom:"",email:"",telephone:"",adresse:"",cin:"",password:""}); setCoursierErreur(""); }}
                    style={{ marginLeft:"auto",background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",
                      border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13,
                      display:"flex",alignItems:"center",gap:6 }}>
                    <MdAdd style={{ fontSize:18 }}/> Ajouter
                  </button>
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{coursiers.length} coursier(s) enregistré(s)</p>

                {/* Barre recherche + filtre */}
                <div style={{ display:"flex",gap:12,marginBottom:20,flexWrap:"wrap" }}>
                  <div style={{ flex:1,position:"relative",minWidth:200 }}>
                    <MdSearch style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#555",fontSize:18 }}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Rechercher un coursier..."
                      style={{ ...inp,paddingLeft:40 }}/>
                  </div>
                  <select value={filtreStatut} onChange={e=>setFiltreStatut(e.target.value)}
                    style={{ ...inp,width:"auto",cursor:"pointer" }}>
                    <option value="tous">Tous</option>
                    <option value="actif">Actifs</option>
                    <option value="inactif">Inactifs</option>
                  </select>
                </div>

                {/* Tableau */}
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #FFD70018" }}>
                        {["Nom","Téléphone","Missions","Note","Statut","Actions"].map(h=>(
                          <th key={h} style={{ color:"#555",fontWeight:600,padding:"10px 14px",
                            textAlign:"left",fontSize:11,letterSpacing:1,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {coursierPageData.map(c=>(
                        <tr key={c.id} style={{ borderBottom:"1px solid #ffffff06" }}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                              <div style={{ width:34,height:34,borderRadius:"50%",
                                background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontWeight:800,color:"#000",fontSize:13,flexShrink:0 }}>
                                {(c.prenom||"?")[0]}{(c.nom||"?")[0]}
                              </div>
                              <div>
                                <div style={{ color:"#fff",fontWeight:600 }}>{c.prenom} {c.nom}</div>
                                <div style={{ color:"#555",fontSize:11 }}>{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{c.telephone}</td>
                          <td style={{ padding:"12px 14px",color:"#FFD700",fontWeight:700 }}>{c.missions||0}</td>
                          <td style={{ padding:"12px 14px" }}>
                            {c.note > 0 ? (
                              <span style={{ display:"flex",alignItems:"center",gap:4,color:"#FFD700",fontWeight:700 }}>
                                <MdStar style={{ fontSize:14 }}/> {c.note}/5
                              </span>
                            ) : <span style={{ color:"#555" }}>—</span>}
                          </td>
                          <td style={{ padding:"12px 14px" }}><StatutBadge statut={c.statut}/></td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",gap:6 }}>
                              <button onClick={()=>setDetailUser({...c,type:"coursier"})}
                                title="Voir"
                                style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdVisibility style={{ fontSize:15 }}/>
                              </button>
                              {/* ✅ Modifier */}
                              <button onClick={()=>{
                                setCoursierModal("modifier");
                                setCoursierForm({ id:c.id, nom:c.nom||"", prenom:c.prenom||"", email:c.email||"",
                                  telephone:c.telephone||"", adresse:c.adresse||"", cin:c.cin||"", password:"" });
                                setCoursierErreur("");
                              }} title="Modifier"
                                style={{ backgroundColor:"#8b5cf618",border:"1px solid #8b5cf633",
                                  color:"#8b5cf6",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdEdit style={{ fontSize:15 }}/>
                              </button>
                              <button onClick={()=>toggleStatut(c.id,`${c.prenom} ${c.nom}`)}
                                title={c.statut==="actif"?"Désactiver":"Activer"}
                                style={{ backgroundColor:c.statut==="actif"?"#ef444418":"#10b98118",
                                  border:`1px solid ${c.statut==="actif"?"#ef444433":"#10b98133"}`,
                                  color:c.statut==="actif"?"#ef4444":"#10b981",
                                  borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                {c.statut==="actif"?<MdBlock style={{ fontSize:15 }}/>:<MdCheckCircle style={{ fontSize:15 }}/>}
                              </button>
                              <button onClick={()=>setConfirmDelete({id:c.id,nom:`${c.prenom} ${c.nom}`})}
                                title="Supprimer"
                                style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",
                                  color:"#ef4444",borderRadius:8,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                                <MdDelete style={{ fontSize:15 }}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {coursiersFiltres.length===0 && (
                    <div style={{ textAlign:"center",padding:32,color:"#555" }}>Aucun coursier trouvé</div>
                  )}

                  {/* Pagination — 5 par page */}
                  {totalPagesCoursier > 1 && (
                    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:6,marginTop:20 }}>
                      <button onClick={()=>setPageCoursier(p=>Math.max(1,p-1))} disabled={pageCoursier===1}
                        style={{ background:pageCoursier===1?"#1a1a35":"#FFD70022",color:pageCoursier===1?"#444":"#FFD700",
                          border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageCoursier===1?"not-allowed":"pointer",fontWeight:700 }}>
                        ‹
                      </button>
                      {Array.from({length:totalPagesCoursier},(_,i)=>i+1).map(p=>(
                        <button key={p} onClick={()=>setPageCoursier(p)}
                          style={{ background:p===pageCoursier?"linear-gradient(135deg,#FFD700,#ff9500)":"#1a1a35",
                            color:p===pageCoursier?"#000":"#aaa",border:"1px solid #FFD70033",
                            borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:700,minWidth:34 }}>
                          {p}
                        </button>
                      ))}
                      <button onClick={()=>setPageCoursier(p=>Math.min(totalPagesCoursier,p+1))} disabled={pageCoursier===totalPagesCoursier}
                        style={{ background:pageCoursier===totalPagesCoursier?"#1a1a35":"#FFD70022",color:pageCoursier===totalPagesCoursier?"#444":"#FFD700",
                          border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageCoursier===totalPagesCoursier?"not-allowed":"pointer",fontWeight:700 }}>
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>
              );
            })()}

            {/* ═══ COMMANDES — données BDD ═══ */}
            {onglet==="commandes" && !loading && (() => {
              const CMD_PAR_PAGE = 5;
              const totalPagesCmd = Math.ceil(commandes.length / CMD_PAR_PAGE);
              const cmdPage = commandes.slice((pageCommande-1)*CMD_PAR_PAGE, pageCommande*CMD_PAR_PAGE);
              return (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#10b98118",
                    border:"1px solid #10b98133",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdListAlt style={{ color:"#10b981",fontSize:22 }}/>
                  </div>
                  Toutes les commandes
                  {/* ✅ Bouton Ajouter */}
                  <button onClick={()=>{ setCmdModal("ajouter"); setCmdForm({id:null,client_id:"",service:"",moyen:"",tarif:"",detail:"",adresse_pickup:"",statut:"en_attente",coursier_id:""}); setCmdErreur(""); }}
                    style={{ marginLeft:"auto",background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",
                      border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13,
                      display:"flex",alignItems:"center",gap:6 }}>
                    <MdAdd style={{ fontSize:18 }}/> Ajouter
                  </button>
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{commandes.length} commande(s) au total</p>

                {/* 3 box statuts — même style que les cartes KPI de l'accueil */}
                <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16,marginBottom:24 }}>
                  {[
                    { label:"EN ATTENTE",     val:commandes.filter(c=>c.statut==="en_attente").length, sub:"à traiter",       Icon:MdSchedule,    color:"#f59e0b" },
                    { label:"EN NÉGOCIATION", val:commandes.filter(c=>c.statut==="negociable").length, sub:"accord en cours", Icon:MdForum,       color:"#3b82f6" },
                    { label:"ACCEPTÉES",      val:commandes.filter(c=>c.statut==="accepte").length,    sub:"en cours",        Icon:MdCheckCircle, color:"#10b981" },
                    { label:"TERMINÉES",      val:commandes.filter(c=>c.statut==="termine").length,    sub:"missions closes", Icon:MdDoneAll,     color:"#8b5cf6" },
                  ].map(s=>(
                    <div key={s.label} style={{
                      ...card, display:"flex",alignItems:"center",gap:16,
                      border:`1px solid ${s.color}33`, boxShadow:`0 4px 20px ${s.color}15`,
                      transition:"transform 0.2s,box-shadow 0.2s",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${s.color}30`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow=`0 4px 20px ${s.color}15`; }}>
                      <div style={{ width:52,height:52,borderRadius:14,backgroundColor:`${s.color}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        boxShadow:`0 0 16px ${s.color}22` }}>
                        <s.Icon style={{ color:s.color,fontSize:26 }}/>
                      </div>
                      <div>
                        <div style={{ color:"#fff",fontWeight:800,fontSize:26,lineHeight:1 }}>{s.val}</div>
                        <div style={{ color:"#888",fontWeight:600,fontSize:10,letterSpacing:1.5,marginTop:3 }}>{s.label}</div>
                        <div style={{ color:s.color,fontSize:11,marginTop:2 }}>{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tableau avec pagination */}
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #FFD70018" }}>
                        {["#","Service","Client","Coursier","Tarif","Statut","Date","Actions"].map(h=>(
                          <th key={h} style={{ color:"#555",fontWeight:600,padding:"10px 14px",
                            textAlign:"left",fontSize:11,letterSpacing:1,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cmdPage.map(cmd=>(
                        <tr key={cmd.id} style={{ borderBottom:"1px solid #ffffff06" }}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                          <td style={{ padding:"12px 14px",color:"#555",fontSize:12 }}>#{cmd.id}</td>
                          <td style={{ padding:"12px 14px",color:"#fff",fontWeight:600 }}>{cmd.service}</td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{cmd.client}</td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{cmd.coursier||"Non assigné"}</td>
                          <td style={{ padding:"12px 14px",color:"#FFD700",fontWeight:700 }}>{(cmd.tarif||0).toLocaleString()} Ar</td>
                          <td style={{ padding:"12px 14px" }}><StatutBadge statut={cmd.statut}/></td>
                          <td style={{ padding:"12px 14px",color:"#555",fontSize:12 }}>{cmd.date}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",gap:6 }}>
                              {/* Modifier */}
                              <button onClick={()=>{
                                setCmdModal("modifier");
                                setCmdForm({ id:cmd.id, client_id:cmd.client_id||"", service:cmd.service||"",
                                  moyen:cmd.moyen||"", tarif:cmd.tarif||"", detail:cmd.detail||"",
                                  adresse_pickup:cmd.adresse_pickup||"", statut:cmd.statut||"en_attente",
                                  coursier_id:cmd.coursier_id||"" });
                                setCmdErreur("");
                              }} title="Modifier"
                                style={{ background:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:6,padding:"5px 8px",cursor:"pointer",
                                  display:"flex",alignItems:"center" }}>
                                <MdEdit style={{ fontSize:15 }}/>
                              </button>
                              {/* Supprimer */}
                              <button onClick={()=>setConfirmDeleteCmd(cmd.id)} title="Supprimer"
                                style={{ background:"#ef444418",border:"1px solid #ef444433",
                                  color:"#ef6666",borderRadius:6,padding:"5px 8px",cursor:"pointer",
                                  display:"flex",alignItems:"center" }}>
                                <MdDelete style={{ fontSize:15 }}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {commandes.length===0 && (
                        <tr><td colSpan={8} style={{ padding:24,textAlign:"center",color:"#555" }}>Aucune commande</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPagesCmd > 1 && (
                  <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:6,marginTop:20 }}>
                    <button onClick={()=>setPageCommande(p=>Math.max(1,p-1))} disabled={pageCommande===1}
                      style={{ background:pageCommande===1?"#1a1a35":"#FFD70022",color:pageCommande===1?"#444":"#FFD700",
                        border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageCommande===1?"not-allowed":"pointer",fontWeight:700 }}>
                      ‹
                    </button>
                    {Array.from({length:totalPagesCmd},(_,i)=>i+1).map(p=>(
                      <button key={p} onClick={()=>setPageCommande(p)}
                        style={{ background:p===pageCommande?"linear-gradient(135deg,#FFD700,#ff9500)":"#1a1a35",
                          color:p===pageCommande?"#000":"#aaa",border:"1px solid #FFD70033",
                          borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:700,minWidth:34 }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={()=>setPageCommande(p=>Math.min(totalPagesCmd,p+1))} disabled={pageCommande===totalPagesCmd}
                      style={{ background:pageCommande===totalPagesCmd?"#1a1a35":"#FFD70022",color:pageCommande===totalPagesCmd?"#444":"#FFD700",
                        border:"1px solid #FFD70033",borderRadius:8,padding:"6px 12px",cursor:pageCommande===totalPagesCmd?"not-allowed":"pointer",fontWeight:700 }}>
                      ›
                    </button>
                  </div>
                )}
              </div>
              );
            })()}


            {/* ═══ ABONNEMENTS — données BDD + pagination ═══ */}
            {onglet==="paiements" && !loading && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#8b5cf618",
                    border:"1px solid #8b5cf633",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdAttachMoney style={{ color:"#8b5cf6",fontSize:22 }}/>
                  </div>
                  Abonnements coursiers
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>
                  Gestion des abonnements mensuels — 10 000 Ar/mois
                </p>

                {/* 4 box BDD */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28 }}>
                  {[
                    { label:"Abonnements actifs",    val:stats.abonnes_payes,                                color:"#10b981",Icon:MdCheckCircle },
                    { label:"Abonnements impayés",   val:stats.abonnes_impayes,                              color:"#ef4444",Icon:MdCancel      },
                    { label:"En attente validation", val:coursiers.filter(c=>c.statut==="inactif").length,   color:"#f59e0b",Icon:MdSchedule    },
                    { label:"Revenus mensuels",      val:`${(stats.abonnes_payes*10000/1000).toFixed(0)}k Ar`,color:"#FFD700",Icon:MdAttachMoney },
                  ].map(s=>(
                    <div key={s.label} style={{ ...card,display:"flex",alignItems:"center",gap:14,
                      border:`1px solid ${s.color}33` }}>
                      <div style={{ width:44,height:44,borderRadius:12,backgroundColor:`${s.color}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <s.Icon style={{ color:s.color,fontSize:22 }}/>
                      </div>
                      <div>
                        <div style={{ color:"#fff",fontWeight:800,fontSize:20 }}>{s.val}</div>
                        <div style={{ color:"#888",fontSize:11,marginTop:2 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Liste coursiers paginée BDD */}
                {coursiersPage.map(c=>(
                  <div key={c.id} style={{ ...card,marginBottom:14 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"center" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                        <div style={{ width:44,height:44,borderRadius:"50%",
                          background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontWeight:800,color:"#000",fontSize:16 }}>
                          {(c.prenom||"?")[0]}{(c.nom||"?")[0]}
                        </div>
                        <div>
                          <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{c.prenom} {c.nom}</div>
                          <div style={{ color:"#888",fontSize:12 }}>{c.email}</div>
                          <div style={{ color:"#555",fontSize:11,marginTop:2 }}>{c.missions} missions</div>
                        </div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                        <StatutBadge statut={c.statut==="actif"?"paye":"impaye"}/>
                        {c.statut==="inactif" && (
                          <button onClick={()=>toggleStatut(c.id,`${c.prenom} ${c.nom}`)}
                            style={{ ...btnY,padding:"8px 16px",fontSize:12,
                              display:"flex",alignItems:"center",gap:6 }}>
                            <MdVerified style={{ fontSize:16 }}/> Valider & Activer
                          </button>
                        )}
                        {c.statut==="actif" && (
                          <button onClick={()=>toggleStatut(c.id,`${c.prenom} ${c.nom}`)}
                            style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",
                              color:"#ef4444",borderRadius:10,padding:"8px 16px",cursor:"pointer",
                              fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:6 }}>
                            <MdBlock style={{ fontSize:16 }}/> Suspendre
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalAbonnPages>1 && (
                  <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:20,flexWrap:"wrap" }}>
                    <button onClick={()=>setAbonnPage(p=>Math.max(1,p-1))}
                      disabled={abonnPage===1}
                      style={{ backgroundColor:"#FFD70018",border:"1px solid #FFD70033",
                        color:"#FFD700",borderRadius:8,padding:"7px 16px",
                        cursor:abonnPage===1?"not-allowed":"pointer",fontWeight:700,fontSize:13,
                        opacity:abonnPage===1?0.4:1 }}>← Précédent</button>
                    {Array.from({length:totalAbonnPages},(_,i)=>i+1).map(p=>(
                      <button key={p} onClick={()=>setAbonnPage(p)}
                        style={{ backgroundColor:p===abonnPage?"#FFD700":"#FFD70018",
                          border:"1px solid #FFD70033",
                          color:p===abonnPage?"#000":"#FFD700",
                          borderRadius:8,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:13 }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={()=>setAbonnPage(p=>Math.min(totalAbonnPages,p+1))}
                      disabled={abonnPage===totalAbonnPages}
                      style={{ backgroundColor:"#FFD70018",border:"1px solid #FFD70033",
                        color:"#FFD700",borderRadius:8,padding:"7px 16px",
                        cursor:abonnPage===totalAbonnPages?"not-allowed":"pointer",fontWeight:700,fontSize:13,
                        opacity:abonnPage===totalAbonnPages?0.4:1 }}>Suivant →</button>
                  </div>
                )}
              </div>
            )}

            {/* ═══ HISTORIQUE & CLASSEMENTS ═══ */}
            {onglet==="historique" && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#FFD70018",
                    border:"1px solid #FFD70033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdHistory style={{ color:"#FFD700",fontSize:22 }}/>
                  </div>
                  Historique & Classements
                </h4>
                <p style={{ color:"#555",marginBottom:20,fontSize:14 }}>
                  Palmarès des coursiers et clients de la plateforme
                </p>

                {/* Filtre période, partagé Top Coursiers + Top Clients */}
                <div style={{ ...card,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",marginBottom:20 }}>
                  <span style={{ color:"#FFD700",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6 }}>
                    <MdFilterList style={{ fontSize:18 }}/> Période :
                  </span>
                  <select value={histMois} onChange={e=>setHistMois(e.target.value)}
                    style={{ ...inp,width:"auto",cursor:"pointer" }}>
                    <option value="">Tous les mois</option>
                    {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
                      .map((m,i)=>(<option key={i} value={i+1}>{m}</option>))}
                  </select>
                  <select value={histAnnee} onChange={e=>setHistAnnee(e.target.value)}
                    style={{ ...inp,width:"auto",cursor:"pointer" }}>
                    <option value="">Toutes les années</option>
                    {[2024,2025,2026,2027].map(a=>(<option key={a} value={a}>{a}</option>))}
                  </select>
                  {histLoading && <span style={{ color:"#555",fontSize:12 }}>Chargement…</span>}
                </div>

                {/* ── TOP COURSIERS ── */}
                <div style={{ ...card,marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10 }}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10 }}>
                      <MdEmojiEvents style={{ fontSize:20 }}/> Top coursiers — missions terminées
                    </div>
                    <select value={limMissions} onChange={e=>setLimMissions(Number(e.target.value))}
                      style={{ ...inp,width:"auto",cursor:"pointer" }}>
                      <option value={5}>Top 5</option>
                      <option value={10}>Top 10</option>
                      <option value={20}>Top 20</option>
                    </select>
                  </div>

                  {topCoursiers.length===0 ? (
                    <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"24px 0" }}>
                      Aucune mission terminée sur cette période.
                    </p>
                  ) : (
                    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                      {topCoursiers.map((c,i)=>{
                        const medaille = i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":null;
                        return (
                          <div key={c.id} style={{ backgroundColor:"#080820",borderRadius:12,
                            border:`1px solid ${medaille?medaille+"55":"#FFD70018"}`,padding:"14px 18px",
                            display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
                            <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,
                              backgroundColor:medaille?medaille+"22":"#ffffff08",
                              border:`2px solid ${medaille||"#ffffff20"}`,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontWeight:800,fontSize:14,color:medaille||"#888" }}>
                              {i<3 ? <MdMilitaryTech style={{ fontSize:18,color:medaille }}/> : `#${i+1}`}
                            </div>
                            <div style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,
                              background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontWeight:800,color:"#000",fontSize:14 }}>
                              {(c.prenom||"?")[0]}{(c.nom||"?")[0]}
                            </div>
                            <div style={{ flex:1,minWidth:160 }}>
                              <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{c.prenom} {c.nom}</div>
                              <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:4,flexWrap:"wrap" }}>
                                <span style={{ color:"#FFD700",fontSize:12,display:"flex",alignItems:"center",gap:3 }}>
                                  <MdStar style={{ fontSize:14 }}/> {c.note || 0}/5
                                </span>
                                <span style={{ color:"#10b981",fontSize:12,fontWeight:700 }}>
                                  {c.nb_missions} mission{c.nb_missions>1?"s":""}
                                </span>
                              </div>
                            </div>
                            <div style={{ display:"flex",gap:6,flexWrap:"wrap",maxWidth:280 }}>
                              {c.services.map((s,idx)=>(
                                <span key={idx} style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600 }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── TOP CLIENTS FIDÈLES ── */}
                <div style={{ ...card,marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10 }}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10 }}>
                      <MdEmojiEvents style={{ fontSize:20 }}/> Top clients — les plus fidèles
                    </div>
                    <select value={limClientsTop} onChange={e=>setLimClientsTop(Number(e.target.value))}
                      style={{ ...inp,width:"auto",cursor:"pointer" }}>
                      <option value={5}>Top 5</option>
                      <option value={10}>Top 10</option>
                      <option value={20}>Top 20</option>
                    </select>
                  </div>

                  {topClients.length===0 ? (
                    <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"24px 0" }}>
                      Aucune commande sur cette période.
                    </p>
                  ) : (
                    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                      {topClients.map((c,i)=>{
                        const medaille = i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":null;
                        return (
                          <div key={c.id} style={{ backgroundColor:"#080820",borderRadius:12,
                            border:`1px solid ${medaille?medaille+"55":"#FFD70018"}`,padding:"14px 18px",
                            display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
                            <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,
                              backgroundColor:medaille?medaille+"22":"#ffffff08",
                              border:`2px solid ${medaille||"#ffffff20"}`,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontWeight:800,fontSize:14,color:medaille||"#888" }}>
                              {i<3 ? <MdMilitaryTech style={{ fontSize:18,color:medaille }}/> : `#${i+1}`}
                            </div>
                            <div style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,
                              background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontWeight:800,color:"#fff",fontSize:14 }}>
                              {(c.prenom||"?")[0]}{(c.nom||"?")[0]}
                            </div>
                            <div style={{ flex:1,minWidth:160 }}>
                              <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{c.prenom} {c.nom}</div>
                              <div style={{ color:"#10b981",fontSize:12,fontWeight:700,marginTop:4 }}>
                                {c.nb_commandes} commande{c.nb_commandes>1?"s":""}
                              </div>
                            </div>
                            <div style={{ display:"flex",gap:6,flexWrap:"wrap",maxWidth:280 }}>
                              {c.services.map((s,idx)=>(
                                <span key={idx} style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600 }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── ANCIENNETÉ : COURSIERS + CLIENTS côte à côte ── */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10 }}>
                  <div style={{ color:"#FFD700",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10 }}>
                    <MdWorkHistory style={{ fontSize:20 }}/> Ancienneté sur la plateforme
                  </div>
                  <select value={limAnciens} onChange={e=>setLimAnciens(Number(e.target.value))}
                    style={{ ...inp,width:"auto",cursor:"pointer" }}>
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                  </select>
                </div>

                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="stats-grid">
                  {/* Coursiers anciens */}
                  <div style={card}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:14,marginBottom:14,
                      display:"flex",alignItems:"center",gap:8 }}>
                      <MdDeliveryDining style={{ fontSize:18 }}/> Coursiers les plus anciens
                    </div>
                    {anciensCoursiers.length===0 ? (
                      <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"16px 0" }}>Aucun coursier.</p>
                    ) : (
                      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                        {anciensCoursiers.map((c,i)=>(
                          <div key={c.id} style={{ backgroundColor:"#080820",borderRadius:10,
                            border:"1px solid #FFD70018",padding:"10px 14px",
                            display:"flex",alignItems:"center",gap:12 }}>
                            <span style={{ color:"#666",fontWeight:700,fontSize:12,width:24 }}>#{i+1}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{c.prenom} {c.nom}</div>
                              <div style={{ color:"#555",fontSize:11,marginTop:2 }}>
                                Depuis le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clients anciens */}
                  <div style={card}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:14,marginBottom:14,
                      display:"flex",alignItems:"center",gap:8 }}>
                      <MdPeople style={{ fontSize:18 }}/> Clients les plus anciens
                    </div>
                    {anciensClients.length===0 ? (
                      <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"16px 0" }}>Aucun client.</p>
                    ) : (
                      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                        {anciensClients.map((c,i)=>(
                          <div key={c.id} style={{ backgroundColor:"#080820",borderRadius:10,
                            border:"1px solid #FFD70018",padding:"10px 14px",
                            display:"flex",alignItems:"center",gap:12 }}>
                            <span style={{ color:"#666",fontWeight:700,fontSize:12,width:24 }}>#{i+1}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{c.prenom} {c.nom}</div>
                              <div style={{ color:"#555",fontSize:11,marginTop:2 }}>
                                Depuis le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ SUPPORT CHAT ═══ */}
            {onglet==="support" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  flexWrap:"wrap", gap:12, marginBottom:20 }}>
                  <h4 style={{ color:"#FFD700",fontWeight:800,fontSize:20,
                    display:"flex",alignItems:"center",gap:12, margin:0 }}>
                    <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#FFD70018",
                      border:"1px solid #FFD70033",display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0 }}>
                      <MdForum style={{ color:"#FFD700",fontSize:22 }}/>
                    </div>
                    Support Chat
                    {supportNonLus > 0 && (
                      <span style={{ background:"#ef4444",color:"#fff",borderRadius:20,
                        padding:"3px 10px",fontSize:12,fontWeight:800 }}>{supportNonLus} non lu(s)</span>
                    )}
                  </h4>
                  <button onClick={()=>exporterSupportPdf(null)} disabled={supportPdfLoading}
                    style={{ backgroundColor:"#8b5cf618", border:"1px solid #8b5cf644",
                      color:"#8b5cf6", borderRadius:10, padding:"10px 18px", fontWeight:700,
                      fontSize:13, cursor: supportPdfLoading ? "not-allowed" : "pointer",
                      display:"flex", alignItems:"center", gap:8, opacity: supportPdfLoading ? 0.6 : 1 }}>
                    {supportPdfLoading
                      ? <div style={{ width:14,height:14,border:"2px solid #8b5cf6",
                          borderTop:"2px solid transparent",borderRadius:"50%",
                          animation:"spin 0.6s linear infinite" }}/>
                      : <MdHistory style={{ fontSize:16 }}/>
                    }
                    Exporter tout en PDF ({supportConvs.length} conversation{supportConvs.length>1?"s":""})
                  </button>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:18,
                  height:600 }} className="support-grid">

                  {/* Liste des conversations */}
                  <div style={{ ...card, padding:0, overflowY:"auto" }}>
                    {supportConvs.length === 0 ? (
                      <div style={{ padding:32, textAlign:"center", color:"#555", fontSize:13 }}>
                        Aucune conversation pour le moment.
                      </div>
                    ) : (
                      supportConvs.map(conv => (
                        <div key={conv.client_id}
                          onClick={()=>ouvrirConversation(conv.client_id)}
                          style={{
                            padding:"14px 16px", cursor:"pointer",
                            borderBottom:"1px solid #ffffff0a",
                            backgroundColor: supportSelected === conv.client_id ? "#FFD70012" : "transparent",
                            borderLeft: supportSelected === conv.client_id ? "3px solid #FFD700" : "3px solid transparent",
                            transition:"all 0.15s",
                          }}
                          onMouseEnter={e=>{ if(supportSelected!==conv.client_id) e.currentTarget.style.backgroundColor="#ffffff08"; }}
                          onMouseLeave={e=>{ if(supportSelected!==conv.client_id) e.currentTarget.style.backgroundColor="transparent"; }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                            <div style={{ color:"#fff", fontWeight:700, fontSize:13.5 }}>
                              {conv.client?.prenom} {conv.client?.nom}
                            </div>
                            {conv.non_lus > 0 && (
                              <span style={{ background:"#ef4444", color:"#fff", borderRadius:20,
                                minWidth:18, height:18, fontSize:10, fontWeight:800,
                                display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>
                                {conv.non_lus}
                              </span>
                            )}
                          </div>
                          <div style={{ color:"#777", fontSize:11.5, marginTop:3,
                            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {conv.sender_role === "client" ? "" : "↳ "}{conv.dernier_message}
                          </div>
                          <div style={{ color:"#444", fontSize:10, marginTop:3 }}>
                            {new Date(conv.date).toLocaleString("fr-FR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Conversation ouverte */}
                  <div style={{ ...card, padding:0, display:"flex", flexDirection:"column" }}>
                    {!supportSelected ? (
                      <div style={{ margin:"auto", textAlign:"center", color:"#555" }}>
                        <MdForum style={{ fontSize:44, color:"#FFD70044", marginBottom:10 }}/>
                        <p style={{ fontSize:13 }}>Sélectionnez une conversation à gauche</p>
                      </div>
                    ) : (
                      <>
                        {/* Header conversation */}
                        {(() => {
                          const conv = supportConvs.find(c => c.client_id === supportSelected);
                          return (
                            <div style={{ padding:"14px 18px", borderBottom:"1px solid #FFD70018",
                              display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                              <div>
                                <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>
                                  {conv?.client?.prenom} {conv?.client?.nom}
                                </div>
                                <div style={{ color:"#777", fontSize:11.5 }}>
                                  {conv?.client?.email} {conv?.client?.telephone ? `· ${conv.client.telephone}` : ""}
                                </div>
                              </div>
                              <button onClick={()=>exporterSupportPdf(supportSelected)} disabled={supportPdfLoading}
                                style={{ backgroundColor:"#3b82f618", border:"1px solid #3b82f644",
                                  color:"#3b82f6", borderRadius:8, padding:"7px 12px", fontWeight:700,
                                  fontSize:11.5, cursor: supportPdfLoading ? "not-allowed" : "pointer",
                                  display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
                                  opacity: supportPdfLoading ? 0.6 : 1 }}>
                                <MdHistory style={{ fontSize:14 }}/> PDF de cette conversation
                              </button>
                            </div>
                          );
                        })()}

                        {/* Messages */}
                        <div style={{ flex:1, overflowY:"auto", padding:16,
                          display:"flex", flexDirection:"column", gap:10 }}>
                          {supportLoading ? (
                            <div style={{ margin:"auto", color:"#555", fontSize:13 }}>Chargement...</div>
                          ) : (
                            supportMessages.map((m, i) => {
                              const estClient = m.sender_role === "client";
                              const estBot = !estClient && !m.sender_id;
                              return (
                                <div key={m.id || i} style={{ display:"flex",
                                  justifyContent: estClient ? "flex-start" : "flex-end" }}>
                                  <div style={{
                                    backgroundColor: estClient ? "#1a1a35" : (estBot ? "#8b5cf618" : "#FFD70018"),
                                    border:`1px solid ${estClient ? "#ffffff15" : (estBot ? "#8b5cf644" : "#FFD70044")}`,
                                    borderRadius: estClient ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                                    padding:"9px 14px", maxWidth:"75%",
                                  }}>
                                    {!estClient && (
                                      <div style={{ color: estBot ? "#8b5cf6" : "#FFD700", fontSize:10,
                                        fontWeight:700, marginBottom:4 }}>
                                        {estBot ? "🤖 Assistant automatique" : "🧑‍💼 Vous (admin)"}
                                      </div>
                                    )}
                                    <div style={{ color:"#fff", fontSize:13, lineHeight:1.5 }}>{m.texte}</div>
                                    <div style={{ color:"#666", fontSize:10, marginTop:3, textAlign:"right" }}>
                                      {new Date(m.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Répondre */}
                        <div style={{ padding:"12px 16px", borderTop:"1px solid #FFD70018",
                          display:"flex", gap:10 }}>
                          <input value={supportReply} onChange={e=>setSupportReply(e.target.value)}
                            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&supportReply.trim()&&envoyerReponseSupport()}
                            placeholder="Répondre au client..."
                            style={{ flex:1, backgroundColor:"#0a0a1e", border:"1px solid #FFD70033",
                              color:"#fff", borderRadius:12, padding:"10px 14px", fontSize:13, outline:"none" }}/>
                          <button onClick={envoyerReponseSupport}
                            disabled={!supportReply.trim() || supportEnvoi}
                            style={{ backgroundColor:"#FFD700", color:"#000", border:"none",
                              borderRadius:12, padding:"10px 18px", fontWeight:800, fontSize:13,
                              cursor: supportReply.trim() ? "pointer" : "not-allowed",
                              opacity: supportReply.trim() ? 1 : 0.5 }}>
                            {supportEnvoi ? "..." : "Envoyer"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ PARAMÈTRES ═══ */}
            {onglet==="settings" && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:24,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#6b728018",
                    border:"1px solid #6b728033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdSettings style={{ color:"#6b7280",fontSize:22 }}/>
                  </div>
                  Paramètres
                </h4>

                {/* ═══ GESTION DES TARIFS PAR MOYEN DE DÉPLACEMENT — dynamique BDD ═══ */}
                <div style={{ ...card,marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10 }}>
                      <MdAttachMoney style={{ fontSize:20 }}/> Tarifs par moyen de déplacement
                    </div>
                    <button onClick={ouvrirAjoutMoyen} title="Ajouter un moyen de transport"
                      style={{ ...btnY,padding:"8px 16px",display:"flex",alignItems:"center",gap:6 }}>
                      <MdAdd style={{ fontSize:16 }}/> Ajouter
                    </button>
                  </div>
                  <p style={{ color:"#555",fontSize:12,marginTop:-10,marginBottom:16 }}>
                    Ce tarif s'applique à tous les services (courses, livraison, JIRAMA, mentorat, documents), selon le moyen choisi par le client.
                  </p>

                  {moyens.length===0 ? (
                    <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"24px 0" }}>Aucun moyen de transport enregistré.</p>
                  ) : (
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }} className="stats-grid">
                      {moyens.map(m=>(
                        <div key={m.id} style={{ ...card,padding:16,display:"flex",justifyContent:"space-between",
                          alignItems:"center",border:"1px solid #FFD70033" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                            {m.icone && <span style={{ fontSize:26 }}>{m.icone}</span>}
                            <div>
                              <div style={{ color:"#aaa",fontSize:13 }}>{m.nom}</div>
                              <div style={{ color:"#FFD700",fontWeight:800,fontSize:17,marginTop:2 }}>
                                {Number(m.prix).toLocaleString()} Ar
                              </div>
                              {m.duree_estimee ? (
                                <div style={{ color:"#555",fontSize:11,marginTop:2,display:"flex",alignItems:"center",gap:4 }}>
                                  <MdSchedule style={{ fontSize:12 }}/> ~{m.duree_estimee} min
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                            <button onClick={()=>ouvrirModifierMoyen(m)} title="Modifier"
                              style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                color:"#3b82f6",borderRadius:10,width:32,height:32,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <MdEdit style={{ fontSize:15 }}/>
                            </button>
                            <button onClick={()=>setConfirmDeleteMoyen({id:m.id,nom:m.nom})} title="Supprimer"
                              style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",
                                color:"#ef4444",borderRadius:10,width:32,height:32,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <MdDelete style={{ fontSize:15 }}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ ...card,marginTop:20 }}>
                  <div style={{ color:"#FFD700",fontWeight:700,marginBottom:16,fontSize:15 }}>Compte administrateur</div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14 }}>
                    {[["Email admin","admin@iraky.mg"],["Rôle","Super Administrateur"],
                      ["Accès","Compte unique sécurisé"],["Plateforme","IRAKY Delivery Toliara"]].map(([k,v])=>(
                      <div key={k} style={{ backgroundColor:"#080820",borderRadius:12,padding:"14px 18px",border:"1px solid #FFD70018" }}>
                        <div style={{ color:"#555",fontSize:11,marginBottom:4 }}>{k}</div>
                        <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ═══ GESTION DES ADMINS ═══ */}
                <div style={{ ...card,marginTop:20 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                    <div style={{ color:"#FFD700",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:10 }}>
                      <MdAdminPanelSettings style={{ fontSize:20 }}/> Gestion des admins
                    </div>
                    <button onClick={ouvrirAjoutAdmin} title="Ajouter un admin"
                      style={{ ...btnY,padding:"8px 16px",display:"flex",alignItems:"center",gap:6 }}>
                      <MdPersonAdd style={{ fontSize:16 }}/> Ajouter
                    </button>
                  </div>

                  {admins.length===0 ? (
                    <p style={{ color:"#555",fontSize:13,textAlign:"center",padding:"24px 0" }}>Aucun admin enregistré.</p>
                  ) : (
                    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                      {admins.map(a=>(
                        <div key={a.id} style={{ backgroundColor:"#080820",borderRadius:12,
                          border:"1px solid #FFD70018",padding:"14px 18px",display:"flex",
                          alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
                          <div>
                            <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>
                              {a.prenom} {a.nom}
                              {a.est_moi && <span style={{ color:"#10b981",fontSize:11,marginLeft:8 }}>(vous)</span>}
                            </div>
                            <div style={{ color:"#888",fontSize:12,marginTop:2 }}>{a.email}</div>
                            {a.telephone && <div style={{ color:"#555",fontSize:11,marginTop:2 }}>{a.telephone}</div>}
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <button onClick={()=>ouvrirModifierAdmin(a)} title="Modifier"
                              style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                color:"#3b82f6",borderRadius:10,width:34,height:34,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <MdEdit style={{ fontSize:16 }}/>
                            </button>
                            {!a.est_moi && (
                              <button onClick={()=>setConfirmDeleteAdmin({id:a.id,nom:`${a.prenom} ${a.nom}`})} title="Supprimer"
                                style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",
                                  color:"#ef4444",borderRadius:10,width:34,height:34,cursor:"pointer",
                                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                                <MdDelete style={{ fontSize:16 }}/>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL DÉTAIL UTILISATEUR */}
      {detailUser && (
        <Modal onClose={()=>setDetailUser(null)} size="lg">
          <h5 style={{ color:"#FFD700",marginBottom:20,fontWeight:800,fontSize:18,
            display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:48,height:48,borderRadius:"50%",
              background:detailUser.type==="coursier"?"linear-gradient(135deg,#FFD700,#ff8c00)":"linear-gradient(135deg,#3b82f6,#1d4ed8)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontWeight:800,color:detailUser.type==="coursier"?"#000":"#fff",fontSize:18 }}>
              {(detailUser.prenom||"?")[0]}{(detailUser.nom||"?")[0]}
            </div>
            {detailUser.prenom} {detailUser.nom}
          </h5>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,marginBottom:20 }}>
            {[
              ["Nom",detailUser.nom],["Prénom",detailUser.prenom],
              ["Email",detailUser.email],["Téléphone",detailUser.telephone],
              ["Adresse",detailUser.adresse],["Statut",detailUser.statut],
              ["Inscrit le",detailUser.created_at],
              ...(detailUser.type==="coursier"?[
                ["CIN",detailUser.cin||"—"],
                ["Note",`${detailUser.note||0}/5 ⭐`],
                ["Missions",detailUser.missions],
              ]:[["Commandes",detailUser.commandes]]),
            ].map(([k,v])=>(
              <div key={k} style={{ padding:"10px 0",borderBottom:"1px solid #ffffff08" }}>
                <div style={{ color:"#555",fontSize:11,marginBottom:3 }}>{k}</div>
                <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{v}</div>
              </div>
            ))}
          </div>
          {detailUser.type==="coursier" && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#06b6d4",fontWeight:700,fontSize:14,marginBottom:14,
                display:"flex",alignItems:"center",gap:8 }}>
                <MdBadge style={{ fontSize:18 }}/> Photos CIN
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                {[{label:"CIN Recto",chemin:detailUser.photo_recto,color:"#06b6d4"},
                  {label:"CIN Verso",chemin:detailUser.photo_verso,color:"#8b5cf6"}].map(p=>(
                  <div key={p.label} style={{ backgroundColor:"#080820",borderRadius:12,
                    border:`1px solid ${p.color}22`,overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px",borderBottom:`1px solid ${p.color}18`,
                      color:"#aaa",fontSize:12,display:"flex",alignItems:"center",gap:6 }}>
                      <MdBadge style={{ color:p.color }}/> {p.label}
                    </div>
                    {p.chemin?(
                      <img src={`${BASE_URL}/storage/${p.chemin}`} alt={p.label}
                        style={{ width:"100%",height:160,objectFit:"cover",display:"block" }}
                        onError={e=>{ e.target.style.display="none"; }}/>
                    ):(
                      <div style={{ height:160,display:"flex",alignItems:"center",
                        justifyContent:"center",flexDirection:"column",gap:8,color:"#444" }}>
                        <MdBadge style={{ fontSize:36 }}/>
                        <span style={{ fontSize:12 }}>Non fourni</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display:"flex",gap:12,marginTop:4,flexWrap:"wrap" }}>
            <button onClick={()=>{ toggleStatut(detailUser.id,`${detailUser.prenom} ${detailUser.nom}`); setDetailUser(null); }}
              style={{ flex:1,padding:"11px",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",
                backgroundColor:detailUser.statut==="actif"?"#ef444418":"#10b98118",
                border:`1px solid ${detailUser.statut==="actif"?"#ef444433":"#10b98133"}`,
                color:detailUser.statut==="actif"?"#ef4444":"#10b981",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              {detailUser.statut==="actif"?<><MdBlock style={{ fontSize:18 }}/> Désactiver</>:<><MdCheckCircle style={{ fontSize:18 }}/> Activer</>}
            </button>
            <button onClick={()=>{ setDetailUser(null); setConfirmDelete({id:detailUser.id,nom:`${detailUser.prenom} ${detailUser.nom}`}); }}
              style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",color:"#ef4444",
                borderRadius:10,padding:"11px 20px",cursor:"pointer",fontWeight:700,fontSize:14,
                display:"flex",alignItems:"center",gap:8 }}>
              <MdDelete style={{ fontSize:18 }}/> Supprimer
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL CONFIRM DELETE USER */}
      {confirmDelete && (
        <Modal onClose={()=>setConfirmDelete(null)}>
          <h5 style={{ color:"#ef4444",marginBottom:12,fontWeight:800,display:"flex",alignItems:"center",gap:8 }}>
            <MdDelete style={{ fontSize:22 }}/> Confirmer la suppression
          </h5>
          <p style={{ color:"#aaa",fontSize:14,marginBottom:24,lineHeight:1.6 }}>
            Supprimer <strong style={{ color:"#fff" }}>{confirmDelete.nom}</strong> ?
            Cette action est <span style={{ color:"#ef4444" }}>irréversible</span>.
          </p>
          <div style={{ display:"flex",gap:12 }}>
            <button onClick={()=>setConfirmDelete(null)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"1px solid #ffffff20",
                backgroundColor:"transparent",color:"#fff",cursor:"pointer",fontWeight:700 }}>
              Annuler
            </button>
            <button onClick={()=>deleteUser(confirmDelete.id,confirmDelete.nom)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"none",
                backgroundColor:"#ef4444",color:"#fff",cursor:"pointer",fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              <MdDelete style={{ fontSize:18 }}/> Supprimer
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL AJOUTER / MODIFIER ADMIN */}
      {adminModal && (
        <Modal onClose={()=>setAdminModal(null)}>
          <h5 style={{ color:"#FFD700",marginBottom:20,fontWeight:800,fontSize:18,
            display:"flex",alignItems:"center",gap:10 }}>
            <MdAdminPanelSettings style={{ fontSize:22 }}/>
            {adminModal==="ajouter" ? "Ajouter un admin" : "Modifier l'admin"}
          </h5>
          <form onSubmit={soumettreAdmin} style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <input type="text" placeholder="Prénom" required style={inp}
                value={adminForm.prenom}
                onChange={e=>setAdminForm({...adminForm,prenom:e.target.value})}/>
              <input type="text" placeholder="Nom" required style={inp}
                value={adminForm.nom}
                onChange={e=>setAdminForm({...adminForm,nom:e.target.value})}/>
            </div>
            <input type="email" placeholder="Email" required style={inp}
              value={adminForm.email}
              onChange={e=>setAdminForm({...adminForm,email:e.target.value})}/>
            <input type="text" placeholder="Téléphone" style={inp}
              value={adminForm.telephone||""}
              onChange={e=>setAdminForm({...adminForm,telephone:e.target.value})}/>
            <input type="password" style={inp}
              placeholder={adminModal==="ajouter" ? "Mot de passe" : "Nouveau mot de passe (optionnel)"}
              required={adminModal==="ajouter"}
              value={adminForm.password}
              onChange={e=>setAdminForm({...adminForm,password:e.target.value})}/>

            {adminErreur && <p style={{ color:"#ef4444",fontSize:13,margin:0 }}>{adminErreur}</p>}

            <button type="submit" disabled={adminEnvoi}
              style={{ ...btnY,padding:"12px",fontSize:14,opacity:adminEnvoi?0.6:1,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              {adminEnvoi ? "Envoi..." : (adminModal==="ajouter" ? "Créer l'admin" : "Enregistrer")}
            </button>
          </form>
        </Modal>
      )}

      {/* MODAL CONFIRM DELETE ADMIN */}
      {confirmDeleteAdmin && (
        <Modal onClose={()=>setConfirmDeleteAdmin(null)}>
          <h5 style={{ color:"#ef4444",marginBottom:12,fontWeight:800,display:"flex",alignItems:"center",gap:8 }}>
            <MdDelete style={{ fontSize:22 }}/> Confirmer la suppression
          </h5>
          <p style={{ color:"#aaa",fontSize:14,marginBottom:24,lineHeight:1.6 }}>
            Supprimer l'admin <strong style={{ color:"#fff" }}>{confirmDeleteAdmin.nom}</strong> ?
            Cette action est <span style={{ color:"#ef4444" }}>irréversible</span>.
          </p>
          <div style={{ display:"flex",gap:12 }}>
            <button onClick={()=>setConfirmDeleteAdmin(null)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"1px solid #ffffff20",
                backgroundColor:"transparent",color:"#fff",cursor:"pointer",fontWeight:700 }}>
              Annuler
            </button>
            <button onClick={()=>supprimerAdmin(confirmDeleteAdmin.id,confirmDeleteAdmin.nom)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"none",
                backgroundColor:"#ef4444",color:"#fff",cursor:"pointer",fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              <MdDelete style={{ fontSize:18 }}/> Supprimer
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL AJOUTER / MODIFIER MOYEN DE TRANSPORT */}
      {moyenModal && (
        <Modal onClose={()=>setMoyenModal(null)}>
          <h5 style={{ color:"#FFD700",marginBottom:20,fontWeight:800,fontSize:18,
            display:"flex",alignItems:"center",gap:10 }}>
            <MdAttachMoney style={{ fontSize:22 }}/>
            {moyenModal==="ajouter" ? "Ajouter un moyen de transport" : "Modifier le moyen de transport"}
          </h5>
          <form onSubmit={soumettreMoyen} style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 3fr",gap:14 }}>
              <input type="text" placeholder="🚶" maxLength={2} style={{ ...inp,textAlign:"center",fontSize:20 }}
                value={moyenForm.icone}
                onChange={e=>setMoyenForm({...moyenForm,icone:e.target.value})}/>
              <input type="text" placeholder="Nom (ex: Piéton)" required style={inp}
                value={moyenForm.nom}
                onChange={e=>setMoyenForm({...moyenForm,nom:e.target.value})}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <input type="number" placeholder="Prix (Ar)" required style={inp}
                value={moyenForm.prix}
                onChange={e=>setMoyenForm({...moyenForm,prix:e.target.value})}/>
              <input type="number" placeholder="Durée estimée (min)" style={inp}
                value={moyenForm.duree_estimee}
                onChange={e=>setMoyenForm({...moyenForm,duree_estimee:e.target.value})}/>
            </div>

            {moyenErreur && <p style={{ color:"#ef4444",fontSize:13,margin:0 }}>{moyenErreur}</p>}

            <button type="submit" disabled={moyenEnvoi}
              style={{ ...btnY,padding:"12px",fontSize:14,opacity:moyenEnvoi?0.6:1,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              {moyenEnvoi ? "Envoi..." : (moyenModal==="ajouter" ? "Créer" : "Enregistrer")}
            </button>
          </form>
        </Modal>
      )}

      {/* MODAL CONFIRM DELETE MOYEN DE TRANSPORT */}
      {confirmDeleteMoyen && (
        <Modal onClose={()=>setConfirmDeleteMoyen(null)}>
          <h5 style={{ color:"#ef4444",marginBottom:12,fontWeight:800,display:"flex",alignItems:"center",gap:8 }}>
            <MdDelete style={{ fontSize:22 }}/> Confirmer la suppression
          </h5>
          <p style={{ color:"#aaa",fontSize:14,marginBottom:24,lineHeight:1.6 }}>
            Supprimer le moyen de transport <strong style={{ color:"#fff" }}>{confirmDeleteMoyen.nom}</strong> ?
            Cette action est <span style={{ color:"#ef4444" }}>irréversible</span>.
          </p>
          <div style={{ display:"flex",gap:12 }}>
            <button onClick={()=>setConfirmDeleteMoyen(null)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"1px solid #ffffff20",
                backgroundColor:"transparent",color:"#fff",cursor:"pointer",fontWeight:700 }}>
              Annuler
            </button>
            <button onClick={()=>supprimerMoyen(confirmDeleteMoyen.id,confirmDeleteMoyen.nom)}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"none",
                backgroundColor:"#ef4444",color:"#fff",cursor:"pointer",fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              <MdDelete style={{ fontSize:18 }}/> Supprimer
            </button>
          </div>
        </Modal>
      )}

    {/* MODAL CONFIRM DELETE NOTIF */}
      {confirmNotifDel !== null && (
        <Modal onClose={() => setConfirmNotifDel(null)}>
          <h5 style={{ color:"#ef4444", marginBottom:12, fontWeight:800 }}>
            Supprimer cette notification ?
          </h5>
          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button onClick={() => setConfirmNotifDel(null)}
              style={{ flex:1, padding:"11px", borderRadius:10, border:"1px solid #ffffff20",
                backgroundColor:"transparent", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              Annuler
            </button>
            <button onClick={() => deleteNotif(confirmNotifDel)}
              style={{ flex:1, padding:"11px", borderRadius:10, border:"none",
                backgroundColor:"#ef4444", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              Supprimer
            </button>
          </div>
        </Modal>
      )}

      {/* ✅ MODAL VÉRIFICATION COURSIER — AU BON NIVEAU, pas imbriqué */}
      {coursierVerif && (
        <Modal onClose={() => { setCoursierVerif(null); setMsgRejet(""); }} size="lg">
          <h5 style={{ color: "#FFD700", marginBottom: 20, fontWeight: 800, fontSize: 18,
            display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%",
              background: "linear-gradient(135deg,#FFD700,#ff8c00)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, color: "#000", fontSize: 18 }}>
              {coursierVerif.prenom?.[0]}{coursierVerif.nom?.[0]}
            </div>
            Dossier : {coursierVerif.prenom} {coursierVerif.nom}
          </h5>

          {/* Infos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 16 }}>
            {[
              ["Nom",        coursierVerif.nom],
              ["Prénom",     coursierVerif.prenom],
              ["Email",      coursierVerif.email],
              ["Téléphone",  coursierVerif.telephone],
              ["Adresse",    coursierVerif.adresse],
              ["CIN",        coursierVerif.cin || "—"],
              ["Inscrit le", coursierVerif.created_at],
              ["Réf. MVola", coursierVerif.mvola_transaction || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                <div style={{ color: "#555", fontSize: 11, marginBottom: 3 }}>{k}</div>
                <div style={{ color: k === "Réf. MVola" ? "#FFD700" : "#fff",
                  fontWeight: k === "Réf. MVola" ? 700 : 600, fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Photos CIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              {label: "CIN Recto", chemin: coursierVerif.photo_recto, color: "#06b6d4"},
              {label: "CIN Verso", chemin: coursierVerif.photo_verso, color: "#8b5cf6"},
            ].map(p => (
              <div key={p.label} style={{ backgroundColor: "#080820", borderRadius: 12,
                border: `1px solid ${p.color}22`, overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", borderBottom: `1px solid ${p.color}18`,
                  color: "#aaa", fontSize: 12 }}>{p.label}</div>
                {p.chemin ? (
                  <img src={`${BASE_URL}/storage/${p.chemin}`} alt={p.label}
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}/>
                ) : (
                  <div style={{ height: 160, display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#444", fontSize: 13 }}>Non fourni</div>
                )}
              </div>
            ))}
          </div>

          {/* Zone message rejet — visible seulement si msgRejet n'est pas vide */}
          {msgRejet !== "" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" }}>
                ✏️ Message de rejet à envoyer au coursier :
              </label>
              <textarea
                value={msgRejet}
                onChange={e => setMsgRejet(e.target.value)}
                placeholder="Expliquez pourquoi le dossier est rejeté (CIN illisible, paiement non confirmé, etc.)"
                rows={3}
                style={{ width: "100%", backgroundColor: "#080820", border: "1px solid #ef444430",
                  color: "#fff", borderRadius: 10, padding: "10px 14px",
                  fontSize: 13, resize: "vertical", outline: "none" }}
              />
            </div>
          )}

          {/* Boutons actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Valider */}
            <button
              onClick={async () => {
                const res = await fetch(`${BASE_URL}/api/admin/valider-coursier/${coursierVerif.id}`, {
                  method: "POST", headers: getHeaders(),
                });
                if (res.ok) {
                  showToast(`✅ ${coursierVerif.prenom} validé ! Il peut se connecter.`);
                  setCoursiersEnAttente(prev => prev.filter(c => c.id !== coursierVerif.id));
                  setCoursierVerif(null);
                  fetchAll();
                } else {
                  showToast("Erreur lors de la validation", "error");
                }
              }}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#10b981,#059669)",
                color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <MdCheckCircle style={{ fontSize: 18 }}/> Valider le dossier
            </button>

            {/* Rejeter */}
            {msgRejet === "" ? (
              <button
                onClick={() => setMsgRejet(" ")}
                style={{ flex: 1, padding: "12px", borderRadius: 12,
                  backgroundColor: "#ef444418", border: "1px solid #ef444433",
                  color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <MdClose style={{ fontSize: 18 }}/> Rejeter le dossier
              </button>
            ) : (
              <button
                disabled={!msgRejet.trim()}
                onClick={async () => {
                  const res = await fetch(`${BASE_URL}/api/admin/rejeter-coursier/${coursierVerif.id}`, {
                    method: "POST",
                    headers: { ...getHeaders(), "Content-Type": "application/json" },
                    body: JSON.stringify({ message: msgRejet.trim() }),
                  });
                  if (res.ok) {
                    showToast(`❌ Dossier rejeté — ${coursierVerif.prenom} notifié.`, "error");
                    setCoursiersEnAttente(prev => prev.filter(c => c.id !== coursierVerif.id));
                    setCoursierVerif(null);
                    setMsgRejet("");
                    fetchAll();
                  } else {
                    showToast("Erreur lors du rejet", "error");
                  }
                }}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none",
                  backgroundColor: msgRejet.trim() ? "#ef4444" : "#ef444440",
                  color: "#fff", cursor: msgRejet.trim() ? "pointer" : "not-allowed",
                  fontWeight: 700, fontSize: 14, opacity: msgRejet.trim() ? 1 : 0.5,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <MdClose style={{ fontSize: 18 }}/> Envoyer le rejet
              </button>
            )}
          </div>
        </Modal>
      )}


      {/* ═══ MODAL AJOUTER/MODIFIER COMMANDE ═══ */}
      {cmdModal && (
        <Modal titre={cmdModal==="ajouter" ? "Ajouter une commande" : "Modifier la commande"} onClose={()=>setCmdModal(null)}>
          <div style={{ display:"grid", gap:12 }}>
            {cmdErreur && <div style={{ color:"#ef4444",fontSize:13,padding:"8px 12px",background:"#ef444410",borderRadius:8 }}>{cmdErreur}</div>}

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Client *</label>
              <select value={cmdForm.client_id} onChange={e=>setCmdForm(f=>({...f,client_id:e.target.value}))}
                style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}>
                <option value="">— Sélectionner un client —</option>
                {clients.map(c=>(
                  <option key={c.id} value={c.id}>{c.prenom} {c.nom} ({c.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Service *</label>
              <input value={cmdForm.service} onChange={e=>setCmdForm(f=>({...f,service:e.target.value}))}
                placeholder="Ex: Livraison de colis" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Moyen *</label>
                <select value={cmdForm.moyen} onChange={e=>setCmdForm(f=>({...f,moyen:e.target.value}))}
                  style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}>
                  <option value="">— Moyen —</option>
                  <option value="pieton">🚶 Piéton</option>
                  <option value="bicyclette">🚲 Bicyclette</option>
                  <option value="moto">🏍️ Moto</option>
                  <option value="voiture">🚗 Voiture</option>
                </select>
              </div>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Tarif (Ar) *</label>
                <input type="number" value={cmdForm.tarif} onChange={e=>setCmdForm(f=>({...f,tarif:e.target.value}))}
                  placeholder="5000" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Adresse de pickup</label>
              <input value={cmdForm.adresse_pickup} onChange={e=>setCmdForm(f=>({...f,adresse_pickup:e.target.value}))}
                placeholder="Adresse de prise en charge" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Détail</label>
              <textarea value={cmdForm.detail} onChange={e=>setCmdForm(f=>({...f,detail:e.target.value}))}
                placeholder="Description de la commande..." rows={3}
                style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none",resize:"vertical" }}/>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Statut</label>
              <select value={cmdForm.statut} onChange={e=>setCmdForm(f=>({...f,statut:e.target.value}))}
                style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}>
                <option value="en_attente">En attente</option>
                <option value="negociable">Négociable</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="termine">Terminé</option>
              </select>
            </div>

            <button onClick={sauvegarderCommande} disabled={cmdEnvoi}
              style={{ background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#000",border:"none",
                borderRadius:10,padding:"11px",fontWeight:800,cursor:cmdEnvoi?"not-allowed":"pointer",fontSize:14,marginTop:4 }}>
              {cmdEnvoi ? "Enregistrement..." : (cmdModal==="ajouter" ? "Créer la commande" : "Enregistrer")}
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL AJOUTER / MODIFIER CLIENT */}
      {clientModal && (
        <Modal titre={clientModal==="ajouter" ? "Ajouter un client" : "Modifier le client"} onClose={()=>setClientModal(null)}>
          <div style={{ display:"grid", gap:12 }}>
            {clientErreur && <div style={{ color:"#ef4444",fontSize:13,padding:"8px 12px",background:"#ef444410",borderRadius:8 }}>{clientErreur}</div>}

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Prénom *</label>
                <input value={clientForm.prenom} onChange={e=>setClientForm(f=>({...f,prenom:e.target.value}))}
                  placeholder="Prénom" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Nom *</label>
                <input value={clientForm.nom} onChange={e=>setClientForm(f=>({...f,nom:e.target.value}))}
                  placeholder="Nom" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Email *</label>
              <input type="email" value={clientForm.email} onChange={e=>setClientForm(f=>({...f,email:e.target.value}))}
                placeholder="client@email.com" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Téléphone</label>
                <input value={clientForm.telephone} onChange={e=>setClientForm(f=>({...f,telephone:e.target.value}))}
                  placeholder="03X XX XXX XX" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Adresse</label>
                <input value={clientForm.adresse} onChange={e=>setClientForm(f=>({...f,adresse:e.target.value}))}
                  placeholder="Adresse" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>
                {clientModal==="ajouter" ? "Mot de passe *" : "Nouveau mot de passe (optionnel)"}
              </label>
              <input type="password" value={clientForm.password} onChange={e=>setClientForm(f=>({...f,password:e.target.value}))}
                placeholder={clientModal==="ajouter" ? "Mot de passe" : "Laisser vide pour ne pas changer"}
                style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <button onClick={sauvegarderClient} disabled={clientEnvoi}
              style={{ background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#000",border:"none",
                borderRadius:10,padding:"11px",fontWeight:800,cursor:clientEnvoi?"not-allowed":"pointer",fontSize:14,marginTop:4 }}>
              {clientEnvoi ? "Enregistrement..." : (clientModal==="ajouter" ? "Créer le client" : "Enregistrer")}
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL AJOUTER / MODIFIER COURSIER */}
      {coursierModal && (
        <Modal titre={coursierModal==="ajouter" ? "Ajouter un coursier" : "Modifier le coursier"} onClose={()=>setCoursierModal(null)}>
          <div style={{ display:"grid", gap:12 }}>
            {coursierErreur && <div style={{ color:"#ef4444",fontSize:13,padding:"8px 12px",background:"#ef444410",borderRadius:8 }}>{coursierErreur}</div>}

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Prénom *</label>
                <input value={coursierForm.prenom} onChange={e=>setCoursierForm(f=>({...f,prenom:e.target.value}))}
                  placeholder="Prénom" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Nom *</label>
                <input value={coursierForm.nom} onChange={e=>setCoursierForm(f=>({...f,nom:e.target.value}))}
                  placeholder="Nom" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Email *</label>
              <input type="email" value={coursierForm.email} onChange={e=>setCoursierForm(f=>({...f,email:e.target.value}))}
                placeholder="coursier@email.com" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Téléphone</label>
                <input value={coursierForm.telephone} onChange={e=>setCoursierForm(f=>({...f,telephone:e.target.value}))}
                  placeholder="03X XX XXX XX" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
              <div>
                <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>CIN</label>
                <input value={coursierForm.cin} onChange={e=>setCoursierForm(f=>({...f,cin:e.target.value}))}
                  placeholder="Numéro CIN" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
              </div>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>Adresse</label>
              <input value={coursierForm.adresse} onChange={e=>setCoursierForm(f=>({...f,adresse:e.target.value}))}
                placeholder="Adresse" style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <div>
              <label style={{ color:"#aaa",fontSize:12,display:"block",marginBottom:4 }}>
                {coursierModal==="ajouter" ? "Mot de passe *" : "Nouveau mot de passe (optionnel)"}
              </label>
              <input type="password" value={coursierForm.password} onChange={e=>setCoursierForm(f=>({...f,password:e.target.value}))}
                placeholder={coursierModal==="ajouter" ? "Mot de passe" : "Laisser vide pour ne pas changer"}
                style={{ backgroundColor:"#080820",border:"1px solid #FFD70030",color:"#fff",borderRadius:10,padding:"9px 14px",fontSize:13,width:"100%",outline:"none" }}/>
            </div>

            <button onClick={sauvegarderCoursier} disabled={coursierEnvoi}
              style={{ background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#000",border:"none",
                borderRadius:10,padding:"11px",fontWeight:800,cursor:coursierEnvoi?"not-allowed":"pointer",fontSize:14,marginTop:4 }}>
              {coursierEnvoi ? "Enregistrement..." : (coursierModal==="ajouter" ? "Créer le coursier" : "Enregistrer")}
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ CONFIRMATION SUPPRESSION COMMANDE ═══ */}
      {confirmDeleteCmd && (
        <Modal titre="Confirmer la suppression" onClose={()=>setConfirmDeleteCmd(null)}>
          <p style={{ color:"#ccc",marginBottom:20 }}>
            Supprimer la commande <strong style={{ color:"#fff" }}>#{confirmDeleteCmd}</strong> ? Cette action est irréversible.
          </p>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
            <button onClick={()=>setConfirmDeleteCmd(null)}
              style={{ background:"#1a1a35",color:"#aaa",border:"1px solid #ffffff15",borderRadius:8,padding:"8px 16px",cursor:"pointer" }}>
              Annuler
            </button>
            <button onClick={()=>supprimerCommande(confirmDeleteCmd)}
              style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontWeight:700,cursor:"pointer" }}>
              Supprimer
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideIn { from{transform:translateY(-16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes modalIn { from{transform:scale(0.94);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin    { from{transform:rotate(0deg)}            to{transform:rotate(360deg)} }
        @media(min-width:992px){ #main-content{ margin-left:252px !important; } }
        @media(max-width:900px){
          #main-content{ margin-left:0 !important; }
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .charts-grid{ grid-template-columns:1fr !important; }
          .chart-span2{ grid-column:span 1 !important; }
          .support-grid{ grid-template-columns:1fr !important; height:auto !important; }
        }
        @media(max-width:480px){ .stats-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        *{ box-sizing:border-box; }
        body{ overflow-x:hidden; }
        table th, table td{ white-space:nowrap; }
        select{ background-color:#080820; }
        select option{ background-color:#0f1128; }
      `}</style>
    </div>
  );
}

export default DashboardAdmin;