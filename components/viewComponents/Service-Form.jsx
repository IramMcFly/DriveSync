"use client"

import { useState, useEffect } from "react"
import { MapPin, ChevronDown } from "lucide-react"
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
  const metodosPago = ["Tarjeta", "Efectivo"] // ✅ Filtradas como pediste
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

  useEffect(() => {
    if (serviceType === "asistencia") {
      setPrice(183.3)
    } else if (serviceType === "grua") {
      setPrice(341.56)
    } else if (serviceType === "limpieza") {
      const preciosLimpieza = {
        "Lavado exterior": 120,
        "Lavado completo": 250,
        Detallado: 450,
      }
      setPrice(preciosLimpieza[formData.servicioLimpieza] || null)
    } else if (serviceType === "diagnostico") {
      setPrice(120)
    } else if (serviceType === "cerrajeria") {
      setPrice(430)
    }
  }, [serviceType, formData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          router.push(`/asistente?lat=${latitude}&lng=${longitude}`)
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          alert("No se pudo obtener tu ubicación. Serás redirigido de todas formas.")
          router.push("/asistente")
        }
      )
    } else {
      router.push("/asistente")
    }
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
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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


  const tiposValidos = Object.keys(encabezados)
  if (!tiposValidos.includes(serviceType)) {
    return <p className="text-white text-center mt-10">Servicio no válido o no disponible</p>
  }

  const isFormValid = () => {
    if (serviceType === "asistencia") {
      return (
        formData.marca &&
        formData.modelo &&
        formData.año &&
        formData.metodoPago
      )
    }

    if (serviceType === "grua") {
      return (
        formData.tipoVehiculo &&
        formData.metodoPago &&
        formData.servicioGrua
      )
    }

    if (serviceType === "limpieza") {
      return (
        formData.tipoVehiculo &&
        formData.servicioLimpieza &&
        formData.metodoPago
      )
    }

    if (serviceType === "diagnostico") {
      return formData.marca && formData.año
    }

    if (serviceType === "cerrajeria") {
      return (
        formData.marca &&
        formData.modelo &&
        formData.año &&
        formData.metodoPago
      )
    }

    return false
  }

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        {/* ✅ Encabezado dinámico según tipo */}
        <h2 className="text-white text-xl font-bold mb-6">{encabezados[serviceType]}</h2>

        {/* Formulario específico por tipo */}
        {serviceType === "asistencia" && (
          <>
            {renderSelect("marca", "Marca", marcas, true)}
            {renderInput("modelo", "Modelo", "text", true)}
            {renderInput("año", "Año", "number", true)}
            {renderSelect("metodoPago", "Metodo de Pago", metodosPago, true)}
            {renderSelect("tallerServicio", "Taller del Servicio", talleres)}
            <div className="mb-4">
              <p className="text-white text-sm mb-1">Solicitar por:</p>
              <p className="text-white text-2xl font-bold">{price?.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">MXN</p>
            </div>
            {renderLocationToggle()}
          </>
        )}

        {serviceType === "grua" && (
          <>
            {renderSelect("tipoVehiculo", "Tipo de Vehiculo", tiposVehiculo, true)}
            {renderSelect("metodoPago", "Metodo de Pago", metodosPago, true)}
            {renderSelect("servicioGrua", "Servicio de grua", serviciosGrua)}
            <div className="mb-4">
              <p className="text-white text-sm mb-1">Por este servicio pagas:</p>
              <p className="text-white text-2xl font-bold">${price?.toFixed(2)}</p>
            </div>
          </>
        )}

        {serviceType === "limpieza" && (
          <>
            {renderSelect("tipoVehiculo", "Tipo de Vehículo", tiposVehiculo, true)}

            {renderSelect("servicioLimpieza", "Tipo de limpieza", serviciosLimpieza, true)}

            {/* ✅ Descripción dinámica según la opción */}
            {formData.servicioLimpieza && (
              <div className="mb-4 text-sm text-gray-300 bg-[#2a2a2a] p-3 rounded-lg">
                {formData.servicioLimpieza === "Lavado exterior" && (
                  <p>Incluye lavado de carrocería, cristales y llantas. No se limpia el interior.</p>
                )}
                {formData.servicioLimpieza === "Lavado completo" && (
                  <p>Incluye lavado exterior e interior (alfombras, tablero, puertas y asientos).</p>
                )}
                {formData.servicioLimpieza === "Detallado" && (
                  <p>Limpieza profunda interior y exterior. Incluye encerado, abrillantado y restauración de plásticos.</p>
                )}
              </div>
            )}

            {renderSelect("metodoPago", "Método de Pago", metodosPago, true)}

            {price && (
              <div className="mb-4">
                <p className="text-white text-sm mb-1">Total estimado:</p>
                <p className="text-white text-2xl font-bold">${price.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">MXN</p>
              </div>
            )}

            {renderLocationToggle()}
          </>
        )}

        {serviceType === "diagnostico" && (
          <>
            {renderSelect("marca", "Marca", marcas)}
            {renderInput("año", "Año", "number")}
            <p className="text-white mb-4">Precio estimado del diagnóstico:</p>
            <p className="text-white text-2xl font-bold mb-2">${price?.toFixed(2)}</p>
            {renderLocationToggle()}
          </>
        )}

        {serviceType === "cerrajeria" && (
          <>
            {renderSelect("marca", "Marca", marcas)}
            {renderInput("modelo", "Modelo")}
            {renderInput("año", "Año", "number")}
            {renderSelect("metodoPago", "Método de Pago", metodosPago)}
            <p className="text-white mb-4">Precio estimado del servicio:</p>
            <p className="text-white text-2xl font-bold mb-2">${price?.toFixed(2)}</p>
            {renderLocationToggle()}
          </>
        )}

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`py-2 px-4 rounded-md transition-colors w-auto font-semibold ${isFormValid()
            ? "bg-[#E85D04] hover:bg-[#F48C06] text-white"
            : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
        >
          Enviar
        </button>

      </form>
    </div>
  )
}

export default ServiceForm
