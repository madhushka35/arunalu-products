import { TriangleAlert } from "lucide-react"

import { AdminShell } from "@/components/admin/admin-shell"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <p className="flex items-start gap-2 rounded-lg border border-warning/35 bg-warning/10 px-3.5 py-2.5 text-xs text-warning-strong">
        <TriangleAlert aria-hidden className="mt-px size-4 shrink-0" />
        Admin preview — sample data only. Not connected to the backend; no changes are saved and there is no sign-in yet.
      </p>
      {children}
    </AdminShell>
  )
}
