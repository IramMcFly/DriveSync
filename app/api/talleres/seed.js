import { connectDB } from '@/lib/mongoose'
import Taller from '@/models/Taller'

export default async function seedTalleres() {
  await connectDB();
  const talleres = [
    { nombre: 'Taller Orona', direccion: 'Calle 1', telefono: '1234567890', email: 'orona@taller.com', activo: true },
    { nombre: 'AutoAvante', direccion: 'Calle 2', telefono: '0987654321', email: 'autoavante@taller.com', activo: true },
  ];
  for (const t of talleres) {
    await Taller.findOneAndUpdate({ nombre: t.nombre }, t, { upsert: true });
  }
  return 'Talleres insertados';
}
