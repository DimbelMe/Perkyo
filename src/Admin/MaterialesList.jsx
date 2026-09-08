import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";

export default function MaterialesList() {
  const { token } = useAuth();
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMateriales() {
      try {
        const data = await apiRequest("/materiales", { token });
        setMateriales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMateriales();
  }, [token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/panel">← Volver al panel</Link>
      <h2>Materiales</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Costo Unitario</th>
            <th>Costo Total</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((m) => (
            <tr key={m.ID_Material}>
              <td>{m.ID_Material}</td>
              <td>{m.Nombre_Material}</td>
              <td>{m.Cantidad_Material}</td>
              <td>{m.Costo_Unitario}</td>
              <td>{m.Costo_Total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {materiales.length === 0 && <p>No hay materiales registrados.</p>}
    </div>
  );
}