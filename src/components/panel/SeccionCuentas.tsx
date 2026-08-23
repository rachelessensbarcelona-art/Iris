"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import Desglose, { type Paso } from "../Desglose";
import Particulas from "../Particulas";

const TH = "font-size:12px;font-weight:590;color:var(--text-4);display:flex;align-items:center;justify-content:center;padding:6px 0;";
const TD = "font-family:var(--font-ui);font-weight:600;font-size:19px;color:var(--text-2);display:flex;align-items:center;justify-content:center;padding:11px 0;border:1px solid var(--gold-soft);border-radius:var(--r-sm);background:rgba(0,0,0,.025);";
const TD_TOT = TD.replace("var(--text-2)", "var(--text)").replace("rgba(0,0,0,.025)", "var(--border)");

export default function SeccionCuentas() {
  const { r, verNumero } = useApp();
  if (!r) return null;
  const c = r.cuentas;

  const tabla: Array<{ v: string | number; style: string }> = [
    { v: "", style: TH }, { v: "Día", style: TH }, { v: "Mes", style: TH }, { v: "Año", style: TH }, { v: "Cuenta", style: TH },
    { v: "E", style: TH }, { v: c.espiritu.dia, style: TD }, { v: c.espiritu.mes, style: TD }, { v: c.espiritu.anio, style: TD }, { v: c.espiritu.total, style: TD_TOT },
    { v: "A", style: TH }, { v: c.alma.dia, style: TD }, { v: c.alma.mes, style: TD }, { v: c.alma.anio, style: TD }, { v: c.alma.total, style: TD_TOT },
    { v: "C", style: TH }, { v: c.cuerpo.dia, style: TD }, { v: c.cuerpo.mes, style: TD }, { v: c.cuerpo.anio, style: TD }, { v: c.cuerpo.total, style: TD_TOT },
    { v: "", style: TH }, { v: c.potenciales[0], style: TD_TOT }, { v: c.potenciales[1], style: TD_TOT }, { v: c.potenciales[2], style: TD_TOT }, { v: c.karmico, style: TD_TOT },
  ];

  // De dónde sale cada número de esta pantalla (manual §29 a §35).
  const pasos: Paso[] = [
    { etiqueta: "Fila espíritu", operacion: `${c.espiritu.dia} + ${c.espiritu.mes} + ${c.espiritu.anio}`, resultado: c.espiritu.total },
    { etiqueta: "Fila alma", operacion: `${c.alma.dia} + ${c.alma.mes} + ${c.alma.anio}`, resultado: c.alma.total },
    { etiqueta: "Fila materia", operacion: `${c.cuerpo.dia} + ${c.cuerpo.mes} + ${c.cuerpo.anio}`, resultado: c.cuerpo.total },
    { etiqueta: "Potenciales", operacion: "suma de cada columna", resultado: c.potenciales.join(" · ") },
    { etiqueta: "Número kármico", operacion: `${c.espiritu.total} + ${c.alma.total} + ${c.cuerpo.total}`, resultado: c.karmico, final: true },
    {
      etiqueta: "Lema de vida",
      operacion: c.lemaEnApuntes
        ? `la liberación del ${c.karmico} según los apuntes (${c.karmico} + ${c.tensionKarmico})`
        : `${c.karmico} no figura en los apuntes: se calcula ${c.karmico} + ${c.tensionKarmico}`,
      resultado: c.lemaDeVida,
      final: true,
    },
    {
      etiqueta: "Efecto sanador",
      operacion: `cuerpo + alma + espíritu = ${r.vibraciones.cuerpo}+${r.vibraciones.alma}+${r.vibraciones.espiritu}`,
      resultado: r.vibraciones.efectoSanador,
    },
    { etiqueta: "Afinidad", operacion: `día+mes y mes+año`, resultado: `${r.afinidad.diaMes} · ${r.afinidad.mesAnio}` },
  ];

  const tarjetas = [
    { label: "Número kármico de las relaciones", valor: c.karmico, desc: "Dónde fallaste en tus relaciones en vidas pasadas y qué se repite en esta.", f: r.cuentasFichas.karmico },
    { label: "Número del lema de vida", valor: c.lemaDeVida, desc: "El propósito de tu alma: la vibración que te permite llevar a cabo tu plan.", f: r.cuentasFichas.lema },
    { label: "Número de efecto sanador", valor: r.vibraciones.efectoSanador, desc: `Cuerpo ${r.vibraciones.cuerpo} + alma ${r.vibraciones.alma} + espíritu ${r.vibraciones.espiritu}.`, f: r.efectoSanadorFicha },
    { label: "Números de afinidad", valor: `${r.afinidad.diaMes} · ${r.afinidad.mesAnio}`, desc: "Visión global de tus procesos kármicos: qué has venido a hacer en esta encarnación.", f: null, mistica: true },
  ];

  const notaLema = c.lemaEnApuntes
    ? "El lema de vida no es un número independiente: es el número de liberación del kármico, tomado tal cual de los apuntes."
    : `El ${c.karmico} no está en los apuntes, así que su liberación se ha calculado con la regla de tensión. Conviene comprobarlo a mano.`;

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:var(--gap-lg);align-items:start;")}>
      <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:16px;")}>Cuentas abiertas</div>
        <div style={css("display:grid;grid-template-columns:26px 1fr 1fr 1fr 1fr;gap:6px;")}>
          {tabla.map((cell, i) => (
            <div key={i} style={css(cell.style)}>
              {cell.v}
            </div>
          ))}
        </div>
        <div style={css("font-family:var(--font-ui);font-size:16px;line-height:1.55;color:var(--text-3);margin-top:var(--s4);")}>
          Cada potencial arcaico ayuda a cerrar la cuenta abierta de su fila: {c.potenciales[0]}→{c.cuentas[0]}, {c.potenciales[1]}→{c.cuentas[1]}, {c.potenciales[2]}→{c.cuentas[2]}.
        </div>
        <div style={css("margin-top:16px;")}>
          <Desglose titulo="De dónde salen estos números" pasos={pasos} nota={notaLema} />
        </div>
      </div>
      <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
        {tarjetas.map((k, i) => (
          <article
            key={i}
            style={css(
              "border:1px solid " +
                (k.mistica ? "var(--border-accent)" : "var(--border)") +
                ";background:" +
                (k.mistica ? "linear-gradient(155deg,rgba(201,168,76,.10),rgba(255,255,255,.72))" : "var(--surface)") +
                ";backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);position:relative;overflow:hidden;isolation:isolate;"
            )}
          >
            {/* La afinidad es la lectura más amplia de la carta — la que mira
             * la encarnación entera — así que es la única que lleva el polvo
             * dorado detrás. */}
            {k.mistica && (
              <div style={css("position:absolute;inset:0;z-index:0;pointer-events:none;")}>
                <Particulas cantidad={34} />
              </div>
            )}
            <div style={css("position:relative;z-index:1;")}>
              <div style={css("display:flex;align-items:baseline;gap:var(--s3);")}>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);")}>{k.label}</span>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:30px;color:var(--text);line-height:1;margin-left:auto;font-variant-numeric:tabular-nums;white-space:nowrap;")}>{k.valor}</span>
              </div>
              <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.55;color:var(--text-2);margin:var(--s2) 0 0;text-wrap:pretty;")}>{k.desc}</p>
              <div style={css("display:flex;flex-wrap:wrap;gap:var(--s2);margin-top:var(--s3);")}>
                {chipsDeFicha(k.f, verNumero).map((cc, ci) => (
                  <button key={ci} onClick={cc.onClick} style={css(cc.style)}>
                    {cc.label}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
