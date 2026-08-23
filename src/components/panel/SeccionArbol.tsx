"use client";
import { motion, useReducedMotion } from "framer-motion";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { arbolGeometria } from "@/lib/arbol";
import { COL } from "@/lib/tree";
import { frase, recorta, titulo } from "@/lib/format";
import Particulas from "../Particulas";
import Lienzo from "../Lienzo";

const FUENTE = "-apple-system, BlinkMacSystemFont, sans-serif";

export default function SeccionArbol() {
  const { r, verArcano } = useApp();
  const quieto = useReducedMotion();
  if (!r) return null;
  const { senderos, sefirot, marcasCamino, complementarios } = arbolGeometria(r);

  const camDef = [
    { k: "origen" as const, etapa: "Origen", c: r.caminos.origen, rango: "0 – " + r.caminos.edadCambio + " años" },
    { k: "transformacion" as const, etapa: "Transformación", c: r.caminos.transformacion, rango: "toda la vida" },
    { k: "destino" as const, etapa: "Destino", c: r.caminos.destino, rango: "desde los " + (r.turbulencias ? r.caminos.edadCambio + 10 : r.caminos.edadCambio) + " años" },
  ];

  const caminos = camDef.map((d) => {
    const carta = d.c.carta || ({} as NonNullable<typeof d.c.carta>);
    return { ...d, nombre: titulo(carta.nombre), lema: frase(carta.lema), extracto: recorta((carta.texto || "").replace(/^[“"][^”"]*[”"]\.?\s*/, ""), 420) };
  });

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:var(--gap);align-items:start;")}>
      <Lienzo anclado>
        <div style={css("display:flex;align-items:baseline;gap:var(--s3);margin-bottom:var(--s2);")}>
          <span style={css("font-size:17px;font-weight:600;letter-spacing:-.022em;color:var(--text);")}>Árbol de la Vida</span>
        </div>
        <div style={css("position:relative;")}>
          <Particulas cantidad={26} />
          <svg viewBox="-54 -8 488 676" style={css("position:relative;width:100%;height:auto;display:block;")}>
            {/* Complementarios primero, por debajo: van en discontinuo y la
             * línea corre, para que se lea que es energía que acompaña y no
             * un camino que se recorre. */}
            {complementarios.map((c, i) => (
              <motion.line
                key={"c" + i}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                stroke={c.color}
                strokeWidth={2.4}
                strokeOpacity={0.42}
                strokeLinecap="round"
                strokeDasharray="7 9"
                initial={quieto ? false : { opacity: 0 }}
                animate={quieto ? { opacity: 1 } : { opacity: 1, strokeDashoffset: [0, -32] }}
                transition={{
                  opacity: { delay: c.delay, duration: 0.6 },
                  strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: "linear" },
                }}
              />
            ))}
            {senderos.map((s, i) => (
              <motion.line
                key={i}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={s.color}
                strokeWidth={s.w}
                strokeOpacity={s.o}
                strokeLinecap="round"
                initial={quieto ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: s.delay, duration: s.w > 2 ? 0.9 : 0.55, ease: [0.4, 0, 0.2, 1] }}
              />
            ))}
            {sefirot.map((p, i) => (
              <g key={i}>
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={19}
                  fill={p.fill}
                  stroke="rgba(0,0,0,.22)"
                  strokeWidth={1}
                  initial={quieto ? false : { opacity: 0, scale: 0.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: p.delay, duration: 0.62, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <motion.text
                  x={p.tx}
                  y={p.ty}
                  fill="var(--text-3)"
                  fontSize={13}
                  fontFamily={FUENTE}
                  fontWeight={510}
                  textAnchor={p.anchor}
                  initial={quieto ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: p.delayT, duration: 0.5 }}
                >
                  {p.nombre}
                </motion.text>
              </g>
            ))}
            {marcasCamino.map((m, i) => (
              <motion.text
                key={i}
                x={m.x}
                y={m.y}
                fill={m.color}
                fontSize={14}
                fontFamily={FUENTE}
                fontWeight={700}
                textAnchor="middle"
                initial={quieto ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: m.delay, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {m.n}
              </motion.text>
            ))}
          </svg>
        </div>

        <div style={css("display:flex;flex-direction:column;gap:var(--s2);margin-top:var(--s4);border-top:1px solid var(--border);padding-top:var(--s4);")}>
          {camDef.map((d, i) => (
            <div key={i} style={css("display:flex;align-items:center;gap:var(--s3);font-size:14px;color:var(--text-3);")}>
              <span style={css("width:24px;height:3px;border-radius:2px;flex:none;background:" + COL[d.k] + ";")} />
              {d.etapa} · arcano {d.c.arcano}
            </div>
          ))}
          {complementarios.length > 0 && (
            <div style={css("display:flex;align-items:center;gap:var(--s3);font-size:14px;color:var(--text-3);")}>
              <span
                style={css(
                  "width:24px;height:0;flex:none;border-top:3px dashed var(--text-4);"
                )}
              />
              Complementarios · {complementarios.map((c) => c.n).join(", ")}
            </div>
          )}
        </div>
      </Lienzo>

      <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
        {caminos.map((c, ci) => (
          <article
            key={ci}
            data-alza=""
            style={css(
              "border:1px solid " + COL[c.k] + "33;background:linear-gradient(150deg," + COL[c.k] + "12,rgba(255,255,255,.78));border-left:3px solid " + COL[c.k] + ";border-radius:var(--r);padding:var(--pad-card-sm);"
            )}
          >
            <div style={css("display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;")}>
              <span style={css("font-size:13px;font-weight:590;color:" + COL[c.k] + ";")}>{c.etapa}</span>
              <span style={css("font-weight:600;font-size:23px;line-height:1.2;color:var(--text);letter-spacing:-.022em;")}>
                {c.c.arcano} · {c.nombre}
              </span>
              <span style={css("margin-left:auto;font-size:13px;color:var(--text-4);")}>{c.rango}</span>
            </div>
            <div style={css("font-size:17px;color:var(--gold);margin-top:var(--s2);line-height:1.4;")}>{c.lema}</div>
            <p style={css("font-size:17px;line-height:1.62;color:var(--text-2);margin:var(--s3) 0 0;text-wrap:pretty;")}>{c.extracto}</p>
            <button
              onClick={() => verArcano(c.c.arcano)}
              style={css("margin-top:var(--s3);background:rgba(255,255,255,.7);border:1px solid var(--border-accent);color:var(--gold);border-radius:980px;padding:8px 16px;font-size:14px;font-weight:590;cursor:pointer;")}
            >
              Texto completo
            </button>
          </article>
        ))}

        {r.turbulencias && (
          <article style={css("border:1px solid var(--red-border);background:var(--red-soft);border-radius:var(--r);padding:var(--pad-card-sm);")}>
            <div style={css("font-weight:600;font-size:14px;color:var(--red);margin-bottom:var(--s3);")}>
              Años de turbulencias · {r.turbulencias.desde} – {r.turbulencias.hasta} años
            </div>
            {r.turbulencias.lista.map((t, i) => (
              <div key={i} style={css("margin-bottom:var(--s3);")}>
                <div style={css("font-size:13px;font-weight:590;color:var(--red);margin-bottom:2px;")}>
                  Turbulencias en {t.tipo} · {t.causa}
                </div>
                <p style={css("font-size:17px;line-height:1.6;color:var(--text-2);margin:0;text-wrap:pretty;")}>{t.texto}</p>
              </div>
            ))}
          </article>
        )}
      </div>
    </div>
  );
}
