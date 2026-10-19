import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook não configurado." }, { status: 400 })
  }

  try {
    const payload = await request.text()
    const event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret)

    if (event.type === "invoice.payment_succeeded" || event.type === "checkout.session.completed") {
      const object = event.data.object as Stripe.Invoice | Stripe.Checkout.Session
      const metadata = object.metadata ?? {}
      const tier = metadata.deliverableTier
      const deliverableUrl = metadata.deliverableUrl

      if (tier && deliverableUrl) {
        console.log("[v0] Stripe deliverable approved", { tier, deliverableUrl })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.log("[v0] Stripe webhook error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 })
  }
}
