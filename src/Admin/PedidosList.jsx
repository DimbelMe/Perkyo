import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

const emptyForm = {
  ID_Cliente: "",
  Fecha_Entrega: "",
  Direccion: "",
  Detalles: "",
  Comentario: "",
};

function toDateInputValue(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toISOString().slice(0, 10);
}

export default function PedidosList() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newRow, setNewRow] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [token]);

  async function fetchAll() {
    try {
      const [pedidosData, clientesData] = await Promise.all([
        apiRequest("/pedidos", { token }),
        apiRequest("/clientes", { token }),
      ]);
      setPedidos(pedidosData);
      setClientes(clientesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.ID_Pedido);
    setEditForm({
      ID_Cliente: p.ID_Cliente,
      Fecha_Entrega: toDateInputValue(p.Fecha_Entrega),
      Direccion: p.Direccion ?? "",
      Detalles: p.Detalles ?? "",
      Comentario: p.Comentario ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function toApiPayload(form) {
    return {
      ID_Cliente: Number(form.ID_Cliente),
      Fecha_Entrega: form.Fecha_Entrega,
      Direccion: form.Direccion,
      Detalles: form.Detalles,
      Comentario: form.Comentario,
    };
  }

  async function saveEdit(id) {
    try {
      await apiRequest(`/pedidos/${id}`, {
        method: "PUT",
        token,
        body: toApiPayload(editForm),
      });
      await fetchAll();
      cancelEdit();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  async function deletePedido(id) {
    if (!confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.")) return;
    try {
      await apiRequest(`/pedidos/${id}`, { method: "DELETE", token });
      setPedidos((prev) => prev.filter((p) => p.ID_Pedido !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  async function addPedido() {
    if (!newRow.ID_Cliente) {
      alert("Debe seleccionar un cliente.");
      return;
    }
    setAdding(true);
    try {
      await apiRequest("/pedidos", {
        method: "POST",
        token,
        body: toApiPayload(newRow),
      });
      await fetchAll();
      setNewRow(emptyForm);
    } catch (err) {
      alert("Error al crear: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="panel-page">Cargando...</p>;
  if (error) return <p className="panel-page panel-error">Error: {error}</p>;

  return (
    <div className="panel-page">
      <Link to="/panel" className="panel-back">← Volver al panel</Link>
      <h2 className="panel-title">Pedidos</h2>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha Origen</th>
              <th>Fecha Entrega</th>
              <th>Direccion</th>
              <th>Detalles</th>
              <th>Comentario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => {
              const isEditing = editingId === p.ID_Pedido;
              return (
                <tr key={p.ID_Pedido}>
                  <td>{p.ID_Pedido}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editForm.ID_Cliente}
                        onChange={(e) => setEditForm({ ...editForm, ID_Cliente: e.target.value })}
                      >
                        {clientes.map((c) => (
                          <option key={c.ID_Cliente} value={c.ID_Cliente}>
                            {c.Nombre} {c.Apellido ?? ""} (#{c.ID_Cliente})
                          </option>
                        ))}
                      </select>
                    ) : p.Clientes ? (
                      `${p.Clientes.Nombre} ${p.Clientes.Apellido ?? ""}`
                    ) : (
                      p.ID_Cliente
                    )}
                  </td>
                  <td>{p.Fecha_Origen ? new Date(p.Fecha_Origen).toLocaleDateString() : ""}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.Fecha_Entrega}
                        onChange={(e) => setEditForm({ ...editForm, Fecha_Entrega: e.target.value })}
                      />
                    ) : p.Fecha_Entrega ? (
                      new Date(p.Fecha_Entrega).toLocaleDateString()
                    ) : (
                      ""
                    )}
                  </td>
                  {["Direccion", "Detalles", "Comentario"].map((f) => (
                    <td key={f}>
                      {isEditing ? (
                        <input
                          value={editForm[f]}
                          onChange={(e) => setEditForm({ ...editForm, [f]: e.target.value })}
                        />
                      ) : (
                        p[f]
                      )}
                    </td>
                  ))}
                  <td style={{ whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <>
                        <button className="panel-btn panel-btn--primary" onClick={() => saveEdit(p.ID_Pedido)}>
                          Guardar
                        </button>
                        <button className="panel-btn" onClick={cancelEdit}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="panel-btn panel-btn--primary" onClick={() => startEdit(p)}>Editar</button>
                        <button className="panel-btn panel-btn--danger" onClick={() => deletePedido(p.ID_Pedido)}>
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
              <td>
                <select
                  value={newRow.ID_Cliente}
                  onChange={(e) => setNewRow({ ...newRow, ID_Cliente: e.target.value })}
                >
                  <option value="">-- seleccionar --</option>
                  {clientes.map((c) => (
                    <option key={c.ID_Cliente} value={c.ID_Cliente}>
                      {c.Nombre} {c.Apellido ?? ""} (#{c.ID_Cliente})
                    </option>
                  ))}
                </select>
              </td>
              <td><span className="panel-auto">auto</span></td>
              <td>
                <input
                  type="date"
                  value={newRow.Fecha_Entrega}
                  onChange={(e) => setNewRow({ ...newRow, Fecha_Entrega: e.target.value })}
                />
              </td>
              {["Direccion", "Detalles", "Comentario"].map((f) => (
                <td key={f}>
                  <input
                    value={newRow[f]}
                    onChange={(e) => setNewRow({ ...newRow, [f]: e.target.value })}
                  />
                </td>
              ))}
              <td>
                <button className="panel-btn panel-btn--primary" onClick={addPedido} disabled={adding}>
                  {adding ? "Agregando..." : "Agregar"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {pedidos.length === 0 && <p className="panel-empty">No hay pedidos registrados.</p>}
    </div>
  );
}