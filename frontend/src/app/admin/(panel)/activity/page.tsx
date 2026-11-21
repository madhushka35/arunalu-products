import type { Metadata } from "next"

import { ActivityLog } from "@/components/admin/activity-log"
import { activityLog } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "Activity logs" }

export default function Page() {
  return <ActivityLog entries={activityLog} />
}
