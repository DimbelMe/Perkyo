import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <h2>Panel Admin</h2>
      <button onClick={logout}>Cerrar sesión</button>
      <ul>
        <li><Link to="/panel/clientes">Clientes</Link></li>
        <li><Link to="/panel/materiales">Materiales</Link></li>
        <li><Link to="/panel/pedidos">Pedidos</Link></li>
      </ul>
    </div>
  );
}