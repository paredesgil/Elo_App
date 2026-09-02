import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";

const statusLabel: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovada",
  recusado: "Recusada",
};

export default async function MinhasVisitasPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: solicitacoes } = await supabase
    .from("solicitacoes_visita")
    .select("id, data_pretendida, status, created_at, lojas!solicitacoes_visita_loja_destino_id_fkey(nome, cidade)")
    .eq("membro_id", membro.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Minhas solicitações</h1>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        {(!solicitacoes || solicitacoes.length === 0) && (
          <p className="text-sm text-graphite/50">Você ainda não solicitou nenhuma visita.</p>
        )}

        <div className="flex flex-col gap-2">
          {solicitacoes?.map((s) => {
            const loja = Array.isArray(s.lojas) ? s.lojas[0] : s.lojas;
            return (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-graphite/10 bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{loja?.nome}</p>
                  <p className="text-[12px] text-graphite/55">{loja?.cidade}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    s.status === "aprovado"
                      ? "bg-green-100 text-green-800"
                      : s.status === "recusado"
                      ? "bg-red-100 text-red-800"
                      : "bg-graphite/10 text-graphite/60"
                  }`}
                >
                  {statusLabel[s.status]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
