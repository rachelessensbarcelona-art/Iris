"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { css } from "@/lib/css";
import { useApp, type Seccion, type Disciplina } from "@/lib/app-context";
import {
  IcoAlma,
  IcoArbol,
  IcoCiclos,
  IcoCuentas,
  IcoEstructura,
  IcoFengShui,
  IcoNumerologia,
  IcoNumeros,
  IcoResumen,
} from "./Iconos";

type Ico = (p: { size?: number }) => React.JSX.Element;
type Item = { k: Seccion; label: string; Ico: Ico };

/* En la lateral los nombres van cortos: caben en un renglón y la columna
 * queda a plomo. El nombre largo sigue estando arriba, en la tira de
 * pestañas y en el encabezado de cada sección. */
const KABALA: Item[] = [
  { k: "resumen", label: "Resumen", Ico: IcoResumen },
  { k: "arbol", label: "Árbol", Ico: IcoArbol },
  { k: "numeros", label: "Números", Ico: IcoNumeros },
  { k: "estructura", label: "Estructura", Ico: IcoEstructura },
  { k: "alma", label: "Imagen del alma", Ico: IcoAlma },
  { k: "cuentas", label: "Cuentas abiertas", Ico: IcoCuentas },
  { k: "ciclos", label: "Ciclos vitales", Ico: IcoCiclos },
];

/** Las tres disciplinas de la escuela, en el orden en que se estudian. */
export const DISCIPLINAS: Array<{ k: Disciplina; label: string; Ico: Ico }> = [
  { k: "kabala", label: "Kábala", Ico: IcoArbol },
  { k: "fengshui", label: "Feng Shui", Ico: IcoFengShui },
  { k: "numerologia", label: "Numerología", Ico: IcoNumerologia },
];

/**
 * Barra lateral del panel. Un grupo por disciplina: dentro de Kábala cuelgan
 * las siete partes del estudio, y Feng Shui y Numerología están puestas ya en
 * su sitio aunque todavía no tengan contenido — así se ve de entrada que la
 * escuela son tres cosas y no una. En pantalla estrecha desaparece y manda la
 * tira de pestañas de arriba.
 */
export default function Sidebar() {
  const { r, seccion, setSeccion, disciplina, setDisciplina } = useApp();
  const quieto = useReducedMotion();
  // Qué disciplinas están desplegadas. Se abre la que se está mirando, y
  // pulsando su nombre se cierra: en cuanto haya partes en las tres, la
  // columna entera abierta no cabría de una vez.
  const [abiertas, setAbiertas] = useState<Disciplina[]>(["kabala"]);
  if (!r) return null;

  const alterna = (d: Disciplina) => {
    setDisciplina(d);
    setAbiertas((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]));
  };

  const fila = (activo: boolean, Ico: Ico, label: string, onClick: () => void, grande?: boolean, abierta?: boolean) => (
    <button
      key={label}
      onClick={onClick}
      style={css(
        "display:flex;align-items:center;gap:11px;width:100%;text-align:left;padding:9px 10px;white-space:nowrap;border:none;border-radius:var(--r-sm);cursor:pointer;letter-spacing:-.01em;line-height:1.25;transition:background .18s,color .18s;" +
          (grande ? "font-size:var(--t-read);font-weight:600;" : "font-size:var(--t-body);font-weight:590;") +
          "background:" +
          (activo ? "var(--gold-soft)" : "transparent") +
          ";color:" +
          (activo ? "var(--gold-deep)" : grande ? "var(--text)" : "var(--text-3)") +
          ";"
      )}
    >
      <span
        style={css(
          "flex:none;display:grid;place-items:center;" +
            (grande ? "width:26px;height:26px;border-radius:9px;background:var(--gold-soft);" : "") +
            "color:" +
            (activo || grande ? "var(--gold)" : "var(--text-4)") +
            ";"
        )}
      >
        <Ico size={grande ? 16 : 19} />
      </span>
      {label}
      {/* La flecha dice si el grupo está abierto y sirve para cerrarlo. */}
      {abierta !== undefined && (
        <motion.span
          aria-hidden="true"
          animate={{ rotate: abierta ? 0 : -90 }}
          transition={quieto ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={css("margin-left:auto;display:grid;place-items:center;color:var(--text-4);")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      )}
    </button>
  );

  return (
    <aside
      data-sidebar=""
      data-chrome="1"
      style={css(
        "position:sticky;top:63px;align-self:start;flex:none;width:238px;height:calc(100vh - 63px);overflow-y:auto;padding:22px 14px 28px;background:var(--bg);border-right:1px solid var(--border);"
      )}
    >
      <nav style={css("display:flex;flex-direction:column;gap:var(--s5);")}>
        {DISCIPLINAS.map((d) => {
          const dentro = disciplina === d.k;
          // Sólo Kábala tiene partes por ahora; las otras dos no llevan flecha
          // porque no hay nada que desplegar todavía.
          const partes = d.k === "kabala" ? KABALA : [];
          const abierta = partes.length > 0 && abiertas.includes(d.k);
          return (
            <div key={d.k} style={css("display:flex;flex-direction:column;gap:2px;")}>
              {/* La disciplina abierta no se resalta si es Kábala: ya se ve
               * cuál está por la sección marcada de dentro. */}
              {fila(
                dentro && !partes.length,
                d.Ico,
                d.label,
                () => (partes.length ? alterna(d.k) : setDisciplina(d.k)),
                true,
                partes.length ? abierta : undefined
              )}
              <AnimatePresence initial={false}>
                {abierta && (
                  <motion.div
                    key="partes"
                    initial={quieto ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={quieto ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ height: { duration: 0.34, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.22 } }}
                    style={css("overflow:hidden;")}
                  >
                    <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);padding:var(--s2) 10px 2px;")}>El estudio</div>
                    {partes.map(({ k, label, Ico }, i) => (
                      <motion.div
                        key={k}
                        initial={quieto ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.035, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {fila(seccion === k && dentro, Ico, label, () => {
                          // Pulsar una parte de Kábala devuelve a Kábala, aunque
                          // se estuviera mirando otra disciplina.
                          setDisciplina("kabala");
                          setSeccion(k);
                        })}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
