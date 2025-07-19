"use client";

import { useEffect, useState } from "react";

export default function TalleresAdminPanel() {
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "", email: "", servicios: [], horario: "", lat: "", lng: "" });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [asistentes, setAsistentes] = useState([]);
  const [asistenteForm, setAsistenteForm] = useState({ nombre: "", telefono: "", email: "", password: "" });
  const [selectedTaller, setSelectedTaller] = useState(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  // Fetch talleres
  const fetchTalleres = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/talleres");
      if (!res.ok) throw new Error("Error al cargar talleres");
      const data = await res.json();
      setTalleres(data);
    } catch (err) {
      setError("No se pudieron cargar los talleres");
    } finally {
      setLoading(false);
    }
  };

  // Fetch asistentes de un taller
  const fetchAsistentes = async (tallerId) => {
    setAsistentes([]);
    if (!tallerId) return;
    try {
      const res = await fetch(`/api/asistentes?taller=${tallerId}`);
      if (!res.ok) throw new Error("Error al cargar asistentes");
      const data = await res.json();
      setAsistentes(data);
    } catch {
      setAsistentes([]);
    }
  };

  useEffect(() => {
    fetchTalleres();
    // Obtener todos los servicios disponibles
    const fetchServicios = async () => {
      try {
        const res = await fetch("/api/servicios");
        if (!res.ok) return;
        const data = await res.json();
        setServiciosDisponibles(data);
      } catch {}
    };
    fetchServicios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;
    if (name === "servicios" && multiple) {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setForm({ ...form, servicios: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const payload = { ...form };
      // servicios ya es array
      payload.ubicacion = { lat: form.lat, lng: form.lng, direccion: form.direccion };
      delete payload.lat;
      delete payload.lng;
      const res = await fetch("/api/talleres", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { ...payload, _id: editId } : payload),
      });
      if (!res.ok) throw new Error("Error al guardar taller");
      setForm({ nombre: "", direccion: "", telefono: "", email: "", servicios: "", horario: "", lat: "", lng: "" });
      setEditId(null);
      setSuccess(editId ? "Taller actualizado" : "Taller creado");
      fetchTalleres();
    } catch (err) {
      setError("No se pudo guardar el taller");
    }
  };

  const handleEdit = (taller) => {
    setForm({
      nombre: taller.nombre || "",
      direccion: taller.direccion || "",
      telefono: taller.telefono || "",
      email: taller.email || "",
      servicios: taller.servicios || [],
      horario: taller.horario || "",
      lat: taller.ubicacion?.lat || "",
      lng: taller.ubicacion?.lng || ""
    });
    setEditId(taller._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este taller?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/talleres?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar taller");
      setSuccess("Taller eliminado");
      fetchTalleres();
    } catch (err) {
      setError("No se pudo eliminar el taller");
    }
  };

  // Asistentes
  const handleAsistenteChange = (e) => {
    setAsistenteForm({ ...asistenteForm, [e.target.name]: e.target.value });
  };

  const handleAddAsistente = async (e) => {
    e.preventDefault();
    if (!selectedTaller) return;
    try {
      const payload = { ...asistenteForm, taller: selectedTaller._id };
      const res = await fetch("/api/asistentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear asistente");
      setAsistenteForm({ nombre: "", telefono: "", email: "", password: "" });
      fetchAsistentes(selectedTaller._id);
    } catch {}
  };

  const handleDeleteAsistente = async (id) => {
    if (!window.confirm("¿Eliminar este asistente?")) return;
    try {
      const res = await fetch(`/api/asistentes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchAsistentes(selectedTaller._id);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-[#1E1E1E] border border-[#333] rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 text-center">Gestión de Talleres</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 text-sm">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Servicios ofrecidos</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {serviciosDisponibles.length === 0 && (
                <span className="text-xs text-gray-400">No hay servicios registrados</span>
              )}
              {serviciosDisponibles.map(servicio => {
                const selected = form.servicios.includes(servicio._id);
                return (
                  <button
                    type="button"
                    key={servicio._id}
                    onClick={() => {
                      setForm(f => {
                        const servicios = f.servicios.includes(servicio._id)
                          ? f.servicios.filter(s => s !== servicio._id)
                          : [...f.servicios, servicio._id];
                        return { ...f, servicios };
                      });
                    }}
                    className={
                      `px-3 py-1 rounded-full border text-sm transition-colors ` +
                      (selected
                        ? "bg-orange-600 border-orange-600 text-white shadow"
                        : "bg-[#333] border-[#444] text-gray-300 hover:bg-orange-900 hover:text-white")
                    }
                  >
                    {servicio.nombre}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">Horario</label>
            <input name="horario" value={form.horario} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block mb-1 text-sm">Latitud</label>
              <input name="lat" value={form.lat} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm">Longitud</label>
              <input name="lng" value={form.lng} onChange={handleChange} className="w-full bg-[#333] text-white py-2 px-3 rounded-md" />
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-semibold">
            {editId ? "Actualizar" : "Crear"} Taller
          </button>
          {success && <div className="text-green-400 text-center mt-2">{success}</div>}
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
        <h3 className="text-lg font-bold mb-4">Talleres existentes</h3>
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : (
          <ul className="space-y-4">
            {talleres.map((t) => (
              <li key={t._id} className="bg-[#222] rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white">{t.nombre}</div>
                    <div className="text-sm text-gray-300">{t.direccion}</div>
                    <div className="text-sm text-gray-400">Tel: {t.telefono} | Email: {t.email}</div>
                    <div className="text-xs text-orange-400">Servicios: {Array.isArray(t.servicios) && t.servicios.length > 0
                      ? t.servicios.map(id => {
                          const s = serviciosDisponibles.find(sv => sv._id === id);
                          return s ? s.nombre : id;
                        }).join(", ")
                      : 'Ninguno'}</div>
                    <div className="text-xs text-gray-400">Horario: {t.horario}</div>
                    <div className="text-xs text-gray-400">Ubicación: {t.ubicacion?.lat}, {t.ubicacion?.lng}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button onClick={() => { handleEdit(t); setSelectedTaller(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">Editar</button>
                    <button onClick={() => handleDelete(t._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">Eliminar</button>
                    <button onClick={() => { setSelectedTaller(t); fetchAsistentes(t._id); }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">Ver asistentes</button>
                  </div>
                </div>
                {/* Panel de asistentes */}
                {selectedTaller && selectedTaller._id === t._id && (
                  <div className="mt-4 bg-[#1a1a1a] p-4 rounded">
                    <h4 className="font-bold mb-2 text-orange-400">Asistentes de este taller</h4>
                    <form onSubmit={handleAddAsistente} className="flex flex-col md:flex-row gap-2 mb-2">
                      <input name="nombre" value={asistenteForm.nombre} onChange={handleAsistenteChange} placeholder="Nombre" className="bg-[#333] text-white py-1 px-2 rounded-md" required />
                      <input name="telefono" value={asistenteForm.telefono} onChange={handleAsistenteChange} placeholder="Teléfono" className="bg-[#333] text-white py-1 px-2 rounded-md" />
                      <input name="email" value={asistenteForm.email} onChange={handleAsistenteChange} placeholder="Email" className="bg-[#333] text-white py-1 px-2 rounded-md" required />
                      <input name="password" value={asistenteForm.password} onChange={handleAsistenteChange} placeholder="Contraseña" className="bg-[#333] text-white py-1 px-2 rounded-md" required />
                      <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm">Agregar</button>
                    </form>
                    <ul className="space-y-2">
                      {asistentes.length === 0 && <li className="text-xs text-gray-400">No hay asistentes registrados.</li>}
                      {asistentes.map(a => (
                        <li key={a._id} className="flex items-center justify-between bg-[#222] p-2 rounded">
                          <span>{a.nombre} <span className="text-xs text-gray-400">({a.email})</span></span>
                          <button onClick={() => handleDeleteAsistente(a._id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs">Eliminar</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
