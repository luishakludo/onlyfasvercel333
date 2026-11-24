"use client"

import { useState } from "react"
import Link from "next/link"
import { AdminShell } from "./admin-shell"
import { ChartLineUp, UsersThree, Eye, ArrowsClockwise, TelegramLogo, Cursor, ShoppingCart, CurrencyCircleDollar, TrendUp, TrendDown, ArrowUpRight, Funnel, MapPin, GlobeHemisphereWest, Sparkle } from "@phosphor-icons/react"

type Metric = { label: string; value: string; change: string; positive: boolean; icon: React.ElementType; tone: string }

const metrics: Metric[] = [
  { label: "Visitantes únicos", value: "0", change: "—", positive: true, icon: UsersThree, tone: "blue" },
  { label: "Visualizações", value: "0", change: "—", positive: true, icon: Eye, tone: "violet" },
  { label: "Redirecionamentos", value: "0", change: "—", positive: true, icon: ArrowsClockwise, tone: "cyan" },
  { label: "Enviados ao Telegram", value: "0", change: "—", positive: true, icon: TelegramLogo, tone: "sky" },
  { label: "Cliques nos planos", value: "0", change: "—", positive: true, icon: Cursor, tone: "indigo" },
  { label: "Checkouts iniciados", value: "0", change: "—", positive: true, icon: ShoppingCart, tone: "orange" },
  { label: "Vendas aprovadas", value: "0", change: "—", positive: true, icon: ChartLineUp, tone: "green" },
  { label: "Faturamento total", value: "R$ 0,00", change: "—", positive: true, icon: CurrencyCircleDollar, tone: "navy" },
]

const rows = [
  { page: "priv-en5", views: "0", clicks: "0", checkouts: "0", sales: "0", revenue: "R$ 0,00" },
  { page: "priv-en6", views: "0", clicks: "0", checkouts: "0", sales: "0", revenue: "R$ 0,00" },
  { page: "priv-en8", views: "0", clicks: "0", checkouts: "0", sales: "0", revenue: "R$ 0,00" },
]

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon
  return <div className="analytics-card analytics-card-hover p-4 sm:p-5"><div className="flex items-start justify-between"><div className={`analytics-metric-icon ${metric.tone}`}><Icon weight="fill" /></div><span className={`flex items-center gap-1 text-[11px] font-bold ${metric.positive ? "text-[#7b8aa0]" : "text-[#d15d67]"}`}>{metric.positive ? <TrendUp /> : <TrendDown />}{metric.change}</span></div><p className="mt-4 text-[25px] font-bold tracking-tight text-[#10233f]">{metric.value}</p><p className="mt-1 text-xs font-medium text-[#7b8aa0]">{metric.label}</p><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#edf2f8]"><div className={`h-full w-0 rounded-full bg-[#1769e0]`} /></div></div>
}

export function KaneDashboard() {
  const [period, setPeriod] = useState("Últimos 30 dias")
  return <AdminShell><main className="analytics-main px-4 py-6 sm:px-6 lg:px-9 lg:py-8"><div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1 text-[11px] font-bold text-[#1769e0]"><span className="size-1.5 rounded-full bg-[#1769e0]" />Dados em tempo real</div><h1 className="text-2xl font-bold tracking-tight text-[#10233f] sm:text-[30px]">Visão geral</h1><p className="mt-1 text-sm text-[#7b8aa0]">Acompanhe o desempenho de todo o seu ecossistema.</p></div><div className="flex items-center gap-2"><select aria-label="Período de análise" value={period} onChange={(e) => setPeriod(e.target.value)} className="analytics-select"><option>Hoje</option><option>Ontem</option><option>Últimos 7 dias</option><option>Últimos 30 dias</option><option>Últimos 90 dias</option><option>Este mês</option><option>Mês anterior</option></select><button className="analytics-refresh" aria-label="Atualizar dados"><ArrowsClockwise /></button></div></div>

<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>

<div className="mt-6 grid gap-5 xl:grid-cols-[1.65fr_1fr]"><section className="analytics-card p-5 sm:p-6"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-base font-bold">Desempenho do negócio</h2><p className="mt-1 text-xs text-[#8a98ab]">Visitantes, cliques e vendas no período selecionado</p></div><button className="analytics-outline-button">Comparar <ArrowUpRight /></button></div><div className="analytics-empty-chart"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf2ff] text-[#1769e0]"><ChartLineUp weight="bold" /></div><p className="mt-3 text-sm font-bold">Ainda não há dados para exibir</p><p className="mt-1 max-w-[260px] text-center text-xs leading-5 text-[#8a98ab]">Quando o primeiro evento for registrado, sua evolução aparecerá aqui.</p></div></section><section className="analytics-card p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-base font-bold">Funil de conversão</h2><p className="mt-1 text-xs text-[#8a98ab]">Progressão dos visitantes</p></div><Funnel className="text-[#1769e0]" /></div><div className="flex flex-col gap-3">{["Acessou a página", "Visualizou os planos", "Clicou em um plano", "Iniciou o checkout", "Pagamento aprovado"].map((label, i) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-[#53647c]">{i + 1}. {label}</span><span className="font-bold text-[#10233f]">0</span></div><div className="h-2 rounded-full bg-[#edf2f8]"><div className="h-full rounded-full bg-[#b9d2fa]" style={{ width: `${100 - i * 15}%`, opacity: 0.25 }} /></div></div>)}</div></section></div>

<div className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]"><section className="analytics-card overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf1f6] px-5 py-5 sm:px-6"><div><h2 className="text-base font-bold">Performance por página</h2><p className="mt-1 text-xs text-[#8a98ab]">Resultados das suas páginas de oferta</p></div><Link href="/cliente/adm/paginas" className="analytics-link">Ver detalhes <ArrowUpRight /></Link></div><div className="overflow-x-auto"><table className="analytics-table"><thead><tr><th>Página</th><th>Visualizações</th><th>Cliques</th><th>Checkouts</th><th>Vendas</th><th>Faturamento</th></tr></thead><tbody>{rows.map((row) => <tr key={row.page}><td><Link href="/cliente/adm/paginas" className="font-bold text-[#1769e0]">{row.page}</Link></td><td>{row.views}</td><td>{row.clicks}</td><td>{row.checkouts}</td><td>{row.sales}</td><td className="font-bold">{row.revenue}</td></tr>)}</tbody></table></div></section><section className="analytics-card p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-base font-bold">Top países</h2><p className="mt-1 text-xs text-[#8a98ab]">Visitantes por localização</p></div><MapPin className="text-[#1769e0]" /></div><div className="analytics-empty-small"><GlobeHemisphereWest /><p>Nenhum país identificado</p><span>Os dados aparecerão após os primeiros acessos.</span></div></section></div>

<div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#dceaff] bg-[#f4f8ff] px-5 py-4"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#dceaff] text-[#1769e0]"><Sparkle weight="fill" /></div><div><p className="text-xs font-bold text-[#1b4f9e]">Comece a coletar dados</p><p className="mt-0.5 text-xs text-[#6680a6]">Instale o script de tracking nas suas páginas para acompanhar métricas reais neste painel.</p></div><Link href="/cliente/adm/configuracoes" className="ml-auto hidden text-xs font-bold text-[#1769e0] sm:block">Configurar <ArrowUpRight className="inline" /></Link></div>
</main></AdminShell>
}
