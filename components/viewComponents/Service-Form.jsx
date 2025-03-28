"use client"

import { useState, useEffect } from "react"
import { MapPin, ChevronDown } from "lucide-react"

const ServiceForm = ({ serviceType }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    metodoPago: "",
    tallerServicio: "",
    tipoGasolina: "",
    cantidadLitros: "",
    tipoVehiculo: "",
    servicioGrua: "",
    tipoServicio: "",
    servicioLimpieza: "",
    useLocation: false,
  })

  // Precios según el tipo de servicio
  const [price, setPrice] = useState(null)

  // Precios de gasolina
  const gasolinePrices = [
    { type: "Verde", price: 23.5 },
    { type: "Roja", price: 25.65 },
    { type: "Diesel", price: 23.5 },
  ]

  // Opciones para los selectores
  const marcas = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen"]
  const metodosPago = ["Tarjeta de crédito", "Tarjeta de débito", "Efectivo", "Transferencia"]
  const talleres = ["Taller Mecánico AutoAvante", "Garage Orona", "Multiservicios Almeraz"]
  const tiposGasolina = ["Verde", "Roja", "Diesel"]
  const tiposVehiculo = ["Sedán", "SUV", "Pickup", "Hatchback", "Minivan"]
  const serviciosGrua = ["Arrastre completo", "Cambio de llanta", "Carga de batería"]
  const tiposServicio = ["Básico", "Completo", "Premium"]
  const serviciosLimpieza = ["Lavado exterior", "Lavado completo", "Detallado"]

  // Actualizar precio según el tipo de servicio y selecciones
  useEffect(() => {
    if (serviceType === "asistencia") {
      setPrice(183.3)
    } else if (serviceType === "combustible") {
      const selectedGas = gasolinePrices.find((gas) => gas.type === formData.tipoGasolina)
      const litros = Number.parseFloat(formData.cantidadLitros) || 0
      if (selectedGas && litros > 0) {
        setPrice(selectedGas.price * litros)
      } else {
        setPrice(null)
      }
    } else if (serviceType === "grua") {
      setPrice(341.56)
    } else if (serviceType === "limpieza") {
      // Precios base para limpieza
      const preciosLimpieza = {
        "Lavado exterior": 120,
        "Lavado completo": 250,
        Detallado: 450,
      }
      setPrice(preciosLimpieza[formData.servicioLimpieza] || null)
    }
  }, [serviceType, formData])

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)
    // Aquí iría la lógica para enviar los datos al servidor
    alert("Servicio solicitado con éxito")
  }

  // Renderizar selector
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

  // Renderizar input de texto
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

  // Renderizar toggle de ubicación
  const renderLocationToggle = () => (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <MapPin size={18} className="text-gray-400 mr-2" />
        <span className="text-white text-sm">Usar la Ubicacion actual</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="useLocation"
          checked={formData.useLocation}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
      </label>
    </div>
  )

  // Renderizar tabla de precios de gasolina
  const renderGasolinePrices = () => (
    <div className="mb-6">
      <p className="text-white mb-4">El precio puede variar</p>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">TIPO DE GASOLINA</span>
          <span className="text-gray-400 text-sm">PRECIO (LITRO)</span>
        </div>

        {gasolinePrices.map((gas, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-white">{gas.type}</span>
            <span className="text-white">{gas.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Formulario para Asistencia Vehicular */}
        {serviceType === "asistencia" && (
          <>
            <h2 className="text-white text-xl font-bold mb-6">Ingresa los Datos de tu Vehiculo</h2>
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

        {/* Formulario para Carga de Combustible */}
        {serviceType === "combustible" && (
          <>
            {renderGasolinePrices()}

            {renderSelect("tipoGasolina", "Tipo de gasolina", tiposGasolina, true)}

            {renderLocationToggle()}

            {renderInput("cantidadLitros", "Cantidad (Litros)", "number", true)}

            {renderSelect("metodoPago", "Metodo de Pago", metodosPago, true)}

            <p className="text-gray-400 text-sm mb-4">
              La aplicación te comunicara el total cuando el asistente complete la carga de combustible.
            </p>

            {price && (
              <div className="mb-4">
                <p className="text-white text-sm mb-1">Total estimado:</p>
                <p className="text-white text-2xl font-bold">${price.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">MXN</p>
              </div>
            )}
          </>
        )}

        {/* Formulario para Servicio de Grúa */}
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

        {/* Formulario para Servicio de Limpieza */}
        {serviceType === "limpieza" && (
          <>
            <h2 className="text-white text-xl font-bold mb-6">Detalles del Vehiculo</h2>

            {renderSelect("tipoVehiculo", "Tipo de Vehiculo", tiposVehiculo)}
            {renderSelect("tipoServicio", "Tipo de Servicio", tiposServicio, true)}
            {renderSelect("metodoPago", "Metodo de Pago", metodosPago)}
            {renderSelect("servicioLimpieza", "Servicio de Limpieza", serviciosLimpieza)}

            <p className="text-white mb-4">Limpieza del Vehiculo</p>

            {price && (
              <div className="mb-4">
                <p className="text-white text-sm mb-1">Total:</p>
                <p className="text-white text-2xl font-bold">${price.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">MXN</p>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-[#E85D04] hover:bg-[#F48C06] text-white py-2 px-4 rounded-md transition-colors w-auto"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default ServiceForm

