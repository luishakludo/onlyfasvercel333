import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  amount: z.number().min(1).max(100000000),
  paymentMethod: z.literal("credit_card"),
})

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
        image_url: new URL("/images/basic-package.png", request.url).toString(),
        payment_type: 1,
        product_type: "digital",
        delivery_type: 1,
        id_category: 1,
        amount: Math.round(parsed.data.amount * 100),
      }),
      cache: "no-store",
    })

    const product = await productResponse.json().catch(() => ({}))
    if (!productResponse.ok) {
      return NextResponse.json({ error: product?.message || "Não foi possível criar o produto IronPay." }, { status: productResponse.status })
    }

    const productHash = product?.hash || product?.data?.hash || product?.product?.hash
    const transactionResponse = await fetch(`${baseUrl}/transactions?${query}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        amount: Math.round(parsed.data.amount * 100),
        payment_method: parsed.data.paymentMethod,
        product_hash: productHash,
        customer: { name: parsed.data.name, email: parsed.data.email },
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
