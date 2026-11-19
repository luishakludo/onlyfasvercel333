import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAZIL_COUNTRY_CODE = "BR"
const BRAZIL_TELEGRAM_URL = "https://t.me/isabelaalbinabot"
const INTERNATIONAL_PAGE = "/priv-en8"

function getCountry(requestHeaders: Headers) {
  const countryHeaders = [
    "x-vercel-ip-country",
    "cf-ipcountry",
    "x-country-code",
    "x-country",
  ]

  for (const headerName of countryHeaders) {
    const value = requestHeaders.get(headerName)?.trim().toUpperCase()
    if (value && /^[A-Z]{2}$/.test(value)) return value
  }

  return null
}

export default async function Chat4RedirectPage() {
  const requestHeaders = await headers()
  const country = getCountry(requestHeaders)

  if (country === BRAZIL_COUNTRY_CODE) {
    redirect(BRAZIL_TELEGRAM_URL)
  }

  redirect(INTERNATIONAL_PAGE)
}
