"use client"

import { useState } from "react"

type GiftModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (giftData: { senderName: string; message: string }) => void
  colors: {
    background: string
    text: string
    subtext: string
    accent: string
    cardBg: string
  }
}

export function GiftModal({ isOpen, onClose, onSubmit, colors }: GiftModalProps) {
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!senderName.trim()) {
      alert("Por favor, digite seu nome")
      return
    }
    
    if (!message.trim()) {
      alert("Por favor, digite uma mensagem")
      return
    }

    setLoading(true)
    onSubmit({ senderName: senderName.trim(), message: message.trim() })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[430px] overflow-hidden rounded-[26px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: colors.cardBg, color: colors.text }}
      >
        {/* Header com ícone de presente */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h2 id="gift-title" className="text-xl font-black text-white">
                Enviar Presentinho
              </h2>
              <p className="text-xs text-white/80">Mensagem personalizada para a modelo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xl text-white transition hover:bg-white/30"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Nome do remetente */}
          <div>
            <label
              htmlFor="senderName"
              className="block text-sm font-bold mb-2"
              style={{ color: colors.text }}
            >
              Seu nome
            </label>
            <input
              id="senderName"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Como você se chama?"
              maxLength={50}
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium transition focus:outline-none"
              style={{
                borderColor: colors.accent,
                backgroundColor: colors.background,
                color: colors.text,
              }}
            />
            <p className="mt-1 text-xs" style={{ color: colors.subtext }}>
              {senderName.length}/50 caracteres
            </p>
          </div>

          {/* Mensagem */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-bold mb-2"
              style={{ color: colors.text }}
            >
              Sua mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva uma mensagem personalizada..."
              maxLength={280}
              rows={5}
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium resize-none transition focus:outline-none"
              style={{
                borderColor: colors.accent,
                backgroundColor: colors.background,
                color: colors.text,
              }}
            />
            <p className="mt-1 text-xs" style={{ color: colors.subtext }}>
              {message.length}/280 caracteres
            </p>
          </div>

          {/* Info box */}
          <div
            className="rounded-lg border-l-4 p-3 text-xs"
            style={{
              borderLeftColor: colors.accent,
              backgroundColor: colors.background,
              color: colors.subtext,
            }}
          >
            <p className="font-semibold">💡 Dica:</p>
            <p className="mt-1">Quanto mais pessoal a mensagem, mais especial será o presentinho!</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition"
              style={{
                borderColor: colors.subtext,
                color: colors.text,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !senderName.trim() || !message.trim()}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition disabled:opacity-50"
              style={{
                backgroundColor: colors.accent,
              }}
            >
              {loading ? "Processando..." : "Continuar → Pagamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
