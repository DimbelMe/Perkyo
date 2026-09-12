import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

const emptyForm = {
  Color: "",
  Talla: "",
  Cantidad: "",
};

export default function StockList() {
  const { token } = useAuth();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newRow, setNewRow] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStock();
  }, [token]);

  async function fetchStock() {
    try {
      const data = await apiRequest("/stock", { token });
      setStock(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(m) {
    setEditingId(m.ID_Stock);
    setEditForm({
      Color: m.Color ?? "",
      Talla: m.Talla ?? "",
      Cantidad: m.Cantidad ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function toApiPayload(form) {
    return {
      Color: form.Color,
      Talla: form.Talla,
      Cantidad: Number(form.Cantidad),
    };
  }

  async function saveEdit(id) {
    try {
      const updated = await apiRequest(`/stock/${id}`, {
        method: "PUT",
        token,
        body: toApiPayload(editForm),
      });
      setStock((prev) => prev.map((m) => (m.ID_Stock === id ? updated : m)));
      cancelEdit();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  async function deleteStock(id) {
    if (!confirm("¿Eliminar este stock? Esta acción no se puede deshacer."))
      return;
    try {
      await apiRequest(`/stock/${id}`, { method: "DELETE", token });
      setStock((prev) => prev.filter((m) => m.ID_Stock !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  async function addStock() {
    if (!newRow.Color || !newRow.Talla || !newRow.Cantidad) {
      alert("Color, Talla y Cantidad son obligatorios.");
      return;
    }
    setAdding(true);
    try {
      const created = await apiRequest("/stock", {
        method: "POST",
        token,
        body: toApiPayload(newRow),
      });
      setStock((prev) => [created, ...prev]);
      setNewRow(emptyForm);
    } catch (err) {
      alert("Error al crear: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="panel-page">Cargando...</p>;
  if (error) return <p className="panel-page panel-error">Error: {error}</p>;

  const fields = ["Color", "Talla", "Cantidad"];
  const numericFields = ["Cantidad"];

  return (
    <div className="panel-page">
      <Link to="/panel" className="panel-back">
        ← Volver al panel
      </Link>
      <h2 className="panel-title">Stock</h2>

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
            {stock.map((m) => {
              const isEditing = editingId === m.ID_Stock;
              return (
                <tr key={m.ID_Stock}>
                  <td>{m.ID_Stock}</td>
                  {fields.map((f) => (
                    <td key={f}>
                      {isEditing ? (
                        <input
                          type={numericFields.includes(f) ? "number" : "text"}
                          step={numericFields.includes(f) ? "0.01" : undefined}
                          value={editForm[f]}
                          onChange={(e) =>
                            setEditForm({ ...editForm, [f]: e.target.value })
                          }
                        />
                      ) : (
                        m[f]
                      )}
                    </td>
                  ))}
                  <td>{m.Costo_Total}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <>
                        <button
                          className="panel-btn panel-btn--primary"
                          onClick={() => saveEdit(m.ID_Stock)}
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
                          onClick={() => startEdit(m)}
                        >
                          Editar
                        </button>
                        <button
                          className="panel-btn panel-btn--danger"
                          onClick={() => deleteStock(m.ID_Stock)}
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
                    type={numericFields.includes(f) ? "number" : "text"}
                    step={numericFields.includes(f) ? "0.01" : undefined}
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
                  onClick={addStock}
                  disabled={adding}
                >
                  {adding ? "Agregando..." : "Agregar"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {stock.length === 0 && (
        <p className="panel-empty">No hay stock registrado.</p>
      )}
    </div>
  );
}
