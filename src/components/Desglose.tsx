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
    <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px) clamp(16px,2.2vw,22px);")}>
      <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:12px;")}>{titulo}</div>
      <div style={css("display:flex;flex-direction:column;gap:2px;")}>
        {pasos.map((p, i) => (
          <div
            key={i}
            style={css(
              "display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;padding:7px 9px;border-radius:3px;background:" +
                (p.final ? "rgba(201,168,76,.10)" : "transparent") +
                ";"
            )}
          >
            <span style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;min-width:118px;")}>{p.etiqueta}</span>
            <span style={css("font-family:'Karla',sans-serif;font-size:14px;color:#C0B69F;letter-spacing:.02em;")}>{p.operacion}</span>
            {p.resultado !== undefined && p.resultado !== "" && (
              <span style={css("margin-left:auto;font-family:'Cinzel',serif;font-size:" + (p.final ? "22px" : "17px") + ";color:" + (p.final ? "#F2E6C6" : "#B7A57C") + ";line-height:1;")}>
                = {p.resultado}
              </span>
            )}
          </div>
        ))}
      </div>
      {nota && <div style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:#7E7461;margin-top:11px;line-height:1.45;")}>{nota}</div>}
    </div>
  );
}
