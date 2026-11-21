import { Suspense } from "react"
import type { Metadata } from "next"

import { OrderRequestFlow } from "@/components/public/inquiries/order-request-flow"
import { OrderRequestWithProduct } from "@/components/public/inquiries/order-request-with-product"

export const metadata: Metadata = {
  title: "Request an order",
  description:
    "Send a guest order request to Arunalu Products. No account or payment needed — our team contacts you to confirm availability and pricing.",
  alternates: { canonical: "/request-order" },
  robots: { index: false, follow: true },
}

/** Guest order request (also the header "Request a quote" destination). */
export default function RequestOrderPage() {
  return (
    <Suspense fallback={<OrderRequestFlow />}>
      <OrderRequestWithProduct />
    </Suspense>
  )
}
