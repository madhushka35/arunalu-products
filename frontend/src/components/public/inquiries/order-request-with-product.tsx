"use client"

import { useSearchParams } from "next/navigation"

import { OrderRequestFlow } from "@/components/public/inquiries/order-request-flow"
import { findProduct } from "@/features/products/catalog"

/** Reads ?product=<slug> from product cards / details and preselects it. */
export function OrderRequestWithProduct() {
  const product = findProduct(useSearchParams().get("product") ?? "")
  return <OrderRequestFlow key={product?.slug ?? "none"} initialProduct={product?.slug} />
}
