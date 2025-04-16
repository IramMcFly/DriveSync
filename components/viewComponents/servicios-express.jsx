import Image from "next/image"
import Link from "next/link"

export default function ServiciosExpress() {
  const servicios = [
    {
      id: 1,
      tipo: "asistencia",
      title: "Asistencia vehicular",
      price: "$150 MXN",
      image: "/images/asistencia.jpg",
      alt: "Mecánico trabajando en una llanta",
    },
    {
      id: 2,
      tipo: "grua",
      title: "Servicios de grúa",
      price: "$300 MXN",
      image: "/images/grua.jpg",
      alt: "Grúa transportando un auto",
    },
    {
      id: 3,
      tipo: "diagnostico",
      title: "Diagnóstico de problemas",
      price: "$120 MXN",
      image: "/images/scanner.jpg",
      alt: "Escáner de diagnóstico",
    },
    {
      id: 4,
      tipo: "limpieza",
      title: "Limpieza del Vehículo",
      price: "$340 MXN",
      image: "/images/limpieza.jpg",
      alt: "Lavado de auto",
    },
    {
      id: 5,
      tipo: "cerrajeria",
      title: "Cerrajería",
      price: "$430 MXN",
      image: "/images/cerrajero.jpg",
      alt: "Cerrajero abriendo puerta de auto",
    },
  ]
  

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-white text-center mb-10">Servicios Express</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="bg-[#1E1E1E] border border-[#333] rounded-xl shadow-md hover:shadow-orange-500/30 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
          >
            <div className="w-full h-48 relative">
              <Image
                src={servicio.image}
                alt={servicio.alt}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 space-y-2 w-full">
              <h3 className="text-white text-lg font-semibold">{servicio.title}</h3>
              <p className="text-gray-300 text-sm">Desde: {servicio.price}</p>
              <Link href={`/formServicios?tipo=${encodeURIComponent(servicio.tipo)}`}>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition duration-300">
                  Solicitar
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
