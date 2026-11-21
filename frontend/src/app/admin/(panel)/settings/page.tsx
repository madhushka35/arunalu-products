import type { Metadata } from "next"

import { SettingsEditor } from "@/components/admin/settings-editor"

export const metadata: Metadata = { title: "Website settings" }

export default function Page() {
  return <SettingsEditor />
}
