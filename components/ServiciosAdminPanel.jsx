"use client";

import { useEffect, useState } from "react";



export default function ServiciosAdminPanel() {
  const [servicios, setServicios] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "", imagen: "", taller: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");

  const fetchServicios = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/servicios");
      if (!res.ok) throw new Error("Error al cargar servicios");
      const data = await res.json();
      setServicios(data);
    } catch (err) {
      setError("No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
    // Cargar talleres
    const fetchTalleres = async () => {
      try {
        const res = await fetch("/api/talleres");
        if (!res.ok) throw new Error("Error al cargar talleres");
        const data = await res.json();
        setTalleres(data);
      } catch (err) {
        setTalleres([]);
      }
    };
    fetchTalleres();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const payload = { ...form };
      if (!payload.taller) delete payload.taller;
      const res = await fetch("/api/servicios", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { ...payload, _id: editId } : payload),
      });
      if (!res.ok) throw new Error("Error al guardar servicio");
      setForm({ nombre: "", precio: "", descripcion: "", imagen: "", taller: "" });
      setEditId(null);
      setSuccess(editId ? "Servicio actualizado" : "Servicio creado");
      fetchServicios();
    } catch (err) {
      setError("No se pudo guardar el servicio");
    }
  };

  const handleEdit = (servicio) => {
    setForm({
      nombre: servicio.nombre || "",
      // tipo eliminado
      precio: servicio.precio || "",
      descripcion: servicio.descripcion || "",
      imagen: servicio.imagen || "",
      taller: servicio.taller || ""
    });
    setEditId(servicio._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/servicios?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar servicio");
      setSuccess("Servicio eliminado");
      fetchServicios();
    } catch (err) {
      setError("No se pudo eliminar el servicio");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-[#1E1E1E] border border-[#333] rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 text-center">Gestión de Servicios</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 text-sm">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            {/* Campo tipo eliminado */}
          </div>
          <div>
            <label className="block mb-1 text-sm">Precio (MXN)</label>
            <input name="precio" value={form.precio} onChange={handleChange} required type="number" min="0" className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
        <div>
          <label className="block mb-1 text-sm">Imagen (URL de JPG, PNG o WEBP)</label>
          <input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            className="w-full bg-[#333] text-white py-2 px-3 rounded-md mb-2"
            placeholder="https://... o /images/ejemplo.jpg"
            type="url"
          />
          {form.imagen && (
            <img src={form.imagen} alt="preview" className="max-h-32 mb-2 rounded" />
          )}
        </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-semibold">
            {editId ? "Actualizar" : "Crear"} Servicio
          </button>
          {success && <div className="text-green-400 text-center mt-2">{success}</div>}
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
        <h3 className="text-lg font-bold mb-4">Servicios existentes</h3>
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : (
          <ul className="space-y-4">
            {servicios.map((s) => (
              <ServicioItem
                key={s._id}
                servicio={s}
                talleres={talleres}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTallerChange={fetchServicios}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Componente para cada servicio con edición, eliminación y asignación de taller
function ServicioItem({ servicio, talleres, onEdit, onDelete, onTallerChange }) {
  // Usar array para talleres asignados
  const [talleresAsignados, setTalleresAsignados] = useState(servicio.talleresAsignados || servicio.talleres || servicio.taller || []);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showTallerModal, setShowTallerModal] = useState(false);

  // Normalizar a array si viene como string
  useEffect(() => {
    if (typeof talleresAsignados === 'string') {
      setTalleresAsignados(talleresAsignados ? [talleresAsignados] : []);
    }
  }, [servicio.talleresAsignados, servicio.talleres, servicio.taller]);

  return (
    <li className="bg-[#222] rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <div className="font-semibold text-white">{servicio.nombre}</div>
        <div className="text-sm text-gray-300">{servicio.descripcion}</div>
        <div className="text-sm text-orange-400 font-bold">${servicio.precio?.toFixed(2)} MXN</div>
        <div className="mt-2">
          <label className="block text-xs mb-1">Talleres asignados:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {talleresAsignados.length > 0 ? (
              talleres
                .filter(t => talleresAsignados.includes(t._id))
                .map(t => (
                  <span key={t._id} className="px-2 py-1 rounded-full bg-orange-600 text-white text-xs font-semibold">
                    {t.nombre}
                  </span>
                ))
            ) : (
              <span className="text-xs text-gray-400">Ningún taller asignado</span>
            )}
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-semibold"
            onClick={() => setShowTallerModal(true)}
            disabled={loading}
          >
            Añadir taller
          </button>
          {msg && <span className="ml-2 text-xs text-orange-400">{msg}</span>}
          {/* Modal de selección de talleres */}
          {showTallerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#222] p-6 rounded-lg max-w-xs w-full">
                <h4 className="font-bold mb-2 text-orange-400 text-center">Selecciona talleres</h4>
                <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
                  {talleres.map(t => (
                    <label key={t._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={talleresAsignados.includes(t._id)}
                        onChange={e => {
                          setTalleresAsignados(prev =>
                            e.target.checked
                              ? [...prev, t._id]
                              : prev.filter(id => id !== t._id)
                          );
                        }}
                        className="accent-orange-600"
                      />
                      <span className="text-sm text-white">{t.nombre}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs"
                    onClick={() => setShowTallerModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-xs"
                    onClick={async () => {
                      setMsg("");
                      setLoading(true);
                      try {
                        const res = await fetch("/api/servicios", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ _id: servicio._id, talleresAsignados }),
                        });
                        if (!res.ok) throw new Error("Error al asignar talleres");
                        setMsg("Talleres asignados");
                        onTallerChange && onTallerChange();
                        setShowTallerModal(false);
                      } catch {
                        setMsg("No se pudo asignar los talleres");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button onClick={() => onEdit(servicio)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">Editar</button>
        <button onClick={() => onDelete(servicio._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">Eliminar</button>
      </div>
    </li>
  );
}
