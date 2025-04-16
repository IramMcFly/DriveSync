import dynamic from "next/dynamic"
import Header from "@/components/viewComponents/Header"

const FormServiciosClient = dynamic(() => import("@/components/FormServiciosClient"), {
  ssr: false,
})

export default function FormServiciosPage() {
  return (
    <>
      <Header />
      <FormServiciosClient />
    </>
  )
}
