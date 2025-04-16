"use client"

import { useEffect, useState } from "react"
import AsistenteEnCamino from "@/components/viewComponents/AsistenteEnCamino"
import Header from "@/components/viewComponents/Header"

function getRandomNearbyCoords([lat, lon], radiusKm = 2) {
  const radiusInDegrees = radiusKm / 111.32 // Aprox. conversión de km a grados
  const u = Math.random()
  const v = Math.random()
  const w = radiusInDegrees * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const dx = w * Math.cos(t)
  const dy = w * Math.sin(t)
  return [lat + dx, lon + dy]
}

export default function FormServiciosPage() {
  const [userLocation, setUserLocation] = useState(null)
  const [assistantLocation, setAssistantLocation] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const userCoords = [latitude, longitude]
        setUserLocation(userCoords)

        // ✅ Generar ubicación del asistente aleatoriamente a 2km
        const randomAssistantCoords = getRandomNearbyCoords(userCoords, 2)
        setAssistantLocation(randomAssistantCoords)
      },
      (err) => {
        console.error("Error al obtener ubicación:", err)
      }
    )
  }, [])

  return (
    <>
      <Header />
      {userLocation && assistantLocation ? (
        <AsistenteEnCamino
          userLocation={userLocation}
          assistantLocation={assistantLocation}
        />
      ) : (
        <p className="text-white text-center mt-10">Obteniendo ubicación y asignando asistente...</p>
      )}
    </>
  )
}
