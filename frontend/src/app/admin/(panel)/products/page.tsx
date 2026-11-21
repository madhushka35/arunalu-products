import type { Metadata } from "next"

import { ProductsManager } from "@/components/admin/products-manager"
import { adminProducts } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "Products" }

export default function AdminProductsPage() {
  return <ProductsManager products={adminProducts} />
}
