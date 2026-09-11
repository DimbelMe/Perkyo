import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

const emptyForm = {
  Nombre_Material: "",
  Cantidad_Material: "",
  Costo_Unitario: "",
};

export default function MaterialesList() {
  const { token } = useAuth();
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newRow, setNewRow] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchMateriales();
  }, [token]);

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

  function startEdit(m) {
    setEditingId(m.ID_Material);
    setEditForm({
      Nombre_Material: m.Nombre_Material ?? "",
      Cantidad_Material: m.Cantidad_Material ?? "",
      Costo_Unitario: m.Costo_Unitario ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function toApiPayload(form) {
    return {
      Nombre_Material: form.Nombre_Material,
      Cantidad_Material: Number(form.Cantidad_Material),
      Costo_Unitario: Number(form.Costo_Unitario),
    };
  }

  async function saveEdit(id) {
    try {
      const updated = await apiRequest(`/materiales/${id}`, {
        method: "PUT",
        token,
        body: toApiPayload(editForm),
      });
      setMateriales((prev) => prev.map((m) => (m.ID_Material === id ? updated : m)));
      cancelEdit();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  async function deleteMaterial(id) {
    if (!confirm("¿Eliminar este material? Esta acción no se puede deshacer.")) return;
    try {
      await apiRequest(`/materiales/${id}`, { method: "DELETE", token });
      setMateriales((prev) => prev.filter((m) => m.ID_Material !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  async function addMaterial() {
    if (!newRow.Nombre_Material || !newRow.Cantidad_Material || !newRow.Costo_Unitario) {
      alert("Nombre, Cantidad y Costo Unitario son obligatorios.");
      return;
    }
    setAdding(true);
    try {
      const created = await apiRequest("/materiales", {
        method: "POST",
        token,
        body: toApiPayload(newRow),
      });
      setMateriales((prev) => [created, ...prev]);
      setNewRow(emptyForm);
    } catch (err) {
      alert("Error al crear: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="panel-page">Cargando...</p>;
  if (error) return <p className="panel-page panel-error">Error: {error}</p>;

  const fields = ["Nombre_Material", "Cantidad_Material", "Costo_Unitario"];
  const numericFields = ["Cantidad_Material", "Costo_Unitario"];

  return (
    <div className="panel-page">
      <Link to="/panel" className="panel-back">← Volver al panel</Link>
      <h2 className="panel-title">Materiales</h2>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>ID</th>
              {fields.map((f) => (
                <th key={f}>{f.replace("_", " ")}</th>
              ))}
              <th>Costo Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((m) => {
              const isEditing = editingId === m.ID_Material;
              return (
                <tr key={m.ID_Material}>
                  <td>{m.ID_Material}</td>
                  {fields.map((f) => (
                    <td key={f}>
                      {isEditing ? (
                        <input
                          type={numericFields.includes(f) ? "number" : "text"}
                          step={numericFields.includes(f) ? "0.01" : undefined}
                          value={editForm[f]}
                          onChange={(e) => setEditForm({ ...editForm, [f]: e.target.value })}
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
                        <button className="panel-btn panel-btn--primary" onClick={() => saveEdit(m.ID_Material)}>
                          Guardar
                        </button>
                        <button className="panel-btn" onClick={cancelEdit}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="panel-btn panel-btn--primary" onClick={() => startEdit(m)}>Editar</button>
                        <button className="panel-btn panel-btn--danger" onClick={() => deleteMaterial(m.ID_Material)}>
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
                    onChange={(e) => setNewRow({ ...newRow, [f]: e.target.value })}
                  />
                </td>
              ))}
              <td><span className="panel-auto">auto</span></td>
              <td>
                <button className="panel-btn panel-btn--primary" onClick={addMaterial} disabled={adding}>
                  {adding ? "Agregando..." : "Agregar"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {materiales.length === 0 && <p className="panel-empty">No hay materiales registrados.</p>}
    </div>
  );
}