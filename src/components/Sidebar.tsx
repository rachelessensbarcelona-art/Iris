"use client";
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
  if (!r) return null;

  const fila = (activo: boolean, Ico: Ico, label: string, onClick: () => void, grande?: boolean) => (
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
          return (
            <div key={d.k} style={css("display:flex;flex-direction:column;gap:2px;")}>
              {/* La disciplina abierta no se resalta si es Kábala: ya se ve
               * cuál está por la sección marcada de dentro. */}
              {fila(dentro && d.k !== "kabala", d.Ico, d.label, () => setDisciplina(d.k), true)}
              {d.k === "kabala" && dentro && (
                <>
                  <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);padding:var(--s2) 10px 2px;")}>El estudio</div>
                  {KABALA.map(({ k, label, Ico }) => fila(seccion === k, Ico, label, () => setSeccion(k)))}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
