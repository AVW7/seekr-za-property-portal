"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Users, FileText, UserCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/agent",
    icon: LayoutDashboard,
  },
  {
    title: "Listings",
    href: "/agent/listings",
    icon: Building2,
  },
  {
    title: "Leads",
    href: "/agent/leads",
    icon: Users,
  },
  {
    title: "Agency",
    href: "/agent/agency",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/agent/profile",
    icon: UserCircle,
  },
]

export function AgentNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {sidebarNavItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
