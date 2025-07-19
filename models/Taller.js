// models/Taller.js
import mongoose from 'mongoose';

const tallerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },
  email: { type: String },
  servicios: [{ type: String }], // Ej: ['asistencia', 'grua', 'diagnostico']
  asistentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asistente' }],
  horario: { type: String },
  ubicacion: {
    lat: Number,
    lng: Number,
    direccion: String,
  },
  activo: { type: Boolean, default: true },
  // Puedes agregar más campos según necesidades
});

export default mongoose.models.Taller || mongoose.model('Taller', tallerSchema);