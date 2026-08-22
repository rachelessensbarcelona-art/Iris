"use client";
import { css } from "@/lib/css";
import { useApp, type Seccion } from "@/lib/app-context";
import SeccionArbol from "../panel/SeccionArbol";
import SeccionNumeros from "../panel/SeccionNumeros";
import SeccionEstructura from "../panel/SeccionEstructura";
import SeccionAlma from "../panel/SeccionAlma";
import SeccionCuentas from "../panel/SeccionCuentas";
import SeccionCiclos from "../panel/SeccionCiclos";

const SECCIONES: Array<{ k: Seccion; label: string }> = [
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
    <main style={css("max-width:1240px;margin:0 auto;padding:clamp(20px,4vw,30px) clamp(14px,3vw,28px) 80px;animation:es33-in .45s ease both;")}>
      <div style={css("display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:18px;margin-bottom:22px;")}>
        <div>
          <div style={css("font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;")}>Estudio de Kábala</div>
          <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:clamp(22px,3.6vw,31px);letter-spacing:.04em;color:var(--text);margin:0;line-height:1.15;overflow-wrap:anywhere;")}>{r.nombre.texto}</h1>
          <div style={css("font-family:var(--font-ui);font-size:17px;color:var(--text-3);margin-top:5px;")}>
            {r.fecha.dia} / {r.fecha.mes} / {r.fecha.anio}
          </div>
        </div>
        <div style={css("display:flex;gap:clamp(14px,2.4vw,26px);flex-wrap:wrap;margin-left:auto;")}>
          {resumen.map((k, i) => (
            <div key={i} style={css("display:flex;flex-direction:column;gap:3px;align-items:flex-end;")}>
              <span style={css("font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-4);")}>{k.label}</span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:22px;color:var(--gold);line-height:1;")}>{k.valor}</span>
            </div>
          ))}
        </div>
      </div>

      <nav style={css("display:flex;gap:5px;flex-wrap:wrap;margin-bottom:28px;")}>
        {SECCIONES.map((s) => {
          const on = seccion === s.k;
          return (
            <button
              key={s.k}
              onClick={() => setSeccion(s.k)}
              style={css(
                "padding:8px 15px;border-radius:var(--r-sm);cursor:pointer;font-size:10px;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;transition:all .2s;border:1px solid " +
                  (on ? "var(--gold)" : "var(--border)") +
                  ";background:" +
                  (on ? "var(--gold-soft)" : "transparent") +
                  ";color:" +
                  (on ? "var(--gold)" : "var(--text-3)") +
                  ";"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {seccion === "arbol" && <SeccionArbol />}
      {seccion === "numeros" && <SeccionNumeros />}
      {seccion === "estructura" && <SeccionEstructura />}
      {seccion === "alma" && <SeccionAlma />}
      {seccion === "cuentas" && <SeccionCuentas />}
      {seccion === "ciclos" && <SeccionCiclos />}
    </main>
  );
}
