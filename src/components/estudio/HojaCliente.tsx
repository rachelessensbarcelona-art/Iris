"use client";
import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import { fechaLarga, frase, sinPunto, titulo } from "@/lib/format";
import { COL } from "@/lib/tree";
import styles from "./Estudio.module.css";

const ROTULO = "font-size:9px;font-weight:700;color:#9A7F32;letter-spacing:.09em;text-transform:uppercase;";
const CUERPO = "font-size:11.5px;line-height:1.55;color:#3A3546;margin:0;";
const APUNTE = "font-size:10.5px;line-height:1.5;color:#6B6478;margin:0;";
const RAYA = "border-top:1px solid rgba(154,127,50,.28);";

/**
 * La hoja que se lleva quien recibe la lectura.
 *
 * No es un resumen para Iris: es para alguien que no ha oído hablar de Kábala
 * en su vida. Por eso cada apartado dice primero **qué es** y luego qué sale
 * en esta carta — «lo que ya sabías hacer al llegar» antes que «camino de
 * origen», y el nombre del arcano después—. Ni fórmulas, ni claves de la
 * escuela, ni números sueltos sin explicar.
 *
 * Cabe en una cara porque los textos están escritos a la medida del hueco, no
 * porque se recorten: nada acaba en puntos suspensivos.
 */
export default function HojaCliente({ r, marca }: { r: Resultado; marca: string }) {
  const c = r.ciclos;
  const cicloActual = c.ciclos.find((x) => c.edad >= x.desde && (x.hasta === null || c.edad <= x.hasta)) || c.ciclos[c.ciclos.length - 1];
  const entraDestino = r.turbulencias ? r.caminos.edadCambio + 10 : r.caminos.edadCambio;

  // Los tres caminos, dichos como se los explicarías a alguien en una mesa.
  const caminos = [
    {
      k: "origen" as const,
      titulo: "De dónde vienes",
      cuando: `hasta los ${r.caminos.edadCambio}`,
      carta: r.caminos.origen.carta,
      que: "Lo que ya sabías hacer al llegar. Te sostiene en la primera parte de la vida.",
    },
    {
      k: "transformacion" as const,
      titulo: "Cómo eres",
      cuando: "toda la vida",
      carta: r.caminos.transformacion.carta,
      que: "Tu manera de estar en el mundo. Nace y se acaba contigo, no cambia de tramo.",
    },
    {
      k: "destino" as const,
      titulo: "Hacia dónde vas",
      cuando: `desde los ${entraDestino}`,
      carta: r.caminos.destino.carta,
      que: "El sitio al que te lleva la vida cuando dejas de empujar en contra.",
    },
  ];

  const cifras = [
    { l: "Tu número", v: r.corazon.valor, p: "El de tu nombre y tu fecha juntos" },
    { l: "Por dentro", v: r.esencia.valor, p: "Lo que has venido a ser" },
    { l: "Por fuera", v: r.ego.valor, p: "Lo que ven los demás de ti" },
    { l: "Tu consciencia", v: r.imagenAlma.numero, p: "Desde dónde miras la vida" },
  ];

  const aprendizajes = r.aprendizajes.map((a) => sinPunto(frase(a.tarea?.nombre)) || `Portal ${a.portal}`);
  const bloqueos = r.bloqueos.map((b) => sinPunto(frase(b.plano?.nombre)).replace(/^Consciencia (?:de la|del|de) /i, ""));
  const maestrias = r.estructura.maestrias.map((m) => (m === 10 ? "0" : m));

  return (
    <section className={`${styles.page} ${styles.interior} ${styles.abreSeccion} ${styles.hoja}`} style={css("display:flex;flex-direction:column;gap:17px;")}>
      <header style={css("display:flex;align-items:flex-end;gap:13px;" + RAYA.replace("top", "bottom") + "padding-bottom:10px;")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="" style={css("width:36px;height:36px;border-radius:50%;object-fit:cover;flex:none;")} />
        <div style={css("min-width:0;")}>
          <div style={css(ROTULO)}>{marca}</div>
          <h1 style={css("font-family:var(--font-display);font-size:25px;font-weight:500;letter-spacing:-.014em;color:#241F2E;margin:3px 0 0;line-height:1.15;overflow-wrap:anywhere;")}>
            {titulo(r.nombre.texto)}
          </h1>
        </div>
        <div style={css("margin-left:auto;text-align:right;flex:none;")}>
          <div style={css("font-size:10px;color:#7A7288;white-space:nowrap;")}>{fechaLarga(r.fecha.dia, r.fecha.mes, r.fecha.anio)}</div>
          <div style={css(ROTULO + "margin-top:3px;")}>Resumen de tu estudio</div>
        </div>
      </header>

      <p style={css(CUERPO)}>
        Esto es tu estudio en una hoja. Cada apartado te dice primero qué significa y después qué sale en tu caso. No hace falta
        saber nada de Kábala para leerlo: el documento largo lo desarrolla todo con calma, y esto es lo que conviene tener a mano.
      </p>

      <div style={css("display:grid;grid-template-columns:repeat(4,1fr);gap:8px;")}>
        {cifras.map((x) => (
          <div key={x.l} style={css("border:1px solid rgba(154,127,50,.22);border-radius:8px;padding:8px 10px;background:rgba(201,168,76,.05);")}>
            <div style={css(ROTULO)}>{x.l}</div>
            <div style={css("font-family:var(--font-display);font-size:27px;font-weight:500;color:#241F2E;line-height:1.05;margin-top:3px;letter-spacing:-.012em;")}>{x.v}</div>
            <div style={css("font-size:9.5px;color:#7A7288;margin-top:3px;line-height:1.35;")}>{x.p}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={css("display:flex;align-items:baseline;gap:8px;margin-bottom:6px;")}>
          <span style={css(ROTULO)}>Tus tres caminos</span>
          <span style={css(APUNTE)}>Los tres van a la vez; lo que cambia es cuánto pesa cada uno.</span>
        </div>
        <div style={css("display:flex;flex-direction:column;gap:10px;")}>
          {caminos.map((x) => (
            <div key={x.k} style={css("border-left:2.5px solid " + COL[x.k] + ";padding:1px 0 1px 10px;")}>
              <div style={css("display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;")}>
                <span style={css("font-size:11.5px;font-weight:700;color:#241F2E;")}>{x.titulo}</span>
                <span style={css("font-family:var(--font-display);font-size:15px;font-weight:500;color:" + COL[x.k] + ";")}>{titulo(x.carta?.nombre)}</span>
                <span style={css("margin-left:auto;font-size:9px;color:#8A8296;white-space:nowrap;")}>{x.cuando}</span>
              </div>
              <p style={css(APUNTE + "margin-top:1px;")}>{x.que}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:1.15fr 1fr;gap:16px;" + RAYA + "padding-top:10px;")}>
        <div>
          <div style={css(ROTULO + "margin-bottom:2px;")}>Lo que has venido a trabajar</div>
          <p style={css(APUNTE + "margin-bottom:5px;")}>No son defectos ni cosas que estén mal en ti: son las tareas de esta vida. Se trabajan de una en una.</p>
          {aprendizajes.length === 0 ? (
            <p style={css(CUERPO)}>Ninguna pendiente. Tu trabajo es sostener lo que ya traes hecho.</p>
          ) : (
            <div style={css("display:flex;flex-direction:column;gap:5px;")}>
              {r.aprendizajes.map((a, i) => (
                <div key={i} style={css("display:flex;gap:7px;align-items:baseline;")}>
                  <span style={css("flex:none;display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:#E5B63C;color:#241F2E;font-size:9.5px;font-weight:700;")}>{a.portal === 10 ? "0" : a.portal}</span>
                  <span style={css("font-size:11.5px;line-height:1.35;color:#241F2E;")}>{aprendizajes[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={css("display:flex;flex-direction:column;gap:9px;")}>
          <div>
            <div style={css(ROTULO + "margin-bottom:2px;")}>Lo que ya traes aprendido</div>
            <p style={css(APUNTE)}>
              {maestrias.length === 0
                ? "Todo está por trabajar en esta vida."
                : `De los diez puntos de tu figura, ${maestrias.length} vienen resueltos de antes: el ${maestrias.slice(0, -1).join(", el ")} y el ${maestrias[maestrias.length - 1]}. Es tu terreno firme, en lo que te puedes apoyar.`}
            </p>
          </div>
          <div>
            <div style={css(ROTULO + "margin-bottom:2px;")}>Dónde se te atasca</div>
            <p style={css(APUNTE)}>
              {bloqueos.length === 0
                ? "No hay puntos atascados: la energía te circula limpia."
                : `${bloqueos.join(", ")}. Son los sitios donde la energía se te queda parada. Reconocerlos ya es media parte.`}
            </p>
          </div>
        </div>
      </div>

      <div style={css("display:grid;grid-template-columns:1.15fr 1fr;gap:16px;" + RAYA + "padding-top:10px;")}>
        <div>
          <div style={css(ROTULO + "margin-bottom:2px;")}>Dónde estás ahora</div>
          <p style={css(CUERPO)}>
            {c.edad} años, dentro de la etapa de {frase(cicloActual.nombre).toLocaleLowerCase("es")} —de los {cicloActual.desde} a los{" "}
            {cicloActual.hasta === null ? "el final" : cicloActual.hasta}—.
          </p>
          <p style={css(APUNTE + "margin-top:3px;")}>
            Y dentro de ella, el año {c.anioPersonal} de una rueda que se repite cada nueve. Lo que toca este año no es lo que
            tocará el que viene: por eso conviene mirar la carta de vez en cuando y no una sola vez.
          </p>
        </div>
        <div>
          <div style={css(ROTULO + "margin-bottom:4px;")}>Tus días de fuerza</div>
          <div style={css("display:flex;gap:5px;flex-wrap:wrap;")}>
            {r.diasFuerza.dias.map((d, i) => (
              <span
                key={d}
                style={css(
                  "display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:50%;font-size:12.5px;font-weight:600;border:1px solid rgba(154,127,50,.35);color:#241F2E;background:" +
                    (i === 0 ? "rgba(201,168,76,.24)" : "transparent") +
                    ";"
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <p style={css(APUNTE + "margin-top:4px;")}>
            Los días del mes que te acompañan, empezando por el más fuerte. Guárdalos para firmar, empezar algo o decidir.
          </p>
        </div>
      </div>

      <div style={css(RAYA + "padding-top:10px;")}>
        <div style={css(ROTULO + "margin-bottom:4px;")}>Si sólo te quedas con una cosa</div>
        <p style={css(CUERPO)}>
          Que vas hacia {sinPunto(titulo(r.caminos.destino.carta?.nombre))}
          {r.aprendizajes.length > 0 ? `, y que el camino pasa por ${aprendizajes.length === 1 ? "esa tarea" : "esas " + aprendizajes.length + " tareas"} de arriba, de una en una y sin prisa` : ", y que tu trabajo es sostener lo que ya traes hecho"}
          . Nada de esto está cerrado ni decidido de antemano: es el mapa, y el camino lo andas tú.
        </p>
      </div>

      <div style={css("margin-top:auto;padding-top:10px;" + RAYA + "display:flex;align-items:baseline;gap:10px;")}>
        <span style={css("font-size:9.5px;color:#8A8296;")}>{marca}</span>
        <span style={css("margin-left:auto;font-size:9.5px;color:#8A8296;font-style:italic;")}>El nombre es la contraseña del alma</span>
      </div>
    </section>
  );
}
