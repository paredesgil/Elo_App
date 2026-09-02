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

export default async function MembrosPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: membros } = await supabase
    .from("membros")
    .select("id, nome, grau, whatsapp, papel")
    .eq("loja_id", membro.loja_id)
    .eq("status", "ativo")
    .order("nome");

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Membros da loja</h1>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        {(!membros || membros.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhum membro ativo ainda.</p>
        )}

        <div className="flex flex-col gap-2">
          {membros?.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-graphite/10 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-navy">{m.nome}</p>
                <p className="text-[12px] text-graphite/55">
                  {papelLabel[m.papel] ?? m.papel}
                  {m.grau ? ` · ${m.grau}` : ""}
                </p>
              </div>
              {m.id !== membro.id && m.whatsapp && (
                <a
                  href={`https://wa.me/55${m.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  className="rounded-full bg-gold/15 px-3.5 py-1.5 text-[12px] font-semibold text-gold"
                >
                  WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
