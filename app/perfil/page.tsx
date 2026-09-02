import { redirect } from "next/navigation";
import Link from "next/link";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BottomNav } from "@/components/BottomNav";
import { BotaoSair } from "./BotaoSair";

export default async function PerfilPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: loja } = await supabase
    .from("lojas")
    .select("nome, cidade, uf")
    .eq("id", membro.loja_id)
    .single();

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="flex flex-col items-center gap-3 bg-gradient-to-br from-navy to-navy-2 px-6 pb-10 pt-12">
        <EloMark size={44} />
        <p className="font-serif text-lg font-semibold text-off-white">{membro.nome}</p>
        <p className="text-xs text-off-white/60">
          {loja?.nome} · {loja?.cidade}/{loja?.uf}
        </p>
        {membro.whatsapp && (
          <a
            href={`https://wa.me/55${membro.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="mt-1 flex items-center gap-1.5 rounded-full bg-gold/15 px-3.5 py-1.5 text-[12px] font-semibold text-gold"
          >
            Falar no WhatsApp
          </a>
        )}
      </header>

      <section className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-6">
        <Link
          href="/notificacoes"
          className="rounded-xl border border-graphite/10 bg-white px-4 py-3.5 text-[14px] font-semibold text-navy"
        >
          Notificações
        </Link>
        <Link
          href="/lojas"
          className="rounded-xl border border-graphite/10 bg-white px-4 py-3.5 text-[14px] font-semibold text-navy"
        >
          Lojas por região
        </Link>
        <Link
          href="/visitas/nova"
          className="rounded-xl border border-graphite/10 bg-white px-4 py-3.5 text-[14px] font-semibold text-navy"
        >
          Solicitar visita a outra loja
        </Link>
        <Link
          href="/visitas"
          className="rounded-xl border border-graphite/10 bg-white px-4 py-3.5 text-[14px] font-semibold text-navy"
        >
          Minhas solicitações
        </Link>
        <Link
          href="/apoiar"
          className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3.5 text-[14px] font-semibold text-navy"
        >
          Apoiar o Elo
        </Link>

        <div className="mt-4">
          <BotaoSair />
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
