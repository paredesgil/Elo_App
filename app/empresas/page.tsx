import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { BottomNav } from "@/components/BottomNav";
import { FormEmpresa } from "./FormEmpresa";

export default async function EmpresasPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  const { data: empresas } = await supabase
    .from("empresas")
    .select("id, nome, categoria, descricao, whatsapp, site, cidade")
    .eq("status", "aprovado")
    .order("nome");

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="bg-gradient-to-br from-navy to-navy-2 px-6 py-8">
        <h1 className="font-serif text-xl font-semibold text-off-white">Empresas de membros</h1>
        <p className="mt-1 text-xs text-off-white/60">Negócios de irmãos da rede</p>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        <FormEmpresa />

        {(!empresas || empresas.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhuma empresa aprovada ainda.</p>
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
