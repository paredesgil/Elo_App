import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { FormEmpresa } from "./FormEmpresa";

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  const params = await searchParams;
  const categoriaFiltro = params.categoria || "";

  const { data: todasCategorias } = await supabase
    .from("empresas")
    .select("categoria")
    .eq("status", "aprovado");

  const categorias = Array.from(
    new Set((todasCategorias ?? []).map((c) => c.categoria).filter(Boolean))
  ).sort();

  let query = supabase
    .from("empresas")
    .select("id, nome, categoria, descricao, whatsapp, site, cidade")
    .eq("status", "aprovado")
    .order("nome");
  if (categoriaFiltro) query = query.eq("categoria", categoriaFiltro);
  const { data: empresas } = await query;

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <PageHeader title="Empresas de membros" subtitle="Negócios de irmãos da rede" />

      <section className="mx-auto max-w-lg px-5 py-6">
        <FormEmpresa />

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

        {(!empresas || empresas.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhuma empresa encontrada.</p>
        )}

        <div className="flex flex-col gap-2">
          {empresas?.map((e) => (
            <div key={e.id} className="rounded-xl border border-graphite/10 bg-white p-4">
              <p className="text-sm font-semibold text-navy">{e.nome}</p>
              <p className="text-[12px] text-graphite/55">
                {e.categoria}
                {e.cidade ? ` · ${e.cidade}` : ""}
              </p>
              {e.descricao && <p className="mt-1.5 text-[13px] text-graphite/70">{e.descricao}</p>}
              <div className="mt-2 flex gap-3">
                {e.whatsapp && (
                  <a
                    href={`https://wa.me/55${e.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    className="text-[12px] font-semibold text-gold"
                  >
                    WhatsApp
                  </a>
                )}
                {e.site && (
                  <a href={e.site} target="_blank" className="text-[12px] font-semibold text-navy">
                    Site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro?.papel === "mestre" || membro?.papel === "admin"} />
    </main>
  );
}
