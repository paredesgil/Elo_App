"use client";

import { useState } from "react";

const CHAVE_PIX = "2ff7343a-980d-41f9-b7f7-92e7e0cff507";
const PIX_COPIA_E_COLA =
  "00020126580014br.gov.bcb.pix01362ff7343a-980d-41f9-b7f7-92e7e0cff5075204000053039865802BR5903ELO6007CORUMBA62070503***6304761C";

function BotaoCopiar({ texto, rotulo, primario }: { texto: string; rotulo: string; primario?: boolean }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copie o texto abaixo:", texto);
    }
  }

  return (
    <button
      onClick={copiar}
      className={`w-full rounded-lg py-2.5 text-[13px] font-bold transition ${
        copiado
          ? "bg-green-600 text-white"
          : primario
            ? "bg-navy text-off-white"
            : "border border-navy/30 bg-white text-navy"
      }`}
    >
      {copiado ? "Copiado!" : rotulo}
    </button>
  );
}

export function ChavePix() {
  return (
    <div className="w-full rounded-xl border border-gold/30 bg-gold/10 p-5">
      <div className="mb-4 flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/qr-pix.png"
          alt="QR Code PIX para apoiar o Elo"
          width={208}
          height={208}
          className="rounded-lg bg-white p-2"
        />
        <p className="text-[11px] text-graphite/60">Aponte a câmera do app do seu banco</p>
      </div>

      <p className="mb-2 text-xs font-semibold text-graphite/60">Chave PIX (aleatória)</p>
      <p className="break-all rounded-lg bg-white px-3 py-2.5 font-mono text-sm text-navy">{CHAVE_PIX}</p>

      <div className="mt-3 flex flex-col gap-2">
        <BotaoCopiar texto={CHAVE_PIX} rotulo="Copiar chave PIX" primario />
        <BotaoCopiar texto={PIX_COPIA_E_COLA} rotulo="Copiar PIX copia e cola" />
      </div>

      <p className="mt-3 text-[11px] text-graphite/50">
        Escaneie o QR Code ou cole a chave no app do seu banco e envie o valor que desejar.
      </p>
    </div>
  );
}
