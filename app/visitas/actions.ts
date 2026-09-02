"use server";

import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";

export async function solicitarVisita(formData: FormData) {
  const { supabase, membro } = await getMembroAtual();
  if (!membro) return;

  await supabase.from("solicitacoes_visita").insert({
    membro_id: membro.id,
    loja_destino_id: formData.get("loja_id") as string,
    data_pretendida: (formData.get("data") as string) || null,
    mensagem: formData.get("mensagem") as string,
  });

  redirect("/visitas");
}
