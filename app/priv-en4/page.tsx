"use client"

import useSWR from "swr"
import { useEffect, useMemo, useRef, useState } from "react"
import { StripeCheckoutModal } from "@/components/landing/stripe-checkout-modal"

const coverImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_5102618888402308435_x-Sq51aO1dOYuIzmY0680vX5ENAyztcC.jpg"
const profileImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_5102618888402308436_x-MuUfzG592DTKQ2TvH1U0kvsadd0F3b.jpg"
const vipDownsellImage =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_5102692130479607016_y-TOJt6Qs82vuor2nqVUaOltvOGiMWBF.jpg"
const basicDownsellVideo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/El_mejor_pack_de_esta_deliciosa_brasile%C3%B1a_2026_brasileira_ruiva-p7wVl1yG2ssD4kRo2o52Esa1oW8QIa.mp4"

const translations = {
  en: {
    vip: "🎁 💎 Total VIP Album ⭐ BEST SELLER ⭐",
    vipDescription: "All albums included 🔥",
    basic: "📸 Basic package 🌸",
    basicDescription: "A few selected photos",
    exclusive: "🎬 Exclusive album 💎",
    exclusiveDescription: "Selected content for you",
    flash: "⚡ FLASH SALE, VALID UNTIL 11:00 PM 🔥 ⏰ ⌛ — LIMITED SPOTS FOR THE FIRST 100 💎",
    vipOffer: "VIP PACKAGE with 60% OFF 💎 🎁 + Bonus",
    firstAlbum: "special ON THE FIRST ALBUM! 📸",
    daily: "New content every day",
    photos: "Photos every day",
    gift: "Send a little gift",
    closeDetails: "Close package details",
    want: "I want this package",
    privateContent: "Private content",
    labels: { subscribeTo: "Get access to", emailLabel: "Email", emailPlaceholder: "you@example.com", emailHelp: "Your access details will be sent to this email.", enterEmail: "Enter a valid email.", continue: "Continue to payment", loading: "Loading…", processing: "Processing…", pay: "Pay securely", securedBy: "Secured by Stripe", checkDetails: "Check your payment details.", paymentFailed: "Payment failed. Please try again.", networkError: "Network error. Please try again.", somethingWrong: "Something went wrong. Please try again.", successTitle: "You’re in!", successBodyPre: "Your access is ready. Check ", successBodyPost: " for the details.", done: "Done", close: "Close" },
  },
  es: {
    vip: "🎁 💎 Álbum VIP total ⭐ MÁS VENDIDO ⭐", vipDescription: "Todos los álbumes incluidos 🔥", basic: "📸 Paquete básico 🌸", basicDescription: "Algunas fotos seleccionadas", exclusive: "🎬 Álbum exclusivo 💎", exclusiveDescription: "Contenido seleccionado para ti", flash: "⚡ OFERTA RELÁMPAGO, VÁLIDA HASTA LAS 23:00 🔥 ⏰ ⌛ — PLAZAS LIMITADAS PARA LOS PRIMEROS 100 💎", vipOffer: "PAQUETE VIP con 60% de DESCUENTO 💎 🎁 + Bono", firstAlbum: "especial EN EL PRIMER ÁLBUM! 📸", daily: "Contenido nuevo todos los días", photos: "Fotos todos los días", gift: "Enviar un regalito", closeDetails: "Cerrar detalles del paquete", want: "Quiero este paquete", privateContent: "Contenido privado", labels: { subscribeTo: "Obtén acceso a", emailLabel: "Correo electrónico", emailPlaceholder: "tu@ejemplo.com", emailHelp: "Los datos de acceso se enviarán a este correo.", enterEmail: "Introduce un correo válido.", continue: "Continuar al pago", loading: "Cargando…", processing: "Procesando…", pay: "Pagar de forma segura", securedBy: "Protegido por Stripe", checkDetails: "Revisa los datos de pago.", paymentFailed: "El pago falló. Inténtalo de nuevo.", networkError: "Error de red. Inténtalo de nuevo.", somethingWrong: "Algo salió mal. Inténtalo de nuevo.", successTitle: "¡Ya estás dentro!", successBodyPre: "Tu acceso está listo. Revisa ", successBodyPost: " para ver los detalles.", done: "Listo", close: "Cerrar" },
  },
  pt: {
    vip: "🎁 💎 Álbum VIP total ⭐ MAIS VENDIDO ⭐", vipDescription: "Todos os álbuns inclusos 🔥", basic: "📸 Pacote básico 🌸", basicDescription: "Poucas fotos selecionadas", exclusive: "🎬 Álbum exclusivo 💎", exclusiveDescription: "Conteúdo selecionado para você", flash: "⚡ PROMOÇÃO RELÂMPAGO, VÁLIDA ATÉ AS 23:00 🔥 ⏰ ⌛ — VAGAS LIMITADAS PARA OS 100 PRIMEIROS 💎", vipOffer: "PACOTE VIP com 60% OFF 💎 🎁 + Bônus", firstAlbum: "especial NO PRIMEIRO ÁLBUM! 📸", daily: "Conteúdo novo todos os dias", photos: "Fotos todos os dias", gift: "Enviar presentinho", closeDetails: "Fechar detalhes do pacote", want: "Quero este pacote", privateContent: "Conteúdo privado", labels: { subscribeTo: "Tenha acesso a", emailLabel: "E-mail", emailPlaceholder: "voce@exemplo.com", emailHelp: "Os dados de acesso serão enviados para este e-mail.", enterEmail: "Digite um e-mail válido.", continue: "Continuar para o pagamento", loading: "Carregando…", processing: "Processando…", pay: "Pagar com segurança", securedBy: "Protegido por Stripe", checkDetails: "Confira os dados do pagamento.", paymentFailed: "O pagamento falhou. Tente novamente.", networkError: "Erro de rede. Tente novamente.", somethingWrong: "Algo deu errado. Tente novamente.", successTitle: "Você conseguiu!", successBodyPre: "Seu acesso está pronto. Confira ", successBodyPost: " para ver os detalhes.", done: "Concluído", close: "Fechar" },
  },
} as const

type Locale = keyof typeof translations
type DisplayCurrency = "USD" | "BRL" | "CLP" | "EUR" | "GBP"

const currencyConfig: Record<DisplayCurrency, { locale: string; rate: number }> = {
  USD: { locale: "en-US", rate: 1 },
  BRL: { locale: "pt-BR", rate: 5.2 },
  CLP: { locale: "es-CL", rate: 950 },
  EUR: { locale: "de-DE", rate: 0.92 },
  GBP: { locale: "en-GB", rate: 0.79 },
}

const formatPrice = (usd: string, currency: DisplayCurrency) => {
  const amount = Number.parseFloat(usd.replace(/[^0-9.]/g, "")) * currencyConfig[currency].rate
  return new Intl.NumberFormat(currencyConfig[currency].locale, { style: "currency", currency, maximumFractionDigits: currency === "CLP" ? 0 : 2 }).format(amount)
}

const offers = [
  {
    id: "priv-vip",
    title: "🎁 💎 Total VIP Album ⭐ BEST SELLER ⭐",
    description: "All albums included 🔥",
    price: "$10.00",
    oldPrice: "$49.99",
    accent: "VIP",
    image: "/images/vip-album.png",
  },
  {
    id: "priv-basic",
    title: "📸 Basic package 🌸",
    description: "A few selected photos",
    price: "$3.60",
    accent: "BASIC",
    image: "/images/basic-package.png",
  },
  {
    id: "priv-exclusive",
    title: "🎬 Exclusive album 💎",
    description: "Selected content for you",
    price: "$9.00",
    accent: "EXCLUSIVE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%2810%29-Eh0BjwUidyxWt7bT3KyMIJUwUYMMu3.png",
  },
]

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function PrivEn4Page() {
  const { data: geo } = useSWR<{ country?: string }>("/api/geo", fetcher)
  const [locale, setLocale] = useState<Locale>("en")
  const [currency, setCurrency] = useState<DisplayCurrency>("USD")
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[number] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | null>(null)
  const [showDownsell, setShowDownsell] = useState<"vip" | "basic" | "exclusive" | "exit" | false>(false)

  const t = translations[locale]
  const exitOfferShown = useRef(false)

  useEffect(() => {
    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 0 && !exitOfferShown.current && !selectedOffer && !showDownsell) {
        exitOfferShown.current = true
        setShowDownsell("exit")
      }
    }
    document.addEventListener("mouseout", handleExitIntent)
    return () => document.removeEventListener("mouseout", handleExitIntent)
  }, [selectedOffer, showDownsell])

  useEffect(() => {
    const language = navigator.language.toLowerCase()
    const region = (geo?.country || navigator.language.split("-")[1] || "").toUpperCase()
    setLocale(language.startsWith("pt") ? "pt" : language.startsWith("es") ? "es" : "en")
    setCurrency(region === "BR" ? "BRL" : region === "CL" ? "CLP" : region === "PT" || region === "ES" || region === "FR" || region === "DE" ? "EUR" : region === "GB" ? "GBP" : "USD")
  }, [geo?.country])

  const localizedOffers = useMemo(() => offers.map((offer) => ({
    ...offer,
    title: offer.id === "priv-vip" ? t.vip : offer.id === "priv-basic" ? t.basic : t.exclusive,
    description: offer.id === "priv-vip" ? t.vipDescription : offer.id === "priv-basic" ? t.basicDescription : t.exclusiveDescription,
    price: formatPrice(offer.price, currency),
    oldPrice: offer.oldPrice ? formatPrice(offer.oldPrice, currency) : undefined,
  })), [t, currency])

  const handleOfferClick = (offer: (typeof offers)[number]) => {
    setSelectedOffer(offer)
    setPaymentMethod(null)
  }

  const openPayment = () => {
    // A página /priv usa sempre PIX direto, sem formulário de e-mail.
    setPaymentMethod("stripe")
  }

  const closeCheckout = () => {
    setSelectedOffer(null)
    setPaymentMethod(null)
    setShowDownsell(false)
  }

  const dismissCheckout = () => {
    const shouldOfferDownsell = paymentMethod === "stripe"
      ? selectedOffer?.id === "priv-vip" ? "vip" : selectedOffer?.id === "priv-basic" ? "basic" : selectedOffer?.id === "priv-exclusive" ? "exclusive" : false
      : false
    setSelectedOffer(null)
    setPaymentMethod(null)
    setShowDownsell(shouldOfferDownsell)
  }

  const acceptDownsell = () => {
    const offerId = showDownsell === "basic" ? "priv-basic" : showDownsell === "exclusive" ? "priv-exclusive" : showDownsell === "exit" ? "priv-vip" : "priv-vip"
    const offer = localizedOffers.find((item) => item.id === offerId)
    if (!offer) return
    const isBasic = showDownsell === "basic"
    const isExclusive = showDownsell === "exclusive"
    setShowDownsell(false)
    setSelectedOffer({
      ...offer,
  id: "offer",
  price: formatPrice(isBasic ? "$2.99" : isExclusive ? "$6.00" : showDownsell === "exit" ? "$3.00" : "$5.00", currency),
  oldPrice: formatPrice(isBasic ? "$3.60" : isExclusive ? "$9.00" : "$10.00", currency),
    })
    setPaymentMethod("stripe")
  }

  return (
    <main className="min-h-screen bg-[#f3f6fc] px-4 py-7 text-[#07142f]">
      <section className="mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="relative z-10 h-[150px] overflow-visible bg-[#d8dce4]">
          <img src={coverImage} alt="Capa do perfil" width={720} height={150} fetchPriority="high" className="block h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
          <img
            src={profileImage}
            alt="Foto do perfil"
            width={104}
            height={104}
            className="absolute bottom-[-34px] left-1/2 z-20 h-[104px] w-[104px] -translate-x-1/2 rounded-full border-[7px] border-white object-cover shadow-sm"
          />
        </div>

        <div className="relative z-0 px-5 pb-7 pt-11 text-center font-sans sm:px-10">
          <h1 className="mx-auto max-w-[620px] text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[25px]">
            {t.flash}
          </h1>
          <p className="mt-3 text-[18px] font-semibold leading-tight sm:text-[22px]">{t.vipOffer}</p>
          <p className="mt-2 text-[17px] font-semibold sm:text-[20px]">{t.firstAlbum}</p>
          <p className="mt-4 text-[21px] font-semibold sm:text-[25px]">{t.daily}</p>
          <p className="mt-1 text-base font-normal">{t.photos}</p>

          <div className="mt-7 space-y-5 text-left">
            {localizedOffers.map((offer) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => handleOfferClick(offer)}
                className="group flex min-h-[76px] w-full items-center gap-3 rounded-2xl border border-black/[0.04] bg-white px-3.5 py-2.5 text-left shadow-[0_5px_18px_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.14)]"
              >
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    width={56}
                    height={56}
                    loading="lazy"
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


          </div>

          <p className="mt-8 text-2xl font-black text-[#f0008c]">Link Priv</p>
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
              alt={selectedOffer.title}
              width={720}
              height={288}
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
                  className="rounded-xl bg-[#00f58b] px-5 py-3 text-sm font-extrabold text-[#062a1a] shadow-[0_6px_16px_rgba(57,217,138,0.3)] transition hover:bg-[#24c477]"
                >
{t.want}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {showDownsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142f]/70 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="downsell-title">
          <div className="relative w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white text-[#07142f] shadow-2xl">
            <button type="button" onClick={() => setShowDownsell(false)} aria-label="Close special offer" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-xl text-white">×</button>
            <div className="relative flex h-64 items-end justify-center overflow-hidden bg-[#170b25] text-center text-white sm:h-72">
  {showDownsell === "basic" ? (
  <video
  src={basicDownsellVideo}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  aria-label="Exclusive video preview"
  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
  />
  ) : (
  <img
  src={vipDownsellImage}
  alt="VIP private offer preview"
  className="absolute inset-0 h-full w-full object-cover object-center"
  />
  )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0008c]">{showDownsell === "basic" ? "Your exclusive discount" : showDownsell === "exclusive" ? "VIP album upgrade" : showDownsell === "exit" ? "Wait — special exit offer" : "Your exclusive discount"}</p>
  <h2 id="downsell-title" className="mt-1 text-xl font-black sm:text-2xl">{showDownsell === "basic" ? "You unlocked 10 extra videos" : showDownsell === "exclusive" ? "Get the VIP album for less" : showDownsell === "exit" ? "Unlock the VIP album for only $3" : "Your VIP discount is ready"}</h2>
  <p className="mt-1 text-sm font-medium text-[#536078]">{showDownsell === "basic" ? "Enjoy 10 unique bonus videos with your package." : showDownsell === "exclusive" ? "You can upgrade to the complete VIP album at a special price." : "This special price is only available right now."}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#f0008c]/25 bg-[#fff1f9] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-[#536078]">Regular price</p><p className="text-lg font-bold text-[#536078] line-through">{formatPrice(showDownsell === "basic" ? "$3.60" : "$10.00", currency)}</p></div>
                  <div className="text-right"><p className="text-xs font-bold uppercase tracking-wider text-[#f0008c]">Today only</p><p className="text-3xl font-black text-[#f0008c]">{formatPrice(showDownsell === "basic" ? "$2.99" : showDownsell === "exclusive" ? "$6.00" : showDownsell === "exit" ? "$3.00" : "$5.00", currency)}</p></div>
                </div>
                <p className="mt-3 rounded-lg bg-[#f0008c] px-3 py-2 text-center text-sm font-black text-white">{showDownsell === "basic" ? "You save $0.61" : showDownsell === "exclusive" ? "You save $4.00 — 40% OFF" : showDownsell === "exit" ? "You save $7.00 — 70% OFF" : "You save $5.00 — 50% OFF"}</p>
              </div>
              <button type="button" onClick={acceptDownsell} className="w-full rounded-xl bg-[#00f58b] px-5 py-3.5 text-sm font-extrabold text-[#062a1a] shadow-[0_6px_16px_rgba(57,217,138,0.3)] transition hover:bg-[#24c477]">{showDownsell === "basic" ? `Yes, unlock 10 bonus videos for ${formatPrice("$2.99", currency)}` : showDownsell === "exclusive" ? `Yes, get the VIP album for ${formatPrice("$6.00", currency)} — save ${formatPrice("$4.00", currency)}` : showDownsell === "exit" ? `Yes, unlock VIP for ${formatPrice("$3.00", currency)}` : `Yes, unlock VIP for ${formatPrice("$5.00", currency)} — save ${formatPrice("$5.00", currency)}`}</button>
            </div>
          </div>
        </div>
      )}

      {selectedOffer && paymentMethod === "stripe" && (
        <StripeCheckoutModal
          plan={{ id: selectedOffer.id, name: selectedOffer.title, price: selectedOffer.price }}
          modelName={t.privateContent}
          colors={{ background: "#f3f6fc", text: "#07142f", subtext: "#536078", accent: "#00f58b", cardBg: "#ffffff" }}
          downsell={selectedOffer.id === "offer"}
          labels={t.labels}
          deliverable={{
            enabled: true,
            tier: selectedOffer.id === "priv-basic" || selectedOffer.id === "priv-basic-downsell" ? "low" : selectedOffer.id === "priv-exclusive" ? "medium" : "high",
            title: "Payment approved!",
            description: selectedOffer.id === "priv-basic"
              ? "Your basic access has been unlocked."
              : selectedOffer.id === "priv-exclusive"
                ? "Your medium access has been unlocked."
                : "Your high access has been unlocked.",
            buttonText: "Access your content",
            buttonUrl: selectedOffer.id === "priv-basic"
              ? "https://t.me/+7UKq9MZYma5iN2Ux"
              : selectedOffer.id === "priv-exclusive"
                ? "https://t.me/+2l9fejrVfcNmZDEx"
                : "https://t.me/+r1wJP767rDA0Mjcx",
          }}

          onClose={closeCheckout}
          onDismiss={dismissCheckout}
        />
      )}
    </main>
  )
}
