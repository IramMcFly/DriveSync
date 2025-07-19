// models/ServiceRequest.js
import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taller: { type: mongoose.Schema.Types.ObjectId, ref: 'Taller', required: true },
  asistente: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // se asigna después
  tipoServicio: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'asignado', 'en_camino', 'finalizado', 'cancelado'], default: 'pendiente' },
  detallesVehiculo: {
    marca: String,
    modelo: String,
    año: String,
    tipoVehiculo: String,
    // ...otros campos relevantes
  },
  ubicacion: {
    lat: Number,
    lng: Number,
    direccion: String,
  },
  fechaSolicitud: { type: Date, default: Date.now },
  // ...otros campos como precio, método de pago, etc.
});

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);