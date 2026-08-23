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
      "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:62px;border-radius:var(--r-sm);border:1px solid " +
      (b ? "var(--red)" : "var(--border)") +
      ";background:" +
      (b ? "var(--red-soft)" : "rgba(0,0,0,.025)") +
      ";width:100%;opacity:0;animation:es33-pop .5s cubic-bezier(.34,1.56,.64,1) forwards;animation-delay:" +
      (0.06 + (n % 11) * 0.06).toFixed(2) +
      "s;",
  };
}
const B_STYLE = "font-family:var(--font-ui);font-weight:600;font-size:17px;letter-spacing:1px;color:var(--red);line-height:1;min-height:17px;";
const A_STYLE = "font-size:12px;font-weight:590;letter-spacing:2px;color:var(--green);line-height:1;min-height:9px;";

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
    chips: [{ label: "Número " + b.numero, style: chipStyle("var(--gold)"), onClick: () => verNumero(b.numero) }]
      .concat(chipsDeFicha(b.ficha, verNumero))
      .concat([{ label: "Plano completo", style: chipStyle("var(--text-3)"), onClick: () => verTexto("Bloqueo " + b.casilla, b.plano?.nombre || "", "Plano de consciencia " + b.casilla, b.plano?.texto || "") }]),
  }));

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:var(--gap-lg);align-items:start;")}>
      <div style={css("position:sticky;top:78px;align-self:start;max-height:calc(100vh - 96px);overflow-y:auto;border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--text-3);margin-bottom:14px;")}>Imagen del alma · número {ia.numero}</div>
        <div style={css("display:grid;grid-template-columns:66px 1fr 1fr 1fr;gap:var(--s2);margin-bottom:6px;")}>
          <span />
          {["Espíritu", "Alma", "Materia"].map((h) => (
            <span key={h} style={css("font-size:12px;font-weight:590;color:var(--text-3);text-align:center;")}>{h}</span>
          ))}
        </div>
        {filasAlma.map((f, fi) => (
          <div key={fi} style={css("display:grid;grid-template-columns:66px 1fr 1fr 1fr;gap:var(--s2);margin-bottom:var(--s2);align-items:center;")}>
            <span style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>{f.label}</span>
            {f.celdas.map((cc, ci) => (
              <div key={ci} style={css(cc.style)}>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:15px;color:var(--text-3);")}>{cc.n}</span>
                <span style={css(B_STYLE)}>{cc.bloqueo}</span>
                <span style={css(A_STYLE)}>{cc.ayuda}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={css("display:grid;grid-template-columns:66px 1fr;gap:var(--s2);align-items:center;")}>
          <span style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>Evolución</span>
          <div style={css(celda10.style)}>
            <span style={css("font-family:var(--font-ui);font-weight:600;font-size:15px;color:var(--text-3);")}>10 / 0</span>
            <span style={css(B_STYLE)}>{celda10.bloqueo}</span>
            <span style={css(A_STYLE)}>{celda10.ayuda}</span>
          </div>
        </div>
        <div style={css("display:flex;flex-direction:column;gap:6px;margin-top:var(--s4);font-size:13px;font-weight:590;color:var(--text-3);")}>
          <div style={css("display:flex;align-items:center;gap:var(--s2);")}>
            <span style={css("width:11px;height:11px;border-radius:3px;background:var(--red);")} />
            Bloqueos (estructura fija)
          </div>
          <div style={css("display:flex;align-items:center;gap:var(--s2);")}>
            <span style={css("width:11px;height:11px;border-radius:50%;background:var(--green);")} />
            Ayudas espirituales (estructura móvil)
          </div>
          <div style={css("font-family:var(--font-ui);font-style:normal;font-size:16px;color:var(--text-4);margin-top:4px;")}>
            {ia.proyeccion ? "El 0 cae en la casilla " + ia.proyeccion + ": eso es lo que proyectas de cara a los demás." : ""}
          </div>
        </div>
      </div>
      <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
        {bloqueos.map(({ b, extracto, chips }, i) => (
          <article
            key={i}
            style={css(
              "border:1px solid var(--border-accent);background:rgba(142,68,173,.06);border-radius:var(--r);padding:var(--pad-card-sm);opacity:0;animation:es33-rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
                (0.18 + i * 0.13).toFixed(2) +
                "s;"
            )}
          >
            <div style={css("display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;")}>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--purple);")}>
                Bloqueo {b.casilla}
                {b.veces > 1 ? " · ×" + b.veces : ""}
              </span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:21px;color:var(--text);")}>{b.plano?.nombre || ""}</span>
              <span style={css("margin-left:auto;font-size:13px;font-weight:590;color:var(--text-3);")}>se forma con el número {b.numero}</span>
            </div>
            <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.6;color:var(--text-2);margin:12px 0 0;text-wrap:pretty;")}>{extracto}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:var(--s2);margin-top:var(--s4);")}>
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
