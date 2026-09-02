"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Etapa = "codigo" | "dados" | "sucesso";

export function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [etapa, setEtapa] = useState<Etapa>("codigo");
  const [codigo, setCodigo] = useState(searchParams.get("convite") ?? "");
  const [lojaNome, setLojaNome] = useState("");
  const [lojaCidade, setLojaCidade] = useState("");

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function validarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { data, error } = await supabase.rpc("validar_convite", {
      p_codigo: codigo.trim().toUpperCase(),
    });

    setCarregando(false);

    const resultado = data?.[0];
    if (error || !resultado?.valido) {
      setErro("Convite inválido ou expirado. Confirme o código com seu Mestre.");
      return;
    }

    setLojaNome(resultado.loja_nome);
    setLojaCidade(resultado.loja_cidade);
    setEtapa("dados");
  }

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (signUpError) {
      setCarregando(false);
      setErro(signUpError.message.includes("already registered")
        ? "Este e-mail já está cadastrado."
        : "Não foi possível criar a conta. Tente novamente.");
      return;
    }

    const { error: resgateError } = await supabase.rpc("resgatar_convite", {
      p_codigo: codigo.trim().toUpperCase(),
      p_nome: nome,
      p_whatsapp: whatsapp,
    });

    setCarregando(false);

    if (resgateError) {
      setErro("Conta criada, mas houve um problema ao vincular seu convite. Fale com seu Mestre.");
      return;
    }

    setEtapa("sucesso");
  }

  if (etapa === "codigo") {
    return (
      <form onSubmit={validarCodigo} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="codigo" className="text-xs font-semibold text-graphite">
            Código do convite
          </label>
          <input
            id="codigo"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ELO-XXXXX"
            className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] uppercase tracking-wide text-graphite outline-none focus:border-gold"
          />
        </div>

        {erro && <p className="text-xs text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-[10px] bg-navy py-3.5 text-[14.5px] font-bold tracking-wide text-off-white disabled:opacity-60"
        >
          {carregando ? "Validando..." : "Continuar"}
        </button>

        <p className="mt-auto pt-5 text-center text-xs leading-relaxed text-graphite/65">
          Já tem conta?{" "}
          <a href="/login" className="border-b border-gold font-bold text-navy">
            Entrar
          </a>
        </p>
      </form>
    );
  }

  if (etapa === "dados") {
    return (
      <form onSubmit={criarConta} className="flex flex-col gap-4">
        <p className="text-xs leading-relaxed text-graphite/70">
          Convite confirmado para <span className="font-semibold text-navy">{lojaNome}</span> — {lojaCidade}
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-xs font-semibold text-graphite">
            Nome completo
          </label>
          <input
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="whatsapp" className="text-xs font-semibold text-graphite">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(00) 00000-0000"
            className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
          />
        </div>

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
            className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-xs font-semibold text-graphite">
            Crie uma senha
          </label>
          <input
            id="senha"
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border-0 border-b-[1.5px] border-graphite/25 bg-transparent py-2.5 px-0.5 text-[14.5px] text-graphite outline-none focus:border-gold"
          />
        </div>

        {erro && <p className="text-xs text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-[10px] bg-navy py-3.5 text-[14.5px] font-bold tracking-wide text-off-white disabled:opacity-60"
        >
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <p className="text-[15px] font-semibold text-navy">Conta criada com sucesso.</p>
      <p className="text-xs leading-relaxed text-graphite/70">
        Seu acesso está pendente de ativação pelo Mestre da sua loja. Você será avisado assim que puder entrar.
      </p>
      <button
        onClick={() => router.push("/login")}
        className="mt-2 rounded-[10px] bg-navy px-6 py-3 text-[14.5px] font-bold text-off-white"
      >
        Ir para o login
      </button>
    </div>
  );
}
