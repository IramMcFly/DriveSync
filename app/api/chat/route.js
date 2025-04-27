// Archivo: /app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // ✅ Modelo rápido, gratis y recomendado para demos
        messages: body.messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await groqResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al conectar con Groq:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
