"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { arbolGeometria } from "@/lib/arbol";
import { COL } from "@/lib/tree";
import { frase, recorta, titulo } from "@/lib/format";

export default function SeccionArbol() {
  const { r, verArcano } = useApp();
  if (!r) return null;
  const { senderos, sefirot, marcasCamino } = arbolGeometria(r);

  const camDef = [
    { k: "origen" as const, etapa: "Origen", c: r.caminos.origen, rango: "0 – " + r.caminos.edadCambio + " años" },
    { k: "transformacion" as const, etapa: "Transformación", c: r.caminos.transformacion, rango: "toda la vida" },
    { k: "destino" as const, etapa: "Destino", c: r.caminos.destino, rango: "desde los " + (r.turbulencias ? r.caminos.edadCambio + 10 : r.caminos.edadCambio) + " años" },
  ];

  const caminos = camDef.map((d) => {
    const carta = d.c.carta || ({} as NonNullable<typeof d.c.carta>);
    return {
      ...d,
      nombre: titulo(carta.nombre),
      lema: frase(carta.lema),
      extracto: recorta((carta.texto || "").replace(/^[“"][^”"]*[”"]\.?\s*/, ""), 400),
    };
  });

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:30px;align-items:start;")}>
      <div style={css("background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.6));backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border:1px solid var(--border);border-radius:var(--r);padding:clamp(15px,2vw,20px);")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--text-3);margin-bottom:6px;")}>Árbol de la Vida</div>
        <svg viewBox="-54 -8 488 676" style={css("width:100%;height:auto;display:block;")}>
          {senderos.map((s, i) => (
            <line
              key={i}
              pathLength={1}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={s.color}
              strokeWidth={s.w}
              strokeOpacity={s.o}
              strokeLinecap="round"
              style={css(`stroke-dasharray:1;stroke-dashoffset:1;animation:es33-draw ${s.w > 2 ? ".9s" : ".55s"} cubic-bezier(.4,0,.2,1) forwards;animation-delay:${s.delay.toFixed(2)}s;`)}
            />
          ))}
          {sefirot.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={19}
                fill={p.fill}
                stroke="rgba(0,0,0,.22)"
                strokeWidth={1}
                style={css(`transform-box:fill-box;transform-origin:center;opacity:0;animation:es33-pop .62s cubic-bezier(.34,1.56,.64,1) forwards;animation-delay:${p.delay.toFixed(2)}s;`)}
              />
              <text x={p.tx} y={p.ty} fill="var(--text-3)" fontSize={13} fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontWeight={510} textAnchor={p.anchor} style={css(`opacity:0;animation:es33-in .5s ease forwards;animation-delay:${p.delayT.toFixed(2)}s;`)}>
                {p.nombre}
              </text>
            </g>
          ))}
          {marcasCamino.map((m, i) => (
            <text key={i} x={m.x} y={m.y} fill={m.color} fontSize={13} fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontWeight={600} textAnchor="middle" style={css(`opacity:0;animation:es33-in .5s ease forwards;animation-delay:${m.delay.toFixed(2)}s;`)}>
              {m.n}
            </text>
          ))}
        </svg>
        <div style={css("display:flex;flex-direction:column;gap:7px;margin-top:14px;border-top:1px solid var(--gold-soft);padding-top:14px;")}>
          {camDef.map((d, i) => (
            <div key={i} style={css("display:flex;align-items:center;gap:9px;font-size:13px;font-weight:590;color:var(--text-3);")}>
              <span style={css("width:22px;height:3px;border-radius:var(--r-xs);background:" + COL[d.k] + ";")} />
              {d.etapa} · arcano {d.c.arcano}
            </div>
          ))}
        </div>
      </div>

      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        {caminos.map((c, ci) => (
          <article
            key={ci}
            style={css(
              "border:1px solid " +
                COL[c.k] +
                "33;background:linear-gradient(150deg," +
                COL[c.k] +
                "14,rgba(255,255,255,.75));border-left:3px solid " +
                COL[c.k] +
                ";border-radius:var(--r);padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);opacity:0;animation:es33-rise .6s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
                (0.6 + ci * 0.16).toFixed(2) +
                "s;"
            )}
          >
            <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;")}>
              <span style={css("font-size:12px;font-weight:590;color:" + COL[c.k] + ";")}>{c.etapa}</span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:23px;line-height:1.25;color:var(--text);letter-spacing:-.022em;")}>
                {c.c.arcano} · {c.nombre}
              </span>
              <span style={css("margin-left:auto;font-size:12px;font-weight:590;color:var(--text-4);")}>{c.rango}</span>
            </div>
            <div style={css("font-family:var(--font-ui);font-style:normal;font-size:18px;color:var(--gold);margin-top:6px;")}>{c.lema}</div>
            <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.62;color:var(--text-2);margin:12px 0 0;text-wrap:pretty;")}>{c.extracto}</p>
            <button onClick={() => verArcano(c.c.arcano)} style={css("margin-top:12px;background:none;border:1px solid var(--border-accent);color:var(--gold);border-radius:980px;padding:7px 15px;font-size:15px;font-weight:590;cursor:pointer;")}>
              Texto completo
            </button>
          </article>
        ))}

        {r.turbulencias && (
          <article style={css("border:1px solid var(--red-border);background:var(--red-soft);border-radius:var(--r);padding:clamp(15px,2vw,20px) clamp(16px,2.2vw,22px);")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--red);margin-bottom:10px;")}>
              Años de turbulencias · {r.turbulencias.desde} – {r.turbulencias.hasta} años
            </div>
            {r.turbulencias.lista.map((t, i) => (
              <div key={i} style={css("margin-bottom:10px;")}>
                <div style={css("font-size:13px;font-weight:590;color:var(--red);margin-bottom:3px;")}>
                  Turbulencias en {t.tipo} · {t.causa}
                </div>
                <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.6;color:var(--text-2);margin:0;")}>{t.texto}</p>
              </div>
            ))}
          </article>
        )}
      </div>
    </div>
  );
}
