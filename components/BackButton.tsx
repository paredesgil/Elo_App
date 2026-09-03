"use client";

import { useRouter } from "next/navigation";

export function BackButton({ light = false }: { light?: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      className={`absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl transition ${
        light
          ? "bg-off-white/10 text-off-white hover:bg-off-white/20"
          : "bg-graphite/5 text-graphite hover:bg-graphite/10"
      }`}
    >
      ←
    </button>
  );
}
