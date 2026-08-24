"use client";
import { motion } from "framer-motion";
import { css } from "@/lib/css";
import { useApp, valida } from "@/lib/app-context";
import { analizaNombre, esVocal } from "@/lib/engine";
import Particulas from "../Particulas";

function saludo(): string {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 14) return "Buenos días";
  if (h < 21) return "Buenas tardes";
  return "Buenas noches";
}

const TARJETA =
  "background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:var(--pad-card);";
const ROTULO = "font-size:var(--t-mini);font-weight:590;color:var(--gold);";

export default function ConsultaScreen() {
  const { f, set, calcular, hist, abrir, borrar } = useApp();

  const n = analizaNombre([f.nombre, f.ap1, f.ap2].filter(Boolean).join(" "));
  const err = valida(f);
  const listo = !err;

  const campo = (label: string, key: "nombre" | "ap1" | "ap2" | "dia" | "mes" | "anio", numeric?: boolean) => (
    <label style={css("display:flex;flex-direction:column;gap:var(--s2);min-width:0;")}>
      <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);")}>{label}</span>
      <input
        size={4}
        value={f[key]}
        onChange={(e) => set(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        inputMode={numeric ? "numeric" : undefined}
        style={css(
          "width:100%;min-width:0;background:color-mix(in srgb, var(--text) 6%, transparent);border:1px solid transparent;border-radius:var(--r-sm);padding:14px 16px;color:var(--text);font-family:var(--font-ui);font-size:var(--t-read);"
        )}
      />
    </label>
  );

  return (
    <main style={css("position:relative;max-width:1140px;margin:0 auto;padding:clamp(40px,7vh,84px) var(--gutter) var(--s8);")}>
      {/* El polvo cubre la pantalla entera, no una tarjeta: es la puerta de
       * entrada al estudio y se lee mejor como atmósfera que como adorno. */}
      <div style={css("position:absolute;inset:0;z-index:0;pointer-events:none;")}>
        <Particulas cantidad={64} />
      </div>

      <div style={css("position:relative;z-index:1;")}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={css("text-align:center;max-width:660px;margin:0 auto var(--s8);")}
        >
          <div style={css(ROTULO + "margin-bottom:var(--s4);")}>{saludo()}, Iris</div>
          <h1 style={css("font-size:clamp(34px,6vw,58px);line-height:1.06;letter-spacing:-.018em;color:var(--text);margin:0 0 var(--s5);")}>
            ¿A quién estudiamos hoy?
          </h1>
          <p style={css("font-size:clamp(17px,2vw,20px);line-height:1.55;color:var(--text-3);margin:0;")}>
            Dime el nombre de la partida de nacimiento y la fecha exacta. Yo hago las cuentas, te enseño de dónde sale cada número y te dejo el estudio listo para imprimir.
          </p>
        </motion.div>

        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:var(--gap-lg);align-items:start;")}>
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={css(
              "background:linear-gradient(160deg,color-mix(in srgb, var(--surface-solid) 88%, transparent),color-mix(in srgb, var(--surface-solid) 58%, transparent));box-shadow:var(--shadow-lg);border:1px solid var(--border-accent);border-radius:var(--r-lg);padding:clamp(24px,3vw,36px);position:relative;"
            )}
          >
            <div style={css("position:absolute;top:-1px;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);")} />
            <div style={css(ROTULO + "margin-bottom:var(--s6);")}>Datos de nacimiento</div>

            <div style={css("display:flex;flex-direction:column;gap:var(--s5);")}>
              {campo("Nombre", "nombre")}
              <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--s4);")}>
                {campo("Primer apellido", "ap1")}
                {campo("Segundo apellido", "ap2")}
              </div>
              <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s4);")}>
                {campo("Día", "dia", true)}
                {campo("Mes", "mes", true)}
                {campo("Año", "anio", true)}
              </div>

              {/* El estudio se dirige a la persona en segunda persona —
               * «bienvenida», «fuiste nombrada» — así que necesita saber cómo
               * tratarla. No entra en ningún cálculo. */}
              <div style={css("display:flex;flex-direction:column;gap:var(--s2);")}>
                <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);")}>Cómo se dirige el estudio a la persona</span>
                <div style={css("display:flex;gap:2px;background:color-mix(in srgb, var(--text) 6%, transparent);border-radius:980px;padding:3px;width:fit-content;max-width:100%;")}>
                  {([
                    ["f", "Ella"],
                    ["m", "Él"],
                    ["n", "Neutro"],
                  ] as const).map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set("genero", k)}
                      style={css(
                        "flex:none;padding:8px 18px;border-radius:980px;border:none;cursor:pointer;font-size:var(--t-body);font-weight:590;white-space:nowrap;transition:all .2s;background:" +
                          (f.genero === k ? "var(--surface-solid)" : "transparent") +
                          ";box-shadow:" +
                          (f.genero === k ? "0 2px 6px rgba(0,0,0,.09)" : "none") +
                          ";color:" +
                          (f.genero === k ? "var(--text)" : "var(--text-3)") +
                          ";"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              onClick={calcular}
              disabled={!listo}
              whileTap={listo ? { scale: 0.98 } : undefined}
              style={css(
                "width:100%;margin-top:var(--s7);padding:16px 0;border-radius:980px;border:none;cursor:" +
                  (listo ? "pointer" : "not-allowed") +
                  ";font-family:var(--font-ui);font-weight:600;font-size:var(--t-read);letter-spacing:-.01em;background:" +
                  (listo ? "linear-gradient(180deg,#C9A84C,#8A6A1B)" : "color-mix(in srgb, var(--text) 9%, transparent)") +
                  ";box-shadow:" +
                  (listo ? "0 1px 2px rgba(0,0,0,.14),0 10px 26px rgba(154,123,46,.32)" : "none") +
                  ";color:" +
                  (listo ? "#fff" : "var(--text-4)") +
                  ";"
              )}
            >
              Generar el estudio
            </motion.button>
            <p style={css("margin:var(--s4) 0 0;font-size:var(--t-body);color:var(--text-4);line-height:1.5;text-align:center;")}>
              {err || "Se usa el nombre inscrito en el Registro Civil, sin diminutivos."}
            </p>
          </motion.section>

          <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
            <div style={css(TARJETA)}>
              <div style={css(ROTULO + "margin-bottom:var(--s4);")}>Valor del nombre</div>
              {n.palabras.length === 0 ? (
                <p style={css("font-size:var(--t-body);line-height:1.55;color:var(--text-4);margin:0;")}>
                  Cada letra tiene su valor. En cuanto escribas el nombre verás aquí el desglose letra a letra.
                </p>
              ) : (
                <div style={css("display:flex;flex-wrap:wrap;gap:var(--s4);")}>
                  {n.palabras.map((w, wi) => (
                    <div key={wi} style={css("display:flex;flex-direction:column;gap:var(--s2);")}>
                      <div style={css("display:flex;flex-wrap:wrap;gap:4px;")}>
                        {w.letras.map((l, li) => (
                          <motion.div
                            key={li}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.28, delay: li * 0.015 }}
                            style={css(
                              "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:28px;padding:6px 5px;border-radius:var(--r-xs);border:1px solid " +
                                (esVocal(l.g) ? "var(--border-accent)" : "var(--border)") +
                                ";background:" +
                                (esVocal(l.g) ? "var(--gold-soft)" : "color-mix(in srgb, var(--text) 4%, transparent)") +
                                ";color:" +
                                (esVocal(l.g) ? "var(--gold-deep)" : "var(--text-3)") +
                                ";"
                            )}
                          >
                            <span style={css("font-size:var(--t-read);line-height:1;")}>{l.g}</span>
                            <span style={css("font-size:var(--t-micro);font-weight:590;opacity:.7;")}>{l.v}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);")}>
                        {w.palabra} · {w.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={css("display:flex;align-items:baseline;gap:var(--s3);border-top:1px solid var(--border);margin-top:var(--s5);padding-top:var(--s4);")}>
                <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);")}>Valor del nombre</span>
                <span data-cifras="" style={css("font-weight:600;font-size:var(--t-hero);color:var(--gold);line-height:1;margin-left:auto;letter-spacing:-.028em;")}>{n.total || 0}</span>
              </div>
              <div style={css("display:flex;gap:var(--s6);margin-top:var(--s3);")}>
                {[
                  { l: "Esencia", v: n.esencia },
                  { l: "Ego", v: n.ego },
                ].map((x) => (
                  <div key={x.l} style={css("display:flex;flex-direction:column;gap:2px;")}>
                    <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-4);")}>{x.l}</span>
                    <span data-cifras="" style={css("font-weight:600;font-size:var(--t-title);color:var(--text-3);")}>{x.v || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={css(TARJETA)}>
              <div style={css(ROTULO + "margin-bottom:var(--s4);")}>Estudios guardados</div>
              {hist.length === 0 ? (
                <p style={css("font-size:var(--t-body);line-height:1.55;color:var(--text-4);margin:0;")}>Todavía no hay estudios guardados. Los que generes se quedan aquí, en este equipo.</p>
              ) : (
                <div style={css("display:flex;flex-direction:column;gap:var(--s2);max-height:320px;overflow-y:auto;")}>
                  {hist.map((h) => (
                    <div
                      key={h.id}
                      data-alza=""
                      style={css("display:flex;align-items:center;gap:var(--s3);padding:11px 13px;border:1px solid var(--border);border-radius:var(--r-sm);background:color-mix(in srgb, var(--text) 4%, transparent);")}
                    >
                      <button onClick={() => abrir(h)} style={css("flex:1;min-width:0;text-align:left;background:none;border:none;padding:0;cursor:pointer;color:var(--text);")}>
                        <div style={css("font-size:var(--t-read);line-height:1.25;color:var(--text);overflow-wrap:anywhere;")}>{h.nombre}</div>
                        <div style={css("font-size:var(--t-mini);color:var(--text-4);margin-top:2px;")}>
                          {h.fecha} · corazón {h.corazon}
                        </div>
                      </button>
                      <button
                        onClick={() => borrar(h)}
                        title="Eliminar"
                        style={css("flex:none;background:none;border:1px solid var(--red-border);color:var(--red);border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:var(--t-body);line-height:1;")}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
