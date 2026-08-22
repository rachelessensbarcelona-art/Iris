"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { KDATA } from "@/lib/kdata";
import { recorta } from "@/lib/format";
import Desglose, { type Paso } from "../Desglose";

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

  // De dónde sale cada número de esta pantalla.
  const c = r.ciclos;
  const cif = (n: number | string) => String(n).split("").join("+");
  const red = (bruto: number, fin: number) => (bruto === fin ? String(fin) : `${bruto} → ${fin}`);
  const finFormacion = c.ciclos[0].hasta ?? 0;
  const R = c.realizaciones.map((x) => x.valor);
  const D = c.desafios.map((x) => x.valor);
  const pasos: Paso[] = [
    { etiqueta: "Día", operacion: `${r.fecha.dia} → ${cif(r.fecha.dia)}`, resultado: c.diaR },
    { etiqueta: "Mes", operacion: `${r.fecha.mes} → ${cif(r.fecha.mes)}`, resultado: c.mesR },
    { etiqueta: "Año", operacion: `${r.fecha.anio} → ${cif(r.fecha.anio)}`, resultado: c.anioR },
    { etiqueta: "Propósito", operacion: `${c.mesR}+${c.diaR}+${c.anioR} = ${red(c.propositoBruto, c.proposito)}`, resultado: c.proposito, final: true },
    { etiqueta: "Fin formación", operacion: `36 − ${c.proposito}`, resultado: `${finFormacion} años` },
    { etiqueta: "Formación", operacion: "el mes reducido", resultado: c.mesR },
    { etiqueta: "Evolución", operacion: "el día reducido", resultado: c.diaR },
    { etiqueta: "Cosecha", operacion: "el año reducido", resultado: c.anioR },
    { etiqueta: "Realización 1", operacion: `mes + día = ${c.mesR}+${c.diaR}`, resultado: R[0] },
    { etiqueta: "Realización 2", operacion: `día + año = ${c.diaR}+${c.anioR}`, resultado: R[1] },
    { etiqueta: "Realización 3", operacion: `1ª + 2ª = ${R[0]}+${R[1]}`, resultado: R[2] },
    { etiqueta: "Realización 4", operacion: `mes + año = ${c.mesR}+${c.anioR}`, resultado: R[3] },
    { etiqueta: "Desafío 1", operacion: `|mes − día| = |${c.mesR}−${c.diaR}|`, resultado: D[0] },
    { etiqueta: "Desafío 2", operacion: `|día − año| = |${c.diaR}−${c.anioR}|`, resultado: D[1] },
    { etiqueta: "Desafío mayor", operacion: `|1º − 2º| = |${D[0]}−${D[1]}|`, resultado: D[2] },
    { etiqueta: "Año personal", operacion: `día + mes + ${c.anioUniversal} = ${r.fecha.dia}+${r.fecha.mes}+${c.anioUniversal}`, resultado: c.anioPersonal },
    { etiqueta: "Etapa actual", operacion: `${c.edad} años ÷ 9`, resultado: `etapa ${c.etapaActual}` },
  ];

  return (
    <div style={css("display:flex;flex-direction:column;gap:22px;")}>
      <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:20px;")}>
          <span style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);")}>Ciclos vitales</span>
          <span style={css("font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);")}>propósito de vida {r.ciclos.proposito}</span>
          <span style={css("margin-left:auto;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);")}>
            año {r.ciclos.anioUniversal} · <span style={css("font-family:var(--font-ui);font-weight:600;font-size:19px;color:var(--gold);")}>{r.ciclos.anioPersonal}</span>
          </span>
        </div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px;")}>
          {ciclos.map((c, i) => (
            <div key={i} style={css("border:1px solid var(--border);background:rgba(0,0,0,.025);border-radius:var(--r-sm);padding:16px 18px;")}>
              <div style={css("font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);")}>{c.nombre}</div>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:34px;color:var(--text);line-height:1.1;margin:4px 0;")}>{c.numero}</div>
              <div style={css("font-size:11px;letter-spacing:.13em;color:var(--text-3);margin-bottom:8px;")}>{c.rango}</div>
              <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{c.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <Desglose titulo="De dónde salen estos números" pasos={pasos} nota="Todos los ciclos parten de reducir a una cifra el día, el mes y el año de nacimiento; lo demás son sumas y restas entre esos tres." />

      <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:12px;")}>
          <span style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);")}>Tu año personal {r.ciclos.anioUniversal}</span>
          <span style={css("font-family:var(--font-ui);font-weight:600;font-size:32px;color:var(--gold);line-height:1;")}>{r.ciclos.anioPersonal}</span>
        </div>
        <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.6;color:var(--text-2);margin:0;text-wrap:pretty;")}>{textoAnioPersonal}</p>
      </div>

      <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:16px;")}>
          <span style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);")}>Etapas de nueve años</span>
          <span style={css("font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);")}>
            ahora en la etapa {r.ciclos.etapaActual} · {r.ciclos.edad} años
          </span>
        </div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;")}>
          {etapas.map((e) => (
            <div
              key={e.n}
              style={css(
                "border-radius:var(--r-sm);padding:13px 15px;border:1px solid " +
                  (e.actual ? "var(--gold)" : "var(--border)") +
                  ";background:" +
                  (e.actual ? "var(--gold-soft)" : "rgba(0,0,0,.025)") +
                  ";"
              )}
            >
              <div style={css("display:flex;align-items:baseline;gap:8px;")}>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:22px;color:" + (e.actual ? "var(--text)" : "var(--text-3)") + ";line-height:1;")}>{e.n}</span>
                <span style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);")}>
                  {e.desde} – {e.hasta} años
                </span>
                {e.actual && <span style={css("margin-left:auto;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);")}>ahora</span>}
              </div>
              <p style={css("font-family:var(--font-ui);font-size:15px;line-height:1.5;color:var(--text-2);margin:7px 0 0;")}>{e.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:22px;")}>
        <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;")}>Realizaciones</div>
          {realizaciones.map((r2, i) => (
            <div key={i} style={css("display:flex;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);")}>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:24px;color:var(--gold);min-width:32px;")}>{r2.valor}</span>
              <div>
                <div style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin-bottom:3px;")}>
                  Realización {r2.n} · {r2.rango}
                </div>
                <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{r2.texto}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;")}>Desafíos</div>
          {desafios.map((d, i) => (
            <div key={i} style={css("display:flex;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);")}>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:24px;color:var(--red);min-width:32px;")}>{d.valor}</span>
              <div>
                <div style={css("font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin-bottom:3px;")}>
                  {d.etiqueta} · {d.rango}
                </div>
                <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
