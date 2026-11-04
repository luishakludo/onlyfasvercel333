import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function NayanePage() {
  const requestHeaders = await headers()
  const country = (requestHeaders.get("x-vercel-ip-country") || "").toUpperCase()

  if (country === "BR") {
    redirect("https://t.me/negaalbinabot")
  }

  redirect("/priv-en4")
}
