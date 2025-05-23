"use client"
import { Phone, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const Asistencia = () => {
  const router = useRouter()

  // Función para manejar la llamada de asistencia
  const handleLlamada = () => {
    window.location.href = "tel:+526141110404"
  }

  // Función para manejar el inicio de chat
  const handleChat = () => {
    router.push("/aiAssist")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6 pt-8">
        <h1 className="text-3xl font-bold mb-6">Asistencia Especial</h1>

        {/* Sección de Asistencia telefónica */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Asistencia telefónica</h2>
          <p className="text-gray-400 mb-4">No te pongas en riesgo, obtén una llamada para asistencia.</p>
          <button
            onClick={handleLlamada}
            className="w-full bg-[#E85D04] hover:bg-[#F48C06] text-white py-3 px-4 rounded-md flex items-center justify-center transition-colors"
          >
            <Phone className="mr-2" size={20} />
            Llamar para asistencia
          </button>
        </section>

        {/* Separador */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Sección de Atención 24/7 */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Atención 24/7</h2>
          <p className="text-gray-400 mb-4">
            Chatea con una IA que te ayude a resolver los diferentes problemas que puedas tener.
          </p>
          <button
            onClick={handleChat}
            className="w-full bg-[#E85D04] hover:bg-[#F48C06] text-white py-3 px-4 rounded-md flex items-center justify-center transition-colors"
          >
            <MessageCircle className="mr-2" size={20} />
            Chatear
          </button>
        </section>
      </div>
    </div>
  )
}

export default Asistencia
