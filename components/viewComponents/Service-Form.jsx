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

  const [price, setPrice] = useState(null)

  const marcas = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Otro"]
  const metodosPago = ["Tarjeta", "Efectivo"]
  const talleres = ["Taller Mecánico AutoAvante", "Garage Orona", "Multiservicios Almeraz"]
  const tiposVehiculo = ["Sedán", "SUV", "Pickup", "Hatchback", "Minivan"]
  const serviciosGrua = ["Arrastre completo", "Cambio de llanta", "Carga de batería"]
  const tiposServicio = ["Básico", "Completo", "Premium"]
  const serviciosLimpieza = ["Lavado exterior", "Lavado completo", "Detallado"]

  const encabezados = {
    asistencia: "Asistencia Vehicular",
    grua: "Servicio de Grúa",
    limpieza: "Limpieza del Vehículo",
    diagnostico: "Diagnóstico del Vehículo",
    cerrajeria: "Servicio de Cerrajería"
  }

  const router = useRouter()

  const isFormValid = () => {
    if (serviceType === "asistencia") return formData.marca && formData.modelo && formData.año && formData.metodoPago
    if (serviceType === "grua") return formData.tipoVehiculo && formData.metodoPago && formData.servicioGrua
    if (serviceType === "limpieza") return formData.tipoVehiculo && formData.servicioLimpieza && formData.metodoPago
    if (serviceType === "diagnostico") return formData.marca && formData.año
    if (serviceType === "cerrajeria") return formData.marca && formData.modelo && formData.año && formData.metodoPago
    return false
  }

  useEffect(() => {
    if (!isFormValid()) {
      setPrice(null)
      return
    }

    switch (serviceType) {
      case "asistencia":
        setPrice(183.3)
        break
      case "grua":
        setPrice(341.56)
        break
      case "limpieza":
        const preciosLimpieza = {
          "Lavado exterior": 120,
          "Lavado completo": 250,
          Detallado: 450,
        }
        setPrice(preciosLimpieza[formData.servicioLimpieza] || null)
        break
      case "diagnostico":
        setPrice(120)
        break
      case "cerrajeria":
        setPrice(430)
        break
      default:
        setPrice(null)
    }
  }, [formData, serviceType])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => router.push(`/asistente?lat=${coords.latitude}&lng=${coords.longitude}`),
        (error) => {
          console.error("Ubicación error:", error)
          alert("No se pudo obtener tu ubicación.")
          router.push("/asistente")
        }
      )
    } else router.push("/asistente")
  }

  const renderSelect = (name, label, options, required = false) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-white text-sm">{label}</label>
        {required && <span className="text-xs text-gray-400">Requerido</span>}
      </div>
      <div className="relative">
        <select
          name={name}
          value={formData[name]}
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
        <label className="text-white text-sm">{label}</label>
        {required && <span className="text-xs text-gray-400">Requerido</span>}
      </div>
      <input
        type={type}
        name={name}
        value={formData[name]}
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
              {renderInput("año", "Año", "number", true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
              {renderSelect("tallerServicio", "Taller del Servicio", talleres)}
            </>
          )}

          {serviceType === "grua" && (
            <>
              {renderSelect("tipoVehiculo", "Tipo de Vehiculo", tiposVehiculo, true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
              {renderSelect("servicioGrua", "Servicio de grúa", serviciosGrua)}
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
              {renderInput("año", "Año", "number", true)}
            </>
          )}

          {serviceType === "cerrajeria" && (
            <>
              {renderSelect("marca", "Marca", marcas, true)}
              {renderInput("modelo", "Modelo", "text", true)}
              {renderInput("año", "Año", "number", true)}
              {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}
            </>
          )}

          {isFormValid() && price && (
            <div className="mb-4 mt-4">
              <p className="text-white text-sm mb-1">Total estimado:</p>
              <p className="text-white text-2xl font-bold">${price.toFixed(2)} <span className="text-sm text-gray-400">MXN</span></p>
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