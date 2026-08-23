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

const SECCIONES: Array<{ k: Seccion; label: string }> = [
  { k: "resumen", label: "Resumen" },
  { k: "arbol", label: "Árbol y caminos" },
  { k: "numeros", label: "Números" },
  { k: "estructura", label: "Estructura y aprendizajes" },
  { k: "alma", label: "Imagen del alma" },
  { k: "cuentas", label: "Cuentas abiertas" },
  { k: "ciclos", label: "Ciclos vitales" },
];

export default function PanelScreen() {
  const { r, seccion, setSeccion } = useApp();
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
          <div style={css("font-size:12px;font-weight:590;color:var(--text-3);margin-bottom:6px;")}>Estudio de Kábala</div>
          <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:clamp(22px,3.6vw,31px);letter-spacing:-.022em;color:var(--text);margin:0;line-height:1.15;overflow-wrap:anywhere;")}>{titulo(r.nombre.texto)}</h1>
          <div style={css("font-family:var(--font-ui);font-size:17px;color:var(--text-3);margin-top:5px;")}>
            {r.fecha.dia} / {r.fecha.mes} / {r.fecha.anio}
          </div>
        </div>
        {/* En el resumen estas mismas cifras ya salen en las tarjetas, así que
         * la tira sólo aparece en las demás secciones. */}
        <div style={css("display:" + (seccion === "resumen" ? "none" : "flex") + ";gap:clamp(14px,2.4vw,26px);flex-wrap:wrap;margin-left:auto;")}>
          {resumen.map((k, i) => (
            <div key={i} style={css("display:flex;flex-direction:column;gap:3px;align-items:flex-end;")}>
              <span style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>{k.label}</span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:22px;color:var(--gold);line-height:1;")}>{k.valor}</span>
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
        {SECCIONES.map((s) => {
          const on = seccion === s.k;
          return (
            <button
              key={s.k}
              onClick={() => setSeccion(s.k)}
              style={css(
                "flex:none;padding:8px 16px;border-radius:980px;border:none;cursor:pointer;font-size:14px;font-weight:590;letter-spacing:-.01em;white-space:nowrap;transition:all .2s;background:" +
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

      {/* La key hace que React tire el árbol anterior al cambiar de sección,
       * así la animación de entrada se reproduce en cada salto y no sólo la
       * primera vez. */}
      <div key={seccion} style={css("animation:es33-alza .5s cubic-bezier(.22,1,.36,1) both;")}>
        {seccion === "resumen" && <SeccionResumen />}
        {seccion === "arbol" && <SeccionArbol />}
        {seccion === "numeros" && <SeccionNumeros />}
        {seccion === "estructura" && <SeccionEstructura />}
        {seccion === "alma" && <SeccionAlma />}
        {seccion === "cuentas" && <SeccionCuentas />}
        {seccion === "ciclos" && <SeccionCiclos />}
      </div>
    </main>
  );
}
