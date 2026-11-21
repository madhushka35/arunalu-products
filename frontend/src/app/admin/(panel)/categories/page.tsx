import type { Metadata } from "next"

import { CategoriesManager } from "@/components/admin/categories-manager"
import { adminCategories } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "Product categories" }

export default function AdminCategoriesPage() {
  return <CategoriesManager categories={adminCategories} />
}
