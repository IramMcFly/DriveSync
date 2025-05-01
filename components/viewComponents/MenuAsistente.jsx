"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/viewComponents/Header";
import IrHaciaCliente from "@/components/viewComponents/IrHaciaCliente";

const MapComponent = dynamic(() => import("@/components/viewComponents/LeafletMap"), { ssr: false });

const nombresClientes = ["Ana López", "Carlos Pérez", "Luisa Hernández", "Jorge Ramírez", "Mónica Torres"];
const tiposServicio = ["asistencia", "grua", "limpieza", "diagnostico", "cerrajeria"];

function getRandomNearbyCoords([lat, lon], radiusKm = 2) {
  const radiusInDegrees = radiusKm / 111.32;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const dx = w * Math.cos(t);
  const dy = w * Math.sin(t);
  return [lat + dx, lon + dy];
}

function haversineDistance(coord1, coord2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MenuAsistente() {
  const [servicios, setServicios] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [aceptado, setAceptado] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setUserCoords([coords.latitude, coords.longitude]),
       // (err) => console.error("Error obteniendo ubicación del asistente:", err)
      );
    }
  }, []);

  useEffect(() => {
    if (!userCoords) return;
    const interval = setInterval(() => {
      const nuevo = {
        cliente: nombresClientes[Math.floor(Math.random() * nombresClientes.length)],
        tipo: tiposServicio[Math.floor(Math.random() * tiposServicio.length)],
        coords: getRandomNearbyCoords(userCoords),
        timestamp: Date.now(),
      };
      setServicios((prev) => [nuevo, ...prev.slice(0, 9)]);
    }, 17000);
    return () => clearInterval(interval);
  }, [userCoords]);

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white">
      <Header />
      <div className="grid md:grid-cols-2 gap-4 max-w-7xl mx-auto p-4">
        <div>
          <h2 className="text-xl font-bold text-orange-500 mb-4">Servicios Recientes</h2>
          <div className="space-y-4">
            {servicios.map((serv, index) => {
              const distancia = userCoords ? haversineDistance(userCoords, serv.coords).toFixed(2) : null;
              const tiempo = distancia ? Math.round((distancia / 40) * 60) : null;
              return (
                <div key={index} className={`bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#444] ${seleccionado?.timestamp === serv.timestamp ? "ring-2 ring-orange-500" : ""}`}>
                  <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Cliente:</span> {serv.cliente}</p>
                  <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Servicio:</span> {serv.tipo}</p>
                  {distancia && (
                    <>
                      <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Distancia:</span> {distancia} km</p>
                      <p className="text-sm text-gray-300 mb-3"><span className="font-semibold text-white">ETA:</span> {tiempo} min</p>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSeleccionado(serv);
                      setAceptado(false);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-md"
                  >
                    Ver en mapa
                  </button>
                </div>
              );
            })}
            {servicios.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-8">Esperando nuevos servicios...</p>
            )}
          </div>
        </div>

        <div className="h-[500px] w-full">
          {seleccionado ? (
            <div className="flex flex-col h-full pb-24">
              {aceptado ? (
                <IrHaciaCliente
                  cliente={seleccionado.cliente}
                  destinoCoords={seleccionado.coords}
                  origenCoords={userCoords}
                />
              ) : (
                <>
                  <div className="flex-grow">
                    <MapComponent userLocation={userCoords} assistantLocation={seleccionado.coords} />
                  </div>
                  <div className="mt-4 text-center z-10 relative">
                    <button
                      onClick={() =>
                        window.location.href = `/IrHaciaCliente?lat=${seleccionado.coords[0]}&lng=${seleccionado.coords[1]}&cliente=${encodeURIComponent(seleccionado.cliente)}&tipo=${seleccionado.tipo}`
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
                    >
                      Aceptar servicio
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full w-full bg-[#333] flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Selecciona un servicio para ver en el mapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
