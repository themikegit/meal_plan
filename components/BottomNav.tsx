"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, CalendarDays, ShoppingBasket } from "lucide-react";
import { useLang } from "./LangProvider";
import { t, tr } from "@/lib/i18n";

const TABS = [
  { href: "/meals", key: "meals" as const, Icon: UtensilsCrossed },
  { href: "/week", key: "week" as const, Icon: CalendarDays },
  { href: "/groceries", key: "groceries" as const, Icon: ShoppingBasket },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useLang();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-divider)] bg-surface/95 backdrop-blur safe-pb"
      aria-label="Primary"
    >
      <ul className="mx-auto max-w-md grid grid-cols-3">
        {TABS.map(({ href, key, Icon }) => {
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
                <span>{tr(t[key], lang)}</span>
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
