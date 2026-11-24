import { NextResponse } from "next/server"
import { getStripe, getOrCreatePriceId } from "@/lib/stripe/server"
import { getStripePlan } from "@/lib/stripe/plans"
import { STRIPE_KEYS_MISSING } from "@/lib/stripe/keys"

export async function POST(request: Request) {
  try {
    if (STRIPE_KEYS_MISSING) return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 })
    const body = await request.json().catch(() => ({}))
    const planId = typeof body?.planId === "string" ? body.planId : ""
    const email = typeof body?.email === "string" ? body.email.trim() : ""
    const modelName = typeof body?.modelName === "string" ? body.modelName.trim() : ""
    const requestId = typeof body?.requestId === "string" && /^[a-zA-Z0-9_-]{16,100}$/.test(body.requestId) ? body.requestId : crypto.randomUUID()
    const plan = getStripePlan(planId)
    if (!plan) return NextResponse.json({ error: "Plano inválido." }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "E-mail inválido." }, { status: 400 })

    const stripe = getStripe()
    const priceId = await getOrCreatePriceId({ planKey: plan.id, productName: plan.productName, amountCents: plan.amountCents, intervalCount: plan.intervalCount })
    const origin = new URL(request.url).origin
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/priv-en2?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/priv-en2?checkout=cancelled`,
      adaptive_pricing: { enabled: true },
      locale: "auto",
      billing_address_collection: "auto",
      metadata: { planId: plan.id, modelName: modelName || "Geovanna Pierre" },
      subscription_data: { metadata: { planId: plan.id, modelName: modelName || "Geovanna Pierre" } },
    }, { idempotencyKey: `checkout-session-${requestId}` })

    if (!session.url) return NextResponse.json({ error: "A Stripe não retornou a URL do checkout." }, { status: 502 })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[stripe-checkout-session] error", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Não foi possível iniciar o checkout Stripe." }, { status: 500 })
  }
}
