"use client"

import { useSearchParams } from "next/navigation"

import { ExportInquiryForm } from "@/components/public/inquiries/export-inquiry-form"
import { findProduct } from "@/features/products/catalog"

/** Reads ?product=<slug> (from product pages) and preselects that product. */
export function ExportInquiryWithProduct() {
  const slug = useSearchParams().get("product") ?? ""
  const product = findProduct(slug)
  return <ExportInquiryForm key={product?.slug ?? "none"} preselected={product?.slug} />
}
