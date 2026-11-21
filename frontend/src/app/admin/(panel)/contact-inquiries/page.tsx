import type { Metadata } from "next"

import { RequestsList } from "@/components/admin/requests-list"
import { adminRequests } from "@/features/admin/requests"

export const metadata: Metadata = { title: "Contact inquiries" }

export default function Page() {
  return <RequestsList kind="contact" rows={adminRequests.contact} />
}
