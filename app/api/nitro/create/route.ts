import { NextResponse } from "next/server"
import { z } from "zod"

const requestSchema = z.object({
  offerId: z.enum(["priv-vip", "priv-basic", "priv-exclusive"]),
  currency: z.enum(["USD", "BRL", "CLP", "EUR", "GBP"]),
  paymentMethod: z.enum(["card", "klarna"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  deliveryProduct: z.enum(["priv-en5", "priv-en6"]),
})

const NITRO_API_URL = "https://api.nitropagamento.app"

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Confira os dados informados." }, { status: 400 })
    }

    const publicKey = process.env.NITRO_PUBLIC_KEY?.trim()
    const privateKey = process.env.NITRO_PRIVATE_KEY?.trim()
    if (!publicKey || !privateKey) {
      return NextResponse.json({ error: "As credenciais Nitro não estão configuradas." }, { status: 500 })
    }

    const credentials = Buffer.from(`${publicKey}:${privateKey}`).toString("base64")
    const usdPrices = { "priv-vip": 10, "priv-basic": 3.6, "priv-exclusive": 9 } as const
    const conversionRates = { USD: 1, BRL: 5.2, CLP: 950, EUR: 1, GBP: 0.79 } as const
    const usdAmount = usdPrices[parsed.data.offerId]
    const amount = usdAmount === 3.6 && parsed.data.currency === "EUR"
      ? 3.6
      : usdAmount * conversionRates[parsed.data.currency]
    const origin = new URL(request.url).origin
    const response = await fetch(NITRO_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount.toFixed(parsed.data.currency === "CLP" ? 0 : 2)),
        currency: parsed.data.currency,
        payment_method: parsed.data.paymentMethod,
        description: "Teste de checkout Nitro",
        customer: {
          name: parsed.data.name,
          email: parsed.data.email,
        },
        metadata: {
          order_id: `cartao-${Date.now()}`,
          delivery_product: parsed.data.deliveryProduct,
        },
        source_url: `${origin}/cartao`,
        return_url: `${origin}/entrega?product=${parsed.data.deliveryProduct}`,
        webhook_url: `${origin}/api/nitro/webhook`,
      }),
      cache: "no-store",
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.message || payload?.error || "A Nitro recusou a criação do checkout." },
        { status: response.status },
      )
    }

    const checkoutUrl = payload?.data?.checkout?.url || payload?.checkout?.url
    if (typeof checkoutUrl !== "string" || !checkoutUrl.startsWith("https://")) {
      return NextResponse.json({ error: "A Nitro não retornou um link de checkout válido." }, { status: 502 })
    }

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error("[v0] Nitro checkout error:", error)
    return NextResponse.json({ error: "Não foi possível conectar à Nitro agora." }, { status: 500 })
  }
}
