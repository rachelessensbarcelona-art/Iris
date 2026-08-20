import type { Entrada } from "./engine";

const LS_HIST = "es33.historial.v1";
const LS_EDITS = "es33.edits.v1";

export type HistItem = {
  id: string;
  nombre: string;
  fecha: string;
  corazon: number;
  f: { nombre: string; ap1: string; ap2: string; dia: string; mes: string; anio: string };
};

export function cargaHistorial(): HistItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(LS_HIST) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function guardaHistorial(hist: HistItem[]) {
  try {
    localStorage.setItem(LS_HIST, JSON.stringify(hist));
  } catch {
    /* almacenamiento no disponible */
  }
}

export type Edits = Record<string, Record<string, string>>;
export function cargaEdits(): Edits {
  try {
    const v = JSON.parse(localStorage.getItem(LS_EDITS) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}
export function guardaEdits(edits: Edits) {
  try {
    localStorage.setItem(LS_EDITS, JSON.stringify(edits));
  } catch {
    /* almacenamiento no disponible */
  }
}

export type { Entrada };
