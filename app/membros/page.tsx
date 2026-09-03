import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";

const papelLabel: Record<string, string> = {
  mestre: "Mestre",
  admin: "Administrador",
  membro: "Membro",
};

export default async function MembrosPage({
  searchParams,
}: {
  searchParams: Promise<{ potencia?: string; loja?: string }>;
}) {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const params = await searchParams;

  const { data: potencias } = await supabase.from("potencias").select("id, nome").order("nome");

  let lojasQuery = supabase.from("lojas").select("id, nome, cidade, uf, potencia_id").order("nome");
  if (params.potencia) lojasQuery = lojasQuery.eq("potencia_id", params.potencia);
  const { data: lojas } = await lojasQuery;

  const lojaIdFiltro = params.loja || undefined;
  const lojaIds = lojaIdFiltro
    ? [lojaIdFiltro]
    : lojas?.map((l) => l.id) ?? [membro.loja_id];

  const { data: membros } = await supabase
    .from("membros")
    .select("id, nome, grau, whatsapp, papel, loja_id")
    .in("loja_id", lojaIds.length ? lojaIds : [membro.loja_id])
    .eq("status", "ativo")
    .order("nome");

  const { data: cargos } = await supabase
    .from("cargos_loja")
    .select("membro_id, cargo")
    .is("gestao_fim", null)
    .in("loja_id", lojaIds.length ? lojaIds : [membro.loja_id]);

  const mapaCargos = new Map(cargos?.map((c) => [c.membro_id, c.cargo]));
  const mapaLojas = new Map(lojas?.map((l) => [l.id, l]));

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Diretório de irmãos</h1>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        <form className="mb-5 flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Potência</label>
            <select
              name="potencia"
              defaultValue={params.potencia ?? ""}
              className="rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite"
            >
              <option value="">Todas</option>
              {potencias?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Loja</label>
            <select
              name="loja"
              defaultValue={params.loja ?? ""}
              className="rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite"
            >
              <option value="">Todas</option>
              {lojas?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nome} — {l.cidade}/{l.uf}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white">
            Filtrar
          </button>
        </form>

        {(!membros || membros.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum membro encontrado com esse filtro.</p>
        )}

        <div className="flex flex-col gap-2">
          {membros?.map((m) => {
            const cargo = mapaCargos.get(m.id);
            const loja = mapaLojas.get(m.loja_id);
            return (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-graphite/10 bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{m.nome}</p>
                  <p className="text-[12px] text-graphite/55">
                    {cargo ?? papelLabel[m.papel] ?? m.papel}
                    {m.grau ? ` · ${m.grau}` : ""}
                  </p>
                  {loja && !lojaIdFiltro && (
                    <p className="text-[11px] text-graphite/40">{loja.nome} — {loja.cidade}/{loja.uf}</p>
                  )}
                </div>
                {m.id !== membro.id && m.whatsapp && (
                  <a
                    href={`https://wa.me/55${m.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    className="shrink-0 rounded-full bg-gold/15 px-3.5 py-1.5 text-[12px] font-semibold text-gold"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
