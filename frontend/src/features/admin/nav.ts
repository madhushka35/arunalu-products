import {
  Activity,
  Bell,
  ClipboardList,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  Shield,
  SquarePen,
  Users,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = { label: string; href: string; icon: LucideIcon; mobile?: boolean }
export type AdminNavGroup = { label: string; items: AdminNavItem[] }

/** Figma "Admin Sidebar" groups. `mobile` = shown in the mobile navigation drawer. */
export const adminNav: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, mobile: true },
      { label: "Notifications", href: "/admin/notifications", icon: Bell, mobile: true },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package, mobile: true },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "News", href: "/admin/news", icon: FileText },
      { label: "Website Content", href: "/admin/content", icon: SquarePen, mobile: true },
    ],
  },
  {
    label: "Requests",
    items: [
      { label: "Order Requests", href: "/admin/orders", icon: ClipboardList, mobile: true },
      { label: "Export Inquiries", href: "/admin/export-inquiries", icon: Globe, mobile: true },
      { label: "Contact Inquiries", href: "/admin/contact-inquiries", icon: Mail, mobile: true },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Roles & Permissions", href: "/admin/roles", icon: Shield },
      { label: "Settings", href: "/admin/settings", icon: Settings, mobile: true },
      { label: "Activity Logs", href: "/admin/activity", icon: Activity },
    ],
  },
]

export const adminNavItems = adminNav.flatMap((g) => g.items)

/** Longest matching nav item for the current path ("/admin" only matches exactly). */
export function activeAdminItem(pathname: string) {
  return adminNavItems
    .filter((i) => (i.href === "/admin" ? pathname === "/admin" : pathname === i.href || pathname.startsWith(i.href + "/")))
    .sort((a, b) => b.href.length - a.href.length)[0]
}

/** Screens still to be built in Stage 7b–7e (shown as a labelled placeholder). */
export const pendingAdminScreens: Record<string, { title: string; stage: string }> = {
  products: { title: "Products", stage: "7b" },
  "products/new": { title: "Add product", stage: "7b" },
  categories: { title: "Product categories", stage: "7b" },
  orders: { title: "Order requests", stage: "7c" },
  "export-inquiries": { title: "Export inquiries", stage: "7c" },
  "contact-inquiries": { title: "Contact inquiries", stage: "7c" },
  gallery: { title: "Gallery", stage: "7d" },
  news: { title: "News", stage: "7d" },
  content: { title: "Website content", stage: "7d" },
  settings: { title: "Settings", stage: "7d" },
  users: { title: "Users", stage: "7e" },
  roles: { title: "Roles & permissions", stage: "7e" },
  activity: { title: "Activity logs", stage: "7e" },
  profile: { title: "My profile", stage: "7e" },
}
