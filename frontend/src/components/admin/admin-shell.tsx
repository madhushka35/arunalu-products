"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ChevronDown, LogOut, Menu, Search, X } from "lucide-react"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { activeAdminItem, adminNav, adminNavItems, type AdminNavItem } from "@/features/admin/nav"
import { sampleAdminUser as user } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

const ring = "outline-none focus-visible:ring-3 focus-visible:ring-teal/60"

function AdminLogo({ className }: { className?: string }) {
  return (
    <Link href="/admin" className={cn("inline-flex h-11 shrink-0 items-center rounded-md", ring, className)}>
      <Image src="/images/brand/arunalu-logo-dark.png" alt="Arunalu Products admin — dashboard" width={640} height={518} sizes="56px" className="h-full w-auto" />
    </Link>
  )
}

function Avatar({ dark, size = "md" }: { dark?: boolean; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" ? "size-8 text-xs" : "size-9 text-sm",
        dark ? "bg-navy text-white" : "bg-teal text-navy"
      )}
    >
      {user.initials}
    </span>
  )
}

/** Figma "Sidebar Item" (Default / Hover / Active) on Deep Navy. */
function NavLink({ item, active, onNavigate }: { item: AdminNavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-lg px-3.5 text-sm transition-colors",
        ring,
        active ? "bg-teal/16 text-white" : "text-white/72 hover:bg-white/7 hover:text-white"
      )}
    >
      <Icon aria-hidden className={cn("size-[18px] shrink-0", active ? "text-teal" : "text-white/60")} />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

function Sidebar({ active }: { active?: AdminNavItem }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 flex-col bg-navy px-4 pt-6 pb-5 text-white xl:flex">
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <AdminLogo />
        <span className="rounded-full border border-teal px-2.5 py-0.5 text-xs font-semibold text-teal">Admin</span>
      </div>
      <nav aria-label="Admin" className="-mx-1 flex-1 overflow-y-auto px-1 [scrollbar-width:thin]">
        {adminNav.map((g) => (
          <div key={g.label} className="flex flex-col gap-0.5">
            <p className="px-3.5 pt-3.5 pb-1.5 text-xs font-semibold tracking-wide text-white/40 uppercase">{g.label}</p>
            {g.items.map((i) => (
              <NavLink key={i.href} item={i} active={i === active} />
            ))}
          </div>
        ))}
      </nav>
      <div className="mt-3 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
        <Avatar />
        <Link href="/admin/profile" className={cn("flex min-w-0 flex-1 flex-col rounded-md", ring)}>
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span className="truncate text-xs text-white/55">{user.role}</span>
        </Link>
        <Link href="/admin/login" aria-label="Sign out" className={cn("flex size-11 items-center justify-center rounded-lg text-white/60 hover:bg-white/7 hover:text-white", ring)}>
          <LogOut aria-hidden className="size-[18px]" />
        </Link>
      </div>
    </aside>
  )
}

/** Figma "Admin Rail" (768–1279): 72px, 44px icon targets, tooltip labels. */
function Rail({ active }: { active?: AdminNavItem }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col items-center gap-1.5 bg-navy px-3.5 py-4 md:flex xl:hidden">
      <Link href="/admin" aria-label="Dashboard" className={cn("mb-4 flex size-10 items-center justify-center rounded-lg bg-teal font-heading text-lg font-bold text-navy", ring)}>
        A
      </Link>
      <nav aria-label="Admin" className="flex flex-1 flex-col items-center gap-1 overflow-y-auto [scrollbar-width:none]">
        {adminNavItems.map((i) => {
          const Icon = i.icon
          const on = i === active
          return (
            <Tooltip key={i.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={i.href}
                    aria-label={i.label}
                    aria-current={on ? "page" : undefined}
                    className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors", ring, on ? "bg-teal/16" : "hover:bg-white/7")}
                  />
                }
              >
                <Icon aria-hidden className={cn("size-5", on ? "text-teal" : "text-white/60")} />
              </TooltipTrigger>
              <TooltipContent side="right">{i.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
      <Link href="/admin/profile" aria-label={`${user.name} profile`} className={cn("mt-2 flex size-11 items-center justify-center rounded-full", ring)}>
        <Avatar />
      </Link>
    </aside>
  )
}

const iconBtn = cn("relative flex size-11 shrink-0 items-center justify-center rounded-full text-navy hover:bg-surface", ring)

function BellLink({ bordered }: { bordered?: boolean }) {
  return (
    <Link href="/admin/notifications" aria-label="Notifications, 3 unread" className={cn(iconBtn, bordered && "size-10 border border-line")}>
      <Bell aria-hidden className="size-[18px]" />
      <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-error ring-2 ring-white" />
    </Link>
  )
}

/** Figma "Admin Topbar" (desktop, 72px): global search, notifications, user. */
function DesktopTopbar() {
  return (
    <header className="sticky top-0 z-20 hidden h-[72px] items-center justify-between border-b border-line bg-white px-8 xl:flex">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-[380px]">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          aria-label="Search orders, products, inquiries"
          placeholder="Search orders, products, inquiries…"
          className="h-12 w-full rounded-md border border-line bg-white pr-4 pl-11 text-sm text-ink outline-none placeholder:text-ink-muted/80 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
        />
      </form>
      <div className="flex items-center gap-5">
        <BellLink bordered />
        <Link href="/admin/profile" className={cn("flex items-center gap-2.5 rounded-lg p-1", ring)}>
          <Avatar dark />
          <span className="flex flex-col">
            <span className="text-sm font-medium text-navy">{user.name}</span>
            <span className="text-xs text-ink-muted">{user.role}</span>
          </span>
          <ChevronDown aria-hidden className="size-4 text-ink-muted" />
        </Link>
      </div>
    </header>
  )
}

/** Tablet topbar (64px): page title, search, bell, profile. */
function TabletTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center gap-1 border-b border-line bg-white pr-3 pl-6 md:flex xl:hidden">
      <p className="flex-1 truncate font-heading text-lg font-bold text-navy">{title}</p>
      <BellLink />
      <Link href="/admin/profile" aria-label={`${user.name} profile`} className={iconBtn}>
        <Avatar dark size="sm" />
      </Link>
    </header>
  )
}

/** Figma "Admin Mobile Header" + "Navigation Drawer" (< 768). */
function MobileHeader({ active }: { active?: AdminNavItem }) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)
  const items = adminNavItems.filter((i) => i.mobile)
  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-1 border-b border-line bg-white pr-2 pl-1 md:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" aria-expanded={open} className={iconBtn}>
          <Menu aria-hidden className="size-[22px]" />
        </button>
        <Link href="/admin" className={cn("inline-flex h-10 items-center rounded-md", ring)}>
          <Image src="/images/brand/arunalu-logo-light.png" alt="Arunalu Products admin — dashboard" width={640} height={518} sizes="50px" className="h-full w-auto" />
        </Link>
        <span className="flex-1" />
        <BellLink />
        <Link href="/admin/profile" aria-label={`${user.name} profile`} className={iconBtn}>
          <Avatar dark size="sm" />
        </Link>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[312px] gap-0 border-0 bg-navy px-4 pt-2 pb-6 text-white data-[side=left]:w-[312px] data-[side=left]:border-r-0"
        >
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <SheetDescription className="sr-only">Admin navigation</SheetDescription>
          <div className="flex h-14 items-center justify-between">
            <AdminLogo />
            <SheetClose aria-label="Close menu" className={cn("flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10", ring)}>
              <X aria-hidden className="size-[22px]" />
            </SheetClose>
          </div>
          <nav aria-label="Admin" className="flex flex-col gap-0.5 pt-2">
            {items.map((i) => (
              <NavLink key={i.href} item={i} active={i === active} onNavigate={close} />
            ))}
          </nav>
          <p className="mt-auto pt-6 text-xs text-white/55">Users, roles and activity logs are available on tablet and desktop.</p>
        </SheetContent>
      </Sheet>
    </>
  )
}

/**
 * Admin layout from the Figma admin frames:
 * ≥ 1280 sidebar 280 + topbar 72; 768–1279 icon rail 72 + compact topbar;
 * < 768 mobile header + navigation drawer.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const active = activeAdminItem(pathname)
  return (
    <div className="flex min-h-dvh bg-surface">
      <a href="#admin-main" className="sr-only z-50 rounded-md bg-white px-4 py-2 text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Sidebar active={active} />
      <Rail active={active} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DesktopTopbar />
        <TabletTopbar title={active?.label ?? "Admin"} />
        <MobileHeader active={active} />
        <main id="admin-main" className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-8 md:gap-5 md:p-6 xl:gap-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
