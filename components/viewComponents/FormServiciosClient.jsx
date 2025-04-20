"use client"

import { useSearchParams } from "next/navigation"
import ServiceForm from "@/components/viewComponents/Service-Form"

export default function FormServiciosClient() {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo")

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white p-6 pb-20">
      <ServiceForm serviceType={tipo} />
    </main>
  )
}
