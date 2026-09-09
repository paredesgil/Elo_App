import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { ChavePix } from "./ChavePix";

export default async function ApoiarPage() {
  const { user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <PageHeader title="Apoiar o Elo" comVoltar />

      <section className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-8 text-center">
        <p className="text-sm leading-relaxed text-graphite/70">
          O Elo é mantido por contribuições voluntárias dos próprios irmãos. Qualquer valor ajuda a manter
          o app no ar.
        </p>

        <ChavePix />
      </section>

      <BottomNav mostrarPainel={membro?.papel === "mestre" || membro?.papel === "admin"} />
    </main>
  );
}
