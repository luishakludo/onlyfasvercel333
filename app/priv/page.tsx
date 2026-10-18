"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckoutModal } from "@/components/landing/checkout-modal"
import { StripeCheckoutModal } from "@/components/landing/stripe-checkout-modal"

const coverImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4936166533197663844-cJ8nMNrFT1biLSzOvJThzRP8AcCt0v.jpg"
const profileImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/790059490_18083216771471493_7120741971286687762_n-SLGBqGlxNyssD7kbPz18TJjJrsny9c.jpg"

const offers = [
  {
    title: "Álbum VIP total",
    description: "Mais vendido · Todos os álbuns abaixo inclusos neste pacote",
    price: "R$ 27,99",
    oldPrice: "R$ 127,99",
    accent: "VIP",
  },
  {
    title: "Álbum exclusivo",
    description: "Conteúdo selecionado para você",
    price: "R$ 16,99",
    accent: "EXCLUSIVO",
  },
  {
    title: "Pacote básico",
    description: "Com poucas fotos",
    price: "R$ 7,99",
    accent: "BÁSICO",
  },
]

export default function PrivPage() {
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[number] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "atenas" | null>(null)

  const handleOfferClick = (offer: (typeof offers)[number]) => {
    setSelectedOffer(offer)
    // A página /priv usa sempre PIX direto, sem formulário de e-mail.
    setPaymentMethod("atenas")
  }

  const closeCheckout = () => {
    setSelectedOffer(null)
    setPaymentMethod(null)
  }

  return (
    <main className="min-h-screen bg-[#f3f6fc] px-4 py-7 text-[#07142f]">
      <section className="mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="relative h-[150px] overflow-hidden bg-[#d8dce4]">
          <img src={coverImage} alt="Capa do perfil" className="block h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
          <img
            src={profileImage}
            alt="Foto do perfil"
            className="absolute bottom-[-34px] left-1/2 h-[104px] w-[104px] -translate-x-1/2 rounded-full border-[7px] border-white object-cover"
          />
        </div>

        <div className="px-5 pb-7 pt-11 text-center font-sans sm:px-10">
          <h1 className="mx-auto max-w-[620px] text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[25px]">
            ⚡ PROMOÇÃO RELÂMPAGO, VÁLIDO ATÉ AS 23:00H 🔥 ⏰ ⌛ — VAGAS LIMITADAS PARA OS 100 PRIMEIROS 💎
          </h1>
          <p className="mt-3 text-[18px] font-semibold leading-tight sm:text-[22px]">PACOTE VIP com 60% OFF 💎 🎁 + Bônus</p>
          <p className="mt-2 text-[17px] font-semibold sm:text-[20px]">especial NO PRIMEIRO ÁLBUM! 📸</p>
          <p className="mt-4 text-[21px] font-semibold sm:text-[25px]">Conteúdo novo todos os dias</p>
          <p className="mt-1 text-base font-normal">Fotos todos os dias</p>

          <div className="mt-7 space-y-5 text-left">
            {offers.map((offer) => (
              <button
                key={offer.title}
                type="button"
                onClick={() => handleOfferClick(offer)}
                className="group flex min-h-[76px] w-full items-center gap-3 rounded-2xl border border-black/[0.04] bg-white px-3.5 py-2.5 text-left shadow-[0_5px_18px_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.14)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b29acb] to-[#ecd9ee] text-center text-[10px] font-black uppercase text-white">
                  {offer.accent}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-snug sm:text-base">{offer.title} <span className="font-semibold">{offer.description}</span></p>
                  {offer.oldPrice && <p className="mt-0.5 text-[13px] font-semibold leading-snug">De {offer.oldPrice} por uma oferta especial</p>}
                </div>
                <div className="shrink-0 text-right text-[15px] font-bold sm:text-base">{offer.price}                </div>
              </button>
            ))}

            <Link
              href="/priv"
              className="flex min-h-[76px] items-center justify-between rounded-2xl border-2 border-[#f0008c] px-4 text-[#e50086] shadow-[0_3px_12px_rgba(240,0,140,0.15)] transition hover:bg-[#fff4fb]"
            >
              <span className="text-lg font-extrabold">Enviar presentinho</span>
              <span aria-hidden="true" className="text-3xl">+</span>
            </Link>
          </div>

          <p className="mt-8 text-2xl font-black text-[#f0008c]">Priv</p>
        </div>
      </section>

      {selectedOffer && paymentMethod === "stripe" && (
        <StripeCheckoutModal
          plan={{ id: "1m", name: selectedOffer.title, price: selectedOffer.price, period: "por mês" }}
          modelName="Conteúdo exclusivo"
          colors={{ background: "#f3f6fc", text: "#07142f", subtext: "#536078", accent: "#f0008c", cardBg: "#ffffff" }}
          onClose={closeCheckout}
        />
      )}

      {selectedOffer && paymentMethod === "atenas" && (
        <CheckoutModal
          plan={{ id: selectedOffer.title, name: selectedOffer.title, price: selectedOffer.price }}
          modelName="Conteúdo exclusivo"
          orderBumps={[]}
          title="Pagamento seguro"
          subtitle="Gere seu PIX pela AtenasPay."
          checkoutConfig={{
            title: "Pagamento seguro",
            subtitle: "Gere seu PIX pela AtenasPay.",
            mode: "direto",
            queueEnabled: false,
            queueHours: 0,
            priorityEnabled: false,
            priorityPrice: "R$ 0,00",
            priorityText: "",
          }}
          colors={{ background: "#f3f6fc", text: "#07142f", subtext: "#536078", accent: "#f0008c", cardBg: "#ffffff" }}
          forceGateway="nexuspag"
          onClose={closeCheckout}
        />
      )}
    </main>
  )
}
