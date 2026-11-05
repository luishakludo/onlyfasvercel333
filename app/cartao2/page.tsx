"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, CreditCard, LockKeyhole } from "lucide-react"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const CHARGE_CURRENCY = "USD"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51RihAcAcROcaM8Lgki6KnMOrflJO7Bm8CBFriAiRs4EiVtqQMa8AcGcd3xH9WvA89hB4JjoDk3yrqNYRyHtxubKx00hMYHwDVS")

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setResult("")
    if (!stripe || !elements) {
      setError("O formulário seguro da Stripe ainda está carregando. Tente novamente.")
      return
    }

    const card = elements.getElement(CardElement)
    if (!card) {
      setError("Não foi possível carregar o campo seguro do cartão.")
      return
    }

    setLoading(true)
    try {
      const paymentMethodResult = await stripe.createPaymentMethod({ type: "card", card })
      if (paymentMethodResult.error || !paymentMethodResult.paymentMethod) {
        throw new Error(paymentMethodResult.error?.message || "A Stripe não conseguiu tokenizar o cartão.")
      }

      const response = await fetch("/api/ironpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currency: CHARGE_CURRENCY, card_token: paymentMethodResult.paymentMethod.id }),
      })
      const payload = await response.json()
      if (!response.ok) {
        const fieldErrors = payload.fields ? Object.entries(payload.fields).map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`).join(" | ") : ""
        throw new Error([payload.error, fieldErrors].filter(Boolean).join(" "))
      }

      const clientSecret = payload.transaction?.payment_intent_client_secret || payload.payment_intent_client_secret
      if (clientSecret) {
        const confirmation = await stripe.confirmCardPayment(clientSecret)
        if (confirmation.error) throw new Error(`Falha na autenticação 3DS: ${confirmation.error.message}`)
        if (confirmation.paymentIntent?.status !== "succeeded") throw new Error(`A Stripe retornou o status: ${confirmation.paymentIntent?.status || "desconhecido"}.`)
      }

      if (payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl)
        return
      }
      setResult("Pagamento enviado com sucesso para processamento.")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível processar o pagamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="rounded-xl border border-[#2f6df6] bg-[#eef4ff] px-4 py-3 text-sm font-semibold text-[#2258ce]">Cobrança internacional em dólar (USD)</div>
      <label className="block text-sm font-semibold">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 outline-none focus:border-[#2f6df6]" placeholder="cliente@email.com" autoComplete="email" /></label>
      <div className="rounded-xl bg-[#f5f7fb] px-4 py-3 text-sm text-[#72809a]">Total: <strong className="text-[#13213b]">US$ 2,00</strong></div>
      <p className="text-xs leading-5 text-[#72809a]">O cartão é tokenizado pela Stripe. O número e o CVV não passam pelo servidor desta aplicação.</p>
      <label className="block text-sm font-semibold">Dados do cartão<div className="mt-2 rounded-xl border border-[#dfe5ef] px-4 py-4 focus-within:border-[#2f6df6]"><CardElement options={{ hidePostalCode: true, style: { base: { color: "#13213b", fontSize: "16px", fontFamily: "inherit", "::placeholder": { color: "#72809a" } }, invalid: { color: "#dc2626" } } }} /></div></label>
      <fieldset><legend className="mb-3 text-sm font-semibold">Método de pagamento</legend><div className="flex items-center gap-3 rounded-xl border border-[#2f6df6] bg-[#eef4ff] px-4 py-3 text-sm font-medium text-[#2258ce]"><CreditCard size={18} aria-hidden="true" /> Cartão de crédito</div></fieldset>
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {result ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{result}</p> : null}
      <button disabled={loading || !stripe} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2f6df6] px-5 font-semibold text-white transition hover:bg-[#2258ce] disabled:opacity-60" type="submit">{loading ? "Processando pagamento..." : "Continuar para pagamento"}{!loading && <ArrowRight size={18} aria-hidden="true" />}</button>
    </form>
  )
}

export default function Cartao2Page() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-[#13213b] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#dfe5ef] bg-white shadow-xl shadow-[#17233d]/10 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="bg-[#13213b] p-8 text-white sm:p-12"><div className="mb-12 flex size-12 items-center justify-center rounded-2xl bg-[#2f6df6]"><CreditCard size={23} aria-hidden="true" /></div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8fb1ff]">IronPay</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Teste de pagamento</h1><p className="mt-5 max-w-sm leading-7 text-white/65">Informe seu e-mail e pague US$ 2,00 com tokenização segura da Stripe.</p><div className="mt-14 space-y-4 text-sm text-white/65"><p className="flex items-center gap-3"><LockKeyhole size={18} className="text-[#8fb1ff]" aria-hidden="true" /> Token mantido somente no servidor</p><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-300" aria-hidden="true" /> Cobrança fixa de US$ 2,00</p></div></section>
          <section className="p-6 sm:p-10"><div className="mb-8"><p className="text-sm text-[#72809a]">Ambiente de teste</p><h2 className="mt-2 text-2xl font-semibold">Nova transação</h2></div><Elements stripe={stripePromise}><CheckoutForm /></Elements></section>
        </div>
      </div>
    </main>
  )
}
