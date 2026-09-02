"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BotaoSair() {
  const router = useRouter();
  const supabase = createClient();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="w-full rounded-[10px] border border-graphite/20 py-3 text-[14px] font-semibold text-graphite/70"
    >
      Sair da conta
    </button>
  );
}
