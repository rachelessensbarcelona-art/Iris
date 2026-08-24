"use client";
import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import { paraCliente } from "@/lib/estudio";
import { fechaLarga, frase, recorta, sinPunto, titulo } from "@/lib/format";
import { COL } from "@/lib/tree";
import styles from "./Estudio.module.css";

const ROTULO = "font-size:9px;font-weight:600;color:#9A7F32;letter-spacing:.02em;";
const DATO = "font-family:var(--font-display);font-size:26px;font-weight:500;color:#241F2E;line-height:1;letter-spacing:-.012em;";
const CUERPO = "font-size:10.5px;line-height:1.5;color:#3A3546;margin:3px 0 0;";

/**
 * Una sola hoja para entregar a quien recibe la lectura.
 *
 * El estudio largo es la herramienta de Iris; esto es lo que la persona se
 * lleva a casa: sus números, sus tres caminos, lo que tiene abierto y lo que
 * trae resuelto, sin una sola fórmula ni clave de la escuela. Todo lo que
 * entra aquí pasa por el mismo filtro que el documento largo.
 *
 * Cabe en un A4 porque los textos vienen recortados a medida, no porque se
 * confíe en que quepan: un arcano largo desbordaría la hoja y partiría en dos.
 */
export default function HojaCliente({ r, marca }: { r: Resultado; marca: string }) {
  const caminos = [
    { k: "origen" as const, etapa: "Origen", d: r.caminos.origen, rango: `hasta los ${r.caminos.edadCambio}` },
    { k: "transformacion" as const, etapa: "Transformación", d: r.caminos.transformacion, rango: "toda la vida" },
    { k: "destino" as const, etapa: "Destino", d: r.caminos.destino, rango: `desde los ${r.turbulencias ? r.caminos.edadCambio + 10 : r.caminos.edadCambio}` },
  ];

  const c = r.ciclos;
  const cicloActual = c.ciclos.find((x) => c.edad >= x.desde && (x.hasta === null || c.edad <= x.hasta)) || c.ciclos[c.ciclos.length - 1];

  const importante = [
    { l: "Hacia dónde", t: `Tu destino: ${titulo(r.caminos.destino.carta?.nombre)}.` },
    {
      l: "Qué trabajar",
      t:
        r.aprendizajes.length === 0
          ? "Nada abierto: sostener lo que ya viene resuelto."
          : `${recorta(r.aprendizajes.map((a) => sinPunto(frase(a.tarea?.nombre)) || "portal " + a.portal).join(", "), 62)} — de uno en uno.`,
    },
    { l: "Qué cerrar", t: `El kármico ${r.cuentas.karmico}, con el lema de vida ${r.cuentas.lemaDeVida}.` },
    { l: "Dónde estás", t: `Año personal ${c.anioPersonal} de nueve, ciclo ${cicloActual.nombre}.` },
  ];

  const cifras = [
    { l: "Número de corazón", v: r.corazon.valor, p: "Cómo vibras" },
    { l: "Esencia", v: r.esencia.valor, p: "Lo que has venido a ser" },
    { l: "Ego", v: r.ego.valor, p: "Cómo te ven" },
    { l: "Estructura", v: r.estructura.tipo, p: "Tu forma de energía" },
    { l: "Imagen del alma", v: r.imagenAlma.numero, p: "Tu consciencia" },
    { l: "Lema de vida", v: r.cuentas.lemaDeVida, p: "Tu propósito" },
  ];

  return (
    <section className={`${styles.page} ${styles.interior} ${styles.abreSeccion}`} style={css("display:flex;flex-direction:column;gap:11px;")}>
      <header style={css("display:flex;align-items:flex-end;gap:14px;border-bottom:1px solid rgba(154,127,50,.3);padding-bottom:11px;")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="" style={css("width:38px;height:38px;border-radius:50%;object-fit:cover;flex:none;")} />
        <div style={css("min-width:0;")}>
          <div style={css(ROTULO)}>{marca}</div>
          <h1 style={css("font-family:var(--font-display);font-size:25px;font-weight:500;letter-spacing:-.014em;color:#241F2E;margin:2px 0 0;line-height:1.15;overflow-wrap:anywhere;")}>
            {titulo(r.nombre.texto)}
          </h1>
        </div>
        <div style={css("margin-left:auto;text-align:right;font-size:10px;color:#7A7288;white-space:nowrap;")}>
          {fechaLarga(r.fecha.dia, r.fecha.mes, r.fecha.anio)}
        </div>
      </header>

      <div style={css("display:grid;grid-template-columns:repeat(3,1fr);gap:9px;")}>
        {cifras.map((x) => (
          <div key={x.l} style={css("border:1px solid rgba(154,127,50,.22);border-radius:9px;padding:9px 11px;background:rgba(201,168,76,.05);")}>
            <div style={css(ROTULO)}>{x.l}</div>
            <div style={css(DATO + "margin-top:3px;")}>{x.v}</div>
            <div style={css("font-size:9.5px;color:#7A7288;margin-top:2px;")}>{x.p}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={css(ROTULO + "margin-bottom:6px;")}>Tus tres caminos</div>
        <div style={css("display:flex;flex-direction:column;gap:6px;")}>
          {caminos.map((x) => (
            <div key={x.k} style={css("border-left:2.5px solid " + COL[x.k] + ";padding:2px 0 2px 10px;")}>
              <div style={css("display:flex;align-items:baseline;gap:7px;flex-wrap:wrap;")}>
                <span style={css("font-size:9px;font-weight:600;color:" + COL[x.k] + ";")}>{x.etapa}</span>
                <span style={css("font-family:var(--font-display);font-size:14px;font-weight:500;color:#241F2E;")}>
                  {x.d.arcano} · {titulo(x.d.carta?.nombre)}
                </span>
                <span style={css("margin-left:auto;font-size:9px;color:#8A8296;")}>{x.rango}</span>
              </div>
              <p style={css(CUERPO)}>{recorta(paraCliente(frase(x.d.carta?.lema) + ". " + (x.d.carta?.texto || "").replace(/^[“"][^”"]*[”"]\.?\s*/, "")), 135)}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:14px;")}>
        <div>
          <div style={css(ROTULO + "margin-bottom:6px;")}>Lo que traes abierto</div>
          {r.aprendizajes.length === 0 && <p style={css(CUERPO)}>No hay portales con aprendizaje: tu estructura viene resuelta.</p>}
          <div style={css("display:flex;flex-direction:column;gap:5px;")}>
            {r.aprendizajes.map((a, i) => (
              <div key={i} style={css("display:flex;gap:8px;align-items:baseline;")}>
                <span style={css("flex:none;display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:#E5B63C;color:#241F2E;font-size:9.5px;font-weight:700;")}>{a.portal}</span>
                <span style={css("min-width:0;")}>
                  <span style={css("display:block;font-size:11px;font-weight:600;color:#241F2E;line-height:1.25;")}>{frase(a.tarea?.nombre)}</span>
                  <span style={css("display:block;font-size:10px;color:#5A5468;line-height:1.4;margin-top:1px;")}>{recorta(paraCliente(a.tarea?.sanador || a.tarea?.texto || ""), 100)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={css(ROTULO + "margin-bottom:6px;")}>Lo que traes resuelto</div>
          <div style={css("display:flex;flex-wrap:wrap;gap:5px;")}>
            {r.estructura.maestrias.map((m) => (
              <span key={m} style={css("display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(76,154,90,.4);background:rgba(76,154,90,.07);border-radius:980px;padding:3px 9px;font-size:10px;color:#3D7A48;")}>
                <span style={css("width:11px;height:2.5px;border-radius:2px;background:#4C9A5A;")} />
                Portal {m === 10 ? "0" : m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:14px;border-top:1px solid rgba(0,0,0,.08);padding-top:11px;")}>
        <div>
          <div style={css(ROTULO + "margin-bottom:4px;")}>Dónde estás ahora</div>
          <div style={css("font-family:var(--font-display);font-size:15px;font-weight:500;color:#241F2E;")}>
            {cicloActual.nombre} · {cicloActual.numero}
          </div>
          <p style={css(CUERPO)}>
            {c.edad} años, dentro del ciclo que va de los {cicloActual.desde} a los {cicloActual.hasta === null ? "el final" : cicloActual.hasta}. Estás en el año personal {c.anioPersonal} de una rueda de nueve.
          </p>
        </div>
        <div>
          <div style={css(ROTULO + "margin-bottom:4px;")}>Tus días de fuerza</div>
          <div style={css("display:flex;gap:6px;margin-top:3px;")}>
            {r.diasFuerza.dias.map((d, i) => (
              <span
                key={d}
                style={css(
                  "display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;border-radius:50%;font-size:12px;font-weight:600;border:1px solid rgba(154,127,50,.35);color:#241F2E;background:" +
                    (i === 0 ? "rgba(201,168,76,.22)" : "transparent") +
                    ";"
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <p style={css(CUERPO)}>Del más fuerte al menos fuerte. Aprovéchalos para firmas y decisiones importantes.</p>
        </div>
      </div>

      {/* Lo que hay que retener, al pie. La hoja se lee entera una vez y
       * después se relee a saltos: esto es lo que se busca al releerla. */}
      <div style={css("border-top:1px solid rgba(154,127,50,.3);padding-top:8px;")}>
        <div style={css(ROTULO + "margin-bottom:4px;")}>Lo importante que has de tener en cuenta</div>
        <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:2px 14px;")}>
          {importante.map((x) => (
            <div key={x.l} style={css("display:flex;gap:6px;align-items:baseline;")}>
              <span style={css("flex:none;font-size:10px;font-weight:600;color:#241F2E;min-width:72px;")}>{x.l}</span>
              <span style={css("font-size:10px;line-height:1.4;color:#3A3546;")}>{x.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={css("margin-top:auto;padding-top:11px;border-top:1px solid rgba(0,0,0,.08);display:flex;align-items:baseline;gap:10px;")}>
        <span style={css("font-size:9.5px;color:#8A8296;")}>{marca}</span>
        <span style={css("margin-left:auto;font-size:9.5px;color:#8A8296;font-style:italic;")}>El nombre es la contraseña del alma</span>
      </div>
    </section>
  );
}
