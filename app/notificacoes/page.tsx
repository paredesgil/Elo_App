import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { ItemNotificacao } from "./ItemNotificacao";

export default async function NotificacoesPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: notificacoes } = await supabase
    .from("notificacoes")
    .select("id, titulo, mensagem, link, lida, created_at")
    .eq("membro_id", membro.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Notificações</h1>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        {(!notificacoes || notificacoes.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhuma notificação por enquanto.</p>
        )}

        <div className="flex flex-col gap-2">
          {notificacoes?.map((n) => (
            <ItemNotificacao key={n.id} n={n} />
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
