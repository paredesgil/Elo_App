import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PainelClient } from "./PainelClient";

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membro } = await supabase
    .from("membros")
    .select("id, nome, papel, loja_id, status")
    .eq("auth_user_id", user.id)
    .single();

  if (!membro || !["mestre", "admin"].includes(membro.papel)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-off-white p-6">
        <p className="max-w-sm text-center text-sm text-graphite/70">
          Esta área é restrita ao Mestre ou administrador da loja.
        </p>
      </main>
    );
  }

  const { data: loja } = await supabase.from("lojas").select("nome").eq("id", membro.loja_id).single();

  const [{ data: convites }, { data: membrosPendentes }, { data: prestadoresPendentes }, { data: empresasPendentes }, { data: solicitacoes }, { data: membrosAtivos }, { data: cargosAtuais }] =
    await Promise.all([
      supabase
        .from("convites")
        .select("id, codigo, status, validade, created_at")
        .eq("loja_id", membro.loja_id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("membros")
        .select("id, nome, whatsapp, created_at")
        .eq("loja_id", membro.loja_id)
        .eq("status", "pendente"),
      supabase
        .from("prestadores")
        .select("id, nome, categoria, whatsapp, cidade, created_at, membro_id, membros!prestadores_membro_id_fkey(loja_id)")
        .eq("status", "pendente")
        .eq("membros.loja_id", membro.loja_id),
      supabase
        .from("empresas")
        .select("id, nome, categoria, whatsapp, cidade, created_at, membro_id, membros!empresas_membro_id_fkey(loja_id)")
        .eq("status", "pendente")
        .eq("membros.loja_id", membro.loja_id),
      supabase
        .from("solicitacoes_visita")
        .select("id, data_pretendida, mensagem, status, created_at, membro_id, membros!solicitacoes_visita_membro_id_fkey(nome, whatsapp)")
        .eq("loja_destino_id", membro.loja_id)
        .eq("status", "pendente"),
      supabase
        .from("membros")
        .select("id, nome")
        .eq("loja_id", membro.loja_id)
        .eq("status", "ativo")
        .order("nome"),
      supabase
        .from("cargos_loja")
        .select("id, cargo, membro_id, gestao_inicio")
        .eq("loja_id", membro.loja_id)
        .is("gestao_fim", null),
    ]);

  return (
    <PainelClient
      lojaId={membro.loja_id}
      nomeLoja={loja?.nome ?? "sua loja"}
      nomeMestre={membro.nome}
      convites={convites ?? []}
      membrosPendentes={membrosPendentes ?? []}
      prestadoresPendentes={prestadoresPendentes ?? []}
      empresasPendentes={empresasPendentes ?? []}
      solicitacoes={solicitacoes ?? []}
      membrosAtivos={membrosAtivos ?? []}
      cargosAtuais={cargosAtuais ?? []}
    />
  );
}
