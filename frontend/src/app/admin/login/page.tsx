import type { Metadata } from "next"
import Image from "next/image"

import { AdminLoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = { title: "Sign in" }

/** Figma "Admin – 01 Login": brand panel (desktop) + sign-in card. Staff only — no customer accounts. */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh bg-white">
      <aside className="hidden w-[640px] shrink-0 flex-col justify-between bg-gradient-to-b from-ocean to-navy p-16 text-white xl:flex">
        <Image src="/images/brand/arunalu-logo-dark.png" alt="Arunalu Products" width={640} height={518} sizes="90px" className="h-[72px] w-auto self-start" priority />
        <div className="flex flex-col gap-4">
          <p className="type-overline text-teal">Admin dashboard</p>
          <p className="max-w-[480px] font-heading text-[40px] leading-[1.15] font-bold">Manage products, order requests and export inquiries.</p>
        </div>
        <p className="text-xs text-white/50">Authorised staff only. Customers do not have accounts.</p>
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-surface px-5 py-10 xl:bg-white">
        <Image src="/images/brand/arunalu-logo-light.png" alt="Arunalu Products" width={640} height={518} sizes="80px" className="h-16 w-auto xl:hidden" priority />
        <div className="flex w-full max-w-[440px] flex-col gap-5 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(11,31,51,0.08)] md:p-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-[28px] leading-tight font-bold text-navy">Sign in</h1>
            <p className="text-sm text-ink-muted">Use your Arunalu Products admin account.</p>
          </div>
          <AdminLoginForm />
        </div>
        <p className="text-center text-xs text-ink-muted xl:hidden">Authorised staff only. Customers do not have accounts.</p>
      </main>
    </div>
  )
}
