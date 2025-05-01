"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

const ServiceForm = ({ serviceType }) => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    metodoPago: "",
    tallerServicio: "",
    tipoVehiculo: "",
    servicioGrua: "",
    tipoServicio: "",
    servicioLimpieza: "",
  })

  const [price, setPrice] = useState(0)
  const [showMultiplicadorNote, setShowMultiplicadorNote] = useState(false)

  const marcas = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Otro"]
  const metodosPago = ["Tarjeta", "Efectivo"]
  const talleres = ["Taller Mecánico AutoAvante", "Garage Orona", "Multiservicios Almeraz"]
  const tiposVehiculo = ["Sedán", "SUV", "Pickup", "Hatchback", "Minivan"]
  const serviciosGrua = ["Arrastre completo"]
  const serviciosLimpieza = ["Lavado exterior", "Lavado completo", "Detallado"]

  const preciosServicios = {
    asistencia: 183.3,
    "Arrastre completo": 341.56,
    "Lavado exterior": 120,
    "Lavado completo": 250,
    Detallado: 450,
    diagnostico: 120,
    cerrajeria: 430,
  }

  const multiplicadoresTipoVehiculo = {
    "Sedán": 1,
    "Hatchback": 1,
    "SUV": 1.2,
    "Pickup": 1.3,
    "Minivan": 1.25,
  }

  const encabezados = {
    asistencia: "Asistencia Vehicular",
    grua: "Servicio de Grúa",
    limpieza: "Limpieza del Vehículo",
    diagnostico: "Diagnóstico del Vehículo",
    cerrajeria: "Servicio de Cerrajería"
  }

  const generarAnios = () => {
    const anios = []
    const anioActual = new Date().getFullYear()
    for (let anio = anioActual; anio >= 1950; anio--) {
      anios.push(anio)
    }
    return anios
  }

  const aniosVehiculos = generarAnios()

  const router = useRouter()

  const isFormValid = () => {
    const requiredFields = {
      asistencia: ["marca", "modelo", "año", "metodoPago"],
      grua: ["tipoVehiculo", "metodoPago", "servicioGrua"],
      limpieza: ["tipoVehiculo", "servicioLimpieza", "metodoPago"],
      diagnostico: ["marca", "año"],
      cerrajeria: ["marca", "modelo", "año", "metodoPago"],
    }

    const fields = requiredFields[serviceType] || []
    return fields.every(field => formData[field] && formData[field] !== "")
  }

  const calcularPrecio = () => {
    let total = 0
    setShowMultiplicadorNote(false)

    if (serviceType === "asistencia") {
      total += preciosServicios.asistencia || 0
    }
    if (serviceType === "grua" && formData.servicioGrua) {
      total += preciosServicios[formData.servicioGrua] || 0
    }
    if (serviceType === "limpieza" && formData.servicioLimpieza) {
      const basePrice = preciosServicios[formData.servicioLimpieza] || 0
      const multiplicador = multiplicadoresTipoVehiculo[formData.tipoVehiculo] || 1
      total += basePrice * multiplicador
      if (multiplicador > 1) setShowMultiplicadorNote(true)
    }
    if (serviceType === "diagnostico") {
      total += preciosServicios.diagnostico || 0
    }
    if (serviceType === "cerrajeria") {
      total += preciosServicios.cerrajeria || 0
    }
    setPrice(total)
  }

  useEffect(() => {
    if (!isFormValid()) {
      setPrice(0)
      return
    }
    calcularPrecio()
  }, [formData, serviceType])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios correctamente.")
      return
    }

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          router.push(`/asistente?lat=${coords.latitude}&lng=${coords.longitude}&tipo=${serviceType}`)
        },
        (error) => {
          console.error("Ubicación error:", error)
          alert("No se pudo obtener tu ubicación.")
          router.push(`/asistente?tipo=${serviceType}`)
        }
      )
    } else {
      router.push(`/asistente?tipo=${serviceType}`)
    }
    
  }

  const renderSelect = (name, label, options, required = false) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-white text-sm" htmlFor={name}>{label}</label>
        {required && <span className="text-xs text-gray-400">Requerido</span>}
      </div>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className="w-full bg-[#333333] text-white py-3 px-4 rounded-md appearance-none"
          required={required}
        >
          <option value="">Elige algo</option>
          {options.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  )

  const renderInput = (name, label, type = "text", required = false) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-white text-sm" htmlFor={name}>{label}</label>
        {required && <span className="text-xs text-gray-400">Requerido</span>}
      </div>
      <input
        id={name}
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className="w-full bg-[#333333] text-white py-3 px-4 rounded-md"
        required={required}
      />
    </div>
  )

  if (!encabezados[serviceType]) {
    return <p className="text-white text-center mt-10">Servicio no válido o no disponible</p>
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white py-8 pb-20">
      <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md mx-auto shadow-md border border-[#333]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-white text-xl font-bold mb-6">{encabezados[serviceType]}</h2>

          {serviceType === "asistencia" && (
            <>
              {renderSelect("marca", "Marca", marcas, true)}
              {renderInput("modelo", "Modelo", "text", true)}
              {renderSelect("año", "Año", aniosVehiculos, true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
              {renderSelect("tallerServicio", "Taller del Servicio", talleres)}
            </>
          )}

          {serviceType === "grua" && (
            <>
              {renderSelect("tipoVehiculo", "Tipo de Vehiculo", tiposVehiculo, true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
              {renderSelect("servicioGrua", "Servicio de grúa", serviciosGrua, true)}
            </>
          )}

          {serviceType === "limpieza" && (
            <>
              {renderSelect("tipoVehiculo", "Tipo de Vehículo", tiposVehiculo, true)}
              {renderSelect("servicioLimpieza", "Tipo de limpieza", serviciosLimpieza, true)}
              {formData.servicioLimpieza && (
                <div className="mb-4 text-sm text-gray-300 bg-[#2a2a2a] p-3 rounded-lg">
                  {formData.servicioLimpieza === "Lavado exterior" && <p>Incluye lavado de carrocería, cristales y llantas. No se limpia el interior.</p>}
                  {formData.servicioLimpieza === "Lavado completo" && <p>Incluye lavado exterior e interior (alfombras, tablero, puertas y asientos).</p>}
                  {formData.servicioLimpieza === "Detallado" && <p>Limpieza profunda interior y exterior. Incluye encerado, abrillantado y restauración de plásticos.</p>}
                </div>
              )}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
            </>
          )}

          {serviceType === "diagnostico" && (
            <>
              {renderSelect("marca", "Marca", marcas, true)}
              {renderSelect("año", "Año", aniosVehiculos, true)}
            </>
          )}

          {serviceType === "cerrajeria" && (
            <>
              {renderSelect("marca", "Marca", marcas, true)}
              {renderInput("modelo", "Modelo", "text", true)}
              {renderSelect("año", "Año", aniosVehiculos, true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
            </>
          )}

          {isFormValid() && price > 0 && (
            <div className="mb-4 mt-4">
              <p className="text-white text-sm mb-1">Total estimado:</p>
              <p className="text-white text-2xl font-bold">${price.toFixed(2)} <span className="text-sm text-gray-400">MXN</span></p>
              {showMultiplicadorNote && (
                <p className="text-xs text-yellow-400 mt-2">Incluye ajuste por tipo de vehículo (SUV, Pickup o Minivan).</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid()}
            className={`py-2 px-4 rounded-md transition-colors w-full font-semibold ${isFormValid()
              ? "bg-[#E85D04] hover:bg-[#F48C06] text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}

export default ServiceForm
