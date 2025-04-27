"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Link from "next/link";

const serviciosDisponibles = [
  { tipo: "asistencia", label: "Asistencia Vehicular" },
  { tipo: "grua", label: "Servicio de Grúa" },
  { tipo: "diagnostico", label: "Diagnóstico Vehicular" },
  { tipo: "limpieza", label: "Limpieza del Vehículo" },
  { tipo: "cerrajeria", label: "Cerrajería Automotriz" },
];

function detectarServicios(texto) {
  const serviciosDetectados = [];
  if (/asistencia|ayuda|motor|batería/i.test(texto)) serviciosDetectados.push("asistencia");
  if (/grúa|remolque|arrastre/i.test(texto)) serviciosDetectados.push("grua");
  if (/diagnóstico|scanner|falla|problema/i.test(texto)) serviciosDetectados.push("diagnostico");
  if (/limpieza|lavado|detallado/i.test(texto)) serviciosDetectados.push("limpieza");
  if (/cerrajería|cerradura|llaves/i.test(texto)) serviciosDetectados.push("cerrajeria");

  if (serviciosDetectados.length === 0) {
    return serviciosDisponibles.map((s) => s.tipo);
  }
  return serviciosDetectados;
}

export default function AsistenteEspecializado() {
  const [userMessage, setUserMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    const newChat = [...chat, { role: "user", content: userMessage }];
    setChat(newChat);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente automotriz llamado DriveSync Services. Ofreces servicios de asistencia vehicular, servicio de grúa, diagnóstico vehicular, limpieza de vehículos y cerrajería automotriz. Da respuestas de máximo 3-4 líneas y ofrece de forma amable contratar uno de nuestros servicios si es oportuno.",
            },
            ...newChat,
          ],
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "No pude procesar tu solicitud, intenta de nuevo.";
      setChat((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("Error al comunicar con el servidor:", error);
      setChat((prev) => [...prev, { role: "assistant", content: "Hubo un error. Por favor intenta más tarde." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white flex flex-col">
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto bg-[#1E1E1E] rounded-lg shadow-md border border-[#333] overflow-hidden">
        <div className="p-4 border-b border-[#333] text-center">
          <h1 className="text-2xl font-bold">Asistente Especializado</h1>
          <p className="text-gray-400 text-sm mt-1">Consulta rápida para emergencias automotrices</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
          {chat.map((message, index) => (
            <div key={index}>
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-orange-600/30 self-end text-right"
                    : "bg-[#333] self-start text-left"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              {message.role === "assistant" &&
                detectarServicios(message.content).map((tipo) => {
                  const servicio = serviciosDisponibles.find((s) => s.tipo === tipo);
                  return (
                    <Link key={tipo} href={`/formServicios?tipo=${encodeURIComponent(tipo)}`}>
                      <button className="mt-2 mr-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-xs">
                        {servicio.label}
                      </button>
                    </Link>
                  );
                })}
            </div>
          ))}

          {loading && (
            <div className="p-3 rounded-lg bg-[#333] text-left animate-pulse">
              <p className="text-sm text-gray-400">El asistente está escribiendo...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div
          className={`p-4 flex items-center gap-2 bg-[#1a1a1a] ${
            isMobile ? "fixed bottom-16 left-0 right-0 max-w-2xl mx-auto" : "border-t border-[#333]"
          }`}
        >
          <input
            type="text"
            placeholder="Describe tu problema..."
            className="flex-1 bg-[#333] text-white py-2 px-4 rounded-md focus:outline-none"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!userMessage.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full disabled:bg-gray-600"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
