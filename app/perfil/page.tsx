import { redirect } from "next/navigation";
import Link from "next/link";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BottomNav } from "@/components/BottomNav";
import { BotaoSair } from "./BotaoSair";
import { Bell, ChevronRight, ClipboardList, HeartHandshake, MapPin, Send, Users } from "lucide-react";

const ITENS = [
  { href: "/membros", titulo: "Membros da loja", desc: "Irmãos, cargos e contatos", Icone: Users },
  { href: "/notificacoes", titulo: "Notificações", desc: "Avisos e novidades da sua loja", Icone: Bell },
  { href: "/lojas", titulo: "Lojas por região", desc: "Encontre lojas e seus horários", Icone: MapPin },
  { href: "/visitas/nova", titulo: "Solicitar visita a outra loja", desc: "Peça para visitar uma sessão", Icone: Send },
  { href: "/visitas", titulo: "Minhas solicitações", desc: "Acompanhe o status dos pedidos", Icone: ClipboardList },
];

export default async function PerfilPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");
  if (!membro) redirect("/login");

  const { data: loja } = await supabase
    .from("lojas")
    .select("nome, cidade, uf")
    .eq("id", membro.loja_id)
    .single();

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="flex flex-col items-center gap-3 bg-gradient-to-br from-navy to-navy-2 px-6 pb-10 pt-12">
        <EloMark size={44} />
        <p className="font-serif text-lg font-semibold text-off-white">{membro.nome}</p>
        <p className="text-xs text-off-white/60">
          {loja?.nome} · {loja?.cidade}/{loja?.uf}
        </p>
      </header>

      <section className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-6">
        <Link
          href="/apoiar"
          className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-gold to-gold-soft p-4 shadow-md shadow-gold/30 transition active:scale-[0.98]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold-soft">
            <HeartHandshake size={24} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold text-navy">Apoiar o Elo</span>
            <span className="block text-xs text-navy/70">Ajude a manter o app no ar com qualquer valor</span>
          </span>
          <ChevronRight size={20} className="text-navy/60" />
        </Link>

        <div className="mt-2 flex flex-col gap-2.5">
          {ITENS.map(({ href, titulo, desc, Icone }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3.5 rounded-2xl border border-graphite/10 bg-white p-3.5 shadow-sm transition active:scale-[0.98] active:bg-off-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
                <Icone size={20} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold text-navy">{titulo}</span>
                <span className="block text-xs text-graphite/55">{desc}</span>
              </span>
              <ChevronRight size={18} className="text-graphite/30" />
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <BotaoSair />
        </div>
      </section>

      <BottomNav mostrarPainel={membro.papel === "mestre" || membro.papel === "admin"} />
    </main>
  );
}
