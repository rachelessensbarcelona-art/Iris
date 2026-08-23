"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import { chipStyle, recorta } from "@/lib/format";
import CuerpoPortales from "../CuerpoPortales";
import Desglose, { type Paso } from "../Desglose";
import { PORTALES_CUERPO } from "@/lib/cuerpo";
import { KDATA, TENSIONES, type TensionEntry } from "@/lib/kdata";

/** Dónde cae cada portal sobre el cuerpo, según los apuntes (§ pág. 127). */
const LUGAR: Record<number, string> = {
  1: "Cabeza, delante · tercer ojo",
  2: "Corona",
  3: "Cabeza, detrás · nuca",
  4: "Garganta, detrás",
  5: "Pecho, detrás",
  6: "Vientre, detrás",
  7: "Raíz",
  8: "Vientre, delante",
  9: "Pecho, delante",
  10: "Garganta, delante",
};

export default function SeccionEstructura() {
  const { r, verNumero, verTexto } = useApp();
  if (!r) return null;
  const est = r.estructura;
  const fc = est.fechaConvertida;

  // Sobre la figura conviven cuatro números distintos y sin esta leyenda no
  // hay forma de saber cuál es cuál.
  const punto = (fondo: string, borde: string, texto: string, contenido: string) =>
    css(
      `display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;font-size:14px;font-weight:700;background:${fondo};border:${borde};color:${texto};` + contenido
    );
  const LEYENDA: Array<{ muestra: React.ReactNode; titulo: string; texto: string }> = [
    {
      muestra: <span style={punto("#fff", "1px solid rgba(90,80,60,.45)", "#4A4550", "")}>7</span>,
      titulo: "Número grande · el portal",
      texto: "Los diez portales de energía, siempre en el mismo sitio del cuerpo. El décimo se rotula 0.",
    },
    {
      muestra: <span style={css("display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;font-size:15px;font-weight:600;color:var(--red);")}>{est.tipo}</span>,
      titulo: "Número pequeño rojo · el dinámico",
      texto: `Es el que cambia de una persona a otra. El portal 1 recibe el tipo de estructura (${est.tipo}) y de ahí la cuenta sigue de uno en uno por los diez portales.`,
    },
    {
      muestra: (
        <span style={css("display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:24px;padding:0 6px;border-radius:5px;background:#fff;border:2px solid #3E77C4;font-size:13px;font-weight:700;color:#2C5D9E;")}>
          {est.cifras[0]}
        </span>
      ),
      titulo: "Recuadro azul · el aprendizaje",
      texto: "Una cifra de tu fecha de nacimiento transformada que coincide con el dinámico de ese portal. Si la cifra sale dos veces, el aprendizaje va doble.",
    },
    {
      muestra: <span style={punto("#E5B63C", "none", "#241F2E", "")}>·</span>,
      titulo: "Portal dorado · tarea abierta",
      texto: "El portal que tiene aprendizaje: ahí está el trabajo de esta vida.",
    },
    {
      muestra: <span style={punto("#fff", "3px solid #3E77C4", "#4A4550", "")}>·</span>,
      titulo: "Aro azul · el escudo",
      texto: "Cada aprendizaje deja un escudo tres portales más allá: es la energía que te protege mientras haces esa tarea.",
    },
    {
      muestra: <span style={css("display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;font-size:19px;color:var(--gold);")}>◟</span>,
      titulo: "Conos laterales · los chakras",
      texto: "Cada pareja de portales comparte un vórtice que absorbe y expulsa energía. La corona sube y la raíz baja.",
    },
  ];

  // Cómo se llega al tipo de estructura, paso a paso.
  const cifras = (s: string) => s.split("").join("+");
  const pasosCalculo: Paso[] = [
    { etiqueta: "Fecha", operacion: `${r.fecha.dia} / ${r.fecha.mes} / ${r.fecha.anio}` },
    { etiqueta: "Se transforma", operacion: "0→7 · 1→6 · 2→5", resultado: `${fc.dia} / ${fc.mes} / ${fc.anio}` },
    { etiqueta: "Suma de cifras", operacion: `${cifras(fc.dia)} + ${cifras(fc.mes)} + ${cifras(fc.anio)}`, resultado: est.suma },
    { etiqueta: "Se reduce", operacion: est.pasos.join(" → "), resultado: est.tipo, final: true },
  ];

  // Cada eje/plano se acompaña de su explicación del manual (§20 y §21).
  const tensiones = ([] as Array<{ nombre: string; a: number; b: number; activo: boolean; tipo: string; info?: TensionEntry }>)
    .concat(r.ejes.map((e) => ({ nombre: e.eje.nombre, a: e.eje.a, b: e.eje.b, activo: e.activo, tipo: "Eje", info: TENSIONES.ejes[`${e.eje.a}-${e.eje.b}`] })))
    .concat(r.planosTension.map((p) => ({ nombre: p.plano.nombre, a: p.plano.a, b: p.plano.b, activo: p.activo, tipo: "Plano", info: TENSIONES.planos[`${p.plano.a}-${p.plano.b}`] })));

  // Somatizaciones de los portales con aprendizaje: van aquí, junto a la
  // estructura, porque es la energía de esos portales la que se somatiza.
  const enfermedades = r.aprendizajes
    .map((a) => ({ a, enf: a.enfermedades }))
    .filter((x): x is { a: (typeof r.aprendizajes)[number]; enf: NonNullable<(typeof r.aprendizajes)[number]["enfermedades"]> } =>
      !!x.enf && !!(x.enf.psico || x.enf.nota)
    );

  const aprendizajes = r.aprendizajes.map((a, ai) => ({
    a,
    ai,
    card:
      "border:1px solid var(--border-accent);background:var(--gold-soft);border-radius:var(--r);padding:var(--pad-card-sm);opacity:0;animation:es33-rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
      (0.18 + ai * 0.13).toFixed(2) +
      "s;",
    chips: [{ label: "Número " + a.numero, style: chipStyle("var(--gold)"), onClick: () => verNumero(a.numero) }]
      .concat(chipsDeFicha(a.ficha, verNumero))
      .concat([
        {
          label: "Tarea completa",
          style: chipStyle("var(--text-3)"),
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
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:var(--gap-lg);align-items:start;")}>
      <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
        <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
          <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:10px;")}>
            <span style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--text-3);")}>Estructura energética</span>
            <span style={css("font-family:var(--font-ui);font-weight:600;font-size:26px;color:var(--gold);line-height:1;")}>tipo {est.tipo}</span>
          </div>
          <CuerpoPortales r={r} />

          {/* Qué es cada número del dibujo. Sobre la figura conviven cuatro
           * cosas distintas y sin esto no hay forma de saber cuál es cuál. */}
          <div style={css("margin-top:var(--s4);padding-top:var(--s4);border-top:1px solid var(--border);")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:var(--s3);")}>Qué significa cada número del dibujo</div>
            <div style={css("display:flex;flex-direction:column;gap:var(--s3);")}>
              {LEYENDA.map((l, i) => (
                <div key={i} style={css("display:grid;grid-template-columns:38px 1fr;gap:var(--s3);align-items:start;")}>
                  <span style={css("justify-self:center;margin-top:2px;")}>{l.muestra}</span>
                  <span style={css("min-width:0;")}>
                    <span style={css("display:block;font-size:14px;font-weight:590;color:var(--text);line-height:1.3;")}>{l.titulo}</span>
                    <span style={css("display:block;font-size:14px;color:var(--text-3);line-height:1.45;margin-top:2px;text-wrap:pretty;")}>{l.texto}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Desglose
          titulo="De dónde sale la estructura"
          pasos={pasosCalculo}
          nota={`El portal 1 recibe el propio tipo (${est.tipo}) y a partir de ahí la cuenta sigue de uno en uno por los diez portales hasta cerrar el círculo: ese es el número dinámico de cada portal.`}
        />

        <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:var(--s3);")}>Los diez portales, uno a uno</div>
          <div style={css("display:flex;flex-direction:column;")}>
            {PORTALES_CUERPO.slice()
              .sort((a, b) => a.portal - b.portal)
              .map((p) => {
                const veces = est.aprendizajes[p.portal] || 0;
                const escudo = !!est.escudos[p.portal];
                const tarea = KDATA.tareas?.[p.portal];
                return (
                  <button
                    key={p.portal}
                    onClick={() =>
                      verTexto(
                        "Portal " + p.etiqueta,
                        tarea?.nombre || "Portal " + p.etiqueta,
                        LUGAR[p.portal],
                        (tarea?.texto || "") +
                          (tarea?.hiloRojo ? "\n\nHilo rojo: " + tarea.hiloRojo : "") +
                          (tarea?.neurosis ? "\n\nNeurosis: " + tarea.neurosis : "") +
                          (tarea?.sanador ? "\n\nPrincipio sanador: " + tarea.sanador : "")
                      )
                    }
                    style={css("display:grid;grid-template-columns:34px 1fr auto;gap:var(--s3);align-items:center;text-align:left;width:100%;padding:10px 2px;border:none;border-top:1px solid var(--border);background:none;cursor:pointer;")}
                  >
                    <span
                      style={css(
                        "justify-self:center;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;font-size:15px;font-weight:700;background:" +
                          (veces ? "#E5B63C" : "rgba(0,0,0,.04)") +
                          ";color:" +
                          (veces ? "#241F2E" : "var(--text-3)") +
                          ";border:" +
                          (escudo ? "2.5px solid var(--blue)" : "1px solid var(--border)") +
                          ";"
                      )}
                    >
                      {p.etiqueta}
                    </span>
                    <span style={css("min-width:0;")}>
                      <span style={css("display:block;font-size:15px;font-weight:590;color:var(--text);line-height:1.3;")}>{tarea?.nombre || "—"}</span>
                      <span style={css("display:block;font-size:13px;color:var(--text-4);margin-top:1px;")}>
                        {LUGAR[p.portal]} · dinámico <span style={css("color:var(--red);font-weight:590;")}>{est.dinamicos[p.portal]}</span>
                      </span>
                    </span>
                    <span style={css("justify-self:end;display:flex;flex-direction:column;align-items:flex-end;gap:2px;white-space:nowrap;")}>
                      {veces > 0 ? (
                        <span style={css("font-size:12px;font-weight:590;color:var(--gold-deep);background:var(--gold-soft);border-radius:980px;padding:3px 9px;")}>
                          Aprendizaje{veces > 1 ? " ×" + veces : ""}
                        </span>
                      ) : (
                        <span style={css("font-size:12px;font-weight:590;color:var(--green);")}>Maestría</span>
                      )}
                      {escudo && <span style={css("font-size:12px;font-weight:590;color:var(--blue);")}>Escudo</span>}
                    </span>
                  </button>
                );
              })}
          </div>
          <p style={css("font-size:14px;line-height:1.5;color:var(--text-4);margin:var(--s3) 0 0;text-wrap:pretty;")}>
            Los portales sin aprendizaje son maestrías: vienen resueltos y sostienen el trabajo de los demás. Pulsa cualquiera para leer su texto completo.
          </p>
        </div>

        <div style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--text-3);margin-bottom:8px;")}>Ejes y planos en tensión</div>
          <p style={css("font-family:var(--font-ui);font-size:15px;line-height:1.5;color:var(--text-4);margin:0 0 12px;")}>{TENSIONES.intro.ejes}</p>
          <div style={css("display:flex;flex-direction:column;gap:7px;")}>
            {tensiones.map((t, idx) => (
              <div
                key={idx}
                style={css(
                  "padding:11px 13px;border-radius:var(--r-sm);border:1px solid " +
                    (t.activo ? "var(--red-border)" : "var(--border)") +
                    ";background:" +
                    (t.activo ? "var(--red-soft)" : "rgba(0,0,0,.025)") +
                    ";"
                )}
              >
                <div style={css("display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:12px;color:" + (t.activo ? "var(--red)" : "var(--text-3)") + ";")}>
                  <span>
                    {t.tipo} {t.a}–{t.b} · {t.info?.nombre || t.nombre}
                  </span>
                  <span style={css("margin-left:auto;font-size:12px;font-weight:590;color:" + (t.activo ? "var(--red)" : "var(--text-4)") + ";")}>
                    {t.activo ? "en tensión" : "libre"}
                  </span>
                </div>
                {t.info && (
                  <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.55;color:var(--text-2);margin:7px 0 0;text-wrap:pretty;")}>
                    {recorta(t.info.texto, 300)}
                  </p>
                )}
                {t.info?.tension && (
                  <div style={css("font-size:13px;font-weight:590;color:var(--red);margin-top:6px;")}>Se tensa en: {t.info.tension}</div>
                )}
                {t.info && (
                  <button
                    onClick={() => verTexto(t.tipo + " " + t.a + "–" + t.b, t.info!.nombre, t.activo ? "En tensión" : "Libre", t.info!.texto + (t.info!.tension ? "\n\nSe tensa en: " + t.info!.tension : ""))}
                    style={css(chipStyle(t.activo ? "var(--red)" : "var(--text-3)") + "margin-top:9px;")}
                  >
                    Texto completo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {enfermedades.length > 0 && (
          <div style={css("border:1px solid var(--red-border);background:var(--red-soft);border-radius:var(--r);padding:var(--pad-card-sm);")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:var(--red);margin-bottom:8px;")}>Enfermedades y debilidades</div>
            <p style={css("font-family:var(--font-ui);font-size:15px;line-height:1.5;color:var(--text-4);margin:0 0 12px;")}>
              Si el aprendizaje del portal no se trabaja, la energía se somatiza en los órganos que rige ese chakra.
            </p>
            <div style={css("display:flex;flex-direction:column;gap:11px;")}>
              {enfermedades.map(({ a, enf }) => (
                <div key={a.portal} style={css("border-left:2px solid var(--red);padding-left:12px;")}>
                  <div style={css("font-size:12px;font-weight:590;color:var(--red);margin-bottom:4px;")}>
                    Portal {a.portal} · {a.tarea?.nombre || ""}
                  </div>
                  {enf.nota ? (
                    <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{enf.nota}</p>
                  ) : (
                    <div style={css("display:flex;flex-direction:column;gap:5px;")}>
                      {([["Psicológicas", enf.psico], ["Órganos", enf.organos], ["Físicas", enf.fisicas]] as const).map(([k, v]) =>
                        v ? (
                          <div key={k}>
                            <span style={css("font-size:12px;font-weight:590;color:var(--text-3);")}>{k}: </span>
                            <span style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);")}>{v}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
        <article style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card-sm);")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:10px;")}>Estructura número {est.tipo}</div>
          <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.62;color:var(--text-2);margin:0;text-wrap:pretty;")}>{r.tipoEstructura?.texto || ""}</p>
          <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;margin-top:14px;")}>
            <div style={css("border-left:2px solid var(--red);padding-left:12px;")}>
              <div style={css("font-size:12px;font-weight:590;color:var(--red);margin-bottom:4px;")}>Vivido en negativo</div>
              <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{r.tipoEstructura?.negativo || ""}</p>
            </div>
            <div style={css("border-left:2px solid var(--green);padding-left:12px;")}>
              <div style={css("font-size:12px;font-weight:590;color:var(--green);margin-bottom:4px;")}>Vivido en positivo</div>
              <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{r.tipoEstructura?.positivo || ""}</p>
            </div>
          </div>
        </article>
        {aprendizajes.map(({ a, ai, card, chips }) => (
          <article key={ai} style={css(card)}>
            <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;")}>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);")}>
                Aprendizaje {a.portal}
                {a.veces > 1 ? " · ×" + a.veces : ""}
              </span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:21px;color:var(--text);")}>{a.tarea?.nombre || ""}</span>
              <span style={css("margin-left:auto;font-size:13px;font-weight:590;color:var(--text-3);")}>viene del número {a.numero}</span>
            </div>
            <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.6;color:var(--text-2);margin:12px 0 0;text-wrap:pretty;")}>{recorta(a.tarea?.texto || "", 460)}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;")}>
              {chips.map((c, ci) => (
                <button key={ci} onClick={c.onClick} style={css(c.style)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={css("margin-top:14px;border-top:1px solid var(--border);padding-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;")}>
              <div>
                <div style={css("font-size:12px;font-weight:590;color:var(--text-3);margin-bottom:3px;")}>Hilo rojo</div>
                <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{recorta(a.tarea?.hiloRojo || "", 210)}</p>
              </div>
              <div>
                <div style={css("font-size:12px;font-weight:590;color:var(--text-3);margin-bottom:3px;")}>Principio sanador</div>
                <p style={css("font-family:var(--font-ui);font-size:16px;line-height:1.5;color:var(--text-2);margin:0;")}>{recorta(a.tarea?.sanador || "", 210)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
