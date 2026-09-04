import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { ChavePix } from "./ChavePix";

export default async function ApoiarPage() {
  const { user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Apoiar o Elo</h1>
      </header>

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
