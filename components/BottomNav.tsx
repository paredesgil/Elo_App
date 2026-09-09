"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Building2, CalendarDays, User, ShieldCheck } from "lucide-react";

const itens = [
  { href: "/", label: "Início", icon: Home },
  { href: "/prestadores", label: "Prestadores", icon: Briefcase },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav({ mostrarPainel }: { mostrarPainel?: boolean }) {
  const pathname = usePathname();

  const links = mostrarPainel
    ? [...itens, { href: "/painel", label: "Painel", icon: ShieldCheck }]
    : itens;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-graphite/15 bg-off-white shadow-[0_-4px_16px_rgba(13,27,42,0.06)]">
      <div className="mx-auto flex max-w-lg justify-between px-1.5 py-1.5">
        {links.map((item) => {
          const ativo = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 transition ${
                ativo ? "bg-navy" : ""
              }`}
            >
              <Icon
                size={22}
                strokeWidth={ativo ? 2.4 : 1.8}
                className={ativo ? "text-gold" : "text-graphite/55"}
              />
              <span
                className={`text-[11.5px] font-semibold leading-none ${
                  ativo ? "text-off-white" : "text-graphite/55"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
