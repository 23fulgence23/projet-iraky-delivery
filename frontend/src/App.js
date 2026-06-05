import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accueil from "./components/Accueil";
import APropos from "./components/APropos";
import NosServices from "./components/NosServices";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Connexion from "./pages/auth/Connexion";
import Inscription from "./pages/auth/Inscription";
import OubliMotDePasse from "./pages/auth/OubliMotDePasse";
import DashboardClient from "./pages/client/DashboardClient";
import DashboardCoursier from "./pages/coursier/DashboardCoursier";
import DashboardAdmin from "./pages/admin/DashboardAdmin";

function Portail() {
  return (
    <>
      <Navbar />
      <Accueil />
      <APropos />
      <NosServices />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portail />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/oubli-mot-de-passe" element={<OubliMotDePasse />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-coursier" element={<DashboardCoursier />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;