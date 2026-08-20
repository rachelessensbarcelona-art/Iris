"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";

const TH = "font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;display:flex;align-items:center;justify-content:center;padding:6px 0;";
const TD = "font-family:'Cinzel',serif;font-size:19px;color:#D8CDB2;display:flex;align-items:center;justify-content:center;padding:11px 0;border:1px solid rgba(201,168,76,.12);border-radius:3px;background:rgba(255,255,255,.02);";
const TD_TOT = TD.replace("#D8CDB2", "#F2E6C6").replace("rgba(255,255,255,.02)", "rgba(201,168,76,.1)");

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

  const tarjetas = [
    { label: "Nº kármico de las relaciones", valor: c.karmico, desc: "Dónde fallaste en tus relaciones en vidas pasadas y qué se repite en esta.", f: r.cuentasFichas.karmico },
    { label: "Nº del lema de vida", valor: c.lemaDeVida, desc: "El propósito de tu alma: la vibración que te permite llevar a cabo tu plan.", f: r.cuentasFichas.lema },
    { label: "Nº de efecto sanador", valor: r.vibraciones.efectoSanador, desc: `Cuerpo ${r.vibraciones.cuerpo} + alma ${r.vibraciones.alma} + espíritu ${r.vibraciones.espiritu}.`, f: r.efectoSanadorFicha },
    { label: "Números de afinidad", valor: `${r.afinidad.diaMes} · ${r.afinidad.mesAnio}`, desc: "Visión global de tus procesos kármicos: qué has venido a hacer en esta encarnación.", f: null },
  ];

  return (
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:22px;align-items:start;")}>
      <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);")}>
        <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;")}>Cuentas abiertas</div>
        <div style={css("display:grid;grid-template-columns:26px 1fr 1fr 1fr 1fr;gap:6px;")}>
          {tabla.map((cell, i) => (
            <div key={i} style={css(cell.style)}>
              {cell.v}
            </div>
          ))}
        </div>
        <div style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.55;color:#A99C82;margin-top:14px;")}>
          Cada potencial arcaico ayuda a cerrar la cuenta abierta de su fila: {c.potenciales[0]}→{c.cuentas[0]}, {c.potenciales[1]}→{c.cuentas[1]}, {c.potenciales[2]}→{c.cuentas[2]}.
        </div>
      </div>
      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        {tarjetas.map((k, i) => (
          <article key={i} style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px) clamp(16px,2.2vw,22px);")}>
            <div style={css("display:flex;align-items:baseline;gap:12px;")}>
              <span style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C;")}>{k.label}</span>
              <span style={css("font-family:'Cinzel',serif;font-size:30px;color:#F2E6C6;line-height:1;margin-left:auto;")}>{k.valor}</span>
            </div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.55;color:#B8AE97;margin:8px 0 0;")}>{k.desc}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;")}>
              {chipsDeFicha(k.f, verNumero).map((cc, ci) => (
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
