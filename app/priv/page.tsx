"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckoutModal } from "@/components/landing/checkout-modal"

const coverImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4936166533197663844-cJ8nMNrFT1biLSzOvJThzRP8AcCt0v.jpg"
const profileImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/790059490_18083216771471493_7120741971286687762_n-SLGBqGlxNyssD7kbPz18TJjJrsny9c.jpg"

const offers = [
  {
    title: "🎁 💎 Álbum VIP total ⭐ MAIS VENDIDO ⭐",
    description: "Todos os álbuns inclusos 🔥",
    price: "R$ 27,99",
    oldPrice: "R$ 127,99",
    accent: "VIP",
    image: "/images/vip-album.png",
  },
  {
    title: "📸 Pacote básico 🌸",
    description: "Poucas fotos, do jeitinho certo",
    price: "R$ 7,99",
    accent: "BÁSICO",
    image: "/images/basic-package.png",
  },
  {
    title: "🎬 Álbum exclusivo 💎",
    description: "Conteúdo selecionado para você",
    price: "R$ 16,99",
    accent: "EXCLUSIVO",
    image: "/images/exclusive-album.png",
  },
]

export default function PrivPage() {
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[number] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"sigilo" | null>(null)

  const handleOfferClick = (offer: (typeof offers)[number]) => {
    setSelectedOffer(offer)
    setPaymentMethod(null)
  }

  const openPayment = () => {
    // A página /priv usa sempre PIX direto, sem formulário de e-mail.
    setPaymentMethod("sigilo")
  }

  const closeCheckout = () => {
    setSelectedOffer(null)
    setPaymentMethod(null)
  }

  return (
    <main className="min-h-screen bg-[#f3f6fc] px-4 py-7 text-[#07142f]">
      <section className="mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="relative z-10 h-[150px] overflow-visible bg-[#d8dce4]">
          <img src={coverImage} alt="Capa do perfil" className="block h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
          <img
            src={profileImage}
            alt="Foto do perfil"
            className="absolute bottom-[-34px] left-1/2 z-20 h-[104px] w-[104px] -translate-x-1/2 rounded-full border-[7px] border-white object-cover shadow-sm"
          />
        </div>

        <div className="relative z-0 px-5 pb-7 pt-11 text-center font-sans sm:px-10">
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
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={`Imagem do ${offer.title}`}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b29acb] to-[#ecd9ee] text-center text-[10px] font-black uppercase text-white">
                    {offer.accent}
                  </div>
                )}
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

      {selectedOffer && paymentMethod === null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142f]/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-preview-title"
          onClick={closeCheckout}
        >
          <div
            className="relative w-full max-w-[430px] overflow-hidden rounded-[26px] bg-white text-[#07142f] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCheckout}
              aria-label="Fechar detalhes do pacote"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-xl leading-none text-white transition hover:bg-black/75"
            >
              <span aria-hidden="true">×</span>
            </button>
            <img
              src={selectedOffer.image}
              alt={`Imagem ampliada do ${selectedOffer.title}`}
              className="h-64 w-full object-cover sm:h-72"
            />
            <div className="space-y-4 p-5 text-left sm:p-6">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#f0008c]">{selectedOffer.accent}</p>
                <h2 id="offer-preview-title" className="text-2xl font-black">{selectedOffer.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#536078]">{selectedOffer.description}.</p>
              </div>
              <div className="flex items-end justify-between border-t border-[#e8ebf2] pt-4">
                <div>
                  {selectedOffer.oldPrice && <p className="text-sm text-[#536078] line-through">{selectedOffer.oldPrice}</p>}
                  <p className="text-2xl font-black text-[#f0008c]">{selectedOffer.price}</p>
                </div>
                <button
                  type="button"
                  onClick={openPayment}
                  className="rounded-xl bg-[#f0008c] px-5 py-3 text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(240,0,140,0.25)] transition hover:bg-[#d9007c]"
                >
                  Quero este pacote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOffer && paymentMethod === "sigilo" && (
        <CheckoutModal
          plan={{ id: selectedOffer.title, name: selectedOffer.title, price: selectedOffer.price }}
          modelName="Conteúdo exclusivo"
          orderBumps={[]}
          title="Pagamento seguro"
          subtitle="Gere seu PIX pela Sigilo Pay."
          checkoutConfig={{
            title: "Pagamento seguro",
            subtitle: "Gere seu PIX pela Sigilo Pay.",
            mode: "direto",
            queueEnabled: false,
            queueHours: 0,
            priorityEnabled: false,
            priorityPrice: "R$ 0,00",
            priorityText: "",
          }}
          colors={{ background: "#f3f6fc", text: "#07142f", subtext: "#536078", accent: "#f0008c", cardBg: "#ffffff" }}
          forceGateway="sigilo"
          onClose={closeCheckout}
        />
      )}
    </main>
  )
}
