import type { Metadata } from "next"

import { RolesManager } from "@/components/admin/roles-manager"

export const metadata: Metadata = { title: "Roles & permissions" }

export default function Page() {
  return <RolesManager />
}
