import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  const requestHeaders = await headers()
  const country = (requestHeaders.get("x-vercel-ip-country") || "").toUpperCase()
  return NextResponse.json({ country }, { headers: { "Cache-Control": "private, no-store" } })
}
