"use client";

import { useState } from "react";

const CHAVE_PIX = "pix@eloapp.com.br";

export function ChavePix() {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(CHAVE_PIX);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="w-full rounded-xl border border-gold/30 bg-gold/10 p-5">
      <p className="mb-2 text-xs font-semibold text-graphite/60">Chave PIX</p>
      <p className="rounded-lg bg-white px-3 py-2.5 font-mono text-sm text-navy">
        {CHAVE_PIX}
      </p>
      <button
        onClick={copiar}
        className={`mt-3 w-full rounded-lg py-2.5 text-[13px] font-bold transition ${
          copiado ? "bg-green-600 text-white" : "bg-navy text-off-white"
        }`}
      >
        {copiado ? "Copiado!" : "Copiar chave PIX"}
      </button>
      <p className="mt-3 text-[11px] text-graphite/50">
        Cole a chave no app do seu banco e envie o valor que desejar.
      </p>
    </div>
  );
}
