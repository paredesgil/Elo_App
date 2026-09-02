import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { solicitarVisita } from "../actions";

export default async function NovaVisitaPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: lojas } = await supabase
    .from("lojas")
    .select("id, nome, cidade, uf")
    .neq("id", membro.loja_id)
    .order("cidade");

  return (
    <main className="min-h-screen bg-off-white pb-16">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Solicitar visita</h1>
      </header>

      <form action={solicitarVisita} className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-graphite">Loja que deseja visitar</label>
          <select
            name="loja_id"
            required
            className="rounded-lg border border-graphite/20 bg-white px-3 py-2.5 text-sm text-graphite"
          >
            <option value="">Selecione...</option>
            {lojas?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome} — {l.cidade}/{l.uf}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-graphite">Data pretendida</label>
          <input
            type="date"
            name="data"
            className="rounded-lg border border-graphite/20 bg-white px-3 py-2.5 text-sm text-graphite"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-graphite">Mensagem (opcional)</label>
          <textarea
            name="mensagem"
            rows={3}
            className="rounded-lg border border-graphite/20 bg-white px-3 py-2.5 text-sm text-graphite"
          />
        </div>

        <button type="submit" className="rounded-[10px] bg-navy py-3.5 text-[14px] font-bold text-off-white">
          Enviar solicitação
        </button>
      </form>
    </main>
  );
}
