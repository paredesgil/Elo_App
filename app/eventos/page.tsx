import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { BottomNav } from "@/components/BottomNav";
import { RsvpButtons } from "./RsvpButtons";
import { FormEvento } from "./FormEvento";

export default async function EventosPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: eventos } = await supabase
    .from("eventos")
    .select("id, titulo, descricao, local, data_hora, arte_url, contato_responsavel")
    .eq("loja_id", membro.loja_id)
    .order("data_hora", { ascending: true });

  const { data: minhasConfirmacoes } = await supabase
    .from("eventos_confirmacoes")
    .select("evento_id, status")
    .eq("membro_id", membro.id);

  const mapaConfirmacoes = new Map(minhasConfirmacoes?.map((c) => [c.evento_id, c.status]));
  const podeGerenciar = membro.papel === "mestre" || membro.papel === "admin";

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="bg-gradient-to-br from-navy to-navy-2 px-6 py-8">
        <h1 className="font-serif text-xl font-semibold text-off-white">Eventos e ações</h1>
        <p className="mt-1 text-xs text-off-white/60">Almoços, encontros e confraternizações</p>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        {podeGerenciar && <FormEvento lojaId={membro.loja_id} />}

        {(!eventos || eventos.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum evento cadastrado ainda.</p>
        )}

        <div className="flex flex-col gap-2">
          {eventos?.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-xl border border-graphite/10 bg-white">
              {e.arte_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.arte_url} alt={e.titulo} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <p className="text-sm font-semibold text-navy">{e.titulo}</p>
                <p className="text-[12px] text-graphite/55">
                  {new Date(e.data_hora).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {e.local ? ` · ${e.local}` : ""}
                </p>
                {e.descricao && <p className="mt-1.5 text-[13px] text-graphite/70">{e.descricao}</p>}
                <RsvpButtons eventoId={e.id} statusAtual={mapaConfirmacoes.get(e.id) ?? null} />
                {e.contato_responsavel && (
                  <a
                    href={`https://wa.me/55${e.contato_responsavel.replace(/\D/g, "")}`}
                    target="_blank"
                    className="mt-2 inline-block text-[12px] font-semibold text-gold"
                  >
                    Falar com o responsável
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={podeGerenciar} />
    </main>
  );
}
