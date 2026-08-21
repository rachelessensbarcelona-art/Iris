import { SEF, SENDEROS, COL, IZQ, ORDEN_CAMINOS, type SefKey } from "./tree";
import type { Resultado } from "./engine";

export type Rol = "origen" | "transformacion" | "destino";

export type SenderoView = { x1: number; y1: number; x2: number; y2: number; color: string; w: number; o: number; delay: number };
export type SefiraView = { x: number; y: number; fill: string; nombre: string; tx: number; ty: number; anchor: "start" | "middle" | "end"; delay: number; delayT: number };
export type MarcaCaminoView = { x: number; y: number; n: number; color: string; delay: number };

/** Senderos ocupados por cada camino. Un mismo sendero puede llevar más de un
 *  camino (el de origen y el de destino pueden ser el mismo arcano), por eso
 *  el valor es una lista y no un único rol: así se pueden dibujar los dos. */
export function arcosDe(r: Resultado): Record<number, Rol[]> {
  const arcos: Record<number, Rol[]> = {};
  const add = (arcano: number, rol: Rol) => {
    if (!arcos[arcano]) arcos[arcano] = [];
    arcos[arcano].push(rol);
  };
  add(r.caminos.origen.arcano, "origen");
  add(r.caminos.transformacion.arcano, "transformacion");
  add(r.caminos.destino.arcano, "destino");
  return arcos;
}

/** Separación entre dos caminos que comparten sendero, en unidades del
 *  viewBox. Un pelo mayor que el grosor del trazo (4) para que se lean como
 *  dos líneas y no como una sola más gruesa. */
const SEPARACION = 5;
const GROSOR = 4;

export function arbolGeometria(r: Resultado) {
  const arcos = arcosDe(r);

  const senderos: SenderoView[] = [];
  SENDEROS.forEach((s, i) => {
    const a = SEF[s[0]],
      b = SEF[s[1]];
    const roles = arcos[i];

    if (!roles || !roles.length) {
      senderos.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: "#5A5E70", w: 1.4, o: 0.32, delay: 0.06 + i * 0.032 });
      return;
    }

    // Vector perpendicular unitario al sendero: desplaza cada camino a un
    // lado para que los que coinciden queden en paralelo, visibles los dos.
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const largo = Math.hypot(dx, dy) || 1;
    const px = -dy / largo,
      py = dx / largo;

    roles.forEach((rol, k) => {
      const desvio = (k - (roles.length - 1) / 2) * SEPARACION;
      senderos.push({
        x1: a.x + px * desvio,
        y1: a.y + py * desvio,
        x2: b.x + px * desvio,
        y2: b.y + py * desvio,
        color: COL[rol],
        w: GROSOR,
        o: 0.95,
        delay: 1.15 + ORDEN_CAMINOS.indexOf(rol) * 0.28,
      });
    });
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

  // Número del arcano junto a su sendero, apartado del haz de líneas para no
  // quedar encima cuando hay más de un camino.
  const marcasCamino: MarcaCaminoView[] = [];
  Object.keys(arcos).forEach((clave, i) => {
    const idx = +clave;
    const s = SENDEROS[idx];
    if (!s) return;
    const p1 = SEF[s[0]],
      p2 = SEF[s[1]];
    const roles = arcos[idx];
    const dx = p2.x - p1.x,
      dy = p2.y - p1.y;
    const largo = Math.hypot(dx, dy) || 1;
    const aparta = ((roles.length - 1) / 2) * SEPARACION + 10;
    marcasCamino.push({
      x: (p1.x + p2.x) / 2 + (-dy / largo) * aparta,
      y: (p1.y + p2.y) / 2 + (dx / largo) * aparta + 4,
      n: idx,
      color: COL[roles[0]],
      delay: 2.0 + i * 0.28,
    });
  });

  return { arcos, senderos, sefirot, marcasCamino };
}
