import type { Metadata } from "next"
import { getStripe } from "@/lib/stripe/server"

export const metadata: Metadata = {
  title: "Pagamento aprovado | Acesso liberado",
  description: "Seu pagamento foi aprovado. Acesse seu produto pelo botão abaixo.",
}

const accessLinks: Record<string, Record<string, string>> = {
  "priv-en5": {
    "priv-vip": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-basic": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-exclusive": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-vip-discount": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-basic-discount": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-exclusive-discount": "https://t.me/+ZPkv-9wuams2OWMx",
    "priv-exit-vip": "https://t.me/+ZPkv-9wuams2OWMx",
  },
  "priv-en6": {
    "priv-vip": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-basic": "https://t.me/+7UKq9MZYma5iN2Ux",
    "priv-exclusive": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-vip-discount": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-basic-discount": "https://t.me/+7UKq9MZYma5iN2Ux",
    "priv-exclusive-discount": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-exit-vip": "https://t.me/+r1wJP767rDA0Mjcx",
  },
  "priv-en8": {
    "priv-vip": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-basic": "https://t.me/+7UKq9MZYma5iN2Ux",
    "priv-exclusive": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-vip-discount": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-basic-discount": "https://t.me/+7UKq9MZYma5iN2Ux",
    "priv-exclusive-discount": "https://t.me/+r1wJP767rDA0Mjcx",
    "priv-exit-vip": "https://t.me/+r1wJP767rDA0Mjcx",
  },
}

export default async function EntregaPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; session_id?: string; payment_intent?: string }>
}) {
  const { product, session_id: sessionId, payment_intent: paymentIntentId } = await searchParams
  let accessUrl: string | undefined

  if (product && accessLinks[product]) {
    try {
      if (paymentIntentId) {
        const intent = await getStripe().paymentIntents.retrieve(paymentIntentId)
        const offerId = intent.metadata?.offerId
        if (intent.status === "succeeded" && intent.metadata?.deliveryProduct === product && offerId) {
          accessUrl = accessLinks[product][offerId]
        }
      } else if (sessionId) {
        const session = await getStripe().checkout.sessions.retrieve(sessionId)
        const offerId = session.metadata?.offerId
        const deliveryProduct = session.metadata?.deliveryProduct
        if (session.mode === "payment" && session.payment_status === "paid" && deliveryProduct === product && offerId) {
          accessUrl = accessLinks[product][offerId]
        }
      }
    } catch (error) {
      console.error("[stripe-delivery] payment verification failed", error instanceof Error ? error.message : "unknown")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#15181c] p-7 text-center shadow-2xl shadow-black/30 sm:p-10">
        {accessUrl ? (
          <>
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-300" aria-hidden="true">
              ✓
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Pagamento confirmado
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Tudo certo com a sua compra
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/65">
              Seu pagamento foi aprovado. O link de acesso ao conteúdo está disponível abaixo.
            </p>
            <a
              href={accessUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-6 py-4 text-sm font-bold text-[#07110c] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#15181c]"
            >
              Acessar meu produto
            </a>
            <p className="mt-5 text-xs leading-5 text-white/40">
              Se o botão não abrir, toque nele novamente para continuar no Telegram.
            </p>
          </>
        ) : (
          <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Aguardando confirmação
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Não foi possível confirmar o pagamento
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/65">
              O acesso só é liberado depois que a Stripe confirma o pagamento. Se você já pagou, aguarde alguns instantes e atualize esta página.
            </p>
          </>
        )}
      </section>
    </main>
  )
}
