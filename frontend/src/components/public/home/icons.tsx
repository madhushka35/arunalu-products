import { Fish, Globe, Package, Scale, Sun, Truck } from "lucide-react"

import type { IconKey } from "@/features/home/content"

export const HOME_ICONS: Record<IconKey, React.ElementType> = {
  fish: Fish,
  sun: Sun,
  scale: Scale,
  package: Package,
  truck: Truck,
  globe: Globe,
}
