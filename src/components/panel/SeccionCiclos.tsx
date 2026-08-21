"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { KDATA } from "@/lib/kdata";
import { recorta } from "@/lib/format";

export default function SeccionCiclos() {
  const { r } = useApp();
  if (!r) return null;
  const CI = KDATA.ciclos || ({} as typeof KDATA.ciclos);

  const ciclos = r.ciclos.ciclos.map((cv) => ({
    ...cv,
    rango: cv.hasta === null ? "desde los " + cv.desde + " años" : cv.desde + " – " + cv.hasta + " años",
    texto: recorta((CI.ciclos || {})[cv.numero] || "", 330),
  }));
  const realizaciones = r.ciclos.realizaciones.map((x) => ({
    ...x,
    rango: x.hasta === null ? "desde los " + x.desde : x.desde + " – " + x.hasta + " años",
    texto: recorta((CI.realizaciones || {})[x.valor] || "", 230),
  }));
  const desafios = r.ciclos.desafios.map((x) => ({ ...x, texto: recorta((CI.desafios || {})[x.valor] || "", 230) }));
  const textoAnioPersonal = (CI.anioPersonal || {})[r.ciclos.anioPersonal] || "";
  const etapas = r.ciclos.etapas.map((e) => ({
    ...e,
    actual: e.n === r.ciclos.etapaActual,
    texto: recorta((CI.etapas9 || {})[e.n] || "", 260),
  }));

  return (
    <div style={css("display:flex;flex-direction:column;gap:22px;")}>
      <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:20px;")}>
          <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;")}>Ciclos vitales</span>
          <span style={css("font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;")}>propósito de vida {r.ciclos.proposito}</span>
          <span style={css("margin-left:auto;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;")}>
            año {r.ciclos.anioUniversal} · <span style={css("font-family:'Cinzel',serif;font-size:19px;color:#E9CE84;")}>{r.ciclos.anioPersonal}</span>
          </span>
        </div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px;")}>
          {ciclos.map((c, i) => (
            <div key={i} style={css("border:1px solid rgba(201,168,76,.16);background:rgba(255,255,255,.02);border-radius:3px;padding:16px 18px;")}>
              <div style={css("font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#8A7F68;")}>{c.nombre}</div>
              <div style={css("font-family:'Cinzel',serif;font-size:34px;color:#F2E6C6;line-height:1.1;margin:4px 0;")}>{c.numero}</div>
              <div style={css("font-size:11px;letter-spacing:.13em;color:#A99C82;margin-bottom:8px;")}>{c.rango}</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{c.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:12px;")}>
          <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;")}>Tu año personal {r.ciclos.anioUniversal}</span>
          <span style={css("font-family:'Cinzel',serif;font-size:32px;color:#E9CE84;line-height:1;")}>{r.ciclos.anioPersonal}</span>
        </div>
        <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:#C8BEA6;margin:0;text-wrap:pretty;")}>{textoAnioPersonal}</p>
      </div>

      <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:16px;")}>
          <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;")}>Etapas de nueve años</span>
          <span style={css("font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;")}>
            ahora en la etapa {r.ciclos.etapaActual} · {r.ciclos.edad} años
          </span>
        </div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;")}>
          {etapas.map((e) => (
            <div
              key={e.n}
              style={css(
                "border-radius:3px;padding:13px 15px;border:1px solid " +
                  (e.actual ? "rgba(201,168,76,.5)" : "rgba(201,168,76,.13)") +
                  ";background:" +
                  (e.actual ? "rgba(201,168,76,.1)" : "rgba(255,255,255,.02)") +
                  ";"
              )}
            >
              <div style={css("display:flex;align-items:baseline;gap:8px;")}>
                <span style={css("font-family:'Cinzel',serif;font-size:22px;color:" + (e.actual ? "#F2E6C6" : "#B7A57C") + ";line-height:1;")}>{e.n}</span>
                <span style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;")}>
                  {e.desde} – {e.hasta} años
                </span>
                {e.actual && <span style={css("margin-left:auto;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#E9CE84;")}>ahora</span>}
              </div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.5;color:#B8AE97;margin:7px 0 0;")}>{e.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:22px;")}>
        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:14px;")}>Realizaciones</div>
          {realizaciones.map((r2, i) => (
            <div key={i} style={css("display:flex;gap:14px;padding:11px 0;border-bottom:1px solid rgba(201,168,76,.1);")}>
              <span style={css("font-family:'Cinzel',serif;font-size:24px;color:#E9CE84;min-width:32px;")}>{r2.valor}</span>
              <div>
                <div style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>
                  Realización {r2.n} · {r2.rango}
                </div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{r2.texto}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:14px;")}>Desafíos</div>
          {desafios.map((d, i) => (
            <div key={i} style={css("display:flex;gap:14px;padding:11px 0;border-bottom:1px solid rgba(201,168,76,.1);")}>
              <span style={css("font-family:'Cinzel',serif;font-size:24px;color:#E2574C;min-width:32px;")}>{d.valor}</span>
              <div>
                <div style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>
                  {d.etiqueta} · {d.rango}
                </div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
