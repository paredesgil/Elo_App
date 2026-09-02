"use server";

import { revalidatePath } from "next/cache";
import { getMembroAtual } from "@/lib/membro";

export async function confirmarPresenca(eventoId: string, status: "confirmado" | "recusado") {
  const { supabase, membro } = await getMembroAtual();
  if (!membro) return { error: "Não autenticado." };

  const { error } = await supabase
    .from("eventos_confirmacoes")
    .upsert({ evento_id: eventoId, membro_id: membro.id, status });

  if (error) return { error: "Não foi possível confirmar." };

  revalidatePath("/eventos");
  return { ok: true };
}
