"use client";
import { css } from "@/lib/css";
import { useApp, type Seccion } from "@/lib/app-context";
import { IcoAlma, IcoArbol, IcoCiclos, IcoCuentas, IcoEstructura, IcoNumeros, IcoResumen } from "./Iconos";

type Item = { k: Seccion; label: string; Ico: (p: { size?: number }) => React.JSX.Element };

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

/**
 * Barra lateral del panel. Todo el estudio cuelga de un solo grupo, "Kábala",
 * para que se vea de un vistazo que son las partes de una misma lectura y no
 * secciones sueltas. En pantalla estrecha desaparece y manda la tira de
 * pestañas de arriba.
 */
export default function Sidebar() {
  const { r, seccion, setSeccion } = useApp();
  if (!r) return null;

  return (
    <aside
      data-sidebar=""
      data-chrome="1"
      style={css(
        "position:sticky;top:63px;align-self:start;flex:none;width:238px;height:calc(100vh - 63px);overflow-y:auto;padding:22px 14px 28px;background:var(--bg);border-right:1px solid var(--border);"
      )}
    >
      <div style={css("display:flex;align-items:center;gap:9px;padding:0 10px;margin-bottom:14px;")}>
        <span style={css("width:26px;height:26px;flex:none;display:grid;place-items:center;border-radius:9px;background:var(--gold-soft);color:var(--gold);")}>
          <IcoArbol size={16} />
        </span>
        <span style={css("font-family:var(--font-display);font-size:var(--t-title);font-weight:500;letter-spacing:-.01em;color:var(--text);")}>Kábala</span>
      </div>
      <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);padding:0 10px;margin-bottom:var(--s2);")}>El estudio</div>

      <nav style={css("display:flex;flex-direction:column;gap:2px;")}>
        {KABALA.map(({ k, label, Ico }) => {
          const on = seccion === k;
          return (
            <button
              key={k}
              onClick={() => setSeccion(k)}
              style={css(
                "display:flex;align-items:center;gap:11px;width:100%;text-align:left;padding:9px 10px;white-space:nowrap;border:none;border-radius:var(--r-sm);cursor:pointer;font-size:var(--t-body);font-weight:590;letter-spacing:-.01em;line-height:1.25;transition:background .18s,color .18s;background:" +
                  (on ? "var(--gold-soft)" : "transparent") +
                  ";color:" +
                  (on ? "var(--gold-deep)" : "var(--text-3)") +
                  ";"
              )}
            >
              <span style={css("flex:none;display:grid;place-items:center;color:" + (on ? "var(--gold)" : "var(--text-4)") + ";")}>
                <Ico size={19} />
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
