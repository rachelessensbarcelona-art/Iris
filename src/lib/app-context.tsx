"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { calcula, comparaPareja, ficha as fichaDe, type Resultado, type Comparativa, type Ficha } from "./engine";
import { cargaHistorial, guardaHistorial, cargaEdits, guardaEdits, type HistItem, type Edits } from "./storage";

export type View = "inicio" | "panel" | "estudio" | "pareja";
export type Seccion = "resumen" | "arbol" | "numeros" | "estructura" | "alma" | "cuentas" | "ciclos";
export type FormState = { nombre: string; ap1: string; ap2: string; dia: string; mes: string; anio: string };
const FORM_VACIO: FormState = { nombre: "", ap1: "", ap2: "", dia: "", mes: "", anio: "" };

export type Detalle =
  | { tipo: "numero"; f: Ficha }
  | { tipo: "arcano"; a: number }
  | { tipo: "texto"; titulo: string; sub: string; texto: string; etiqueta: string }
  | null;

export const MARCA = "Escuela de Sabiduría 33";

function entradaDe(f: FormState, anioUniversal: number) {
  return {
    nombre: f.nombre,
    apellido1: f.ap1,
    apellido2: f.ap2,
    dia: +f.dia,
    mes: +f.mes,
    anio: +f.anio,
    anioUniversal,
  };
}

export function valida(f: FormState): string | null {
  const d = +f.dia,
    m = +f.mes,
    a = +f.anio;
  if (!f.nombre.trim()) return "Falta el nombre.";
  if (!(d >= 1 && d <= 31)) return "El día debe estar entre 1 y 31.";
  if (!(m >= 1 && m <= 12)) return "El mes debe estar entre 1 y 12.";
  if (!(a >= 1900 && a <= 2100)) return "El año debe tener cuatro cifras.";
  return null;
}

type Ctx = {
  view: View;
  setView: (v: View) => void;
  seccion: Seccion;
  setSeccion: (s: Seccion) => void;
  f: FormState;
  set: (k: keyof FormState, v: string) => void;
  r: Resultado | null;
  id: string | null;
  hist: HistItem[];
  calcular: () => void;
  abrir: (h: HistItem) => void;
  borrar: (h: HistItem) => void;
  edits: Edits;
  txt: (id: string, def: string) => string;
  guardaEdit: (bloqueId: string, texto: string) => void;
  restablecer: () => void;
  detalle: Detalle;
  verNumero: (n: number) => void;
  verArcano: (a: number) => void;
  verTexto: (tipo: string, titulo: string, sub: string, texto: string) => void;
  cerrarDetalle: () => void;
  p: FormState;
  setP: (k: keyof FormState, v: string) => void;
  pr: Resultado | null;
  comp: Comparativa | null;
  comparar: () => void;
  marca: string;
  anioUniversal: number;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("inicio");
  const [seccion, setSeccion] = useState<Seccion>("resumen");
  const [f, setF] = useState<FormState>(FORM_VACIO);
  const [r, setR] = useState<Resultado | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [hist, setHist] = useState<HistItem[]>(() => (typeof window === "undefined" ? [] : cargaHistorial()));
  const [edits, setEdits] = useState<Edits>(() => (typeof window === "undefined" ? {} : cargaEdits()));
  const [detalle, setDetalle] = useState<Detalle>(null);
  const [p, setPState] = useState<FormState>(FORM_VACIO);
  const [pr, setPr] = useState<Resultado | null>(null);
  const [comp, setComp] = useState<Comparativa | null>(null);

  const anioUniversal = new Date().getFullYear();

  const set = useCallback((k: keyof FormState, v: string) => setF((s) => ({ ...s, [k]: v })), []);
  const setP = useCallback((k: keyof FormState, v: string) => setPState((s) => ({ ...s, [k]: v })), []);

  const calcular = useCallback(() => {
    if (valida(f)) return;
    const resultado = calcula(entradaDe(f, anioUniversal));
    const hid = [f.nombre, f.ap1, f.ap2, f.dia, f.mes, f.anio].join("|").toUpperCase();
    const item: HistItem = {
      id: hid,
      nombre: [f.nombre, f.ap1, f.ap2].filter(Boolean).join(" "),
      fecha: `${f.dia}/${f.mes}/${f.anio}`,
      corazon: resultado.corazon.valor,
      f: { ...f },
    };
    setHist((s) => {
      const next = [item].concat(s.filter((h) => h.id !== hid)).slice(0, 40);
      guardaHistorial(next);
      return next;
    });
    setR(resultado);
    setId(hid);
    setView("panel");
    setSeccion("resumen");
  }, [f, anioUniversal]);

  const abrir = useCallback(
    (h: HistItem) => {
      const resultado = calcula(entradaDe(h.f as FormState, anioUniversal));
      setF(h.f as FormState);
      setR(resultado);
      setId(h.id);
      setView("panel");
      setSeccion("resumen");
    },
    [anioUniversal]
  );

  const borrar = useCallback((h: HistItem) => {
    setHist((s) => {
      const next = s.filter((x) => x.id !== h.id);
      guardaHistorial(next);
      return next;
    });
  }, []);

  const guardaEdit = useCallback(
    (bloqueId: string, texto: string) => {
      if (!id) return;
      setEdits((s) => {
        const next: Edits = { ...s, [id]: { ...(s[id] || {}), [bloqueId]: texto } };
        guardaEdits(next);
        return next;
      });
    },
    [id]
  );
  const txt = useCallback((bloqueId: string, def: string) => (id && edits[id] && edits[id][bloqueId] !== undefined ? edits[id][bloqueId] : def), [id, edits]);
  const restablecer = useCallback(() => {
    if (!id) return;
    setEdits((s) => {
      const next = { ...s };
      delete next[id];
      guardaEdits(next);
      return next;
    });
  }, [id]);

  const verNumero = useCallback((n: number) => {
    const F = fichaDe(n);
    if (!F) return;
    setDetalle({ tipo: "numero", f: F });
  }, []);
  const verArcano = useCallback((a: number) => setDetalle({ tipo: "arcano", a }), []);
  const verTexto = useCallback((tipo: string, titulo: string, sub: string, texto: string) => setDetalle({ tipo: "texto", etiqueta: tipo, titulo, sub, texto }), []);
  const cerrarDetalle = useCallback(() => setDetalle(null), []);

  const comparar = useCallback(() => {
    if (valida(p) || !r) return;
    const resultado = calcula(entradaDe(p, anioUniversal));
    setPr(resultado);
    setComp(comparaPareja(r, resultado));
  }, [p, r, anioUniversal]);

  const value = useMemo<Ctx>(
    () => ({
      view,
      setView,
      seccion,
      setSeccion,
      f,
      set,
      r,
      id,
      hist,
      calcular,
      abrir,
      borrar,
      edits,
      txt,
      guardaEdit,
      restablecer,
      detalle,
      verNumero,
      verArcano,
      verTexto,
      cerrarDetalle,
      p,
      setP,
      pr,
      comp,
      comparar,
      marca: MARCA,
      anioUniversal,
    }),
    [view, seccion, f, set, r, id, hist, calcular, abrir, borrar, edits, txt, guardaEdit, restablecer, detalle, verNumero, verArcano, verTexto, cerrarDetalle, p, setP, pr, comp, comparar, anioUniversal]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
