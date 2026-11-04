import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Webhook Nitro recebido:", JSON.stringify(body, null, 2))

    const status = body?.status || body?.payment_status
    const orderId = body?.metadata?.order_id || body?.order_id || body?.id

    if (status?.toLowerCase() === "approved" || status?.toLowerCase() === "paid") {
      console.log("[v0] Pagamento aprovado:", orderId)
      return NextResponse.json({ success: true, message: "Pagamento aprovado" }, { status: 200 })
    }

    if (status?.toLowerCase() === "pending") {
      console.log("[v0] Pagamento pendente:", orderId)
      return NextResponse.json({ success: true, message: "Pagamento pendente" }, { status: 200 })
    }

    if (status?.toLowerCase() === "declined" || status?.toLowerCase() === "failed") {
      console.log("[v0] Pagamento recusado:", orderId)
      return NextResponse.json({ success: true, message: "Pagamento recusado" }, { status: 200 })
    }

    console.log("[v0] Webhook Nitro com status desconhecido:", status)
    return NextResponse.json({ success: true, message: "Webhook recebido" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro no webhook Nitro:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 })
  }
}
