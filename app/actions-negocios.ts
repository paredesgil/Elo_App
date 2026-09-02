"use server";

import { revalidatePath } from "next/cache";
import { getMembroAtual } from "@/lib/membro";

export async function cadastrarPrestador(formData: FormData) {
  const { supabase, membro } = await getMembroAtual();
  if (!membro) return { error: "Não autenticado." };

  const { error } = await supabase.from("prestadores").insert({
    membro_id: membro.id,
    nome: formData.get("nome") as string,
    categoria: formData.get("categoria") as string,
    descricao: formData.get("descricao") as string,
    whatsapp: formData.get("whatsapp") as string,
    cidade: formData.get("cidade") as string,
  });

  if (error) return { error: "Não foi possível cadastrar." };

  revalidatePath("/prestadores");
  return { ok: true };
}

export async function cadastrarEmpresa(formData: FormData) {
  const { supabase, membro } = await getMembroAtual();
  if (!membro) return { error: "Não autenticado." };

  const { error } = await supabase.from("empresas").insert({
    membro_id: membro.id,
    nome: formData.get("nome") as string,
    categoria: formData.get("categoria") as string,
    descricao: formData.get("descricao") as string,
    whatsapp: formData.get("whatsapp") as string,
    site: formData.get("site") as string,
    cidade: formData.get("cidade") as string,
  });

  if (error) return { error: "Não foi possível cadastrar." };

  revalidatePath("/empresas");
  return { ok: true };
}
