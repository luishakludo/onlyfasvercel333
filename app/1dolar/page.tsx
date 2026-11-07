"use client"

import { useState } from "react"
import { StripeCheckoutModal } from "@/components/landing/stripe-checkout-modal"

export default function OneDollarPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#f8f7fb] px-5 py-10 text-[#111827]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-[#ebe7f1] bg-white p-7 text-center shadow-xl shadow-[#26123d]/10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ec008c]">Exclusive access</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Unlock for $1</h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Complete your secure Stripe payment and unlock your access instantly.
          </p>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="mt-7 w-full rounded-2xl bg-[#ec008c] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#ec008c]/25 transition hover:bg-[#d9007c]"
          >
            Continue to secure checkout — $1
          </button>
          <p className="mt-4 text-xs text-[#98a2b3]">Secure payment powered by Stripe</p>
        </div>
      </section>

      {isCheckoutOpen ? (
        <StripeCheckoutModal
          plan={{ id: "1dolar", name: "One dollar access", price: "$1" }}
          modelName="One Dollar Access"
          colors={{ background: "#ffffff", text: "#111827", subtext: "#667085", accent: "#ec008c", cardBg: "#ffffff" }}
          onClose={() => setIsCheckoutOpen(false)}
        />
      ) : null}
    </main>
  )
}
