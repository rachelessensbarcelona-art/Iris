import { SEF, SENDEROS, COL, IZQ, type SefKey } from "./tree";
import type { Resultado } from "./engine";

export type Rol = "origen" | "transformacion" | "destino";

export type SenderoView = { x1: number; y1: number; y2: number; x2: number; color: string; w: number; o: number; delay: number };
export type SefiraView = { x: number; y: number; fill: string; nombre: string; tx: number; ty: number; anchor: "start" | "middle" | "end"; delay: number; delayT: number };
export type MarcaCaminoView = { x: number; y: number; n: number; color: string; delay: number };

export function arcosDe(r: Resultado): Record<number, Rol> {
  const arcos: Record<number, Rol> = {};
  arcos[r.caminos.origen.arcano] = "origen";
  if (arcos[r.caminos.transformacion.arcano] === undefined) arcos[r.caminos.transformacion.arcano] = "transformacion";
  if (arcos[r.caminos.destino.arcano] === undefined) arcos[r.caminos.destino.arcano] = "destino";
  return arcos;
}

export function arbolGeometria(r: Resultado) {
  const arcos = arcosDe(r);
  const arcosKeys = Object.keys(arcos);

  const senderos: SenderoView[] = SENDEROS.map((s, i) => {
    const a = SEF[s[0]],
      b = SEF[s[1]];
    const rol = arcos[i];
    const delay = rol ? 1.15 + arcosKeys.indexOf(String(i)) * 0.28 : 0.06 + i * 0.032;
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: rol ? COL[rol] : "#5A5E70", w: rol ? 4 : 1.4, o: rol ? 0.95 : 0.32, delay };
  });

  const sefirot: SefiraView[] = (Object.keys(SEF) as SefKey[]).map((k, i) => {
    const p = SEF[k];
    const izq = IZQ[k];
    const centro = p.x === 190;
    const delay = 0.1 + i * 0.075;
    return {
      x: p.x,
      y: p.y,
      fill: p.c,
      nombre: p.n,
      tx: centro ? p.x : izq ? p.x - 26 : p.x + 26,
      ty: centro ? p.y - 26 : p.y + 4,
      anchor: centro ? "middle" : izq ? "end" : "start",
      delay,
      delayT: delay + 0.3,
    };
  });

  const marcasCamino: MarcaCaminoView[] = [];
  arcosKeys.forEach((a, i) => {
    const s = SENDEROS[+a];
    if (!s) return;
    const p1 = SEF[s[0]],
      p2 = SEF[s[1]];
    marcasCamino.push({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 + 4, n: +a, color: COL[arcos[+a]], delay: 2.0 + i * 0.28 });
  });

  return { arcos, senderos, sefirot, marcasCamino };
}
