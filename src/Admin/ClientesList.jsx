import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";

export default function ClientesList() {
  const { token } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await apiRequest("/clientes", { token });
        setClientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, [token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/panel">← Volver al panel</Link>
      <h2>Clientes</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Rut</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Metodo Pago</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.ID_Cliente}>
              <td>{c.ID_Cliente}</td>
              <td>{c.Nombre}</td>
              <td>{c.Apellido}</td>
              <td>{c.Rut}</td>
              <td>{c.Telefono}</td>
              <td>{c.Correo}</td>
              <td>{c.Metodo_Pago}</td>
              <td>{c.Comentario}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {clientes.length === 0 && <p>No hay clientes registrados.</p>}
    </div>
  );
}