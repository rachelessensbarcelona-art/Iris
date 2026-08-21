"use client";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { chipsDeFicha } from "@/lib/chips";
import { chipStyle, recorta } from "@/lib/format";
import CuerpoPortales from "../CuerpoPortales";
import Desglose, { type Paso } from "../Desglose";
import { PORTALES_CUERPO } from "@/lib/cuerpo";
import { TENSIONES, type TensionEntry } from "@/lib/kdata";

export default function SeccionEstructura() {
  const { r, verNumero, verTexto } = useApp();
  if (!r) return null;
  const est = r.estructura;
  const fc = est.fechaConvertida;

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
      "border:1px solid rgba(232,185,60,.24);background:rgba(232,185,60,.045);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);opacity:0;animation:es33-rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:" +
      (0.18 + ai * 0.13).toFixed(2) +
      "s;",
    chips: [{ label: "Número " + a.numero, style: chipStyle("#C9A84C"), onClick: () => verNumero(a.numero) }]
      .concat(chipsDeFicha(a.ficha, verNumero))
      .concat([
        {
          label: "Tarea completa",
          style: chipStyle("#A99C82"),
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
    <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:30px;align-items:start;")}>
      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
          <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:10px;")}>
            <span style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;")}>Estructura energética</span>
            <span style={css("font-family:'Cinzel',serif;font-size:26px;color:#E9CE84;line-height:1;")}>tipo {est.tipo}</span>
          </div>
          <CuerpoPortales r={r} />
          <div style={css("display:flex;flex-direction:column;gap:6px;margin-top:12px;font-size:11px;letter-spacing:.1em;color:#8A7F68;")}>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("width:11px;height:11px;border-radius:50%;background:rgba(232,185,60,.88);")} />
              Portal con aprendizaje
            </div>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("width:11px;height:11px;border-radius:50%;border:2px solid rgba(76,143,224,.75);")} />
              Escudo energético
            </div>
            <div style={css("display:flex;align-items:center;gap:8px;")}>
              <span style={css("color:#E2574C;font-size:13px;")}>7</span>
              Número dinámico
            </div>
          </div>
        </div>

        <Desglose
          titulo="De dónde sale la estructura"
          pasos={pasosCalculo}
          nota={`El portal 1 recibe el propio tipo (${est.tipo}) y a partir de ahí la cuenta sigue de uno en uno por los diez portales hasta cerrar el círculo: ese es el número dinámico de cada portal.`}
        />

        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;margin-bottom:10px;")}>Número dinámico de cada portal</div>
          <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(56px,1fr));gap:7px;")}>
            {PORTALES_CUERPO.map((p) => {
              const tieneTarea = !!est.aprendizajes[p.portal];
              return (
                <div
                  key={p.portal}
                  style={css(
                    "display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:3px;border:1px solid " +
                      (tieneTarea ? "rgba(232,185,60,.45)" : "rgba(201,168,76,.13)") +
                      ";background:" +
                      (tieneTarea ? "rgba(232,185,60,.10)" : "rgba(255,255,255,.02)") +
                      ";"
                  )}
                >
                  <span style={css("font-family:'Cinzel',serif;font-size:16px;color:#E9CE84;line-height:1;")}>{p.etiqueta}</span>
                  <span style={css("font-size:13px;color:#E2574C;line-height:1;")}>{est.dinamicos[p.portal]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8A7F68;margin-bottom:8px;")}>Ejes y planos en tensión</div>
          <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.5;color:#7E7461;margin:0 0 12px;")}>{TENSIONES.intro.ejes}</p>
          <div style={css("display:flex;flex-direction:column;gap:7px;")}>
            {tensiones.map((t, idx) => (
              <div
                key={idx}
                style={css(
                  "padding:11px 13px;border-radius:3px;border:1px solid " +
                    (t.activo ? "rgba(226,87,76,.4)" : "rgba(201,168,76,.1)") +
                    ";background:" +
                    (t.activo ? "rgba(226,87,76,.08)" : "rgba(255,255,255,.02)") +
                    ";"
                )}
              >
                <div style={css("display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:12px;color:" + (t.activo ? "#DE8B82" : "#A99C82") + ";")}>
                  <span>
                    {t.tipo} {t.a}–{t.b} · {t.info?.nombre || t.nombre}
                  </span>
                  <span style={css("margin-left:auto;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:" + (t.activo ? "#DE8B82" : "#7E7461") + ";")}>
                    {t.activo ? "en tensión" : "libre"}
                  </span>
                </div>
                {t.info && (
                  <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.55;color:#B8AE97;margin:7px 0 0;text-wrap:pretty;")}>
                    {recorta(t.info.texto, 300)}
                  </p>
                )}
                {t.info?.tension && (
                  <div style={css("font-size:11px;letter-spacing:.1em;color:#C8695F;margin-top:6px;")}>Se tensa en: {t.info.tension}</div>
                )}
                {t.info && (
                  <button
                    onClick={() => verTexto(t.tipo + " " + t.a + "–" + t.b, t.info!.nombre, t.activo ? "En tensión" : "Libre", t.info!.texto + (t.info!.tension ? "\n\nSe tensa en: " + t.info!.tension : ""))}
                    style={css(chipStyle(t.activo ? "#E2574C" : "#A99C82") + "margin-top:9px;")}
                  >
                    Texto completo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {enfermedades.length > 0 && (
          <div style={css("border:1px solid rgba(226,87,76,.28);background:rgba(226,87,76,.05);border-radius:4px;padding:clamp(15px,2vw,20px);")}>
            <div style={css("font-family:'Cinzel',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#E2574C;margin-bottom:8px;")}>Enfermedades y debilidades</div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.5;color:#7E7461;margin:0 0 12px;")}>
              Si el aprendizaje del portal no se trabaja, la energía se somatiza en los órganos que rige ese chakra.
            </p>
            <div style={css("display:flex;flex-direction:column;gap:11px;")}>
              {enfermedades.map(({ a, enf }) => (
                <div key={a.portal} style={css("border-left:2px solid rgba(226,87,76,.5);padding-left:12px;")}>
                  <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#D08A82;margin-bottom:4px;")}>
                    Portal {a.portal} · {a.tarea?.nombre || ""}
                  </div>
                  {enf.nota ? (
                    <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{enf.nota}</p>
                  ) : (
                    <div style={css("display:flex;flex-direction:column;gap:5px;")}>
                      {([["Psicológicas", enf.psico], ["Órganos", enf.organos], ["Físicas", enf.fisicas]] as const).map(([k, v]) =>
                        v ? (
                          <div key={k}>
                            <span style={css("font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#8A7F68;")}>{k}: </span>
                            <span style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;")}>{v}</span>
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

      <div style={css("display:flex;flex-direction:column;gap:16px;")}>
        <article style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
          <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#C9A84C;margin-bottom:10px;")}>Estructura número {est.tipo}</div>
          <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.62;color:#C8BEA6;margin:0;text-wrap:pretty;")}>{r.tipoEstructura?.texto || ""}</p>
          <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;margin-top:14px;")}>
            <div style={css("border-left:2px solid rgba(226,87,76,.5);padding-left:12px;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C8695F;margin-bottom:4px;")}>Vivido en negativo</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{r.tipoEstructura?.negativo || ""}</p>
            </div>
            <div style={css("border-left:2px solid rgba(76,154,90,.5);padding-left:12px;")}>
              <div style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#6FAE7C;margin-bottom:4px;")}>Vivido en positivo</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{r.tipoEstructura?.positivo || ""}</p>
            </div>
          </div>
        </article>
        {aprendizajes.map(({ a, ai, card, chips }) => (
          <article key={ai} style={css(card)}>
            <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;")}>
              <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#E9CE84;")}>
                Aprendizaje {a.portal}
                {a.veces > 1 ? " · ×" + a.veces : ""}
              </span>
              <span style={css("font-family:'Cinzel',serif;font-size:21px;color:#F2E6C6;")}>{a.tarea?.nombre || ""}</span>
              <span style={css("margin-left:auto;font-size:11px;letter-spacing:.18em;color:#8A7F68;")}>viene del número {a.numero}</span>
            </div>
            <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:#C8BEA6;margin:12px 0 0;text-wrap:pretty;")}>{recorta(a.tarea?.texto || "", 460)}</p>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;")}>
              {chips.map((c, ci) => (
                <button key={ci} onClick={c.onClick} style={css(c.style)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={css("margin-top:14px;border-top:1px solid rgba(201,168,76,.14);padding-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;")}>
              <div>
                <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>Hilo rojo</div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{recorta(a.tarea?.hiloRojo || "", 210)}</p>
              </div>
              <div>
                <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8A7F68;margin-bottom:3px;")}>Principio sanador</div>
                <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#B8AE97;margin:0;")}>{recorta(a.tarea?.sanador || "", 210)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
