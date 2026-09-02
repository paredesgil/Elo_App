"use client";

import { useState, useTransition } from "react";
import { cadastrarPrestador } from "../actions-negocios";

export function FormPrestador() {
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const res = await cadastrarPrestador(formData);
      if (res.error) {
        setErro(res.error);
      } else {
        setAberto(false);
      }
    });
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="mb-4 w-full rounded-[10px] bg-navy py-3 text-[14px] font-bold text-off-white"
      >
        Divulgar meu serviço
      </button>
    );
  }

  return (
    <form action={onSubmit} className="mb-5 flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
      <input name="nome" required placeholder="Nome do serviço" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="categoria" required placeholder="Categoria (ex: Advocacia, Elétrica)" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="cidade" placeholder="Cidade" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="whatsapp" placeholder="WhatsApp" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <textarea name="descricao" placeholder="Descrição" rows={2} className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />

      {erro && <p className="text-xs text-red-700">{erro}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="flex-1 rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white disabled:opacity-60">
          {pending ? "Enviando..." : "Enviar para aprovação"}
        </button>
        <button type="button" onClick={() => setAberto(false)} className="rounded-lg border border-graphite/20 px-4 text-[13px] text-graphite/70">
          Cancelar
        </button>
      </div>
    </form>
  );
}
