import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe não configurado." }, { status: 400 })
  }

  const payload = await request.text()

  try {
    const event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret)

    switch (event.type) {
      case "invoice.paid":
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const object = event.data.object as Stripe.Invoice | Stripe.Checkout.Session
        const paymentStatus = "payment_status" in object ? object.payment_status : object.status
        if (event.type.startsWith("checkout.session") && paymentStatus !== "paid") break
        console.log("[stripe-webhook] pagamento confirmado", {
          eventId: event.id,
          eventType: event.type,
          objectId: object.id,
        })
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("[stripe-webhook] pagamento recusado", {
          eventId: event.id,
          invoiceId: invoice.id,
          attemptCount: invoice.attempt_count,
          status: invoice.status,
        })
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[stripe-webhook] assinatura inválida ou payload inválido", {
      message: error instanceof Error ? error.message : "unknown error",
    })
    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 })
  }
}
