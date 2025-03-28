"use client"

import { useState } from "react"
import ServiceForm from "./Service-Form"

const ServiceFormDemo = () => {
  const [selectedService, setSelectedService] = useState("asistencia")

  return (
    <div className="min-h-screen bg-[#121212] text-white py-8 px-4">
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-2xl font-bold mb-4">Formulario de Servicio</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Selecciona un tipo de servicio:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-[#333333] text-white py-2 px-4 rounded-md"
          >
            <option value="asistencia">Asistencia vehicular</option>
            <option value="combustible">Carga de combustible</option>
            <option value="grua">Servicio de grúa</option>
            <option value="limpieza">Limpieza de vehículo</option>
          </select>
        </div>
      </div>

      <ServiceForm serviceType={selectedService} />
    </div>
  )
}

export default ServiceFormDemo

