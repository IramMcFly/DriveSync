import Image from "next/image"

export default function ServiciosExpress() {
  const servicios = [
    {
      id: 1,
      title: "Asistencia vehicular",
      price: "$150 MXN",
      image: "/images/asistencia.jpg?height=200&width=300",
      alt: "Mecánico trabajando en una llanta",
    },
    {
      id: 2,
      title: "Carga de combustible",
      price: "Carga por litro 5% de Comisión",
      image: "/images/gasolina.jpg?height=200&width=300",
      alt: "Estación de gasolina",
    },
    {
      id: 3,
      title: "Servicios de grúa",
      price: "$300 MXN",
      image: "/images/grua.jpg?height=200&width=300",
      alt: "Grúa transportando un auto",
    },
    {
      id: 4,
      title: "Diagnóstico de problemas",
      price: "$120 MXN",
      image: "/images/scanner.jpg?height=200&width=300",
      alt: "Escáner de diagnóstico",
    },
    {
      id: 5,
      title: "Limpieza del Vehículo",
      price: "$340 MXN",
      image: "/images/limpieza.jpg?height=200&width=300",
      alt: "Lavado de auto",
    },
    {
      id: 6,
      title: "Cerrajería",
      price: "$430 MXN",
      image: "/images/cerrajero.jpg?height=200&width=300",
      alt: "Cerrajero abriendo puerta de auto",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Servicios Express</h2>
          <p className="text-orange-400 text-lg">Soluciones rápidas para tu vehículo</p>
        </div>
        <div className="relative w-full md:w-72">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar servicio..."
            className="w-full pl-11 pr-4 py-3 bg-[#1E1E1E] border border-[#333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="group relative bg-gradient-to-b from-gray-800 to-gray-900 border border-[#333] hover:border-orange-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={servicio.image || "/placeholder.svg"}
                alt={servicio.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-white">{servicio.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-orange-400 font-medium text-lg">
                  Desde: {servicio.price}
                </p>
                <button className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/50">
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

