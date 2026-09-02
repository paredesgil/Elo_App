"use client";

import { useRouter } from "next/navigation";

export function BackButton({ light = false }: { light?: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      className={`absolute left-4 top-12 flex h-8 w-8 items-center justify-center rounded-full text-lg ${
        light ? "text-off-white/80 hover:text-off-white" : "text-graphite/70"
      }`}
    >
      ←
    </button>
  );
}
