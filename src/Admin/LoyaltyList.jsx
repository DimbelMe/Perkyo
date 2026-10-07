import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

const emptyForm = {
  ID_Cliente: "",
  Hito: "1",
  Estado: "disponible",
};

// Turns "" into null so empty fields never reach the database as empty strings.
function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === "string" && v.trim() === "" ? null : v,
    ]),
  );
}

// Hito must be a whole number from 1 to 8.
function isValidHito(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 8;
}

// Any date/datetime value -> DD-MM-YYYY (display only).
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export default function LoyaltyList() {
  const { token } = useAuth();
  const [loyalty, setLoyalty] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newRow, setNewRow] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!token) return; // wait until the token exists
    fetchLoyalty();
    fetchClientes();
  }, [token]);

  // Clients come from the database, so ID_Cliente is never typed by hand.
  async function fetchClientes() {
    try {
      const data = await apiRequest("/clientes", { token });
      setClientes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function clienteLabel(id) {
    const c = clientes.find((x) => x.ID_Cliente === id);
    return c ? `${c.nombre} (#${c.ID_Cliente})` : id;
  }

  // API DB request to fetch the loyalty data.
  async function fetchLoyalty() {
    setError(""); // a previous failure must not hide the table forever
    setLoading(true);
    try {
      const data = await apiRequest("/lealtad", { token });
      setLoyalty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(loyaltyItem) {
    setEditingId(loyaltyItem.ID_Lealtad);
    setEditForm({
      ID_Cliente: loyaltyItem.ID_Cliente ?? "",
      Hito: loyaltyItem.Hito ?? "",
      Estado: loyaltyItem.Estado ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function saveEdit(id) {
    if (!isValidHito(editForm.Hito)) {
      alert("El hito debe ser un número entero entre 1 y 8.");
      return;
    }
    try {
      // ID_Cliente and the dates are not editable, so they are not sent.
      const updated = await apiRequest(`/lealtad/${id}`, {
        method: "PUT",
        token,
        body: clean({
          Hito: Number(editForm.Hito),
          Estado: editForm.Estado,
        }),
      });
      setLoyalty((prev) =>
        prev.map((l) => (l.ID_Lealtad === id ? updated : l)),
      );
      cancelEdit();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  async function deleteLoyalty(id) {
    if (!confirm("¿Eliminar esta tarjeta? Esta acción no se puede deshacer."))
      return;
    try {
      await apiRequest(`/lealtad/${id}`, { method: "DELETE", token });
      setLoyalty((prev) => prev.filter((l) => l.ID_Lealtad !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  async function addLoyalty() {
    if (!newRow.ID_Cliente) {
      alert("Selecciona un cliente.");
      return;
    }
    if (!isValidHito(newRow.Hito)) {
      alert("El hito debe ser un número entero entre 1 y 8.");
      return;
    }
    setAdding(true);
    try {
      // The dates are filled in automatically by the server.
      const created = await apiRequest("/lealtad", {
        method: "POST",
        token,
        body: clean({
          ID_Cliente: Number(newRow.ID_Cliente),
          Hito: Number(newRow.Hito),
          Estado: newRow.Estado,
        }),
      });
      setLoyalty((prev) => [created, ...prev]);
      setNewRow(emptyForm);
    } catch (err) {
      alert("Error al crear: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const columns = [
    "ID_Cliente",
    "Hito",
    "Estado",
    "Fecha_Desbloqueo",
    "Fecha_Canje",
  ];

  return (
    <div className="panel-page">
      <Link to="/panel" className="panel-back">
        ← Volver al panel
      </Link>
      <h2 className="panel-title">Lealtad</h2>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>ID</th>
              {columns.map((f) => (
                <th key={f}>{f.replace("_", " ")}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loyalty.map((l) => {
              const isEditing = editingId === l.ID_Lealtad;
              return (
                <tr key={l.ID_Lealtad}>
                  <td>{l.ID_Lealtad}</td>

                  {/* ID_Cliente: read-only */}
                  <td>{clienteLabel(l.ID_Cliente)}</td>

                  {/* Hito: number 1-8 */}
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min={1}
                        max={8}
                        step={1}
                        value={editForm.Hito}
                        onChange={(e) =>
                          setEditForm({ ...editForm, Hito: e.target.value })
                        }
                      />
                    ) : (
                      l.Hito
                    )}
                  </td>

                  {/* Estado */}
                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.Estado}
                        onChange={(e) =>
                          setEditForm({ ...editForm, Estado: e.target.value })
                        }
                      />
                    ) : (
                      l.Estado
                    )}
                  </td>

                  {/* dates: automatic, read-only, DD-MM-YYYY */}
                  <td>{formatDate(l.Fecha_Desbloqueo)}</td>
                  <td>{formatDate(l.Fecha_Canje)}</td>

                  <td style={{ whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <>
                        <button
                          className="panel-btn panel-btn--primary"
                          onClick={() => saveEdit(l.ID_Lealtad)}
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
                          onClick={() => startEdit(l)}
                        >
                          Editar
                        </button>
                        <button
                          className="panel-btn panel-btn--danger"
                          onClick={() => deleteLoyalty(l.ID_Lealtad)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* New row */}
            <tr>
              <td>—</td>
              <td>
                <select
                  value={newRow.ID_Cliente}
                  onChange={(e) =>
                    setNewRow({ ...newRow, ID_Cliente: e.target.value })
                  }
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.ID_Cliente} value={c.ID_Cliente}>
                      {c.nombre} (#{c.ID_Cliente})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={8}
                  step={1}
                  value={newRow.Hito}
                  onChange={(e) =>
                    setNewRow({ ...newRow, Hito: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  value={newRow.Estado}
                  onChange={(e) =>
                    setNewRow({ ...newRow, Estado: e.target.value })
                  }
                />
              </td>
              <td>Automática</td>
              <td>Automática</td>
              <td>
                <button
                  className="panel-btn panel-btn--primary"
                  onClick={addLoyalty}
                  disabled={adding}
                >
                  {adding ? "Agregando..." : "Agregar"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {loyalty.length === 0 && (
        <p className="panel-empty">No hay fidelidades registradas.</p>
      )}
    </div>
  );
}