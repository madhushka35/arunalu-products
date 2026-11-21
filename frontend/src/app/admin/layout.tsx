import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { isAdminPreviewEnabled } from "@/features/admin/access"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Arunalu Admin" },
  robots: { index: false, follow: false },
}

/**
 * Admin preview gate (Stage 7). There is no authentication until the Laravel
 * backend exists, so /admin is a 404 outside development unless
 * ADMIN_PREVIEW=true. Real authorization will be enforced server-side.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminPreviewEnabled()) notFound()
  return children
}
