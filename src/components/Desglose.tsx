import { css } from "@/lib/css";

export type Paso = {
  etiqueta: string;
  /** La operación tal y como se hace a mano, p. ej. "5+9 + 3 + 6+9+9+6". */
  operacion: string;
  resultado?: string | number;
  /** Resalta el paso: es el número al que se llega. */
  final?: boolean;
};

/**
 * Muestra el cálculo paso a paso, para poder comprobar a mano de dónde sale
 * cada número (y para poder explicarlo en consulta).
 */
export default function Desglose({ titulo, pasos, nota }: { titulo: string; pasos: Paso[]; nota?: string }) {
  return (
    <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(15px,2vw,20px) clamp(16px,2.2vw,22px);")}>
      <div style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--gold);margin-bottom:12px;")}>{titulo}</div>
      <div style={css("display:flex;flex-direction:column;gap:2px;")}>
        {pasos.map((p, i) => (
          <div
            key={i}
            style={css(
              "display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;padding:7px 9px;border-radius:var(--r-sm);background:" +
                (p.final ? "var(--gold-soft)" : "transparent") +
                ";"
            )}
          >
            <span style={css("font-size:12px;font-weight:590;color:var(--text-3);min-width:118px;")}>{p.etiqueta}</span>
            <span style={css("font-family:var(--font-ui);font-size:14px;color:var(--text-2);letter-spacing:-.022em;")}>{p.operacion}</span>
            {p.resultado !== undefined && p.resultado !== "" && (
              <span style={css("margin-left:auto;font-family:var(--font-ui);font-weight:600;font-size:" + (p.final ? "22px" : "17px") + ";color:" + (p.final ? "var(--text)" : "var(--text-3)") + ";line-height:1;")}>
                = {p.resultado}
              </span>
            )}
          </div>
        ))}
      </div>
      {nota && <div style={css("font-family:var(--font-ui);font-style:normal;font-size:15px;color:var(--text-4);margin-top:11px;line-height:1.45;")}>{nota}</div>}
    </div>
  );
}
