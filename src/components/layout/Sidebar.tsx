"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  CreditCard,
  CalendarDays,
  Target,
  TrendingUp,
  ShoppingCart,
  Smartphone,
  Rocket,
  Settings
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Income", href: "/income", icon: TrendingUp },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Budget", href: "/budget", icon: PieChart },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Bills", href: "/bills", icon: CalendarDays },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Grocery", href: "/grocery", icon: ShoppingCart },
  { name: "Mobile Plans", href: "/mobile-plans", icon: Smartphone },
  { name: "Future Plans", href: "/future-plans", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-card text-card-foreground">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-lg">Finance Center</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
