"use client";
import { css } from "@/lib/css";
import { titulo } from "@/lib/format";
import { useApp, type Seccion } from "@/lib/app-context";
import SeccionResumen from "../panel/SeccionResumen";
import SeccionArbol from "../panel/SeccionArbol";
import SeccionNumeros from "../panel/SeccionNumeros";
import SeccionEstructura from "../panel/SeccionEstructura";
import SeccionAlma from "../panel/SeccionAlma";
import SeccionCuentas from "../panel/SeccionCuentas";
import SeccionCiclos from "../panel/SeccionCiclos";
import Pendiente from "../panel/Pendiente";
import { DISCIPLINAS } from "../Sidebar";

/* El nombre largo y, debajo, qué se está mirando. En la lateral los nombres
 * van cortos para que la columna quede a plomo, así que el encabezado de la
 * sección es lo que dice dónde estás. */
const SECCIONES: Array<{ k: Seccion; label: string; pie: string }> = [
  { k: "resumen", label: "Resumen", pie: "Todo el estudio de un vistazo" },
  { k: "arbol", label: "Árbol y caminos", pie: "Los tres arcanos que recorres y los que te acompañan" },
  { k: "numeros", label: "Números", pie: "Corazón, esencia y ego, y de dónde sale cada uno" },
  { k: "estructura", label: "Estructura y aprendizajes", pie: "La figura, los diez portales y lo que traes por trabajar" },
  { k: "alma", label: "Imagen del alma", pie: "Los diez planos de consciencia y dónde están los bloqueos" },
  { k: "cuentas", label: "Cuentas abiertas", pie: "El kármico, el lema de vida y lo que viene de atrás" },
  { k: "ciclos", label: "Ciclos vitales", pie: "En qué momento de la rueda está ahora" },
];

export default function PanelScreen() {
  const { r, seccion, setSeccion, disciplina, setDisciplina } = useApp();
  if (!r) return null;

  const resumen = [
    { label: "Corazón", valor: r.corazon.valor },
    { label: "Esencia", valor: r.esencia.valor },
    { label: "Ego", valor: r.ego.valor },
    { label: "Edad de cambio", valor: r.caminos.edadCambio },
    { label: "Estructura", valor: r.estructura.tipo },
    { label: "Imagen del alma", valor: r.imagenAlma.numero },
  ];

  return (
    <main style={css("max-width:var(--ancho);margin:0 auto;padding:var(--s6) var(--gutter) var(--s8);")}>
      <div style={css("display:flex;align-items:flex-end;gap:var(--s5);flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:var(--s5);margin-bottom:var(--s5);")}>
        <div>
          <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);margin-bottom:6px;")}>
            Estudio de {DISCIPLINAS.find((d) => d.k === disciplina)?.label}
          </div>
          <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:clamp(22px,3.6vw,31px);letter-spacing:-.022em;color:var(--text);margin:0;line-height:1.15;overflow-wrap:anywhere;")}>{titulo(r.nombre.texto)}</h1>
          <div style={css("font-family:var(--font-ui);font-size:var(--t-read);color:var(--text-3);margin-top:5px;")}>
            {r.fecha.dia} / {r.fecha.mes} / {r.fecha.anio}
          </div>
        </div>
        {/* En el resumen estas mismas cifras ya salen en las tarjetas, así que
         * la tira sólo aparece en las demás secciones. */}
        <div style={css("display:" + (disciplina !== "kabala" || seccion === "resumen" ? "none" : "flex") + ";gap:clamp(14px,2.4vw,26px);flex-wrap:wrap;margin-left:auto;")}>
          {resumen.map((k, i) => (
            <div key={i} style={css("display:flex;flex-direction:column;gap:3px;align-items:flex-end;")}>
              <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);")}>{k.label}</span>
              <span style={css("font-weight:600;font-size:var(--t-title);color:var(--text);line-height:1;")}>{k.valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Duplica la barra lateral, así que sólo aparece cuando ésta se esconde
       * por falta de ancho. */}
      {/* La tira se desliza dentro de su propia pastilla. Sin el overflow las
       * pestañas que no caben empujaban el ancho de la página entera y
       * aparecía una barra horizontal en toda la pantalla. */}
      <nav
        data-nav=""
        data-tabs-panel=""
        data-tira=""
        style={css(
          "display:flex;gap:2px;margin-bottom:var(--s6);background:color-mix(in srgb, var(--text) 10%, transparent);border-radius:980px;padding:3px;width:fit-content;max-width:100%;overflow-x:auto;scrollbar-width:none;overscroll-behavior-x:contain;"
        )}
      >
        {DISCIPLINAS.filter((d) => d.k !== "kabala" || disciplina !== "kabala").map((d) => (
          <button
            key={d.k}
            onClick={() => setDisciplina(d.k)}
            style={css(
              "flex:none;padding:8px 16px;border-radius:980px;border:none;cursor:pointer;font-size:var(--t-body);font-weight:600;letter-spacing:-.01em;white-space:nowrap;transition:all .2s;background:" +
                (disciplina === d.k ? "var(--surface-solid)" : "transparent") +
                ";color:" +
                (disciplina === d.k ? "var(--text)" : "var(--text-3)") +
                ";"
            )}
          >
            {d.label}
          </button>
        ))}
        {disciplina === "kabala" &&
          SECCIONES.map((s) => {
          const on = seccion === s.k;
          return (
            <button
              key={s.k}
              onClick={() => setSeccion(s.k)}
              style={css(
                "flex:none;padding:8px 16px;border-radius:980px;border:none;cursor:pointer;font-size:var(--t-body);font-weight:590;letter-spacing:-.01em;white-space:nowrap;transition:all .2s;background:" +
                  (on ? "var(--surface-solid)" : "transparent") +
                  ";box-shadow:" +
                  (on ? "0 3px 8px rgba(0,0,0,.1),0 1px 1px rgba(0,0,0,.06)" : "none") +
                  ";color:" +
                  (on ? "var(--text)" : "var(--text-3)") +
                  ";"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {(() => {
        // El resumen ya se abre saludando a Iris por su nombre; no hace falta
        // ponerle encima un segundo título que diga lo mismo.
        const s = disciplina !== "kabala" || seccion === "resumen" ? null : SECCIONES.find((x) => x.k === seccion);
        return s ? (
          <div key={"h" + seccion} style={css("margin-bottom:var(--s5);animation:es33-alza .45s cubic-bezier(.22,1,.36,1) both;")}>
            <h2 style={css("font-size:var(--t-head);margin:0;")}>{s.label}</h2>
            <p style={css("font-size:var(--t-body);line-height:1.5;color:var(--text-3);margin:5px 0 0;max-width:64ch;")}>{s.pie}</p>
          </div>
        ) : null;
      })()}

      {/* La key hace que React tire el árbol anterior al cambiar de sección,
       * así la animación de entrada se reproduce en cada salto y no sólo la
       * primera vez. */}
      <div key={disciplina + seccion} style={css("animation:es33-alza .5s cubic-bezier(.22,1,.36,1) both;")}>
        {disciplina === "fengshui" && (
          <Pendiente
            titulo="Feng Shui"
            pie="El estudio del espacio: cómo la casa y la orientación acompañan lo que dice la carta. Todavía no está desarrollado."
          />
        )}
        {disciplina === "numerologia" && (
          <Pendiente
            titulo="Numerología"
            pie="La lectura numerológica, aparte de la kabalística: la vibración de cada cifra por sí misma. Todavía no está desarrollada."
          />
        )}
        {disciplina === "kabala" && (
          <>
            {seccion === "resumen" && <SeccionResumen />}
            {seccion === "arbol" && <SeccionArbol />}
            {seccion === "numeros" && <SeccionNumeros />}
            {seccion === "estructura" && <SeccionEstructura />}
            {seccion === "alma" && <SeccionAlma />}
            {seccion === "cuentas" && <SeccionCuentas />}
            {seccion === "ciclos" && <SeccionCiclos />}
          </>
        )}
      </div>
    </main>
  );
}
