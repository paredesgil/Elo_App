import { createClient } from "@/lib/supabase/server";

export async function getMembroAtual() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, membro: null };

  const { data: membro } = await supabase
    .from("membros")
    .select("id, nome, papel, loja_id, status, whatsapp")
    .eq("auth_user_id", user.id)
    .single();

  return { supabase, user, membro };
}
