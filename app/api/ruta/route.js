import { NextResponse } from "next/server"

export async function POST(request) {
  const body = await request.json()

  try {
    const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
      method: "POST",
      headers: {
        Authorization: process.env.LEAFLETMAP_API_KEY, // ❌ sin Bearer
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ coordinates: body.coordinates })
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error en ruta API:", err)
    return NextResponse.json({ error: "Error interno de servidor" }, { status: 500 })
  }
}
