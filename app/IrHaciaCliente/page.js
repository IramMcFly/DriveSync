"use client"

import React, { Suspense } from 'react'
import IrHaciaCliente from '@/components/viewComponents/IrHaciaCliente'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 mt-10">Cargando ruta del cliente...</div>}>
      <IrHaciaCliente />
    </Suspense>
  )
}
