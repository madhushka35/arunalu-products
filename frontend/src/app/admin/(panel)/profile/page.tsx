import type { Metadata } from "next"

import { ProfileEditor } from "@/components/admin/profile-editor"

export const metadata: Metadata = { title: "My profile" }

export default function Page() {
  return <ProfileEditor />
}
