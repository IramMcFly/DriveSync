"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/viewComponents/Header";

const MapComponent = dynamic(() => import("@/components/viewComponents/LeafletMap"), { ssr: false });

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

export default function IrHaciaCliente() {
  const searchParams = useSearchParams();
  const [asistenteCoords, setAsistenteCoords] = useState(null);
  const [clienteCoords, setClienteCoords] = useState(null);
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const nombre = searchParams.get("cliente");
    const tipo = searchParams.get("tipo");
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    if (lat && lng && nombre && tipo) {
      setCliente({ nombre, tipo });
      setClienteCoords([lat, lng]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setAsistenteCoords([coords.latitude, coords.longitude]),
        (err) => console.error("Error obteniendo ubicación del asistente:", err)
      );
    }
  }, []);

  const distancia =
    asistenteCoords && clienteCoords ? haversineDistance(asistenteCoords, clienteCoords).toFixed(2) : null;
  const tiempo = distancia ? Math.round((distancia / 40) * 60) : null;

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6 pb-28"> {/* ← Aumentado el padding inferior */}
        <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">Ruta hacia el cliente</h2>
        <div className="w-full h-[400px] rounded-lg overflow-hidden mb-6">
          {asistenteCoords && clienteCoords ? (
            <MapComponent userLocation={asistenteCoords} assistantLocation={clienteCoords} />
          ) : (
            <div className="bg-[#333] h-full w-full flex items-center justify-center">
              <p className="text-gray-400">Cargando mapa...</p>
            </div>
          )}
        </div>

        {cliente && (
          <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#444]">
            <p className="text-white font-semibold mb-2">Información del Cliente</p>
            <p className="text-sm text-gray-300 mb-1">
              <span className="font-semibold text-white">Nombre:</span> {cliente.nombre}
            </p>
            <p className="text-sm text-gray-300 mb-1">
              <span className="font-semibold text-white">Servicio:</span> {cliente.tipo}
            </p>
            {distancia && (
              <>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-semibold text-white">Distancia:</span> {distancia} km
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">ETA:</span> {tiempo} min
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
