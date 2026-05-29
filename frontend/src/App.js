import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav 
        className="navbar navbar-dark shadow-sm" 
        style={{ backgroundColor: "#18185c" }}
      >
        <div className="container">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <img
              src="/logo.jpg"
              alt="IRAKY Delivery"
              style={{ width: "45px", height: "45px", borderRadius: "50%" }}
            />
            <span style={{ color: "#FFD700", fontSize: "20px" }}>
              IRAKY Delivery
            </span>
          </span>
        </div>
      </nav>

      {/* Contenu principal */}
      <div 
        className="min-vh-100 py-5" 
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="container">

          {/* Titre */}
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: "#FFD700" }}>
              <i className="fas fa-users me-2"></i>
              Liste des Utilisateurs
            </h2>
            <p className="text-secondary">
              Gestion des utilisateurs IRAKY Delivery
            </p>
          </div>

          {/* Carte tableau */}
          <div 
            className="card shadow-lg border-0" 
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table  table-hover table-bordered text-center mb-0">
                  <thead>
                    <tr style={{ backgroundColor: "#FFD700" }}>
                      <th style={{ color: "#000" }}>#</th>
                      <th style={{ color: "#000" }}>
                        <i className="fas fa-user me-1"></i> Nom
                      </th>
                      <th style={{ color: "#000" }}>Prénom</th>
                      <th style={{ color: "#000" }}>
                        <i className="fas fa-envelope me-1"></i> Email
                      </th>
                      <th style={{ color: "#000" }}>
                        <i className="fas fa-phone me-1"></i> Téléphone
                      </th>
                      <th style={{ color: "#000" }}>
                        <i className="fas fa-tag me-1"></i> Rôle
                      </th>
                      <th style={{ color: "#000" }}>
                        <i className="fas fa-circle me-1"></i> Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-warning py-4">
                          <i className="fas fa-inbox me-2"></i>
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.nom}</td>
                          <td>{user.prenom}</td>
                          <td>{user.email}</td>
                          <td>{user.telephone}</td>
                          <td>
                            <span className={`badge ${
                              user.role === 'admin' 
                                ? 'bg-danger' 
                                : user.role === 'coursier' 
                                  ? 'bg-warning text-dark' 
                                  : 'bg-success'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              user.statut === 'actif' 
                                ? 'bg-success' 
                                : 'bg-secondary'
                            }`}>
                              <i className={`fas fa-circle me-1`}></i>
                              {user.statut}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer carte */}
            <div 
              className="card-footer text-end py-2" 
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <small className="text-secondary">
                Total : <span style={{ color: "#FFD700" }}>{users.length}</span> utilisateur(s)
              </small>
            </div>
          </div>

        </div>
      </div>

      {/* Footer page */}
      <footer 
        className="text-center py-3" 
        style={{ backgroundColor: "#18185c" }}
      >
        <small style={{ color: "#FFD700" }}>
          © 2026 IRAKY Delivery — Toliara, Madagascar
        </small>
      </footer>
    </>
  );
}

export default App;