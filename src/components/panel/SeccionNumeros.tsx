"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import { chipStyle } from "@/lib/format";

export default function SeccionNumeros() {
  const { r, verNumero } = useApp();
  if (!r) return null;

  const nDef = [
    { label: "Número de corazón", o: r.corazon, desc: "el número pin de tu alma, cómo vibras" },
    { label: "Número de esencia", o: r.esencia, desc: "tus valores internos más profundos" },
    { label: "Número de ego", o: r.ego, desc: "la conexión que tienes con las personas" },
  ];

  return (
    <div style={css("display:flex;flex-direction:column;gap:18px;")}>
      {nDef.map((d, i) => {
        const chips = chipsDeFicha(d.o.ficha, verNumero).concat(
          d.o.ficha && d.o.ficha.enDiccionario ? [{ label: "Significado " + d.o.valor, style: chipStyle("var(--gold)"), onClick: () => verNumero(d.o.valor) }] : []
        );
        return (
          <article key={i} style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
            <div style={css("display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;")}>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);")}>{d.label}</span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:42px;line-height:1;color:var(--text);")}>{d.o.valor}</span>
              <span style={css("font-family:var(--font-ui);font-style:normal;font-size:18px;color:var(--text-3);")}>{d.desc}</span>
            </div>
            <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;margin-top:16px;")}>
              <div style={css("border-left:2px solid var(--red);padding:2px 0 2px 12px;")}>
                <div style={css("font-size:12px;font-weight:590;color:var(--red);margin-bottom:4px;")}>En negativo</div>
                <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.55;color:var(--text-2);margin:0;")}>{d.o.lectura.negativo}</p>
              </div>
              <div style={css("border-left:2px solid var(--green);padding:2px 0 2px 12px;")}>
                <div style={css("font-size:12px;font-weight:590;color:var(--green);margin-bottom:4px;")}>En positivo</div>
                <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.55;color:var(--text-2);margin:0;")}>{d.o.lectura.positivo}</p>
              </div>
            </div>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;")}>
              {chips.map((c, ci) => (
                <button key={ci} onClick={c.onClick} style={css(c.style)}>
                  {c.label}
                </button>
              ))}
            </div>
          </article>
        );
      })}

      <article style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:12px;")}>Tus días de fuerza</div>
        <div style={css("display:flex;gap:12px;align-items:center;flex-wrap:wrap;")}>
          {r.diasFuerza.dias.map((n, i) => (
            <span
              key={i}
              style={css(
                "display:inline-flex;align-items:center;justify-content:center;min-width:52px;height:52px;border-radius:50%;font-family:var(--font-ui);font-weight:600;font-size:" +
                  (i === 0 ? 26 : 20) +
                  "px;border:1px solid " +
                  (i === 0 ? "var(--gold)" : "var(--border-accent)") +
                  ";background:" +
                  (i === 0 ? "var(--border)" : "rgba(0,0,0,.025)") +
                  ";color:" +
                  (i === 0 ? "var(--text)" : "var(--text-3)") +
                  ";"
              )}
            >
              {n}
            </span>
          ))}
          <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.5;color:var(--text-3);margin:0 0 0 8px;flex:1;min-width:240px;")}>
            Van del más fuerte al menos fuerte. Aprovecha estos días del mes para firmas y decisiones relevantes.
          </p>
        </div>
      </article>
    </div>
  );
}
