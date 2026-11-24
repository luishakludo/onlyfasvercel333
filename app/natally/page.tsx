import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BRAZIL_DESTINATION = "https://t.me/albinaruivabot"
const INTERNATIONAL_DESTINATION = "/priv-en5"
const ALLOWED_EXTERNAL_HOSTS = new Set(["t.me"])

function getCountry(requestHeaders: Headers): string {
  // Vercel injects this header at the edge; do not trust visitor-controlled fallbacks.
  const value = requestHeaders.get("x-vercel-ip-country")?.trim().toUpperCase() ?? ""
  return /^[A-Z]{2}$/.test(value) ? value : ""
}

function isAllowedDestination(destination: string): boolean {
  if (destination === INTERNATIONAL_DESTINATION) return true

  try {
    const parsed = new URL(destination)
    return parsed.protocol === "https:" && ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname)
  } catch {
    return false
  }
}

export default async function NatallyRedirectPage() {
  let country = ""

  try {
    country = getCountry(await headers())
  } catch {
    console.warn(
      JSON.stringify({
        event: "natally_geo_unavailable",
        timestamp: new Date().toISOString(),
      }),
    )
  }

  const destination = country === "BR" ? BRAZIL_DESTINATION : INTERNATIONAL_DESTINATION
  const statusCode = 307

  console.info(
    JSON.stringify({
      event: "natally_redirect",
      timestamp: new Date().toISOString(),
      country: country || "unknown",
      destination: country === "BR" ? "telegram" : "international",
      statusCode,
    }),
  )

  if (!isAllowedDestination(destination)) {
    console.error(
      JSON.stringify({
        event: "natally_redirect_rejected",
        timestamp: new Date().toISOString(),
        country: country || "unknown",
        statusCode: 500,
      }),
    )
    throw new Error("Invalid configured Natally redirect destination")
  }

  redirect(destination)
}
