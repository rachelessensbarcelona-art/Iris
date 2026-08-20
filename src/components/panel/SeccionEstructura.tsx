"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import { chipStyle, recorta } from "@/lib/format";

export default function SeccionEstructura() {
  const { r, verNumero, verTexto } = useApp();
  if (!r) return null;
  const est = r.estructura;

  const portales = [];
  for (let i = 1; i <= 10; i++) {
    const ang = ((-90 - (i - 1) * 36) * Math.PI) / 180;
    const x = 170 + Math.cos(ang) * 118,
      y = 170 + Math.sin(ang) * 118;
    const tieneA = !!est.aprendizajes[i],
      tieneE = !!est.escudos[i];
    const d = 0.08 + (i - 1) * 0.085;
    portales.push({
      portal: i === 10 ? 0 : i,
      x,
      y,
      ty: y + 5,
      lx: 170 + Math.cos(ang) * 87,
      ly: 170 + Math.sin(ang) * 87 + 4,
      dinamico: est.dinamicos[i],
      fill: tieneA ? "rgba(232,185,60,.85)" : "rgba(255,255,255,.04)",
      stroke: tieneE ? "#4C8FE0" : "rgba(201,168,76,.3)",
      sw: tieneE ? 3 : 1,
      tcolor: tieneA ? "#1A1508" : "#A99C82",
      delay: d,
      delayT: d + 0.26,
    });
  }

  const tensiones = ([] as Array<{ nombre: string; a: number; b: number; activo: boolean; tipo: string }>)
    .concat(r.ejes.map((e) => ({ nombre: e.eje.nombre, a: e.eje.a, b: e.eje.b, activo: e.activo, tipo: "Eje" })))
    .concat(r.planosTension.map((p) => ({ nombre: p.plano.nombre, a: p.plano.a, b: p.plano.b, activo: p.activo, tipo: "Plano" })));

  const aprendizajes = r.aprendizajes.map((a, ai) => ({
    a,
    ai,
    card:
      "border:1px solid rgba(232,185,60,.24);background:rgba(232,185,60,.045);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);opacity:0;animation:es33-rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
      (0.18 + ai * 0.13).toFixed(2) +
      "s;",
    chips: [{ label: "Número " + a.numero, style: chipStyle("#C9A84C"), onClick: () => verNumero(a.numero) }]
      .concat(chipsDeFicha(a.ficha, verNumero))
      .concat([
        {
          label: "Tarea completa",
          style: chipStyle("#A99C82"),
          onClick: () =>
            verTexto(
              "Aprendizaje " + a.portal,
              a.tarea?.nombre || "",
              "Tarea número " + a.portal,
              (a.tarea?.texto || "") + "\n\nHilo rojo: " + (a.tarea?.hiloRojo || "") + "\n\nNeurosis: " + (a.tarea?.neurosis || "") + "\n\nPrincipio sanador: " + (a.tarea?.sanador || "")
            ),
        },
      ]),
  }));

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:30px;align-items:start;")}>
      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;margin-bottom:10px;")}>Estructura energética · tipo {est.tipo}</div>
          <svg viewBox="0 0 340 340" style={css("width:100%;height:auto;display:block;")}>
            <circle cx={170} cy={170} r={118} fill="none" stroke="rgba(201,168,76,.14)" strokeWidth={1} />
            {portales.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={21}
                  fill={p.fill}
                  stroke={p.stroke}
                  strokeWidth={p.sw}
                  style={css(`transform-box:fill-box;transform-origin:center;opacity:0;animation:es33-pop .58s cubic-bezier(.34,1.56,.64,1) forwards;animation-delay:${p.delay.toFixed(2)}s;`)}
                />
                <text x={p.x} y={p.ty} fill={p.tcolor} fontSize={13} fontFamily="Cinzel, serif" textAnchor="middle" style={css(`opacity:0;animation:es33-in .45s ease forwards;animation-delay:${p.delayT.toFixed(2)}s;`)}>
                  {p.portal}
                </text>
                <text x={p.lx} y={p.ly} fill="#E2574C" fontSize={12} fontFamily="Karla, sans-serif" textAnchor="middle" style={css(`opacity:0;animation:es33-in .45s ease forwards;animation-delay:${p.delayT.toFixed(2)}s;`)}>
                  {p.dinamico}
                </text>
              </g>
            ))}
            <text x={170} y={176} fill="#E9CE84" fontSize={30} fontFamily="Cinzel, serif" textAnchor="middle">
              {est.tipo}
            </text>
          </svg>
          <div style={css("display:flex;flex-direction:column;gap:6px;margin-top:10px;font-size:11px;letter-spacing:.1em;color:#8A7F68;")}>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("width:11px;height:11px;border-radius:50%;background:rgba(232,185,60,.85);")} />
              Portal con aprendizaje
            </div>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("width:11px;height:11px;border-radius:50%;border:2px solid rgba(76,143,224,.75);")} />
              Escudo energético
            </div>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("color:#E2574C;font-size:13px;")}>7</span>
              Número dinámico
            </div>
          </div>
        </div>
        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;margin-bottom:10px;")}>Ejes y planos en tensión</div>
          <div style={css("display:flex;flex-direction:column;gap:5px;")}>
            {tensiones.map((t, idx) => (
              <div
                key={idx}
                style={css(
                  "display:flex;align-items:center;gap:8px;padding:8px 11px;border-radius:3px;font-size:12px;border:1px solid " +
                    (t.activo ? "rgba(226,87,76,.4)" : "rgba(201,168,76,.1)") +
                    ";background:" +
                    (t.activo ? "rgba(226,87,76,.08)" : "rgba(255,255,255,.02)") +
                    ";color:" +
                    (t.activo ? "#DE8B82" : "#8A7F68") +
                    ";opacity:0;animation:es33-slide .45s ease forwards;animation-delay:" +
                    (0.1 + idx * 0.05).toFixed(2) +
                    "s;"
                )}
              >
                <span>
                  {t.tipo} {t.a}–{t.b} · {t.nombre}
                </span>
                <span style={css("margin-left:auto;font-size:10px;letter-spacing:.16em;text-transform:uppercase;")}>{t.activo ? "en tensión" : "libre"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        <article style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:10px;")}>Estructura número {est.tipo}</div>
          <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.62;color:#C8BEA6;margin:0;text-wrap:pretty;")}>{r.tipoEstructura?.texto || ""}</p>
          <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;margin-top:14px;")}>
            <div style={css("border-left:2px solid rgba(226,87,76,.5);padding-left:12px;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C8695F;margin-bottom:4px;")}>Vivido en negativo</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{r.tipoEstructura?.negativo || ""}</p>
            </div>
            <div style={css("border-left:2px solid rgba(76,154,90,.5);padding-left:12px;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#6FAE7C;margin-bottom:4px;")}>Vivido en positivo</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{r.tipoEstructura?.positivo || ""}</p>
            </div>
          </div>
        </article>
        {aprendizajes.map(({ a, ai, card, chips }) => (
          <article key={ai} style={css(card)}>
            <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;")}>
              <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#E9CE84;")}>
                Aprendizaje {a.portal}
                {a.veces > 1 ? " · ×" + a.veces : ""}
              </span>
              <span style={css("font-family:'Cinzel',serif;font-size:21px;color:#F2E6C6;")}>{a.tarea?.nombre || ""}</span>
              <span style={css("margin-left:auto;font-size:11px;letter-spacing:.18em;color:#8A7F68;")}>viene del número {a.numero}</span>
            </div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:#C8BEA6;margin:12px 0 0;text-wrap:pretty;")}>{recorta(a.tarea?.texto || "", 460)}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;")}>
              {chips.map((c, ci) => (
                <button key={ci} onClick={c.onClick} style={css(c.style)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={css("margin-top:14px;border-top:1px solid rgba(201,168,76,.14);padding-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;")}>
              <div>
                <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>Hilo rojo</div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{recorta(a.tarea?.hiloRojo || "", 210)}</p>
              </div>
              <div>
                <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>Principio sanador</div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{recorta(a.tarea?.sanador || "", 210)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
