import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  email: z.string().trim().email().max(160),
  currency: z.enum(["BRL", "USD"]),
})

const FIXED_AMOUNT = 5
const CUSTOMER_NAME = "Cliente Priv"
const PAYMENT_METHOD = "credit_card"

const baseUrl = "https://api.ironpayapp.com.br/api/public/v1"

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Confira os dados do pagamento." }, { status: 400 })
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
        currency: parsed.data.currency,
      }),
      cache: "no-store",
    })

    const product = await productResponse.json().catch(() => ({}))
    if (!productResponse.ok) {
      return NextResponse.json({ error: product?.message || "Não foi possível criar o produto IronPay." }, { status: productResponse.status })
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
        customer: { name: CUSTOMER_NAME, email: parsed.data.email },
        cart: [{ product_hash: productHash, offer_hash: offerHash, quantity: 1, price: FIXED_AMOUNT * 100 }],
      }),
      cache: "no-store",
    })
    const transaction = await transactionResponse.json().catch(() => ({}))
    if (!transactionResponse.ok) {
      return NextResponse.json({ error: transaction?.message || "Não foi possível criar a transação IronPay." }, { status: transactionResponse.status })
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
