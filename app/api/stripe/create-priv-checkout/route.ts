import { NextResponse } from "next/server"
import { z } from "zod"
import { getStripe } from "@/lib/stripe/server"

const requestSchema = z.object({
  offerId: z.enum([
    "priv-vip",
    "priv-basic",
    "priv-exclusive",
    "priv-vip-discount",
    "priv-basic-discount",
    "priv-exclusive-discount",
    "priv-exit-vip",
  ]),
  currency: z.enum(["USD", "BRL", "CLP", "EUR", "GBP"]),
  deliveryProduct: z.enum(["priv-en5", "priv-en6", "priv-en8"]),
  requestId: z.string().regex(/^[a-zA-Z0-9_-]{16,100}$/),
})

const offerPricesUsd: Record<string, number> = {
  "priv-vip": 15,
  "priv-basic": 9.6,
  "priv-exclusive": 13.9,
  "priv-vip-discount": 5,
  "priv-basic-discount": 2.99,
  "priv-exclusive-discount": 6,
  "priv-exit-vip": 3,
}

const fixedMainPrices: Record<string, Record<"USD" | "BRL" | "EUR" | "GBP", number>> = {
  "priv-vip": { USD: 15, BRL: 20, EUR: 15, GBP: 15 },
  "priv-basic": { USD: 9.6, BRL: 9.6, EUR: 9.6, GBP: 9.6 },
  "priv-exclusive": { USD: 13.9, BRL: 18, EUR: 13.9, GBP: 13.9 },
}

const convertedDiscountRates: Record<string, number> = {
  USD: 1,
  BRL: 5.2,
  EUR: 0.92,
  GBP: 0.79,
  CLP: 950,
}

  const productNames: Record<string, string> = {
    "priv-vip": "Acesso a conteúdo digital",
    "priv-basic": "Acesso a conteúdo digital",
    "priv-exclusive": "Acesso a conteúdo digital",
    "priv-vip-discount": "Acesso a conteúdo digital",
    "priv-basic-discount": "Acesso a conteúdo digital",
    "priv-exclusive-discount": "Acesso a conteúdo digital",
    "priv-exit-vip": "Acesso a conteúdo digital",
  }

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Confira os dados informados." }, { status: 400 })
    }

    const { offerId, currency, deliveryProduct, requestId } = parsed.data
    const stripe = getStripe()
    const basePriceUsd = offerPricesUsd[offerId]
    const isMainOffer = ["priv-vip", "priv-basic", "priv-exclusive"].includes(offerId)
    const amount = currency === "CLP"
      ? Math.round(basePriceUsd * convertedDiscountRates.CLP)
      : isMainOffer
        ? Math.round(fixedMainPrices[offerId][currency as "USD" | "BRL" | "EUR" | "GBP"] * 100)
        : Math.round(basePriceUsd * convertedDiscountRates[currency] * 100)
    const origin = new URL(request.url).origin
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amount,
          product_data: { name: productNames[offerId] },
        },
      }],
      success_url: `${origin}/entrega?product=${deliveryProduct}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${deliveryProduct}?checkout=cancelled`,
      locale: "auto",
      metadata: { offerId, deliveryProduct },
      payment_intent_data: { metadata: { offerId, deliveryProduct } },
    }, { idempotencyKey: `priv-checkout-${requestId}` })

    if (!session.url) {
      return NextResponse.json({ error: "A Stripe não retornou a URL do checkout." }, { status: 502 })
    }

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error("[stripe-priv-checkout] error", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Não foi possível iniciar o checkout Stripe." }, { status: 500 })
  }
}
