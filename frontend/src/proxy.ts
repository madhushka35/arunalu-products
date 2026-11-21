import { NextResponse, type NextRequest } from "next/server"

import { isAdminPreviewEnabled } from "@/features/admin/access"

/**
 * Stage 7 admin preview gate: when the preview is off, every /admin request
 * (pages and RSC payloads) is answered with the 404 page before anything
 * renders. Real authentication (Laravel session + role checks) replaces this
 * in Stage 9.
 */
export function proxy(request: NextRequest) {
  if (!isAdminPreviewEnabled()) {
    return NextResponse.rewrite(new URL("/__admin-unavailable", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
