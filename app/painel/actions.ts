"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function gerarCodigoConvite() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem caracteres ambíguos
  let sufixo = "";
  for (let i = 0; i < 6; i++) {
    sufixo += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ELO-${sufixo}`;
}

export async function criarConvite(diasValidade: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: membro } = await supabase
    .from("membros")
    .select("id, loja_id, papel")
    .eq("auth_user_id", user.id)
    .single();

  if (!membro || !["mestre", "admin"].includes(membro.papel)) {
    return { error: "Sem permissão para gerar convites." };
  }

  const validade = new Date();
  validade.setDate(validade.getDate() + diasValidade);

  const { data, error } = await supabase
    .from("convites")
    .insert({
      codigo: gerarCodigoConvite(),
      loja_id: membro.loja_id,
      criado_por: membro.id,
      validade: validade.toISOString(),
    })
    .select("codigo")
    .single();

  if (error) return { error: "Não foi possível gerar o convite." };

  revalidatePath("/painel");
  return { codigo: data.codigo };
}

export async function atualizarStatusMembro(membroId: string, status: "ativo" | "inativo") {
  const supabase = await createClient();
  const { error } = await supabase.from("membros").update({ status }).eq("id", membroId);
  if (error) return { error: "Não foi possível atualizar o membro." };
  revalidatePath("/painel");
  return { ok: true };
}

export async function atualizarStatusPrestador(id: string, status: "aprovado" | "recusado") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: membro } = await supabase
    .from("membros")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  const { error } = await supabase
    .from("prestadores")
    .update({ status, aprovado_por: membro?.id })
    .eq("id", id);

  if (error) return { error: "Não foi possível atualizar o prestador." };
  revalidatePath("/painel");
  return { ok: true };
}

export async function atualizarStatusEmpresa(id: string, status: "aprovado" | "recusado") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: membro } = await supabase
    .from("membros")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  const { error } = await supabase
    .from("empresas")
    .update({ status, aprovado_por: membro?.id })
    .eq("id", id);

  if (error) return { error: "Não foi possível atualizar a empresa." };
  revalidatePath("/painel");
  return { ok: true };
}

export async function responderSolicitacaoVisita(id: string, status: "aprovado" | "recusado") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: membro } = await supabase
    .from("membros")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  const { error } = await supabase
    .from("solicitacoes_visita")
    .update({ status, respondido_por: membro?.id })
    .eq("id", id);

  if (error) return { error: "Não foi possível atualizar a solicitação." };
  revalidatePath("/painel");
  return { ok: true };
}

export async function atribuirCargoAction(lojaId: string, membroId: string, cargo: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("atribuir_cargo", {
    p_loja_id: lojaId,
    p_membro_id: membroId,
    p_cargo: cargo,
  });
  if (error) return { error: "Não foi possível atribuir o cargo." };
  revalidatePath("/painel");
  revalidatePath("/membros");
  return { ok: true, data };
}

export async function encerrarCargoAction(cargoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cargos_loja")
    .update({ gestao_fim: new Date().toISOString().slice(0, 10) })
    .eq("id", cargoId);
  if (error) return { error: "Não foi possível encerrar o cargo." };
  revalidatePath("/painel");
  revalidatePath("/membros");
  return { ok: true };
}
