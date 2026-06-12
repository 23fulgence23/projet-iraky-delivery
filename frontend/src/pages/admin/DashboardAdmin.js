import { useState, useEffect, useRef } from "react";
import logo from "../../images/logo.png";
import {
  MdDashboard, MdPeople, MdDeliveryDining, MdListAlt, MdSettings,
  MdLogout, MdNotifications, MdCheckCircle, MdCancel, MdVisibility,
  MdBlock, MdVerified, MdPerson, MdEmail, MdPhone, MdLocationOn,
  MdBadge, MdStar, MdTrendingUp, MdAttachMoney, MdSchedule,
  MdClose, MdSearch, MdFilterList, MdRefresh, MdAdminPanelSettings,
  MdWarning, MdBarChart, MdPieChart, MdShowChart,
} from "react-icons/md";

// ══════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════
const MOCK_CLIENTS = [
  { id:1, nom:"Rakoto",    prenom:"Tony",    email:"tony@gmail.com",    telephone:"+261 34 01 234 56", adresse:"Toliara centre",   statut:"actif",    role:"client",   created_at:"2026-05-01", commandes:5  },
  { id:2, nom:"Rabe",      prenom:"Marie",   email:"marie@gmail.com",   telephone:"+261 33 09 876 54", adresse:"Tsararano, Toliara",statut:"inactif",  role:"client",   created_at:"2026-05-10", commandes:2  },
  { id:3, nom:"Jean",      prenom:"Paul",    email:"jean@gmail.com",    telephone:"+261 32 07 654 32", adresse:"Mahavatse, Toliara",statut:"actif",    role:"client",   created_at:"2026-05-15", commandes:8  },
  { id:4, nom:"Voahangy",  prenom:"Soa",     email:"soa@gmail.com",     telephone:"+261 34 04 321 09", adresse:"Anketa, Toliara",   statut:"actif",    role:"client",   created_at:"2026-05-20", commandes:1  },
];

const MOCK_COURSIERS = [
  { id:5, nom:"Andriamaro", prenom:"Fulgence", email:"fulgence@gmail.com", telephone:"+261 34 02 111 22", adresse:"Toliara centre",   statut:"actif",    role:"coursier", created_at:"2026-05-02", cin:"101 234 567", note:4.5, missions:12, photo_recto:"identites/recto1.jpg", photo_verso:"identites/verso1.jpg", abonnement:"paye",    expiration:"2026-07-01" },
  { id:6, nom:"Rasoa",      prenom:"Hery",     email:"hery@gmail.com",     telephone:"+261 33 03 222 33", adresse:"Tsararano, Toliara",statut:"inactif",  role:"coursier", created_at:"2026-05-08", cin:"202 345 678", note:3.8, missions:6,  photo_recto:null,                    photo_verso:null,                    abonnement:"impaye",  expiration:"2026-06-01" },
  { id:7, nom:"Randriana",  prenom:"Jean",     email:"jeancr@gmail.com",   telephone:"+261 32 04 333 44", adresse:"Mahavatse, Toliara",statut:"actif",    role:"coursier", created_at:"2026-05-12", cin:"303 456 789", note:4.2, missions:9,  photo_recto:"identites/recto3.jpg", photo_verso:"identites/verso3.jpg", abonnement:"paye",    expiration:"2026-07-15" },
  { id:8, nom:"Tiana",      prenom:"Rivo",     email:"rivo@gmail.com",     telephone:"+261 34 05 444 55", adresse:"Anketa, Toliara",   statut:"inactif",  role:"coursier", created_at:"2026-06-01", cin:"404 567 890", note:0,   missions:0,  photo_recto:"identites/recto4.jpg", photo_verso:"identites/verso4.jpg", abonnement:"attente", expiration:null        },
];

const MOCK_COMMANDES = [
  { id:1, service:"Facture JIRAMA", client:"Tony R.",    coursier:"Fulgence A.", tarif:8000,  statut:"termine",    date:"2026-06-01" },
  { id:2, service:"Banque BFV",     client:"Jean P.",    coursier:"Jean R.",     tarif:12000, statut:"accepte",    date:"2026-06-02" },
  { id:3, service:"Achat SACMA",    client:"Soa V.",     coursier:null,          tarif:5000,  statut:"en_attente", date:"2026-06-03" },
  { id:4, service:"Légalisation",   client:"Marie R.",   coursier:"Hery R.",     tarif:8000,  statut:"negociable", date:"2026-06-04" },
  { id:5, service:"Mentor",         client:"Tony R.",    coursier:"Fulgence A.", tarif:6000,  statut:"termine",    date:"2026-06-04" },
];

const MOCK_NOTIFS = [
  { id:1, texte:"Nouvel coursier inscrit : Rivo Tiana",      lu:false, time:"Il y a 5 min",  type:"info"    },
  { id:2, texte:"Abonnement expiré : Hery Rasoa",            lu:false, time:"Il y a 1h",     type:"warning" },
  { id:3, texte:"5 nouvelles commandes aujourd'hui",         lu:true,  time:"Il y a 2h",     type:"success" },
  { id:4, texte:"Paiement reçu : Fulgence Andriamaro",       lu:true,  time:"Hier",          type:"success" },
];

const BASE_URL = "http://localhost:8000";

// ══════════════════════════════════════════════
//  COULEURS STATUT
// ══════════════════════════════════════════════
const STATUT_COLORS = {
  actif:     { color:"#10b981", bg:"#10b98118", label:"Actif"     },
  inactif:   { color:"#ef4444", bg:"#ef444418", label:"Inactif"   },
  paye:      { color:"#10b981", bg:"#10b98118", label:"Payé"      },
  impaye:    { color:"#ef4444", bg:"#ef444418", label:"Impayé"    },
  attente:   { color:"#f59e0b", bg:"#f59e0b18", label:"En attente"},
  en_attente:{ color:"#f59e0b", bg:"#f59e0b18", label:"En attente"},
  negociable:{ color:"#3b82f6", bg:"#3b82f618", label:"Négociation"},
  accepte:   { color:"#10b981", bg:"#10b98118", label:"Accepté"   },
  refuse:    { color:"#ef4444", bg:"#ef444418", label:"Refusé"    },
  termine:   { color:"#8b5cf6", bg:"#8b5cf618", label:"Terminé"   },
};

function StatutBadge({ statut }) {
  const s = STATUT_COLORS[statut] || { color:"#888", bg:"#88818", label:statut };
  return (
    <span style={{ backgroundColor:s.bg, color:s.color, borderRadius:20,
      padding:"3px 12px", fontSize:11, fontWeight:700, border:`1px solid ${s.color}44` }}>
      {s.label}
    </span>
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
//  MINI CHART BAR
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
//  DONUT CHART
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
//  SIDEBAR
// ══════════════════════════════════════════════
function SidebarContent({ onglet, setOnglet, stats }) {
  const items = [
    { id:"accueil",   Icon:MdDashboard,          label:"Tableau de bord"  },
    { id:"clients",   Icon:MdPeople,             label:"Clients",          badge:stats.clients_inactifs },
    { id:"coursiers", Icon:MdDeliveryDining,     label:"Coursiers",        badge:stats.coursiers_attente },
    { id:"commandes", Icon:MdListAlt,            label:"Commandes"         },
    { id:"paiements", Icon:MdAttachMoney,        label:"Abonnements"       },
    { id:"settings",  Icon:MdSettings,           label:"Paramètres"        },
  ];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* logo admin */}
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
            {item.badge>0 && (
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
  const [onglet, setOnglet]         = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [toast, setToast]           = useState(null);
  const [notifs, setNotifs]         = useState(MOCK_NOTIFS);
  const [clients, setClients]       = useState(MOCK_CLIENTS);
  const [coursiers, setCoursiers]   = useState(MOCK_COURSIERS);
  const [commandes]                 = useState(MOCK_COMMANDES);
  const [detailUser, setDetailUser] = useState(null);
  const [search, setSearch]         = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");

  const stats = {
    total_clients:      clients.length,
    clients_actifs:     clients.filter(c=>c.statut==="actif").length,
    clients_inactifs:   clients.filter(c=>c.statut==="inactif").length,
    total_coursiers:    coursiers.length,
    coursiers_actifs:   coursiers.filter(c=>c.statut==="actif").length,
    coursiers_attente:  coursiers.filter(c=>c.abonnement==="attente").length,
    coursiers_impayes:  coursiers.filter(c=>c.abonnement==="impaye").length,
    total_commandes:    commandes.length,
    commandes_terminees:commandes.filter(c=>c.statut==="termine").length,
    revenus:            commandes.filter(c=>c.statut==="termine").reduce((s,c)=>s+c.tarif,0),
    nbNonLus:           notifs.filter(n=>!n.lu).length,
  };

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  const toggleStatut = (id, type) => {
    if (type==="client") {
      setClients(prev=>prev.map(c=>c.id===id?{...c,statut:c.statut==="actif"?"inactif":"actif"}:c));
      showToast("Statut client mis à jour");
    } else {
      setCoursiers(prev=>prev.map(c=>c.id===id?{...c,statut:c.statut==="actif"?"inactif":"actif"}:c));
      showToast("Statut coursier mis à jour");
    }
  };

  const validerAbonnement = (id) => {
    setCoursiers(prev=>prev.map(c=>c.id===id?{...c,abonnement:"paye",statut:"actif",
      expiration:new Date(Date.now()+30*24*3600*1000).toISOString().slice(0,10)}:c));
    showToast("Abonnement validé ! Compte activé ✅");
  };

  const card = { backgroundColor:"#0f1128", borderRadius:18, border:"1px solid #FFD70018", padding:24, transition:"all 0.3s ease" };
  const inp  = { backgroundColor:"#080820", border:"1px solid #FFD70030", color:"#fff", borderRadius:12, padding:"10px 16px", fontSize:13, outline:"none", width:"100%" };
  const btnY = { background:"linear-gradient(135deg,#FFD700,#ff9500)", color:"#000", border:"none", borderRadius:10, padding:"8px 20px", fontWeight:800, cursor:"pointer", fontSize:13, transition:"all 0.2s" };

  // données graphiques
  const chartMensuel = [
    {label:"Jan",val:3},{label:"Fév",val:5},{label:"Mar",val:8},
    {label:"Avr",val:6},{label:"Mai",val:12},{label:"Jun",val:15},
  ];
  const chartServices = [
    {label:"JIR",val:8},{label:"BNQ",val:5},{label:"ACH",val:10},
    {label:"CIN",val:4},{label:"MNT",val:3},{label:"AUT",val:6},
  ];

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
          {/* cloche */}
          <div style={{ position:"relative", cursor:"pointer" }}
            onClick={()=>{ setNotifOpen(!notifOpen); setNotifs(p=>p.map(n=>({...n,lu:true}))); }}>
            <div style={{ width:38,height:38,borderRadius:"50%",backgroundColor:"#FFD70015",
              border:"1px solid #FFD70030",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <MdNotifications style={{ color:"#FFD700", fontSize:20 }}/>
            </div>
            {stats.nbNonLus>0 && (
              <span style={{ position:"absolute",top:-2,right:-2,backgroundColor:"#ef4444",
                color:"#fff",borderRadius:"50%",width:19,height:19,fontSize:10,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #080820",
              }}>{stats.nbNonLus}</span>
            )}
          </div>

          {/* badge admin */}
          <div style={{ display:"flex", alignItems:"center", gap:10,
            backgroundColor:"#FFD70015", border:"1px solid #FFD70033",
            borderRadius:12, padding:"6px 14px" }}>
            <MdAdminPanelSettings style={{ color:"#FFD700", fontSize:20 }}/>
            <span style={{ color:"#FFD700", fontWeight:700, fontSize:13 }}>Admin</span>
          </div>
        </div>
      </nav>

      {/* NOTIFS */}
      {notifOpen && (
        <>
          <div onClick={()=>setNotifOpen(false)} style={{ position:"fixed",inset:0,zIndex:149 }}/>
          <div style={{ position:"fixed",top:74,right:20,zIndex:150,
            backgroundColor:"#0f1128",border:"1px solid #FFD70025",
            borderRadius:16,width:340,boxShadow:"0 16px 48px rgba(0,0,0,0.7)",overflow:"hidden" }}>
            <div style={{ padding:"14px 18px",borderBottom:"1px solid #FFD70018",
              display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ color:"#FFD700",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6 }}>
                <MdNotifications style={{ fontSize:18 }}/> Notifications
              </span>
              <span style={{ color:"#666",fontSize:12 }}>{stats.nbNonLus} non lues</span>
            </div>
            {notifs.map(n=>(
              <div key={n.id} style={{ padding:"12px 18px",borderBottom:"1px solid #ffffff08",
                backgroundColor:n.lu?"transparent":"#FFD70008",
                borderLeft:n.type==="warning"?"3px solid #f59e0b":n.type==="success"?"3px solid #10b981":"3px solid #3b82f6" }}>
                <p style={{ color:n.lu?"#888":"#fff",fontSize:13,margin:0,lineHeight:1.5 }}>{n.texte}</p>
                <small style={{ color:"#555",fontSize:11 }}>{n.time}</small>
              </div>
            ))}
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
          <SidebarContent onglet={onglet} setOnglet={setOnglet} stats={stats}/>
        </aside>

        {/* SIDEBAR mobile */}
        {sidebarOpen && (
          <>
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed",inset:0,backgroundColor:"#000a",zIndex:49 }}/>
            <aside style={{ width:252,position:"fixed",top:66,left:0,bottom:0,
              backgroundColor:"#0a0a20",borderRight:"1px solid #FFD70015",
              padding:"28px 0",zIndex:50,overflowY:"auto" }}>
              <SidebarContent onglet={onglet} setOnglet={o=>{setOnglet(o);setSidebarOpen(false);}} stats={stats}/>
            </aside>
          </>
        )}

        {/* MAIN */}
        <main id="main-content" style={{ flex:1,padding:"28px 20px",maxWidth:"100%" }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>

            {/* ═══ TABLEAU DE BORD ═══ */}
            {onglet==="accueil" && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <h3 style={{ color:"#fff",fontWeight:800,margin:0,fontSize:24 }}>
                    Tableau de bord <span style={{ color:"#FFD700" }}>Admin</span>
                  </h3>
                  <p style={{ color:"#555",marginTop:4,fontSize:14 }}>Vue d'ensemble de la plateforme IRAKY Delivery</p>
                </div>

                {/* KPI Cards */}
                <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
                  {[
                    { label:"CLIENTS",     val:stats.total_clients,    sub:`${stats.clients_actifs} actifs`,     Icon:MdPeople,          color:"#3b82f6" },
                    { label:"COURSIERS",   val:stats.total_coursiers,  sub:`${stats.coursiers_actifs} actifs`,   Icon:MdDeliveryDining,  color:"#FFD700" },
                    { label:"COMMANDES",   val:stats.total_commandes,  sub:`${stats.commandes_terminees} faites`,Icon:MdListAlt,         color:"#10b981" },
                    { label:"REVENUS",     val:`${(stats.revenus/1000).toFixed(0)}k Ar`, sub:"missions terminées", Icon:MdAttachMoney,  color:"#8b5cf6" },
                  ].map(s=>(
                    <div key={s.label} style={{
                      ...card, display:"flex",alignItems:"center",gap:16,
                      border:`1px solid ${s.color}33`,
                      boxShadow:`0 4px 20px ${s.color}15`,
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

                {/* Alertes */}
                {(stats.clients_inactifs>0||stats.coursiers_attente>0||stats.coursiers_impayes>0) && (
                  <div style={{ ...card,marginBottom:24,border:"1px solid #f59e0b33",backgroundColor:"#f59e0b08" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                      <MdWarning style={{ color:"#f59e0b",fontSize:22 }}/>
                      <span style={{ color:"#f59e0b",fontWeight:700,fontSize:15 }}>Actions requises</span>
                    </div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:12 }}>
                      {stats.clients_inactifs>0 && (
                        <div style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",borderRadius:10,
                          padding:"10px 16px",cursor:"pointer" }} onClick={()=>setOnglet("clients")}>
                          <span style={{ color:"#3b82f6",fontSize:13,fontWeight:600 }}>
                            👥 {stats.clients_inactifs} client(s) inactif(s)
                          </span>
                        </div>
                      )}
                      {stats.coursiers_attente>0 && (
                        <div style={{ backgroundColor:"#f59e0b18",border:"1px solid #f59e0b33",borderRadius:10,
                          padding:"10px 16px",cursor:"pointer" }} onClick={()=>setOnglet("coursiers")}>
                          <span style={{ color:"#f59e0b",fontSize:13,fontWeight:600 }}>
                            🚴 {stats.coursiers_attente} coursier(s) en attente d'activation
                          </span>
                        </div>
                      )}
                      {stats.coursiers_impayes>0 && (
                        <div style={{ backgroundColor:"#ef444418",border:"1px solid #ef444433",borderRadius:10,
                          padding:"10px 16px",cursor:"pointer" }} onClick={()=>setOnglet("paiements")}>
                          <span style={{ color:"#ef4444",fontSize:13,fontWeight:600 }}>
                            💳 {stats.coursiers_impayes} abonnement(s) impayé(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Graphiques */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:24 }}
                  className="charts-grid">

                  {/* Histogramme commandes mensuelles */}
                  <div style={{ ...card,gridColumn:"span 2" }} className="chart-span2">
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ width:34,height:34,borderRadius:10,backgroundColor:"#FFD70018",
                          border:"1px solid #FFD70033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <MdBarChart style={{ color:"#FFD700",fontSize:18 }}/>
                        </div>
                        <span style={{ color:"#FFD700",fontWeight:700,fontSize:14 }}>Commandes mensuelles 2026</span>
                      </div>
                      <span style={{ color:"#555",fontSize:12 }}>6 derniers mois</span>
                    </div>
                    <BarChart data={chartMensuel} color="#FFD700" height={120}/>
                  </div>

                  {/* Donut répartition */}
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
                        { val:stats.clients_actifs,   color:"#3b82f6" },
                        { val:stats.clients_inactifs, color:"#1e3a5f" },
                        { val:stats.coursiers_actifs, color:"#FFD700" },
                        { val:stats.coursiers_attente+stats.coursiers_impayes, color:"#ef4444" },
                      ]} size={110}/>
                      <div style={{ display:"flex",flexDirection:"column",gap:6,width:"100%" }}>
                        {[
                          { label:"Clients actifs",    val:stats.clients_actifs,   color:"#3b82f6" },
                          { label:"Clients inactifs",  val:stats.clients_inactifs, color:"#1e3a5f" },
                          { label:"Coursiers actifs",  val:stats.coursiers_actifs, color:"#FFD700" },
                          { label:"Coursiers bloqués", val:stats.coursiers_attente+stats.coursiers_impayes, color:"#ef4444" },
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

                {/* Histogramme services */}
                <div style={{ ...card,marginBottom:24 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
                    <div style={{ width:34,height:34,borderRadius:10,backgroundColor:"#10b98118",
                      border:"1px solid #10b98133",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <MdShowChart style={{ color:"#10b981",fontSize:18 }}/>
                    </div>
                    <span style={{ color:"#10b981",fontWeight:700,fontSize:14 }}>Services les plus demandés</span>
                  </div>
                  <BarChart data={chartServices} color="#10b981" height={100}/>
                  <div style={{ display:"flex",justifyContent:"space-around",marginTop:8,flexWrap:"wrap",gap:6 }}>
                    {["JIRAMA","Banque","Achat","CIN","Mentor","Autre"].map((s,i)=>(
                      <span key={s} style={{ color:"#555",fontSize:10 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Dernières commandes */}
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
                        {commandes.map(cmd=>(
                          <tr key={cmd.id} style={{ borderBottom:"1px solid #ffffff06" }}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                            <td style={{ padding:"10px 12px",color:"#fff",fontWeight:600 }}>{cmd.service}</td>
                            <td style={{ padding:"10px 12px",color:"#aaa" }}>{cmd.client}</td>
                            <td style={{ padding:"10px 12px",color:"#aaa" }}>{cmd.coursier||"—"}</td>
                            <td style={{ padding:"10px 12px",color:"#FFD700",fontWeight:700 }}>{cmd.tarif.toLocaleString()} Ar</td>
                            <td style={{ padding:"10px 12px" }}><StatutBadge statut={cmd.statut}/></td>
                            <td style={{ padding:"10px 12px",color:"#555",fontSize:12 }}>{cmd.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CLIENTS ═══ */}
            {onglet==="clients" && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#3b82f618",
                    border:"1px solid #3b82f633",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdPeople style={{ color:"#3b82f6",fontSize:22 }}/>
                  </div>
                  Gestion des clients
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{clients.length} client(s) enregistré(s)</p>

                {/* Barre recherche + filtre */}
                <div style={{ display:"flex",gap:12,marginBottom:20,flexWrap:"wrap" }}>
                  <div style={{ flex:1,position:"relative",minWidth:200 }}>
                    <MdSearch style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
                      color:"#555",fontSize:18 }}/>
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
                      {clients
                        .filter(c=>(filtreStatut==="tous"||c.statut===filtreStatut)&&
                          (c.nom+c.prenom+c.email).toLowerCase().includes(search.toLowerCase()))
                        .map(c=>(
                        <tr key={c.id} style={{ borderBottom:"1px solid #ffffff06" }}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                              <div style={{ width:34,height:34,borderRadius:"50%",
                                background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontWeight:800,color:"#fff",fontSize:13,flexShrink:0 }}>
                                {c.prenom[0]}{c.nom[0]}
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
                                style={{ backgroundColor:"#3b82f618",border:"1px solid #3b82f633",
                                  color:"#3b82f6",borderRadius:8,padding:"5px 10px",
                                  cursor:"pointer",fontSize:12,fontWeight:600 }}>
                                <MdVisibility style={{ fontSize:14 }}/>
                              </button>
                              <button onClick={()=>toggleStatut(c.id,"client")}
                                style={{ backgroundColor:c.statut==="actif"?"#ef444418":"#10b98118",
                                  border:`1px solid ${c.statut==="actif"?"#ef444433":"#10b98133"}`,
                                  color:c.statut==="actif"?"#ef4444":"#10b981",
                                  borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,fontWeight:600 }}>
                                {c.statut==="actif"?<MdBlock style={{ fontSize:14 }}/>:<MdCheckCircle style={{ fontSize:14 }}/>}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ COURSIERS ═══ */}
            {onglet==="coursiers" && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#FFD70018",
                    border:"1px solid #FFD70033",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdDeliveryDining style={{ color:"#FFD700",fontSize:22 }}/>
                  </div>
                  Gestion des coursiers
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{coursiers.length} coursier(s) enregistré(s)</p>

                <div style={{ display:"flex",gap:12,marginBottom:20,flexWrap:"wrap" }}>
                  <div style={{ flex:1,position:"relative",minWidth:200 }}>
                    <MdSearch style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#555",fontSize:18 }}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Rechercher un coursier..."
                      style={{ ...inp,paddingLeft:40 }}/>
                  </div>
                </div>

                {coursiers.filter(c=>(c.nom+c.prenom+c.email).toLowerCase().includes(search.toLowerCase()))
                  .map(c=>(
                  <div key={c.id} style={{ ...card,marginBottom:16,
                    borderLeft:`4px solid ${c.statut==="actif"?"#10b981":c.abonnement==="attente"?"#f59e0b":"#ef4444"}` }}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:16,flex:1 }}>
                        <div style={{ width:52,height:52,borderRadius:"50%",
                          background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontWeight:800,color:"#000",fontSize:18,flexShrink:0 }}>
                          {c.prenom[0]}{c.nom[0]}
                        </div>
                        <div>
                          <div style={{ color:"#fff",fontWeight:800,fontSize:16 }}>{c.prenom} {c.nom}</div>
                          <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginTop:4 }}>
                            <span style={{ color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:4 }}>
                              <MdEmail style={{ color:"#FFD700" }}/> {c.email}
                            </span>
                            <span style={{ color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:4 }}>
                              <MdPhone style={{ color:"#FFD700" }}/> {c.telephone}
                            </span>
                            <span style={{ color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:4 }}>
                              <MdBadge style={{ color:"#FFD700" }}/> CIN: {c.cin||"—"}
                            </span>
                          </div>
                          <div style={{ display:"flex",gap:8,marginTop:8,flexWrap:"wrap" }}>
                            <StatutBadge statut={c.statut}/>
                            <StatutBadge statut={c.abonnement}/>
                            {c.note>0 && (
                              <span style={{ backgroundColor:"#FFD70018",color:"#FFD700",
                                borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,
                                border:"1px solid #FFD70044",display:"flex",alignItems:"center",gap:4 }}>
                                <MdStar style={{ fontSize:13 }}/> {c.note}/5
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
                        <div style={{ display:"flex",gap:8 }}>
                          <button onClick={()=>setDetailUser({...c,type:"coursier"})}
                            style={{ ...btnY,padding:"7px 14px",fontSize:12,
                              background:"linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
                            <MdVisibility style={{ fontSize:15 }}/> Voir
                          </button>
                          {c.abonnement==="attente"||c.abonnement==="impaye" ? (
                            <button onClick={()=>validerAbonnement(c.id)}
                              style={{ ...btnY,padding:"7px 14px",fontSize:12 }}>
                              <MdVerified style={{ fontSize:15 }}/> Valider abonnement
                            </button>
                          ) : (
                            <button onClick={()=>toggleStatut(c.id,"coursier")}
                              style={{ backgroundColor:c.statut==="actif"?"#ef444418":"#10b98118",
                                border:`1px solid ${c.statut==="actif"?"#ef444433":"#10b98133"}`,
                                color:c.statut==="actif"?"#ef4444":"#10b981",
                                borderRadius:10,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12,
                                display:"flex",alignItems:"center",gap:6 }}>
                              {c.statut==="actif"?<><MdBlock style={{ fontSize:15 }}/> Désactiver</>:<><MdCheckCircle style={{ fontSize:15 }}/> Activer</>}
                            </button>
                          )}
                        </div>
                        <div style={{ color:"#555",fontSize:11 }}>
                          {c.missions} missions · Inscrit le {c.created_at}
                        </div>
                        {c.expiration && (
                          <div style={{ color:"#888",fontSize:11 }}>
                            Abonnement expire : <span style={{ color:"#FFD700" }}>{c.expiration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ═══ COMMANDES ═══ */}
            {onglet==="commandes" && (
              <div>
                <h4 style={{ color:"#FFD700",marginBottom:6,fontWeight:800,fontSize:20,
                  display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,backgroundColor:"#10b98118",
                    border:"1px solid #10b98133",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <MdListAlt style={{ color:"#10b981",fontSize:22 }}/>
                  </div>
                  Toutes les commandes
                </h4>
                <p style={{ color:"#555",marginBottom:24,fontSize:14 }}>{commandes.length} commande(s) au total</p>

                {/* Stats rapides */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14,marginBottom:24 }}>
                  {[
                    { label:"En attente",  val:commandes.filter(c=>c.statut==="en_attente").length, color:"#f59e0b" },
                    { label:"Acceptées",   val:commandes.filter(c=>c.statut==="accepte").length,    color:"#10b981" },
                    { label:"Terminées",   val:commandes.filter(c=>c.statut==="termine").length,    color:"#8b5cf6" },
                    { label:"Refusées",    val:commandes.filter(c=>c.statut==="refuse").length,     color:"#ef4444" },
                  ].map(s=>(
                    <div key={s.label} style={{ backgroundColor:"#0f1128",borderRadius:12,
                      padding:"14px 18px",border:`1px solid ${s.color}33`,
                      display:"flex",flexDirection:"column",gap:4 }}>
                      <div style={{ color:s.color,fontWeight:800,fontSize:24 }}>{s.val}</div>
                      <div style={{ color:"#666",fontSize:12 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #FFD70018" }}>
                        {["#","Service","Client","Coursier","Tarif","Statut","Date"].map(h=>(
                          <th key={h} style={{ color:"#555",fontWeight:600,padding:"10px 14px",
                            textAlign:"left",fontSize:11,letterSpacing:1,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commandes.map(cmd=>(
                        <tr key={cmd.id} style={{ borderBottom:"1px solid #ffffff06" }}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FFD70005"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                          <td style={{ padding:"12px 14px",color:"#555",fontSize:12 }}>#{cmd.id}</td>
                          <td style={{ padding:"12px 14px",color:"#fff",fontWeight:600 }}>{cmd.service}</td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{cmd.client}</td>
                          <td style={{ padding:"12px 14px",color:"#aaa" }}>{cmd.coursier||"Non assigné"}</td>
                          <td style={{ padding:"12px 14px",color:"#FFD700",fontWeight:700 }}>{cmd.tarif.toLocaleString()} Ar</td>
                          <td style={{ padding:"12px 14px" }}><StatutBadge statut={cmd.statut}/></td>
                          <td style={{ padding:"12px 14px",color:"#555",fontSize:12 }}>{cmd.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ PAIEMENTS / ABONNEMENTS ═══ */}
            {onglet==="paiements" && (
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

                {/* Résumé */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28 }}>
                  {[
                    { label:"Abonnements payés",    val:coursiers.filter(c=>c.abonnement==="paye").length,    color:"#10b981",Icon:MdCheckCircle },
                    { label:"Abonnements impayés",  val:coursiers.filter(c=>c.abonnement==="impaye").length,  color:"#ef4444",Icon:MdCancel     },
                    { label:"En attente validation",val:coursiers.filter(c=>c.abonnement==="attente").length, color:"#f59e0b",Icon:MdSchedule   },
                    { label:"Revenus abonnements",  val:`${coursiers.filter(c=>c.abonnement==="paye").length*10000/1000}k Ar`, color:"#FFD700",Icon:MdAttachMoney },
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

                {/* Liste coursiers avec abonnement */}
                {coursiers.map(c=>(
                  <div key={c.id} style={{ ...card,marginBottom:14 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"center" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                        <div style={{ width:44,height:44,borderRadius:"50%",
                          background:"linear-gradient(135deg,#FFD700,#ff8c00)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontWeight:800,color:"#000",fontSize:16 }}>
                          {c.prenom[0]}{c.nom[0]}
                        </div>
                        <div>
                          <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{c.prenom} {c.nom}</div>
                          <div style={{ color:"#888",fontSize:12 }}>{c.email}</div>
                        </div>
                      </div>

                      <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                        <StatutBadge statut={c.abonnement}/>
                        {c.expiration && (
                          <span style={{ color:"#888",fontSize:12 }}>
                            Expire : <span style={{ color:new Date(c.expiration)<new Date()?"#ef4444":"#10b981" }}>
                              {c.expiration}
                            </span>
                          </span>
                        )}
                        {(c.abonnement==="attente"||c.abonnement==="impaye") && (
                          <button onClick={()=>validerAbonnement(c.id)} style={{ ...btnY,padding:"8px 16px",fontSize:12,
                            display:"flex",alignItems:"center",gap:6 }}>
                            <MdVerified style={{ fontSize:16 }}/> Valider & Activer
                          </button>
                        )}
                        {c.abonnement==="paye" && (
                          <button onClick={()=>{ setCoursiers(prev=>prev.map(co=>co.id===c.id?{...co,abonnement:"impaye",statut:"inactif"}:co)); showToast("Abonnement désactivé"); }}
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

                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
                  {[
                    { title:"Tarif piéton",    val:"5 000 Ar",  color:"#10b981" },
                    { title:"Tarif vélo",      val:"6 000 Ar",  color:"#3b82f6" },
                    { title:"Tarif moto",      val:"8 000 Ar",  color:"#f59e0b" },
                    { title:"Tarif voiture",   val:"12 000 Ar", color:"#ef4444" },
                    { title:"Abonnement mensuel coursier", val:"10 000 Ar", color:"#FFD700" },
                    { title:"Durée abonnement",val:"30 jours",  color:"#8b5cf6" },
                  ].map(s=>(
                    <div key={s.title} style={{ ...card,display:"flex",justifyContent:"space-between",
                      alignItems:"center",border:`1px solid ${s.color}22` }}>
                      <span style={{ color:"#aaa",fontSize:14 }}>{s.title}</span>
                      <span style={{ color:s.color,fontWeight:800,fontSize:16 }}>{s.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ ...card,marginTop:20 }}>
                  <div style={{ color:"#FFD700",fontWeight:700,marginBottom:16,fontSize:15 }}>
                    Compte administrateur
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14 }}>
                    {[
                      ["Email admin",   "admin@iraky.mg"],
                      ["Rôle",          "Super Administrateur"],
                      ["Accès",         "Compte unique sécurisé"],
                      ["Plateforme",    "IRAKY Delivery Toliara"],
                    ].map(([k,v])=>(
                      <div key={k} style={{ backgroundColor:"#080820",borderRadius:12,
                        padding:"14px 18px",border:"1px solid #FFD70018" }}>
                        <div style={{ color:"#555",fontSize:11,marginBottom:4 }}>{k}</div>
                        <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{v}</div>
                      </div>
                    ))}
                  </div>
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
              fontWeight:800,color:"#fff",fontSize:18 }}>
              {detailUser.prenom[0]}{detailUser.nom[0]}
            </div>
            {detailUser.prenom} {detailUser.nom}
          </h5>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,marginBottom:20 }}>
            {[
              ["Nom",       detailUser.nom],
              ["Prénom",    detailUser.prenom],
              ["Email",     detailUser.email],
              ["Téléphone", detailUser.telephone],
              ["Adresse",   detailUser.adresse],
              ["Rôle",      detailUser.role],
              ["Statut",    detailUser.statut],
              ["Inscrit le",detailUser.created_at],
              ...(detailUser.type==="coursier"?[
                ["CIN",         detailUser.cin||"—"],
                ["Note",        `${detailUser.note||0}/5`],
                ["Missions",    detailUser.missions],
                ["Abonnement",  detailUser.abonnement],
                ["Expiration",  detailUser.expiration||"—"],
              ]:[
                ["Commandes",   detailUser.commandes],
              ]),
            ].map(([k,v])=>(
              <div key={k} style={{ padding:"10px 0",borderBottom:"1px solid #ffffff08" }}>
                <div style={{ color:"#555",fontSize:11,marginBottom:3 }}>{k}</div>
                <div style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Photos CIN coursier */}
          {detailUser.type==="coursier" && (
            <div>
              <div style={{ color:"#06b6d4",fontWeight:700,fontSize:14,marginBottom:14,
                display:"flex",alignItems:"center",gap:8 }}>
                <MdBadge style={{ fontSize:18 }}/> Photos CIN
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                {[
                  { label:"CIN Recto", chemin:detailUser.photo_recto, color:"#06b6d4" },
                  { label:"CIN Verso", chemin:detailUser.photo_verso, color:"#8b5cf6" },
                ].map(p=>(
                  <div key={p.label} style={{ backgroundColor:"#080820",borderRadius:12,
                    border:`1px solid ${p.color}22`,overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px",borderBottom:`1px solid ${p.color}18`,
                      color:"#aaa",fontSize:12,display:"flex",alignItems:"center",gap:6 }}>
                      <MdBadge style={{ color:p.color }}/> {p.label}
                    </div>
                    {p.chemin ? (
                      <img src={`${BASE_URL}/storage/${p.chemin}`} alt={p.label}
                        style={{ width:"100%",height:160,objectFit:"cover",display:"block" }}
                        onError={e=>{ e.target.style.display="none"; }}/>
                    ) : (
                      <div style={{ height:160,display:"flex",alignItems:"center",
                        justifyContent:"center",flexDirection:"column",gap:8,color:"#444" }}>
                        <MdBadge style={{ fontSize:36 }}/>
                        <span style={{ fontSize:12 }}>Non fourni</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions rapides dans modal */}
              <div style={{ display:"flex",gap:12,marginTop:20,flexWrap:"wrap" }}>
                {(detailUser.abonnement==="attente"||detailUser.abonnement==="impaye") && (
                  <button onClick={()=>{ validerAbonnement(detailUser.id); setDetailUser(null); }}
                    style={{ ...btnY,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                    <MdVerified style={{ fontSize:18 }}/> Valider l'abonnement
                  </button>
                )}
                <button onClick={()=>{ toggleStatut(detailUser.id,"coursier"); setDetailUser(null); }}
                  style={{ flex:1,padding:"11px",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",
                    backgroundColor:detailUser.statut==="actif"?"#ef444418":"#10b98118",
                    border:`1px solid ${detailUser.statut==="actif"?"#ef444433":"#10b98133"}`,
                    color:detailUser.statut==="actif"?"#ef4444":"#10b981",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                  {detailUser.statut==="actif"?<><MdBlock style={{ fontSize:18 }}/> Désactiver</>:<><MdCheckCircle style={{ fontSize:18 }}/> Activer</>}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      <style>{`
        @keyframes slideIn { from{transform:translateY(-16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes modalIn { from{transform:scale(0.94);opacity:0} to{transform:scale(1);opacity:1} }
        @media(min-width:992px){ #main-content{ margin-left:252px !important; } }
        @media(max-width:900px){
          #main-content{ margin-left:0 !important; }
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .charts-grid{ grid-template-columns:1fr !important; }
          .chart-span2{ grid-column:span 1 !important; }
        }
        @media(max-width:480px){
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
        }
        *{ box-sizing:border-box; }
        body{ overflow-x:hidden; }
        table th, table td{ white-space:nowrap; }
      `}</style>
    </div>
  );
}

export default DashboardAdmin;
