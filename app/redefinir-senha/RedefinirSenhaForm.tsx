"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const campo =
  "border-0 border-b-[1.5px] border-graphite/25 bg-transparent px-0.5 py-2.5 text-[14.5px] text-graphite outline-none focus:border-gold";

export function RedefinirSenhaForm() {
  const router = useRouter();
  const supabase = createClient();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [pronto, setPronto] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha.length < 8) return setErro("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== confirma) return setErro("As senhas não são iguais.");

    setCarregando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);

    if (error) {
      setErro("Não foi possível salvar a nova senha. Peça um novo link de recuperação.");
      return;
    }

    setPronto(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  if (pronto) {
    return <p className="py-6 text-center text-sm font-semibold text-green-700">Senha alterada! Entrando...</p>;
  }

  return (
    <form onSubmit={salvar} className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-xs font-semibold text-graphite">
          Nova senha
        </label>
        <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 8 caracteres" className={campo} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirma" className="text-xs font-semibold text-graphite">
          Repita a nova senha
        </label>
        <input id="confirma" type="password" required value={confirma} onChange={(e) => setConfirma(e.target.value)} placeholder="••••••••" className={campo} />
      </div>

      {erro && <p className="text-xs text-red-700">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="mt-2 rounded-[10px] bg-navy py-3.5 text-[14.5px] font-bold tracking-wide text-off-white disabled:opacity-60"
      >
        {carregando ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
