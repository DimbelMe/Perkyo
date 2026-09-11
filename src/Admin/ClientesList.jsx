import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";

const emptyForm = {
  Nombre: "",
  Apellido: "",
  Rut: "",
  Telefono: "",
  Correo: "",
  Metodo_Pago: "",
  Comentario: "",
};

export default function ClientesList() {
  const { token } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newRow, setNewRow] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  //Authenthification via "Token" from "AuthContext" to fetch the data from the API
  useEffect(() => {
    fetchClientes();
  }, [token]);

  // API DB request to fetch the clients data.
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  function startEdit(cliente) {
    setEditingId(cliente.ID_Cliente);
    setEditForm({
      Nombre: cliente.Nombre ?? "",
      Apellido: cliente.Apellido ?? "",
      Rut: cliente.Rut ?? "",
      Telefono: cliente.Telefono ?? "",
      Correo: cliente.Correo ?? "",
      Metodo_Pago: cliente.Metodo_Pago ?? "",
      Comentario: cliente.Comentario ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function saveEdit(id) {
    try {
      const updated = await apiRequest(`/clientes/${id}`, {
        method: "PUT",
        token,
        body: editForm,
      });
      setClientes((prev) =>
        prev.map((c) => (c.ID_Cliente === id ? updated : c)),
      );
      cancelEdit();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  async function deleteCliente(id) {
    if (!confirm("¿Eliminar este cliente? Esta acción no se puede deshacer."))
      return;
    try {
      await apiRequest(`/clientes/${id}`, { method: "DELETE", token });
      setClientes((prev) => prev.filter((c) => c.ID_Cliente !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  async function addCliente() {
    if (!newRow.Nombre || !newRow.Telefono) {
      alert("Nombre y Telefono son obligatorios.");
      return;
    }
    setAdding(true);
    try {
      const created = await apiRequest("/clientes", {
        method: "POST",
        token,
        body: newRow,
      });
      setClientes((prev) => [created, ...prev]);
      setNewRow(emptyForm);
    } catch (err) {
      alert("Error al crear: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const fields = [
    "Nombre",
    "Apellido",
    "Rut",
    "Telefono",
    "Correo",
    "Metodo_Pago",
    "Comentario",
  ];

  return (
    <div className="panel-page">
      <Link to="/panel" className="panel-back">
        ← Volver al panel
      </Link>
      <h2 className="panel-title">Clientes</h2>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>ID</th>
              {fields.map((f) => (
                <th key={f}>{f.replace("_", " ")}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const isEditing = editingId === c.ID_Cliente;
              return (
                <tr key={c.ID_Cliente}>
                  <td>{c.ID_Cliente}</td>
                  {fields.map((f) => (
                    <td key={f}>
                      {isEditing ? (
                        <input
                          value={editForm[f]}
                          onChange={(e) =>
                            setEditForm({ ...editForm, [f]: e.target.value })
                          }
                        />
                      ) : (
                        c[f]
                      )}
                    </td>
                  ))}
                  <td style={{ whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <>
                        <button
                          className="panel-btn panel-btn--primary"
                          onClick={() => saveEdit(c.ID_Cliente)}
                        >
                          Guardar
                        </button>
                        <button className="panel-btn" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="panel-btn panel-btn--primary"
                          onClick={() => startEdit(c)}
                        >
                          Editar
                        </button>
                        <button
                          className="panel-btn panel-btn--danger"
                          onClick={() => deleteCliente(c.ID_Cliente)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            <tr>
              <td>—</td>
              {fields.map((f) => (
                <td key={f}>
                  <input
                    value={newRow[f]}
                    onChange={(e) =>
                      setNewRow({ ...newRow, [f]: e.target.value })
                    }
                  />
                </td>
              ))}
              <td>
                <button
                  className="panel-btn panel-btn--primary"
                  onClick={addCliente}
                  disabled={adding}
                >
                  {adding ? "Agregando..." : "Agregar"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {clientes.length === 0 && (
        <p className="panel-empty">No hay clientes registrados.</p>
      )}
    </div>
  );
}
