import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";

export default function PedidosList() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await apiRequest("/pedidos", { token });
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, [token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/panel">← Volver al panel</Link>
      <h2>Pedidos</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha Origen</th>
            <th>Fecha Entrega</th>
            <th>Direccion</th>
            <th>Detalles</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.ID_Pedido}>
              <td>{p.ID_Pedido}</td>
              <td>{p.Clientes ? `${p.Clientes.Nombre} ${p.Clientes.Apellido ?? ""}` : p.ID_Cliente}</td>
              <td>{p.Fecha_Origen ? new Date(p.Fecha_Origen).toLocaleDateString() : ""}</td>
              <td>{new Date(p.Fecha_Entrega).toLocaleDateString()}</td>
              <td>{p.Direccion}</td>
              <td>{p.Detalles}</td>
              <td>{p.Comentario}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {pedidos.length === 0 && <p>No hay pedidos registrados.</p>}
    </div>
  );
}