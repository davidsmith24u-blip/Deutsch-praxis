"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic, AlertTriangle, LayoutDashboard } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/units", label: "Units", icon: BookOpen },
  { href: "/interview", label: "Speak", icon: Mic },
  { href: "/mistakes", label: "Mistakes", icon: AlertTriangle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden"
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[56px] min-w-[56px] flex-col items-center justify-center gap-1 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}