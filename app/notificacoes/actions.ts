"use server";

import { revalidatePath } from "next/cache";
import { getMembroAtual } from "@/lib/membro";

export async function marcarComoLida(id: string) {
  const { supabase } = await getMembroAtual();
  await supabase.from("notificacoes").update({ lida: true }).eq("id", id);
  revalidatePath("/notificacoes");
}

export async function marcarTodasComoLidas() {
  const { supabase, membro } = await getMembroAtual();
  if (!membro) return;
  await supabase.from("notificacoes").update({ lida: true }).eq("membro_id", membro.id).eq("lida", false);
  revalidatePath("/notificacoes");
}
