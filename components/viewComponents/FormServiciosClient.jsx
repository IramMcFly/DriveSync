"use client"

import { useSearchParams } from "next/navigation"
import ServiceForm from "@/components/viewComponents/Service-Form"

export default function FormServiciosClient() {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo")

  return (
    <main className="min-h-screen bg-black p-6">
      <ServiceForm serviceType={tipo} />
    </main>
  )
}
    