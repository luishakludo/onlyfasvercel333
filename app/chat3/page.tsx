import { headers } from "next/headers"
import { redirect } from "next/navigation"

function getCountryFromAcceptLanguage(value: string | null) {
  const match = value?.match(/[-_]([A-Za-z]{2})(?:[,;]|$)/)
  return match?.[1]?.toUpperCase() ?? ""
}

export default async function Chat3RedirectPage() {
  const requestHeaders = await headers()
  const country = (
    requestHeaders.get("x-vercel-ip-country") ||
    getCountryFromAcceptLanguage(requestHeaders.get("accept-language"))
  ).toUpperCase()

  if (country === "BR") {
    redirect("https://t.me/isabelaalbinabot")
  }

  redirect("/priv-en6")
}
