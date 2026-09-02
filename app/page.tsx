import { redirect } from "next/navigation";
import Link from "next/link";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BottomNav } from "@/components/BottomNav";

export default async function HomePage() {
  const { supabase, user, membro } = await getMembroAtual();

  if (!user) redirect("/login");

  if (!membro || membro.status !== "ativo") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-off-white p-6 text-center">
        <EloMark size={44} />
        <p className="font-serif text-lg text-navy">Cadastro em análise</p>
        <p className="max-w-xs text-sm text-graphite/60">
          Seu acesso está pendente de aprovação pelo Mestre da sua loja.
        </p>
      </main>
    );
  }

  const [{ data: eventos }, { data: prestadores }, { data: empresas }] = await Promise.all([
    supabase
      .from("eventos")
      .select("id, titulo, local, data_hora")
      .eq("loja_id", membro.loja_id)
      .gte("data_hora", new Date().toISOString())
      .order("data_hora", { ascending: true })
      .limit(3),
    supabase
      .from("prestadores")
      .select("id, nome, categoria, cidade")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("empresas")
      .select("id, nome, categoria, cidade")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <EloMark size={38} />
        <p className="text-xs text-off-white/60">Bem-vindo, {membro.nome.split(" ")[0]}</p>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-navy">Próximas ações</h2>
          <Link href="/eventos" className="text-xs font-medium text-gold">
            Ver todas
          </Link>
        </div>

        {(!eventos || eventos.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum evento programado no momento.</p>
        )}

        <div className="flex flex-col gap-2">
          {eventos?.map((e) => (
            <div key={e.id} className="rounded-xl border border-graphite/10 bg-white px-4 py-3">
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
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-navy">Prestadores em destaque</h2>
          <Link href="/prestadores" className="text-xs font-medium text-gold">
            Ver todos
          </Link>
        </div>

        {(!prestadores || prestadores.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum prestador cadastrado ainda.</p>
        )}

        <div className="flex flex-col gap-2">
          {prestadores?.map((p) => (
            <div key={p.id} className="rounded-xl border border-graphite/10 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-navy">{p.nome}</p>
              <p className="text-[12px] text-graphite/55">
                {p.categoria}
                {p.cidade ? ` · ${p.cidade}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-navy">Empresas de irmãos</h2>
          <Link href="/empresas" className="text-xs font-medium text-gold">
            Ver todas
          </Link>
        </div>

        {(!empresas || empresas.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhuma empresa cadastrada ainda.</p>
        )}

        <div className="flex flex-col gap-2">
          {empresas?.map((e) => (
            <div key={e.id} className="rounded-xl border border-graphite/10 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-navy">{e.nome}</p>
              <p className="text-[12px] text-graphite/55">
                {e.categoria}
                {e.cidade ? ` · ${e.cidade}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
