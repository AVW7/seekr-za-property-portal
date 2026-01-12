"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calculator, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "BuyAbility", href: "/buyability", icon: Calculator },
  { label: "Saved", href: "/saved", icon: Heart },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
