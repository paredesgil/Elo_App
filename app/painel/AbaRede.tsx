"use client";

import { useState, useTransition } from "react";
import { criarPotenciaAction, criarLojaAction } from "./actions";

type Potencia = { id: string; nome: string; sigla: string | null };
type Loja = { id: string; nome: string; cidade: string; uf: string };

export function AbaRede({ potencias, lojas }: { potencias: Potencia[]; lojas: Loja[] }) {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  function onSubmitPotencia(formData: FormData) {
    setErro(null);
    setSucesso(null);
    startTransition(async () => {
      const res = await criarPotenciaAction(
        formData.get("nome") as string,
        formData.get("sigla") as string
      );
      if (res.error) setErro(res.error);
      else setSucesso("Potência cadastrada.");
    });
  }

  function onSubmitLoja(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await criarLojaAction({
        nome: formData.get("nome") as string,
        numero: formData.get("numero") as string,
        cidade: formData.get("cidade") as string,
        uf: formData.get("uf") as string,
        endereco: formData.get("endereco") as string,
        dia_reuniao: formData.get("dia_reuniao") as string,
        horario_reuniao: formData.get("horario_reuniao") as string,
        contato_secretario: formData.get("contato_secretario") as string,
        potencia_id: formData.get("potencia_id") as string,
      });
      if (res.error) setErro(res.error);
      else {
        setSucesso("Loja cadastrada.");
        e.currentTarget.reset();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {erro && <p className="text-xs text-red-700">{erro}</p>}
      {sucesso && <p className="text-xs text-green-700">{sucesso}</p>}

      <div className="flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
        <p className="text-[13px] font-semibold text-navy">Cadastrar potência</p>
        <form action={onSubmitPotencia} className="flex flex-col gap-3">
          <input name="nome" required placeholder="Nome (ex: Grande Oriente do Brasil)" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <input name="sigla" placeholder="Sigla (ex: GOB)" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <button type="submit" disabled={pending} className="rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white disabled:opacity-60">
            {pending ? "Salvando..." : "Cadastrar potência"}
          </button>
        </form>

        <div className="mt-1 flex flex-col gap-1">
          {potencias.length === 0 && <p className="text-[12px] text-graphite/50">Nenhuma potência cadastrada.</p>}
          {potencias.map((p) => (
            <p key={p.id} className="text-[12px] text-graphite/60">{p.nome} {p.sigla ? `(${p.sigla})` : ""}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
        <p className="text-[13px] font-semibold text-navy">Cadastrar loja</p>
        <form onSubmit={onSubmitLoja} className="flex flex-col gap-3">
          <input name="nome" required placeholder="Nome da loja" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <input name="numero" placeholder="Número" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input name="cidade" required placeholder="Cidade" className="flex-1 rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
            <input name="uf" required placeholder="UF" maxLength={2} className="w-16 rounded-lg border border-graphite/20 px-3 py-2 text-sm uppercase" />
          </div>
          <input name="endereco" placeholder="Endereço" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input name="dia_reuniao" placeholder="Dia de reunião" className="flex-1 rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
            <input name="horario_reuniao" placeholder="Horário" className="w-28 rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          </div>
          <input name="contato_secretario" placeholder="WhatsApp do secretário" className="rounded-lg border border-graphite/20 px-3 py-2 text-sm" />
          <select name="potencia_id" className="rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite">
            <option value="">Sem potência definida</option>
            {potencias.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <button type="submit" disabled={pending} className="rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white disabled:opacity-60">
            {pending ? "Salvando..." : "Cadastrar loja"}
          </button>
        </form>

        <div className="mt-1 flex flex-col gap-1">
          {lojas.length === 0 && <p className="text-[12px] text-graphite/50">Nenhuma outra loja cadastrada.</p>}
          {lojas.map((l) => (
            <p key={l.id} className="text-[12px] text-graphite/60">{l.nome} — {l.cidade}/{l.uf}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
