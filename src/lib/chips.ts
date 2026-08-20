import { chipStyle, recorta } from "./format";
import { ficha, type Ficha } from "./engine";

export type Chip = { label: string; style: string; onClick: () => void };

/** Chips "te tensa / te libera" (o "Lectura N" para números partidos de 2 en 2) para una ficha. */
export function chipsDeFicha(F: Ficha | null | undefined, verNumero: (n: number) => void): Chip[] {
  if (!F) return [];
  type Raw = { label: string; n: number; color: string };
  const out: Raw[] = [];
  const add = (G: Ficha, pre: string) => {
    if (G.T) out.push({ label: pre + "te tensa · T" + G.T, n: G.T, color: "#E2574C" });
    if (G.L) out.push({ label: pre + "te libera · L" + G.L, n: G.L, color: "#6FAE7C" });
  };
  if (F.enDiccionario) add(F, "");
  else
    (F.partes || []).forEach((p) => {
      out.push({ label: "Lectura " + p.n, n: p.n, color: "#C9A84C" });
      add(p, p.n + " ");
    });
  return out.map((c) => ({ label: c.label, style: chipStyle(c.color), onClick: () => verNumero(c.n) }));
}

export type RefItem = { label: string; color: string; texto: string; style: string };

/** Bloques "lo que te tensa / lo que te libera" con el texto completo, para el Estudio. */
export function refItems(F: Ficha | null | undefined): RefItem[] {
  if (!F) return [];
  const items: RefItem[] = [];
  const lee = (g: Ficha | null): string =>
    g
      ? g.enDiccionario
        ? g.titulo + " " + recorta(g.texto, 280)
        : g.partes.length
          ? g.partes.map((p) => p.n + ". " + p.titulo + " " + recorta(p.texto, 150)).join(" — ")
          : "Se lee dividiéndolo de dos en dos."
      : "";
  const add = (G: Ficha, pre: string) => {
    if (G.T) items.push({ label: pre + "Lo que te tensa · T" + G.T, color: "#B0564C", texto: lee(ficha(G.T)), style: "border-left:2px solid #C0574C;padding-left:12px;" });
    if (G.L) items.push({ label: pre + "Lo que te libera · L" + G.L, color: "#40794F", texto: lee(ficha(G.L)), style: "border-left:2px solid #4C8A5A;padding-left:12px;" });
  };
  if (F.enDiccionario) add(F, "");
  else (F.partes || []).forEach((p) => add(p, p.n + " · "));
  return items;
}
