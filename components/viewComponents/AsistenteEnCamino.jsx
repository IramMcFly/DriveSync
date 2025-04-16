"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

const MapComponent = dynamic(() => import("@/components/viewComponents/LeafletMap"), { ssr: false })

function haversineDistance(coord1, coord2) {
  const toRad = (x) => (x * Math.PI) / 180
  const R = 6371 // km

  const dLat = toRad(coord2[0] - coord1[0])
  const dLon = toRad(coord2[1] - coord1[1])

  const lat1 = toRad(coord1[0])
  const lat2 = toRad(coord2[0])

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export default function AsistenteEnCamino({ userLocation, assistantLocation }) {
  const [distancia, setDistancia] = useState(null)
  const [tiempo, setTiempo] = useState(null)

  useEffect(() => {
    const km = haversineDistance(userLocation, assistantLocation)
    setDistancia(km.toFixed(2))

    const velocidadPromedio = 40 // km/h
    const tiempoEnHoras = km / velocidadPromedio
    const minutos = Math.round(tiempoEnHoras * 60)
    setTiempo(minutos)
  }, [userLocation, assistantLocation])

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center px-4 py-6">
      <div className="bg-[#431e12] text-white px-6 py-2 rounded-full mb-4 shadow-lg text-center font-semibold text-lg">
        Asistente en camino...
      </div>

      {/* Estimaciones */}
      <div className="text-center mb-4 space-y-1">
        <p className="text-lg text-gray-300">
          <span className="font-semibold text-white">Distancia:</span> {distancia} km
        </p>
        <p className="text-lg text-gray-300">
          <span className="font-semibold text-white">Tiempo estimado de llegada:</span> {tiempo} min
        </p>
      </div>

      <div className="w-full max-w-3xl bg-[#1E1E1E] rounded-2xl shadow-xl overflow-hidden">
        <div className="h-[300px] rounded-t-2xl overflow-hidden">
          <MapComponent userLocation={userLocation} assistantLocation={assistantLocation} />
        </div>

        <div className="flex justify-between px-4 py-3 gap-3 flex-wrap bg-[#1a1a1a] border-t border-gray-700">
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
            Cancelar Servicio
          </button>
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
            Llamar al asistente
          </button>
        </div>

        <div className="p-4 bg-[#1a1a1a] border-t border-gray-700">
          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md shadow-md flex items-center justify-center gap-2">
            <AlertCircle size={18} className="text-white" />
            Botón de pánico
          </button>
        </div>

        <div className="text-center px-6 py-6 bg-[#1E1E1E]">
          <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-4 border-orange-500 shadow-md">
            <Image
              src="/images/asistente.jpg"
              width={112}
              height={112}
              alt="Asistente"
              className="object-cover w-full h-full"
            />
          </div>

          <h3 className="text-xl font-semibold mb-2">Acerca de tu Asistente</h3>

          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <span className="text-white font-semibold">Nombre:</span> Juan Morales
            </p>
            <p>
              <span className="text-white font-semibold">Teléfono:</span> 6142330980
            </p>
            <p>
              <span className="text-white font-semibold">Placas del vehículo:</span> DXZ-679-B
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
