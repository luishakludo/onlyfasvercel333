/**
 * Fonte da verdade dos planos de assinatura (valores em centavos de USD).
 * O servidor SEMPRE usa estes valores — o cliente só envia o id do plano,
 * nunca o preço, evitando manipulação de valores.
 */
export type StripePlan = {
  id: string
  name: string
  productName: string
  amountCents: number
  intervalCount: number
}

export const STRIPE_PLANS: Record<string, StripePlan> = {
  "1m": {
    id: "1m",
    name: "1 Month",
    productName: "Subscription — 1 Month",
    amountCents: 500, // $5.00
    intervalCount: 1,
  },
  "3m": {
    id: "3m",
    name: "3 Months",
    productName: "Subscription — 3 Months",
    amountCents: 2500, // $25.00
    intervalCount: 3,
  },
  "6m": {
    id: "6m",
    name: "6 Months",
    productName: "Subscription — 6 Months",
    amountCents: 4100, // $41.00
    intervalCount: 6,
  },
}

STRIPE_PLANS["priv-basic"] = {
  id: "priv-basic",
  name: "Basic package",
  productName: "Priv — Basic package",
  amountCents: 360,
  intervalCount: 1,
}
STRIPE_PLANS["priv-exclusive"] = {
  id: "priv-exclusive",
  name: "Exclusive album",
  productName: "Priv — Exclusive album",
  amountCents: 1000,
  intervalCount: 1,
}
STRIPE_PLANS["priv-vip"] = {
  id: "priv-vip",
  name: "Total VIP album",
  productName: "Priv — Total VIP album",
  amountCents: 1000,
  intervalCount: 1,
}
STRIPE_PLANS["priv-vip-downsell"] = {
  id: "priv-vip-downsell",
  name: "Total VIP album — special offer",
  productName: "Priv — Total VIP album — special offer",
  amountCents: 500,
  intervalCount: 1,
}
STRIPE_PLANS["priv-exclusive-downsell"] = {
  id: "priv-exclusive-downsell",
  name: "Exclusive album — special offer",
  productName: "Priv — Exclusive album — special offer",
  amountCents: 600,
  intervalCount: 1,
}
STRIPE_PLANS["priv-basic-downsell"] = {
  id: "priv-basic-downsell",
  name: "Basic package — exclusive offer",
  productName: "Priv — Basic package — exclusive offer",
  amountCents: 299,
  intervalCount: 1,
}

export function getStripePlan(id: string): StripePlan | undefined {
  return STRIPE_PLANS[id]
}
