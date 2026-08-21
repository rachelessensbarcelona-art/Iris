"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import { chipStyle, recorta } from "@/lib/format";

function celda(n: number, bloqueos: Record<number, number>, ayudas: Record<number, number>) {
  const b = bloqueos[n] || 0,
    ay = ayudas[n] || 0;
  return {
    n: n === 10 ? "10" : String(n),
    bloqueo: b ? String(n === 10 ? 0 : n).repeat(b) : "",
    ayuda: ay ? "●".repeat(ay) : "",
    style:
      "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:62px;border-radius:3px;border:1px solid " +
      (b ? "rgba(226,87,76,.5)" : "rgba(201,168,76,.16)") +
      ";background:" +
      (b ? "rgba(226,87,76,.09)" : "rgba(255,255,255,.02)") +
      ";width:100%;opacity:0;animation:es33-pop .5s cubic-bezier(.34,1.56,.64,1) forwards;animation-delay:" +
      (0.06 + (n % 11) * 0.06).toFixed(2) +
      "s;",
  };
}
const B_STYLE = "font-family:'Cinzel',serif;font-size:17px;letter-spacing:1px;color:#E2574C;line-height:1;min-height:17px;";
const A_STYLE = "font-size:9px;letter-spacing:2px;color:#6FAE7C;line-height:1;min-height:9px;";

export default function SeccionAlma() {
  const { r, verNumero, verTexto } = useApp();
  if (!r) return null;
  const ia = r.imagenAlma;
  const c = (n: number) => celda(n, ia.bloqueos, ia.ayudas);

  // Orden del manual (5.1 TABLA IMAGEN DEL ALMA): el 1 arriba a la izquierda,
  // filas espíritu / alma / materia, y el 10 abajo cruzando toda la tabla.
  const filasAlma = [
    { label: "Espíritu", celdas: [c(1), c(2), c(3)] },
    { label: "Alma", celdas: [c(4), c(5), c(6)] },
    { label: "Materia", celdas: [c(7), c(8), c(9)] },
  ];
  const celda10 = c(10);

  const bloqueos = r.bloqueos.map((b) => ({
    b,
    extracto: recorta(b.plano?.texto || "", 440),
    chips: [{ label: "Número " + b.numero, style: chipStyle("#C9A84C"), onClick: () => verNumero(b.numero) }]
      .concat(chipsDeFicha(b.ficha, verNumero))
      .concat([{ label: "Plano completo", style: chipStyle("#A99C82"), onClick: () => verTexto("Bloqueo " + b.casilla, b.plano?.nombre || "", "Plano de consciencia " + b.casilla, b.plano?.texto || "") }]),
  }));

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:30px;align-items:start;")}>
      <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(16px,2.2vw,22px);")}>
        <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;margin-bottom:14px;")}>Imagen del alma · nº {ia.numero}</div>
        <div style={css("display:grid;grid-template-columns:66px 1fr 1fr 1fr;gap:8px;margin-bottom:6px;")}>
          <span />
          {["Espíritu", "Alma", "Materia"].map((h) => (
            <span key={h} style={css("font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#8A7F68;text-align:center;")}>{h}</span>
          ))}
        </div>
        {filasAlma.map((f, fi) => (
          <div key={fi} style={css("display:grid;grid-template-columns:66px 1fr 1fr 1fr;gap:8px;margin-bottom:8px;align-items:center;")}>
            <span style={css("font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;")}>{f.label}</span>
            {f.celdas.map((cc, ci) => (
              <div key={ci} style={css(cc.style)}>
                <span style={css("font-family:'Cinzel',serif;font-size:15px;color:#8A7F68;")}>{cc.n}</span>
                <span style={css(B_STYLE)}>{cc.bloqueo}</span>
                <span style={css(A_STYLE)}>{cc.ayuda}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={css("display:grid;grid-template-columns:66px 1fr;gap:8px;align-items:center;")}>
          <span style={css("font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;")}>Evolución</span>
          <div style={css(celda10.style)}>
            <span style={css("font-family:'Cinzel',serif;font-size:15px;color:#8A7F68;")}>10 / 0</span>
            <span style={css(B_STYLE)}>{celda10.bloqueo}</span>
            <span style={css(A_STYLE)}>{celda10.ayuda}</span>
          </div>
        </div>
        <div style={css("display:flex;flex-direction:column;gap:6px;margin-top:14px;font-size:11px;letter-spacing:.1em;color:#8A7F68;")}>
          <div style={css("display:flex;align-items:center;gap:8px;")}>
            <span style={css("width:11px;height:11px;border-radius:2px;background:rgba(226,87,76,.75);")} />
            Bloqueos (estructura fija)
          </div>
          <div style={css("display:flex;align-items:center;gap:8px;")}>
            <span style={css("width:11px;height:11px;border-radius:50%;background:rgba(76,154,90,.8);")} />
            Ayudas espirituales (estructura móvil)
          </div>
          <div style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#7E7461;margin-top:4px;")}>
            {ia.proyeccion ? "El 0 cae en la casilla " + ia.proyeccion + ": eso es lo que proyectas de cara a los demás." : ""}
          </div>
        </div>
      </div>
      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        {bloqueos.map(({ b, extracto, chips }, i) => (
          <article
            key={i}
            style={css(
              "border:1px solid rgba(216,80,196,.22);background:rgba(168,68,155,.045);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);opacity:0;animation:es33-rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
                (0.18 + i * 0.13).toFixed(2) +
                "s;"
            )}
          >
            <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;")}>
              <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#D48BC4;")}>
                Bloqueo {b.casilla}
                {b.veces > 1 ? " · ×" + b.veces : ""}
              </span>
              <span style={css("font-family:'Cinzel',serif;font-size:21px;color:#F2E6C6;")}>{b.plano?.nombre || ""}</span>
              <span style={css("margin-left:auto;font-size:11px;letter-spacing:.18em;color:#8A7F68;")}>se forma con el número {b.numero}</span>
            </div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:#C8BEA6;margin:12px 0 0;text-wrap:pretty;")}>{extracto}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;")}>
              {chips.map((cc, ci) => (
                <button key={ci} onClick={cc.onClick} style={css(cc.style)}>
                  {cc.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
