// models/Asistente.js
import mongoose from 'mongoose';

const asistenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  taller: { type: mongoose.Schema.Types.ObjectId, ref: 'Taller', required: true },
  activo: { type: Boolean, default: true },
  ubicacionActual: {
    lat: Number,
    lng: Number,
    direccion: String,
  },
  // Puedes agregar más campos como foto, placa, etc.
});

export default mongoose.models.Asistente || mongoose.model('Asistente', asistenteSchema);
