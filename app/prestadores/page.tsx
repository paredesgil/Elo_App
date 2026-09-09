import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { FormPrestador } from "./FormPrestador";

export default async function PrestadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  const params = await searchParams;
  const categoriaFiltro = params.categoria || "";

  const { data: todasCategorias } = await supabase
    .from("prestadores")
    .select("categoria")
    .eq("status", "aprovado");

  const categorias = Array.from(
    new Set((todasCategorias ?? []).map((c) => c.categoria).filter(Boolean))
  ).sort();

  let query = supabase
    .from("prestadores")
    .select("id, nome, categoria, descricao, whatsapp, cidade")
    .eq("status", "aprovado")
    .order("nome");
  if (categoriaFiltro) query = query.eq("categoria", categoriaFiltro);
  const { data: prestadores } = await query;

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <PageHeader title="Prestadores de serviço" subtitle="Indicados por irmãos da rede" />

      <section className="mx-auto max-w-lg px-5 py-6">
        <FormPrestador />

        {categorias.length > 0 && (
          <form className="mb-4 flex gap-2">
            <select
              name="categoria"
              defaultValue={categoriaFiltro}
              className="flex-1 rounded-lg border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="rounded-lg bg-navy px-4 text-[13px] font-bold text-off-white">
              Filtrar
            </button>
          </form>
        )}

        {(!prestadores || prestadores.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum prestador encontrado.</p>
        )}

        <div className="flex flex-col gap-2">
          {prestadores?.map((p) => (
            <div key={p.id} className="rounded-xl border border-graphite/10 bg-white p-4">
              <p className="text-sm font-semibold text-navy">{p.nome}</p>
              <p className="text-[12px] text-graphite/55">
                {p.categoria}
                {p.cidade ? ` · ${p.cidade}` : ""}
              </p>
              {p.descricao && <p className="mt-1.5 text-[13px] text-graphite/70">{p.descricao}</p>}
              {p.whatsapp && (
                <a
                  href={`https://wa.me/55${p.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  className="mt-2 inline-block text-[12px] font-semibold text-gold"
                >
                  Chamar no WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro?.papel === "mestre" || membro?.papel === "admin"} />
    </main>
  );
}
