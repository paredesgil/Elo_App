"use client";

import { useState, useTransition, useEffect } from "react";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import {
  criarConvite,
  atualizarStatusMembro,
  atualizarStatusPrestador,
  atualizarStatusEmpresa,
  responderSolicitacaoVisita,
  atribuirCargoAction,
  encerrarCargoAction,
} from "./actions";

type Convite = { id: string; codigo: string; status: string; validade: string; created_at: string };
type MembroPendente = { id: string; nome: string; whatsapp: string | null; created_at: string };
type ItemPendente = {
  id: string;
  nome: string;
  categoria: string;
  whatsapp: string | null;
  cidade: string | null;
  created_at: string;
};
type Solicitacao = {
  id: string;
  data_pretendida: string | null;
  mensagem: string | null;
  status: string;
  created_at: string;
  membros: { nome: string; whatsapp: string | null } | { nome: string; whatsapp: string | null }[];
};

type Aba = "convites" | "membros" | "prestadores" | "empresas" | "visitas" | "cargos";

const CARGOS_DISPONIVEIS = [
  "Venerável Mestre",
  "Secretário",
  "Chanceler",
  "Tesoureiro",
  "Primeiro Vigilante",
  "Segundo Vigilante",
  "Orador",
  "Chaveiro",
  "Outro",
];

type MembroAtivo = { id: string; nome: string };
type CargoAtual = { id: string; cargo: string; membro_id: string; gestao_inicio: string };

function nomeDoMembro(m: Solicitacao["membros"]) {
  return Array.isArray(m) ? m[0]?.nome : m.nome;
}

export function PainelClient({
  lojaId,
  nomeLoja,
  nomeMestre,
  convites,
  membrosPendentes,
  prestadoresPendentes,
  empresasPendentes,
  solicitacoes,
  membrosAtivos,
  cargosAtuais,
}: {
  lojaId: string;
  nomeLoja: string;
  nomeMestre: string;
  convites: Convite[];
  membrosPendentes: MembroPendente[];
  prestadoresPendentes: ItemPendente[];
  empresasPendentes: ItemPendente[];
  solicitacoes: Solicitacao[];
  membrosAtivos: MembroAtivo[];
  cargosAtuais: CargoAtual[];
}) {
  const [aba, setAba] = useState<Aba>("convites");
  const [pending, startTransition] = useTransition();
  const [novoCodigo, setNovoCodigo] = useState<string | null>(null);
  const [origemApp, setOrigemApp] = useState("");

  useEffect(() => {
    setOrigemApp(window.location.origin);
  }, []);
  const [cargoSelecionado, setCargoSelecionado] = useState(CARGOS_DISPONIVEIS[0]);
  const [membroSelecionado, setMembroSelecionado] = useState(membrosAtivos[0]?.id ?? "");

  const abas: { id: Aba; label: string; contagem: number }[] = [
    { id: "convites", label: "Convites", contagem: convites.length },
    { id: "membros", label: "Membros", contagem: membrosPendentes.length },
    { id: "prestadores", label: "Prestadores", contagem: prestadoresPendentes.length },
    { id: "empresas", label: "Empresas", contagem: empresasPendentes.length },
    { id: "visitas", label: "Visitas", contagem: solicitacoes.length },
    { id: "cargos", label: "Cargos", contagem: 0 },
  ];

  function gerarConvite() {
    startTransition(async () => {
      const res = await criarConvite(7);
      if ("codigo" in res) setNovoCodigo(res.codigo);
    });
  }

  return (
    <main className="min-h-screen bg-off-white">
      <header className="relative flex flex-col items-center gap-3 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={40} />
        <h1 className="font-serif text-xl font-semibold text-off-white">Painel do Mestre</h1>
        <p className="text-xs text-off-white/60">{nomeMestre}</p>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-graphite/10 bg-off-white px-4 py-2">
        {abas.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
              aba === a.id ? "bg-navy text-off-white" : "text-graphite/60"
            }`}
          >
            {a.label}
            {a.contagem > 0 && (
              <span
                className={`rounded-full px-1.5 text-[11px] ${
                  aba === a.id ? "bg-gold text-navy" : "bg-graphite/10 text-graphite"
                }`}
              >
                {a.contagem}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mx-auto max-w-lg px-5 py-6">
        {aba === "convites" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={gerarConvite}
              disabled={pending}
              className="rounded-[10px] bg-navy py-3 text-[14px] font-bold text-off-white disabled:opacity-60"
            >
              {pending ? "Gerando..." : "Gerar novo convite (7 dias)"}
            </button>

            {novoCodigo && (
              <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-center">
                <p className="text-[11px] text-graphite/60">Envie este código ao convidado:</p>
                <p className="mt-1 font-serif text-lg font-semibold tracking-wide text-navy">{novoCodigo}</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Você foi convidado para o Elo — rede exclusiva dos irmãos da ${nomeLoja}.\n\nAcesse o link e cadastre-se:\n${origemApp}/cadastro?convite=${novoCodigo}\n\nOu digite o código manualmente na tela de cadastro:\n${novoCodigo}`
                  )}`}
                  target="_blank"
                  className="mt-3 inline-block rounded-lg bg-[#25D366] px-4 py-2 text-[12.5px] font-bold text-white"
                >
                  Compartilhar no WhatsApp
                </a>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {convites.length === 0 && (
                <p className="text-sm text-graphite/50">Nenhum convite gerado ainda.</p>
              )}
              {convites.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-navy">{c.codigo}</p>
                    <p className="text-[11px] text-graphite/50">
                      Válido até {new Date(c.validade).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      c.status === "ativo"
                        ? "bg-green-100 text-green-800"
                        : c.status === "usado"
                        ? "bg-graphite/10 text-graphite/60"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status}
                  </span>
                  {c.status === "ativo" && (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Você foi convidado para o Elo — rede exclusiva dos irmãos da ${nomeLoja}.\n\nAcesse o link e cadastre-se:\n${origemApp}/cadastro?convite=${c.codigo}\n\nOu digite o código manualmente na tela de cadastro:\n${c.codigo}`
                      )}`}
                      target="_blank"
                      className="ml-2 shrink-0 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[11px] font-bold text-white"
                    >
                      Compartilhar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {aba === "membros" && (
          <div className="flex flex-col gap-2">
            {membrosPendentes.length === 0 && (
              <p className="text-sm text-graphite/50">Nenhum membro pendente de aprovação.</p>
            )}
            {membrosPendentes.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{m.nome}</p>
                  <p className="text-[11px] text-graphite/50">{m.whatsapp}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusMembro(m.id, "ativo"); })}
                    className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-off-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusMembro(m.id, "inativo"); })}
                    className="rounded-lg border border-graphite/20 px-3 py-1.5 text-[12px] text-graphite/70"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === "prestadores" && (
          <div className="flex flex-col gap-2">
            {prestadoresPendentes.length === 0 && (
              <p className="text-sm text-graphite/50">Nenhum prestador pendente.</p>
            )}
            {prestadoresPendentes.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{p.nome}</p>
                  <p className="text-[11px] text-graphite/50">{p.categoria} · {p.cidade}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusPrestador(p.id, "aprovado"); })}
                    className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-off-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusPrestador(p.id, "recusado"); })}
                    className="rounded-lg border border-graphite/20 px-3 py-1.5 text-[12px] text-graphite/70"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === "empresas" && (
          <div className="flex flex-col gap-2">
            {empresasPendentes.length === 0 && (
              <p className="text-sm text-graphite/50">Nenhuma empresa pendente.</p>
            )}
            {empresasPendentes.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{e.nome}</p>
                  <p className="text-[11px] text-graphite/50">{e.categoria} · {e.cidade}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusEmpresa(e.id, "aprovado"); })}
                    className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-off-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => startTransition(async () => { await atualizarStatusEmpresa(e.id, "recusado"); })}
                    className="rounded-lg border border-graphite/20 px-3 py-1.5 text-[12px] text-graphite/70"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === "visitas" && (
          <div className="flex flex-col gap-2">
            {solicitacoes.length === 0 && (
              <p className="text-sm text-graphite/50">Nenhuma solicitação de visita pendente.</p>
            )}
            {solicitacoes.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{nomeDoMembro(s.membros)}</p>
                  <p className="text-[11px] text-graphite/50">
                    {s.data_pretendida ? new Date(s.data_pretendida).toLocaleDateString("pt-BR") : "Data não informada"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startTransition(async () => { await responderSolicitacaoVisita(s.id, "aprovado"); })}
                    className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-off-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => startTransition(async () => { await responderSolicitacaoVisita(s.id, "recusado"); })}
                    className="rounded-lg border border-graphite/20 px-3 py-1.5 text-[12px] text-graphite/70"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {aba === "cargos" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
              <p className="text-[13px] font-semibold text-navy">Atribuir cargo</p>
              <select
                value={cargoSelecionado}
                onChange={(e) => setCargoSelecionado(e.target.value)}
                className="rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite"
              >
                {CARGOS_DISPONIVEIS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={membroSelecionado}
                onChange={(e) => setMembroSelecionado(e.target.value)}
                className="rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite"
              >
                {membrosAtivos.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
              <button
                disabled={pending || !membroSelecionado}
                onClick={() =>
                  startTransition(async () => {
                    await atribuirCargoAction(lojaId, membroSelecionado, cargoSelecionado);
                  })
                }
                className="rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white disabled:opacity-60"
              >
                {pending ? "Salvando..." : "Atribuir"}
              </button>
              <p className="text-[11px] text-graphite/50">
                Atribuir um cargo já ocupado encerra automaticamente a gestão anterior.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {cargosAtuais.length === 0 && (
                <p className="text-sm text-graphite/50">Nenhum cargo atribuído ainda.</p>
              )}
              {cargosAtuais.map((c) => {
                const nome = membrosAtivos.find((m) => m.id === c.membro_id)?.nome ?? "—";
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-graphite/10 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-navy">{c.cargo}</p>
                      <p className="text-[12px] text-graphite/55">{nome}</p>
                    </div>
                    <button
                      onClick={() => startTransition(async () => { await encerrarCargoAction(c.id); })}
                      className="rounded-lg border border-graphite/20 px-3 py-1.5 text-[12px] text-graphite/70"
                    >
                      Encerrar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
