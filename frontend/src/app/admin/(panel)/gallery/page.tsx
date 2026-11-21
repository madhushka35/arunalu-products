import type { Metadata } from "next"

import { GalleryManager } from "@/components/admin/gallery-manager"
import { adminMedia } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "Gallery" }

export default function Page() {
  return <GalleryManager media={adminMedia} />
}
