"use client"

import { useSearchParams } from "next/navigation"
import Header from "@/components/viewComponents/Header"
import ServiceForm from "@/components/viewComponents/Service-Form" // Ajusta si tu ruta es diferente

const FormServiciosPage = () => {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black p-6">
        <ServiceForm serviceType={tipo} />
      </main>
    </>
  )
}

export default FormServiciosPage
