"use client";

import Link from "next/link";
import { useTransition } from "react";
import { marcarComoLida } from "./actions";

type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string | null;
  link: string | null;
  lida: boolean;
  created_at: string;
};

export function ItemNotificacao({ n }: { n: Notificacao }) {
  const [, startTransition] = useTransition();

  const conteudo = (
    <div
      onClick={() => !n.lida && startTransition(() => marcarComoLida(n.id))}
      className={`rounded-xl border p-4 ${
        n.lida ? "border-graphite/10 bg-white" : "border-gold/40 bg-gold/10"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-navy">{n.titulo}</p>
        {!n.lida && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />}
      </div>
      {n.mensagem && <p className="mt-1 text-[13px] text-graphite/70">{n.mensagem}</p>}
      <p className="mt-1.5 text-[11px] text-graphite/45">
        {new Date(n.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );

  return n.link ? (
    <Link href={n.link} onClick={() => !n.lida && startTransition(() => marcarComoLida(n.id))}>
      {conteudo}
    </Link>
  ) : (
    conteudo
  );
}
