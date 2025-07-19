import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  nombre: { type: String },
  telefono: { type: String },
  role: { type: String, enum: ['cliente', 'asistente', 'admin'], default: 'cliente' },
  taller: { type: mongoose.Schema.Types.ObjectId, ref: 'Taller' }, // solo para asistentes
});

export default mongoose.models.User || mongoose.model('User', userSchema);
