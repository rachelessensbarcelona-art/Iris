import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import { KDATA } from "@/lib/kdata";
import { arbolGeometria } from "@/lib/arbol";
import { COL } from "@/lib/tree";

/** Versiones "documento" (fondo claro, sin animación) de los diagramas del panel. */

export function DocArbol({ r }: { r: Resultado }) {
  const { senderos, sefirot, marcasCamino } = arbolGeometria(r);
  const camDef = [
    { k: "origen" as const, c: r.caminos.origen, etapa: "Origen", rango: "0 – " + r.caminos.edadCambio + " años" },
    { k: "transformacion" as const, c: r.caminos.transformacion, etapa: "Transformación", rango: "toda la vida" },
    { k: "destino" as const, c: r.caminos.destino, etapa: "Destino", rango: "desde los " + (r.turbulencias ? r.caminos.edadCambio + 10 : r.caminos.edadCambio) },
  ];
  return (
    <div style={css("display:grid;grid-template-columns:210px 1fr;gap:22px;align-items:center;")}>
      <svg viewBox="0 0 380 660" style={css("width:100%;height:auto;")}>
        {senderos.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.w > 2 ? s.color : "#B9B2C4"} strokeWidth={s.w} strokeOpacity={s.o} strokeLinecap="round" />
        ))}
        {sefirot.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={19} fill={p.fill} stroke="rgba(40,36,48,.35)" strokeWidth={1} />
        ))}
        {marcasCamino.map((m, i) => (
          <text key={i} x={m.x} y={m.y} fill={m.color} fontSize={15} fontFamily="Cinzel, serif" textAnchor="middle">
            {m.n}
          </text>
        ))}
      </svg>
      <div style={css("display:flex;flex-direction:column;gap:11px;")}>
        {camDef.map((d, i) => (
          <div key={i} style={css("border-left:3px solid " + COL[d.k] + ";padding-left:12px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:" + COL[d.k] + ";")}>
              {d.etapa} · {d.rango}
            </div>
            <div style={css("font-family:'Cinzel',serif;font-size:19px;line-height:1.25;color:#241F2E;")}>
              {d.c.arcano} · {d.c.carta?.nombre || ""}
            </div>
            <div style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#6B6478;")}>{d.c.carta?.lema || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocEstructura({ r }: { r: Resultado }) {
  const est = r.estructura;
  const portales = [];
  for (let i = 1; i <= 10; i++) {
    const ang = ((-90 - (i - 1) * 36) * Math.PI) / 180;
    const x = 170 + Math.cos(ang) * 118,
      y = 170 + Math.sin(ang) * 118;
    const tieneA = !!est.aprendizajes[i],
      tieneE = !!est.escudos[i];
    portales.push({
      portal: i === 10 ? 0 : i,
      x,
      y,
      ty: y + 5,
      lx: 170 + Math.cos(ang) * 87,
      ly: 170 + Math.sin(ang) * 87 + 4,
      dinamico: est.dinamicos[i],
      fill: tieneA ? "#E5B63C" : "#F3EFE6",
      stroke: tieneE ? "#3E77C4" : "rgba(201,168,76,.5)",
      sw: tieneE ? 3 : 1,
      tcolor: tieneA ? "#241F2E" : "#9B93A8",
    });
  }
  const tensiones = ([] as Array<{ nombre: string; a: number; b: number; activo: boolean; tipo: string }>)
    .concat(r.ejes.map((e) => ({ nombre: e.eje.nombre, a: e.eje.a, b: e.eje.b, activo: e.activo, tipo: "Eje" })))
    .concat(r.planosTension.map((p) => ({ nombre: p.plano.nombre, a: p.plano.a, b: p.plano.b, activo: p.activo, tipo: "Plano" })));

  return (
    <div style={css("display:grid;grid-template-columns:220px 1fr;gap:22px;align-items:center;")}>
      <svg viewBox="0 0 340 340" style={css("width:100%;height:auto;")}>
        <circle cx={170} cy={170} r={118} fill="none" stroke="rgba(201,168,76,.35)" strokeWidth={1} />
        {portales.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={21} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} />
            <text x={p.x} y={p.ty} fill={p.tcolor} fontSize={14} fontFamily="Cinzel, serif" textAnchor="middle">
              {p.portal}
            </text>
            <text x={p.lx} y={p.ly} fill="#C0574C" fontSize={12} fontFamily="Karla, sans-serif" textAnchor="middle">
              {p.dinamico}
            </text>
          </g>
        ))}
        <text x={170} y={178} fill="#9A7F32" fontSize={34} fontFamily="Cinzel, serif" textAnchor="middle">
          {est.tipo}
        </text>
      </svg>
      <div style={css("display:flex;flex-direction:column;gap:7px;")}>
        {tensiones.map((t, i) => (
          <div
            key={i}
            style={css(
              "font-family:'Karla',sans-serif;font-size:11px;letter-spacing:.08em;padding:5px 9px;border-radius:2px;color:" +
                (t.activo ? "#8E3A2F" : "#6B6478") +
                ";background:" +
                (t.activo ? "rgba(192,87,76,.1)" : "rgba(201,168,76,.07)") +
                ";"
            )}
          >
            {t.tipo} {t.a}–{t.b} · {t.nombre} — {t.activo ? "en tensión" : "libre"}
          </div>
        ))}
      </div>
    </div>
  );
}

function celdaDoc(n: number, bloqueos: Record<number, number>, ayudas: Record<number, number>) {
  const b = bloqueos[n] || 0,
    ay = ayudas[n] || 0;
  return {
    n: n === 10 ? "10/0" : String(n),
    bloqueo: b ? String(n === 10 ? 0 : n).repeat(b) : "",
    ayuda: ay ? "●".repeat(ay) : "",
    style:
      "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;border-radius:3px;border:1px solid " +
      (b ? "rgba(192,87,76,.5)" : "rgba(201,168,76,.4)") +
      ";background:" +
      (b ? "rgba(192,87,76,.12)" : "#F3EFE6") +
      ";width:100%;",
  };
}
export function DocAlma({ r }: { r: Resultado }) {
  const ia = r.imagenAlma;
  const c = (n: number) => celdaDoc(n, ia.bloqueos, ia.ayudas);
  const filas = [
    { label: "C", celdas: [c(7), c(8), c(9)] },
    { label: "A", celdas: [c(4), c(5), c(6)] },
    { label: "E", celdas: [c(1), c(2), c(3)] },
  ];
  const celda10 = c(10);
  return (
    <div style={css("display:grid;grid-template-columns:230px 1fr;gap:24px;align-items:center;")}>
      <div>
        <div style={css("display:flex;justify-content:center;margin-bottom:7px;")}>
          <div style={css(celda10.style + "width:76px;")}>
            <span style={css("font-family:'Cinzel',serif;font-size:14px;color:#9B93A8;")}>{celda10.n}</span>
            <span style={css("font-family:'Cinzel',serif;font-size:15px;color:#B0342A;")}>{celda10.bloqueo}</span>
            <span style={css("font-size:9px;letter-spacing:2px;color:#3E7A4E;")}>{celda10.ayuda}</span>
          </div>
        </div>
        {filas.map((f, fi) => (
          <div key={fi} style={css("display:flex;align-items:center;gap:7px;margin-bottom:7px;")}>
            <div style={css("display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;flex:1;")}>
              {f.celdas.map((cc, ci) => (
                <div key={ci} style={css(cc.style)}>
                  <span style={css("font-family:'Cinzel',serif;font-size:14px;color:#9B93A8;")}>{cc.n}</span>
                  <span style={css("font-family:'Cinzel',serif;font-size:15px;color:#B0342A;")}>{cc.bloqueo}</span>
                  <span style={css("font-size:9px;letter-spacing:2px;color:#3E7A4E;")}>{cc.ayuda}</span>
                </div>
              ))}
            </div>
            <span style={css("width:12px;font-family:'Cinzel',serif;font-size:12px;color:#9B93A8;")}>{f.label}</span>
          </div>
        ))}
      </div>
      <div style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.5;color:#4A4356;")}>
        {ia.proyeccion ? "El 0 cae en la casilla " + ia.proyeccion + ": eso es lo que proyectas de cara a los demás." : ""}
      </div>
    </div>
  );
}

const DOC_TH = "font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#9B93A8;display:flex;align-items:center;justify-content:center;padding:5px 0;";
const DOC_TD = "font-family:'Cinzel',serif;font-size:16px;color:#37323F;display:flex;align-items:center;justify-content:center;padding:8px 0;border:1px solid rgba(201,168,76,.22);border-radius:3px;background:#F3EFE6;";
const DOC_TD_TOT = DOC_TD.replace("#37323F", "#241F2E").replace("#F3EFE6", "rgba(201,168,76,.22)");

export function DocCuentas({ r }: { r: Resultado }) {
  const c = r.cuentas;
  const tabla: Array<{ v: string | number; style: string }> = [
    { v: "", style: DOC_TH }, { v: "Día", style: DOC_TH }, { v: "Mes", style: DOC_TH }, { v: "Año", style: DOC_TH }, { v: "Cuenta", style: DOC_TH },
    { v: "E", style: DOC_TH }, { v: c.espiritu.dia, style: DOC_TD }, { v: c.espiritu.mes, style: DOC_TD }, { v: c.espiritu.anio, style: DOC_TD }, { v: c.espiritu.total, style: DOC_TD_TOT },
    { v: "A", style: DOC_TH }, { v: c.alma.dia, style: DOC_TD }, { v: c.alma.mes, style: DOC_TD }, { v: c.alma.anio, style: DOC_TD }, { v: c.alma.total, style: DOC_TD_TOT },
    { v: "C", style: DOC_TH }, { v: c.cuerpo.dia, style: DOC_TD }, { v: c.cuerpo.mes, style: DOC_TD }, { v: c.cuerpo.anio, style: DOC_TD }, { v: c.cuerpo.total, style: DOC_TD_TOT },
    { v: "", style: DOC_TH }, { v: c.potenciales[0], style: DOC_TD_TOT }, { v: c.potenciales[1], style: DOC_TD_TOT }, { v: c.potenciales[2], style: DOC_TD_TOT }, { v: c.karmico, style: DOC_TD_TOT },
  ];
  const karma = [
    { label: "Nº kármico de las relaciones", valor: c.karmico },
    { label: "Nº del lema de vida", valor: c.lemaDeVida },
    { label: "Nº de efecto sanador", valor: r.vibraciones.efectoSanador },
    { label: "Nº de afinidad", valor: r.afinidad.diaMes + " · " + r.afinidad.mesAnio },
    { label: "Vibración cuerpo / alma / espíritu", valor: r.vibraciones.cuerpo + " · " + r.vibraciones.alma + " · " + r.vibraciones.espiritu },
  ];
  return (
    <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start;")}>
      <div style={css("display:grid;grid-template-columns:20px 1fr 1fr 1fr 1fr;gap:5px;")}>
        {tabla.map((cell, i) => (
          <div key={i} style={css(cell.style)}>
            {cell.v}
          </div>
        ))}
      </div>
      <div style={css("display:flex;flex-direction:column;gap:9px;")}>
        {karma.map((k, i) => (
          <div key={i} style={css("display:flex;gap:12px;align-items:baseline;border-bottom:1px solid rgba(201,168,76,.25);padding-bottom:7px;")}>
            <span style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#9B93A8;flex:1;")}>{k.label}</span>
            <span style={css("font-family:'Cinzel',serif;font-size:23px;color:#241F2E;")}>{k.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocCiclos({ r }: { r: Resultado }) {
  const CI = KDATA.ciclos;
  const ciclos = r.ciclos.ciclos.map((c) => ({ ...c, rango: c.hasta === null ? "desde los " + c.desde + " años" : c.desde + " – " + c.hasta + " años", texto: (CI.ciclos || {})[c.numero] || "" }));
  const realizaciones = r.ciclos.realizaciones.map((x) => ({ ...x, rango: x.hasta === null ? "desde los " + x.desde : x.desde + " – " + x.hasta + " años", texto: (CI.realizaciones || {})[x.valor] || "" }));
  const desafios = r.ciclos.desafios.map((x) => ({ ...x, texto: (CI.desafios || {})[x.valor] || "" }));
  return (
    <div style={css("display:flex;flex-direction:column;gap:16px;")}>
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px;")}>
        {ciclos.map((c, i) => (
          <div key={i} style={css("border-top:2px solid #C9A84C;padding-top:9px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#9B93A8;")}>
              {c.nombre} · {c.rango}
            </div>
            <div style={css("font-family:'Cinzel',serif;font-size:26px;color:#241F2E;line-height:1.2;")}>{c.numero}</div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.45;color:#4A4356;margin:3px 0 0;")}>{c.texto}</p>
          </div>
        ))}
      </div>
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px;")}>
        {realizaciones.map((x, i) => (
          <div key={i} style={css("border-left:2px solid #C9A84C;padding-left:12px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#9B93A8;")}>
              Realización {x.n} · {x.rango}
            </div>
            <div style={css("font-family:'Cinzel',serif;font-size:22px;color:#241F2E;")}>{x.valor}</div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.45;color:#4A4356;margin:3px 0 0;")}>{x.texto}</p>
          </div>
        ))}
      </div>
      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px;")}>
        {desafios.map((x, i) => (
          <div key={i} style={css("border-left:2px solid #C0574C;padding-left:12px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#9B93A8;")}>
              {x.etiqueta} · {x.rango}
            </div>
            <div style={css("font-family:'Cinzel',serif;font-size:22px;color:#241F2E;")}>{x.valor}</div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.45;color:#4A4356;margin:3px 0 0;")}>{x.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
