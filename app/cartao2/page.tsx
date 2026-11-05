"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, CreditCard, LockKeyhole } from "lucide-react"

type Currency = "BRL" | "USD"

function formatExpiration(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export default function Cartao2Page() {
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState<Currency>("BRL")
  const [cardNumber, setCardNumber] = useState("")
  const [holderName, setHolderName] = useState("")
  const [expiration, setExpiration] = useState("")
  const [cvv, setCvv] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setResult("")
    setLoading(true)
    try {
      const response = await fetch("/api/ironpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currency,
          card: {
            number: cardNumber.replace(/\D/g, ""),
            holder_name: holderName,
            exp_month: Number(expiration.split("/")[0] || 0),
            exp_year: Number(expiration.split("/")[1]?.length === 2 ? `20${expiration.split("/")[1]}` : expiration.split("/")[1] || 0),
            cvv,
          },
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "A IronPay recusou a transação.")
      if (payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl)
        return
      }
      setResult("Transação criada. A resposta da IronPay está disponível para conferência no servidor.")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível criar a transação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-[#13213b] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#dfe5ef] bg-white shadow-xl shadow-[#17233d]/10 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="bg-[#13213b] p-8 text-white sm:p-12">
            <div className="mb-12 flex size-12 items-center justify-center rounded-2xl bg-[#2f6df6]">
              <CreditCard size={23} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8fb1ff]">IronPay</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Teste de pagamento</h1>
            <p className="mt-5 max-w-sm leading-7 text-white/65">Escolha a moeda, informe seu e-mail e continue para o checkout seguro da IronPay.</p>
            <div className="mt-14 space-y-4 text-sm text-white/65">
              <p className="flex items-center gap-3"><LockKeyhole size={18} className="text-[#8fb1ff]" aria-hidden="true" /> Token mantido somente no servidor</p>
              <p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-300" aria-hidden="true" /> Cobrança fixa de 5 unidades</p>
            </div>
          </section>
          <section className="p-6 sm:p-10">
            <div className="mb-8"><p className="text-sm text-[#72809a]">Ambiente de teste</p><h2 className="mt-2 text-2xl font-semibold">Nova transação</h2></div>
            <form className="space-y-5" onSubmit={submit}>
              <fieldset><legend className="mb-3 text-sm font-semibold">Moeda</legend><div className="grid grid-cols-2 gap-3">{(["BRL", "USD"] as const).map((option) => <label key={option} className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${currency === option ? "border-[#2f6df6] bg-[#eef4ff] text-[#2258ce]" : "border-[#dfe5ef] text-[#72809a]"}`}><input className="sr-only" type="radio" name="currency" value={option} checked={currency === option} onChange={() => setCurrency(option)} />{option}</label>)}</div></fieldset>
              <label className="block text-sm font-semibold">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 outline-none focus:border-[#2f6df6]" placeholder="cliente@email.com" autoComplete="email" /></label>
              <div className="rounded-xl bg-[#f5f7fb] px-4 py-3 text-sm text-[#72809a]">Total: <strong className="text-[#13213b]">{currency === "USD" ? "US$ 5,00" : "R$ 5,00"}</strong></div>
              <p className="text-xs leading-5 text-[#72809a]">A IronPay exige os dados do cartão para transações diretas. Use os dados reais do cartão ou o cartão de teste oficial da sua conta.</p>
              <label className="block text-sm font-semibold">Número do cartão<input required inputMode="numeric" autoComplete="cc-number" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 outline-none focus:border-[#2f6df6]" placeholder="0000 0000 0000 0000" /></label>
              <label className="block text-sm font-semibold">Nome no cartão<input required autoComplete="cc-name" value={holderName} onChange={(event) => setHolderName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 uppercase outline-none focus:border-[#2f6df6]" placeholder="NOME COMO IMPRESSO NO CARTÃO" /></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Validade<input required inputMode="numeric" autoComplete="cc-exp" value={expiration} onChange={(event) => setExpiration(formatExpiration(event.target.value))} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 outline-none focus:border-[#2f6df6]" placeholder="MM/AA" maxLength={5} /></label><label className="block text-sm font-semibold">CVV<input required inputMode="numeric" autoComplete="cc-csc" value={cvv} onChange={(event) => setCvv(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfe5ef] px-4 outline-none focus:border-[#2f6df6]" placeholder="123" /></label></div>
              <fieldset><legend className="mb-3 text-sm font-semibold">Método de pagamento</legend><div className="flex items-center gap-3 rounded-xl border border-[#2f6df6] bg-[#eef4ff] px-4 py-3 text-sm font-medium text-[#2258ce]"><CreditCard size={18} aria-hidden="true" /> Cartão de crédito</div></fieldset>
              {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              {result ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{result}</p> : null}
              <button disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2f6df6] px-5 font-semibold text-white transition hover:bg-[#2258ce] disabled:opacity-60" type="submit">{loading ? "Abrindo checkout..." : "Continuar para pagamento"}{!loading && <ArrowRight size={18} aria-hidden="true" />}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
