"use client";

import { useTransition } from "react";
import { confirmarPresenca } from "./actions";

export function RsvpButtons({ eventoId, statusAtual }: { eventoId: string; statusAtual: string | null }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(async () => { await confirmarPresenca(eventoId, "confirmado"); })}
        className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
          statusAtual === "confirmado" ? "bg-navy text-off-white" : "border border-graphite/20 text-graphite/70"
        }`}
      >
        Vou participar
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(async () => { await confirmarPresenca(eventoId, "recusado"); })}
        className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
          statusAtual === "recusado" ? "bg-graphite/20 text-graphite" : "border border-graphite/20 text-graphite/70"
        }`}
      >
        Não vou
      </button>
    </div>
  );
}
