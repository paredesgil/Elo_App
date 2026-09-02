import { redirect } from "next/navigation";
import { getMembroAtual } from "@/lib/membro";
import { EloMark } from "@/components/EloMark";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";

type Loja = {
  id: string;
  nome: string;
  numero: string | null;
  cidade: string;
  uf: string;
  endereco: string | null;
  dia_reuniao: string | null;
  horario_reuniao: string | null;
  contato_secretario: string | null;
  latitude: number | null;
  longitude: number | null;
};

function mapaEmbedUrl(loja: Loja) {
  const query =
    loja.latitude && loja.longitude
      ? `${loja.latitude},${loja.longitude}`
      : encodeURIComponent(`${loja.endereco ?? ""} ${loja.cidade} ${loja.uf}`);
  return `https://maps.google.com/maps?q=${query}&z=14&output=embed`;
}

export default async function LojasPage() {
  const { supabase, user, membro } = await getMembroAtual();
  if (!user) redirect("/login");

  const { data: lojas } = await supabase
    .from("lojas")
    .select("id, nome, numero, cidade, uf, endereco, dia_reuniao, horario_reuniao, contato_secretario, latitude, longitude")
    .order("uf")
    .order("cidade");

  const porRegiao = new Map<string, Loja[]>();
  (lojas ?? []).forEach((l) => {
    const chave = l.uf;
    if (!porRegiao.has(chave)) porRegiao.set(chave, []);
    porRegiao.get(chave)!.push(l);
  });

  return (
    <main className="min-h-screen bg-off-white pb-24">
      <header className="relative flex flex-col items-center gap-2.5 bg-gradient-to-br from-navy to-navy-2 px-6 pb-8 pt-12">
        <BackButton light />
        <EloMark size={36} />
        <h1 className="font-serif text-lg font-semibold text-off-white">Lojas por região</h1>
      </header>

      <section className="mx-auto max-w-lg px-5 py-6">
        {(!lojas || lojas.length === 0) && (
          <p className="text-sm text-graphite/50">Nenhuma loja cadastrada ainda.</p>
        )}

        <div className="flex flex-col gap-6">
          {Array.from(porRegiao.entries()).map(([uf, lojasDaRegiao]) => (
            <div key={uf}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gold">{uf}</h2>
              <div className="flex flex-col gap-3">
                {lojasDaRegiao.map((l) => (
                  <div key={l.id} className="overflow-hidden rounded-xl border border-graphite/10 bg-white">
                    <iframe
                      src={mapaEmbedUrl(l)}
                      className="h-36 w-full border-0"
                      loading="lazy"
                      title={`Mapa — ${l.nome}`}
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-navy">
                        {l.nome} {l.numero ? `nº ${l.numero}` : ""}
                      </p>
                      <p className="text-[12px] text-graphite/55">{l.cidade}/{l.uf}</p>
                      {l.endereco && <p className="mt-1 text-[13px] text-graphite/70">{l.endereco}</p>}
                      {(l.dia_reuniao || l.horario_reuniao) && (
                        <p className="mt-1.5 text-[12px] text-graphite/60">
                          Reuniões: {l.dia_reuniao} {l.horario_reuniao ? `às ${l.horario_reuniao}` : ""}
                        </p>
                      )}
                      {l.contato_secretario && (
                        <a
                          href={`https://wa.me/55${l.contato_secretario.replace(/\D/g, "")}`}
                          target="_blank"
                          className="mt-2 inline-block text-[12px] font-semibold text-gold"
                        >
                          Contato do Secretário
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav mostrarPainel={membro?.papel === "mestre" || membro?.papel === "admin"} />
    </main>
  );
}
