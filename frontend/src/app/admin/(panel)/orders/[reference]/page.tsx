import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { RequestDetails } from "@/components/admin/request-details"
import { adminRequests, findRequest } from "@/features/admin/requests"

type Props = { params: Promise<{ reference: string }> }

export function generateStaticParams() {
  return adminRequests.order.map((r) => ({ reference: r.reference }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await params).reference }
}

export default async function Page({ params }: Props) {
  const request = findRequest("order", (await params).reference)
  if (!request) notFound()
  return <RequestDetails request={request} />
}
