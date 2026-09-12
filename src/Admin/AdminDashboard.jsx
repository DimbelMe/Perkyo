import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="panel-page">
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="panel-header">
          <h2 className="panel-title panel-title--centered">
            Panel de gestión
          </h2>
          <button className="panel-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="panel-dashboard-grid">
          <Link to="/panel/clientes" className="panel-dashboard-tile">
            Clientes
          </Link>
          <Link to="/panel/materiales" className="panel-dashboard-tile">
            Materiales
          </Link>
          <Link to="/panel/pedidos" className="panel-dashboard-tile">
            Pedidos
          </Link>
          <Link to="/panel/stock" className="panel-dashboard-tile">
            Stock
          </Link>
        </div>
      </div>
    </div>
  );
}