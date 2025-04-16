"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import axios from "axios"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const carIcon = new L.Icon({
  iconUrl: "/images/car-icon.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

const Recenter = ({ coords }) => {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView(coords, 14)
    }
  }, [coords, map])
  return null
}

export default function LeafletMap({ userLocation, assistantLocation }) {
  const [ruta, setRuta] = useState([])

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const response = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [assistantLocation.reverse(), userLocation.reverse()],
          },
          {
            headers: {
              Authorization: "5b3ce3597851110001cf6248d03553dc48d5497b849e4f022926caca",
              "Content-Type": "application/json",
            },
          }
        )

        const coords = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]])
        setRuta(coords)
      } catch (error) {
        console.error("Error obteniendo ruta:", error)
      }
    }

    fetchRuta()
  }, [userLocation, assistantLocation])

  return (
    <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0">
      <Recenter coords={userLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={userLocation} />
      <Marker position={assistantLocation} icon={carIcon} />
      {ruta.length > 0 && (
        <Polyline positions={ruta} pathOptions={{ color: "orange", weight: 4 }} />
      )}
    </MapContainer>
  )
}
