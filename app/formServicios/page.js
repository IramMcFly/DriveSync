import Header from "@/components/viewComponents/Header"
import { Suspense } from "react"
import FormServiciosClient from "@/components/viewComponents/FormServiciosClient"

export default function FormServiciosPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<p className="text-white text-center mt-10">Cargando formulario...</p>}>
        <FormServiciosClient />
      </Suspense>
    </>
  )
}
