"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/", label: "Início" },
  { href: "/prestadores", label: "Prestadores" },
  { href: "/empresas", label: "Empresas" },
  { href: "/eventos", label: "Eventos" },
  { href: "/perfil", label: "Perfil" },
];

export function BottomNav({ mostrarPainel }: { mostrarPainel?: boolean }) {
  const pathname = usePathname();

  const links = mostrarPainel
    ? [...itens, { href: "/painel", label: "Painel" }]
    : itens;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-graphite/10 bg-off-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg justify-between px-2 py-2">
        {links.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 rounded-lg py-2 text-center text-[11px] font-medium transition ${
                ativo ? "bg-navy text-off-white" : "text-graphite/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
