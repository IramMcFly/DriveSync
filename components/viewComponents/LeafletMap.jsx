"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import axios from "axios"

// Icono personalizado del asistente
const carIcon = new L.Icon({
  iconUrl: "/images/car-icon.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

// Corrige íconos default de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Re-centra el mapa al usuario
const Recenter = ({ coords }) => {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView(coords, 14)
      setTimeout(() => {
        map.invalidateSize()
      }, 0)
    }
  }, [coords, map])
  return null
}

// Decodificador de polilíneas de OpenRouteService
function decodePolyline(encoded) {
  let points = []
  let index = 0, len = encoded.length
  let lat = 0, lng = 0

  while (index < len) {
    let b, shift = 0, result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push([lat / 1e5, lng / 1e5])
  }

  return points
}

// ⚡ Aquí definimos isValidCoords donde todos lo pueden usar
const isValidCoords = (coords) => 
  Array.isArray(coords) && coords.length === 2 && 
  typeof coords[0] === "number" && typeof coords[1] === "number"

export default function LeafletMap({ userLocation, assistantLocation }) {
  const [ruta, setRuta] = useState([])

  useEffect(() => {
    const fetchRuta = async () => {
      if (!isValidCoords(userLocation) || !isValidCoords(assistantLocation)) {
        console.warn("⚠️ Ubicaciones inválidas, no se puede calcular la ruta.")
        return
      }

      const coordinates = [
        [assistantLocation[1], assistantLocation[0]],
        [userLocation[1], userLocation[0]],
      ]

      try {
        const response = await axios.post("/api/ruta", { coordinates })

        const geometry = response.data?.routes?.[0]?.geometry
        if (!geometry || !geometry?.coordinates) {
          if (geometry?.type === "LineString" && geometry?.coordinates) {
            setRuta(geometry.coordinates.map(([lng, lat]) => [lat, lng]))
          } else if (geometry?.includes) {
            const decoded = decodePolyline(geometry)
            setRuta(decoded)
          } else {
            console.warn("⚠️ No se encontró una ruta válida:", geometry)
          }
        } else {
          const coords = geometry.coordinates.map(([lng, lat]) => [lat, lng])
          setRuta(coords)
        }

      } catch (error) {
        console.error("❌ Error obteniendo ruta:", error.response?.data || error.message)
      }
    }

    fetchRuta()
  }, [userLocation, assistantLocation])

  return (
    <MapContainer center={userLocation || [0, 0]} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0">
      <Recenter coords={userLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isValidCoords(userLocation) && <Marker position={userLocation} />}
      {isValidCoords(assistantLocation) && <Marker position={assistantLocation} icon={carIcon} />}
      {ruta.length > 0 && (
        <Polyline positions={ruta} pathOptions={{ color: "orange", weight: 4 }} />
      )}
    </MapContainer>
  )
}
