"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-graphite">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-xs font-semibold text-graphite">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
          className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
        />
      </div>

      {erro && <p className="text-xs text-red-700">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="mt-2 rounded-[10px] bg-navy py-3.5 text-[14.5px] font-bold tracking-wide text-off-white disabled:opacity-60"
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>

      <p className="mt-auto pt-5 text-center text-xs leading-relaxed text-graphite/65">
        Novo por aqui?{" "}
        <a href="/cadastro" className="border-b border-gold font-bold text-navy">
          O acesso é feito por convite do seu Mestre.
        </a>
      </p>
    </form>
  );
}
