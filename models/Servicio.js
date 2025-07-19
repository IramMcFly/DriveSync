// models/Servicio.js
import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  // tipo eliminado
  precio: { type: Number, required: true },
  imagen: { type: String }, // URL o path de la imagen
  taller: { type: mongoose.Schema.Types.ObjectId, ref: 'Taller' }, // opcional, si el servicio es de un taller específico
  activo: { type: Boolean, default: true }
});

export default mongoose.models.Servicio || mongoose.model('Servicio', servicioSchema);