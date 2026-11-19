"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react"

export default function CartaoPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("5.00")
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/nitro/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          amount: Number(amount.replace(",", ".")),
          currency,
          paymentMethod,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Não foi possível criar o checkout.")
      window.location.assign(result.checkoutUrl)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível criar o checkout.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d12] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-[#15151d] shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-between bg-gradient-to-br from-fuchsia-950 via-[#25152e] to-[#15151d] p-8 sm:p-12">
            <div>
              <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-300/20">
                <CreditCard size={23} aria-hidden="true" />
              </div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-fuchsia-300">Nitro Pagamentos</p>
              <h1 className="max-w-sm text-4xl font-semibold tracking-tight sm:text-5xl">Teste de checkout com cartão</h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/65">
                Gere um checkout seguro e envie o comprador para a página hospedada pela Nitro.
              </p>
            </div>
            <div className="mt-14 space-y-4 text-sm text-white/65">
              <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-300" size={18} aria-hidden="true" /> Dados de cartão não passam pelo seu servidor</div>
              <div className="flex items-center gap-3"><LockKeyhole className="text-emerald-300" size={18} aria-hidden="true" /> Credenciais protegidas no backend</div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8">
              <p className="text-sm text-white/45">Ambiente de teste</p>
              <h2 className="mt-2 text-2xl font-semibold">Criar pagamento</h2>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-white/80">
                Nome completo
                <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-400" placeholder="Nome do cliente" />
              </label>
              <label className="block text-sm font-medium text-white/80">
                E-mail
                <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-400" placeholder="cliente@email.com" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-white/80">
                  Valor
                  <input required min="0.5" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-fuchsia-400" />
                </label>
                <label className="block text-sm font-medium text-white/80">
                  Moeda
                  <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#1d1d27] px-4 text-white outline-none focus:border-fuchsia-400">
                    <option value="USD">USD — Dólar</option>
                    <option value="GBP">GBP — Libra</option>
                    <option value="MXN">MXN — Peso mexicano</option>
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-white/80">Método</legend>
                <div className="grid grid-cols-2 gap-3">
                  {[["card", "Cartão"], ["klarna", "Klarna"]].map(([value, label]) => (
                    <label key={value} className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition ${paymentMethod === value ? "border-fuchsia-400 bg-fuchsia-400/10 text-white" : "border-white/10 text-white/55 hover:border-white/25"}`}>
                      <input className="sr-only" type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              {error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
              <button type="submit" disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-500 px-5 font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-wait disabled:opacity-60">
                {loading ? "Criando checkout..." : "Continuar para pagamento"}
                {!loading && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-white/35">O checkout será aberto em uma página segura da Nitro Pagamentos.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
