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

  const [{ data: convites }, { data: membrosPendentes }, { data: prestadoresPendentes }, { data: empresasPendentes }, { data: solicitacoes }] =
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
        .select("id, nome, categoria, whatsapp, cidade, created_at, membro_id, membros!inner(loja_id)")
        .eq("status", "pendente")
        .eq("membros.loja_id", membro.loja_id),
      supabase
        .from("empresas")
        .select("id, nome, categoria, whatsapp, cidade, created_at, membro_id, membros!inner(loja_id)")
        .eq("status", "pendente")
        .eq("membros.loja_id", membro.loja_id),
      supabase
        .from("solicitacoes_visita")
        .select("id, data_pretendida, mensagem, status, created_at, membro_id, membros!inner(nome, whatsapp)")
        .eq("loja_destino_id", membro.loja_id)
        .eq("status", "pendente"),
    ]);

  return (
    <PainelClient
      nomeMestre={membro.nome}
      convites={convites ?? []}
      membrosPendentes={membrosPendentes ?? []}
      prestadoresPendentes={prestadoresPendentes ?? []}
      empresasPendentes={empresasPendentes ?? []}
      solicitacoes={solicitacoes ?? []}
    />
  );
}
