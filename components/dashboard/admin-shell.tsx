"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SquaresFour,
  ChartLineUp,
  ArrowsClockwise,
  Funnel,
  ShoppingBagOpen,
  GlobeHemisphereWest,
  Megaphone,
  Package,
  GearSix,
  Bell,
  CaretDown,
} from "@phosphor-icons/react"

const NAV = [
  { icon: SquaresFour, label: "Visão geral", href: "/cliente/adm" },
  { icon: ChartLineUp, label: "Páginas", href: "/cliente/adm/paginas" },
  { icon: ArrowsClockwise, label: "Redirecionadores", href: "/cliente/adm/redirecionadores" },
  { icon: Funnel, label: "Funil de conversão", href: "/cliente/adm/funil" },
  { icon: ShoppingBagOpen, label: "Vendas", href: "/cliente/adm/pagamentos" },
  { icon: GlobeHemisphereWest, label: "Geografia", href: "/cliente/adm/paises" },
  { icon: Megaphone, label: "Aquisição", href: "/cliente/adm/aquisicao" },
  { icon: Package, label: "Produtos e planos", href: "/cliente/adm/modelos" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="analytics-app flex min-h-screen text-[#10233f]">
      <aside className="analytics-sidebar sticky top-0 hidden h-screen w-[238px] flex-col px-4 py-5 lg:flex">
        <Link href="/cliente/adm" className="mb-8 flex items-center gap-3 px-2">
          <div className="analytics-logo">K</div>
          <div>
            <p className="text-[15px] font-bold tracking-tight">Kane Analytics</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#71809a]">Control center</p>
          </div>
        </Link>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9ab0]">Workspace</p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return <Link key={item.label} href={item.href} className={`analytics-nav ${active ? "analytics-nav-active" : ""}`}><item.icon weight={active ? "fill" : "regular"} />{item.label}</Link>
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-[#e7edf5] pt-4">
          <Link href="/cliente/adm/configuracoes" className={`analytics-nav ${pathname.includes("configuracoes") ? "analytics-nav-active" : ""}`}><GearSix />Configurações</Link>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f5f8fc] p-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#10233f] text-sm font-bold text-white">AD</div>
            <div className="min-w-0"><p className="truncate text-xs font-bold">Administrador</p><p className="truncate text-[10px] text-[#8390a4]">admin@kane.com</p></div>
            <CaretDown className="ml-auto text-[#8c9ab0]" />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="analytics-header flex items-center justify-between px-5 py-4 lg:px-9">
          <div className="flex items-center gap-3 lg:hidden"><div className="analytics-logo size-9 text-sm">K</div><span className="font-bold">Kane Analytics</span></div>
          <div className="hidden text-sm text-[#8390a4] lg:block">Centro de controle <span className="mx-2">/</span> <span className="font-semibold text-[#10233f]">Visão geral</span></div>
          <div className="flex items-center gap-2"><button aria-label="Notificações" className="analytics-icon-button"><Bell /></button><button className="analytics-period">Últimos 30 dias <CaretDown /></button></div>
        </header>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-[#e7edf5] px-4 pb-3 lg:hidden">{NAV.map((item) => <Link key={item.label} href={item.href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold ${pathname === item.href ? "bg-[#eaf2ff] text-[#1769e0]" : "text-[#71809a]"}`}>{item.label}</Link>)}</nav>
        {children}
      </div>
    </div>
  )
}
