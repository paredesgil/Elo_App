"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EsqueciSenhaForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    });

    setCarregando(false);

    if (error) {
      setErro(
        error.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos e tente de novo."
          : "Não foi possível enviar o e-mail agora. Tente novamente em instantes."
      );
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm leading-relaxed text-graphite">
          Se <strong>{email}</strong> estiver cadastrado, você vai receber um e-mail com o link para criar uma nova senha.
        </p>
        <p className="text-xs text-graphite/60">
          Abra o link no mesmo aparelho e navegador em que fez o pedido. Confira também a caixa de spam.
        </p>
        <a href="/login" className="mt-2 text-sm font-bold text-navy underline decoration-gold">
          Voltar para o login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-[18px]">
      <p className="text-sm leading-relaxed text-graphite/75">
        Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </p>
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
          className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent px-0.5 py-2.5 text-[14.5px] text-graphite outline-none focus:border-gold"
        />
      </div>

      {erro && <p className="text-xs text-red-700">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="mt-2 rounded-[10px] bg-navy py-3.5 text-[14.5px] font-bold tracking-wide text-off-white disabled:opacity-60"
      >
        {carregando ? "Enviando..." : "Enviar link"}
      </button>

      <a href="/login" className="text-center text-xs font-semibold text-graphite/65">
        Voltar para o login
      </a>
    </form>
  );
}
