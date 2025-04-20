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
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20 md:pb-0">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-10">Servicios Express</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-[#1E1E1E] border border-[#333] rounded-xl shadow-md hover:shadow-orange-500/30 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative h-52 md:h-60">
                <Image
                  src={servicio.image}
                  alt={servicio.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{servicio.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">Desde: {servicio.price}</p>
                </div>
                <Link href={`/formServicios?tipo=${encodeURIComponent(servicio.tipo)}`}>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md text-sm">
                    Solicitar
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
