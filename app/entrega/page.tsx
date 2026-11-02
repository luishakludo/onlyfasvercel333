import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento aprovado | Acesso liberado',
  description: 'Seu pagamento foi aprovado. Acesse seu produto pelo botão abaixo.',
}

const accessUrls = {
  'priv-en5': 'https://t.me/+ZPkv-9wuams2OWMx',
  'priv-en6': 'https://t.me/+r1wJP767rDA0Mjcx',
} as const

type Product = keyof typeof accessUrls

export default async function EntregaPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const params = await searchParams
  const product = params.product as Product
  const accessUrl = accessUrls[product] ?? accessUrls['priv-en5']
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#15181c] p-7 text-center shadow-2xl shadow-black/30 sm:p-10">
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
          Se o botão não abrir automaticamente, toque nele novamente para continuar no Telegram.
        </p>
      </section>
    </main>
  )
}
