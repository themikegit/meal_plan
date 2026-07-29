"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, CalendarDays, ShoppingBasket } from "lucide-react";
import { STR } from "@/lib/strings";

const TABS = [
  { href: "/meals", label: STR.meals, Icon: UtensilsCrossed },
  { href: "/week", label: STR.week, Icon: CalendarDays },
  { href: "/groceries", label: STR.groceries, Icon: ShoppingBasket },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Drill-in screens (recipe detail, add recipe) have their own sticky
  // action bar at the same fixed position — hide the tab bar there so it
  // doesn't paint over it.
  if (pathname.startsWith("/meals/")) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-divider)] bg-surface/95 backdrop-blur safe-pb"
      aria-label="Primary"
    >
      <ul className="mx-auto max-w-md grid grid-cols-3">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  active
                    ? "text-accent-2-700"
                    : "text-neutral-600 hover:text-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`flex items-center justify-center rounded-full px-3 py-1 transition-colors ${
                    active ? "bg-accent-2-200" : ""
                  }`}
                >
                  <Icon size={22} strokeWidth={2.75} />
                </span>
                <span>{label}</span>
                <span
                  className={`block h-[3px] rounded-full bg-accent-2-700 transition-all duration-200 ${
                    active ? "w-5" : "w-2.5 opacity-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
