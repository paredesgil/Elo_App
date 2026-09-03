"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function FormEvento({ lojaId }: { lojaId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const arquivo = formData.get("arte") as File | null;

    startTransition(async () => {
      let arteUrl: string | null = null;

      if (arquivo && arquivo.size > 0) {
        const caminho = `${lojaId}/${Date.now()}-${arquivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("eventos-arte")
          .upload(caminho, arquivo);

        if (uploadError) {
          setErro("Não foi possível enviar a arte. O evento não foi criado.");
          return;
        }

        const { data } = supabase.storage.from("eventos-arte").getPublicUrl(caminho);
        arteUrl = data.publicUrl;
      }

      const { error } = await supabase.from("eventos").insert({
        loja_id: lojaId,
        titulo: formData.get("titulo") as string,
        descricao: formData.get("descricao") as string,
        local: formData.get("local") as string,
        data_hora: formData.get("data_hora") as string,
        contato_responsavel: formData.get("contato_responsavel") as string,
        arte_url: arteUrl,
      });

      if (error) {
        setErro("Não foi possível criar o evento.");
        return;
      }

      form.reset();
      setAberto(false);
      router.refresh();
    });
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="mb-4 w-full rounded-[10px] bg-navy py-3 text-[14px] font-bold text-off-white"
      >
        Criar evento
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mb-5 flex flex-col gap-3 rounded-xl border border-graphite/10 bg-white p-4">
      <input name="titulo" required placeholder="Título do evento" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="local" placeholder="Local" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="data_hora" type="datetime-local" required className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <input name="contato_responsavel" placeholder="WhatsApp do responsável" className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />
      <textarea name="descricao" placeholder="Descrição" rows={2} className="border-0 border-b border-graphite/20 bg-transparent py-2 text-sm outline-none focus:border-gold" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-graphite">Arte do evento (opcional)</label>
        <input name="arte" type="file" accept="image/*" className="text-[13px] text-graphite/70" />
      </div>

      {erro && <p className="text-xs text-red-700">{erro}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="flex-1 rounded-lg bg-navy py-2.5 text-[13px] font-bold text-off-white disabled:opacity-60">
          {pending ? "Criando..." : "Criar evento"}
        </button>
        <button type="button" onClick={() => setAberto(false)} className="rounded-lg border border-graphite/20 px-4 text-[13px] text-graphite/70">
          Cancelar
        </button>
      </div>
    </form>
  );
}
