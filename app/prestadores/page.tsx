import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { BottomNav } from "@/components/BottomNav";
import { FormPrestador } from "./FormPrestador";

export default async function PrestadoresPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  const { data: prestadores } = await supabase
    .from("prestadores")
    .select("id, nome, categoria, descricao, whatsapp, cidade")
    .eq("status", "aprovado")
    .order("nome");

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="bg-gradient-to-br from-navy to-navy-2 px-6 py-8">
        <h1 className="font-serif text-xl font-semibold text-off-white">Prestadores de serviço</h1>
        <p className="mt-1 text-xs text-off-white/60">Indicados por irmãos da rede</p>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        <FormPrestador />

        {(!prestadores || prestadores.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum prestador aprovado ainda.</p>
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
