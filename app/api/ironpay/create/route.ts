import { NextResponse } from "next/server"
import { z } from "zod"

const FIXED_AMOUNT = 5
const FIXED_CURRENCY = "USD"

const schema = z.object({
  email: z.string().trim().email().max(160),
  currency: z.literal(FIXED_CURRENCY),
  card_token: z.string().trim().min(1).max(255),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone_number: z.string().trim().min(8).max(20),
    document: z.string().trim().min(5).max(20),
    street_name: z.string().trim().min(2).max(160),
    number: z.string().trim().min(1).max(20),
    complement: z.string().trim().max(80).optional().default(""),
    neighborhood: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(40),
    zip_code: z.string().trim().min(4).max(12),
  }),
})
const PAYMENT_METHOD = "credit_card"

const baseUrl = "https://api.ironpayapp.com.br/api/public/v1"

async function readIronPayResponse(response: Response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { raw: text }
  }
}

function describeIronPayError(payload: unknown, status: number) {
  if (typeof payload === "string") return `IronPay HTTP ${status}: ${payload}`
  if (!payload || typeof payload !== "object") return `IronPay HTTP ${status}: resposta vazia.`

  const response = payload as Record<string, unknown>
  const detail = response.message || response.error || response.errors || response.details || response.code || response.raw
  if (typeof detail === "string") return `IronPay HTTP ${status}: ${detail}`
  if (detail && typeof detail === "object") return `IronPay HTTP ${status}: ${JSON.stringify(detail)}`
  return `IronPay HTTP ${status}: ${JSON.stringify(response)}`
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({
        error: "Confira os dados do pagamento.",
        fields: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const token = process.env.IRONPAY_API_TOKEN?.trim()
    if (!token) {
      return NextResponse.json({ error: "IRONPAY_API_TOKEN não está configurado." }, { status: 500 })
    }

    const query = `api_token=${encodeURIComponent(token)}`
    const headers = { Accept: "application/json", "Content-Type": "application/json" }
    const productResponse = await fetch(`${baseUrl}/products?${query}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Teste de pagamento IronPay",
        sale_page: new URL("/cartao2", request.url).toString(),
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/298538-ThACTz97wXCebERbTe2B9tBm3nh9gt.jpeg",
        cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/298538-ThACTz97wXCebERbTe2B9tBm3nh9gt.jpeg",
        payment_type: 1,
        product_type: "digital",
        delivery_type: 1,
        id_category: 1,
        amount: FIXED_AMOUNT * 100,
      }),
      cache: "no-store",
    })

    const product = await readIronPayResponse(productResponse)
    if (!productResponse.ok) {
      return NextResponse.json({ error: describeIronPayError(product, productResponse.status) }, { status: productResponse.status })
    }

    const productHash = product?.hash || product?.data?.hash || product?.product?.hash
    const offerHash = product?.offers?.[0]?.hash || product?.data?.offers?.[0]?.hash
    if (typeof productHash !== "string" || typeof offerHash !== "string") {
      return NextResponse.json({ error: "A IronPay não retornou os hashes do produto e da oferta." }, { status: 502 })
    }
    const transactionResponse = await fetch(`${baseUrl}/transactions?${query}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        amount: FIXED_AMOUNT * 100,
        currency: parsed.data.currency,
        payment_method: PAYMENT_METHOD,
        product_hash: productHash,
        offer_hash: offerHash,
        customer: { ...parsed.data.customer, email: parsed.data.email },
        cart: [{ product_hash: productHash, offer_hash: offerHash, quantity: 1, price: FIXED_AMOUNT * 100 }],
        card_token: parsed.data.card_token,
      }),
      cache: "no-store",
    })
    const transaction = await readIronPayResponse(transactionResponse)
    if (!transactionResponse.ok) {
      return NextResponse.json({ error: describeIronPayError(transaction, transactionResponse.status) }, { status: transactionResponse.status })
    }

    return NextResponse.json({
      transaction,
      checkoutUrl: transaction?.checkout_url || transaction?.payment_url || transaction?.data?.checkout_url || null,
    })
  } catch (error) {
    console.error("[v0] IronPay error:", error)
    return NextResponse.json({ error: "Não foi possível conectar à IronPay." }, { status: 500 })
  }
}
