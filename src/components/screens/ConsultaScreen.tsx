"use client";
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

export default function ConsultaScreen() {
  const { f, set, calcular, hist, abrir, borrar } = useApp();

  const n = analizaNombre([f.nombre, f.ap1, f.ap2].filter(Boolean).join(" "));
  const err = valida(f);
  const listo = !err;

  const campo = (
    label: string,
    key: "nombre" | "ap1" | "ap2" | "dia" | "mes" | "anio",
    placeholder: string,
    numeric?: boolean
  ) => (
    <label style={css("display:flex;flex-direction:column;gap:7px;min-width:0;")}>
      <span style={css("font-size:12px;font-weight:590;color:var(--text-3);")}>{label}</span>
      <input
        size={4}
        value={f[key]}
        onChange={(e) => set(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        placeholder={placeholder}
        inputMode={numeric ? "numeric" : undefined}
        style={css(
          "width:100%;min-width:0;background:rgba(120,120,128,.08);border:1px solid transparent;border-radius:var(--r-sm);padding:13px 15px;color:var(--text);font-family:var(--font-ui);font-size:17px;transition:border-color .25s,box-shadow .25s,background .25s;"
        )}
      />
    </label>
  );

  return (
    <main style={css("max-width:1180px;margin:0 auto;padding:var(--s7) var(--gutter) var(--s8);")}>
      <div style={css("text-align:center;margin-bottom:var(--s7);")}>
        <div style={css("font-size:13px;font-weight:590;color:var(--gold);margin-bottom:var(--s3);")}>{saludo()}, Iris</div>
        <h1 style={css("font-weight:700;font-size:clamp(26px,4.6vw,40px);line-height:1.12;letter-spacing:-.028em;color:var(--text);margin:0 0 var(--s3);text-wrap:balance;")}>
          ¿A quién estudiamos hoy?
        </h1>
        <p style={css("font-size:clamp(16px,2vw,19px);line-height:1.55;color:var(--text-3);max-width:640px;margin:0 auto;text-wrap:pretty;")}>
          Dime el nombre de la partida de nacimiento y la fecha exacta. Yo hago las cuentas, te enseño de dónde sale cada número y te dejo el estudio listo para imprimir.
        </p>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:var(--gap-lg);align-items:start;")}>
        <section
          style={css(
            "background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(255,255,255,.62));backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border:1px solid var(--border-accent);border-radius:var(--r);padding:var(--pad-card);position:relative;overflow:hidden;isolation:isolate;"
          )}
        >
          <div style={css("position:absolute;inset:0;z-index:0;pointer-events:none;")}>
            <Particulas cantidad={22} />
          </div>
          <div style={css("position:absolute;top:-1px;left:44px;right:44px;height:1px;z-index:1;background:linear-gradient(90deg,transparent,var(--gold),transparent);")} />
          <div style={css("position:relative;z-index:1;")}>
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:var(--s5);")}>Datos de nacimiento</div>

          <div style={css("display:flex;flex-direction:column;gap:var(--s4);")}>
            {campo("Nombre", "nombre", "")}
            <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--s4);")}>
              {campo("Primer apellido", "ap1", "")}
              {campo("Segundo apellido", "ap2", "")}
            </div>
            <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s4);")}>
              {campo("Día", "dia", "", true)}
              {campo("Mes", "mes", "", true)}
              {campo("Año", "anio", "", true)}
            </div>
          </div>

          <button
            onClick={calcular}
            disabled={!listo}
            style={css(
              "width:100%;margin-top:var(--s6);padding:15px 0;border-radius:980px;border:none;cursor:" +
                (listo ? "pointer" : "not-allowed") +
                ";font-family:var(--font-ui);font-weight:600;font-size:17px;letter-spacing:-.01em;background:" +
                (listo ? "linear-gradient(180deg,#B9942F,#8A6A1B)" : "rgba(120,120,128,.12)") +
                ";box-shadow:" +
                (listo ? "0 1px 2px rgba(0,0,0,.10),0 8px 20px rgba(154,123,46,.26)" : "none") +
                ";color:" +
                (listo ? "#fff" : "var(--text-4)") +
                ";transition:all .25s;"
            )}
          >
            Generar el estudio
          </button>
          <div style={css("margin-top:var(--s4);font-family:var(--font-ui);font-size:16px;color:var(--text-4);line-height:1.45;text-align:center;text-wrap:pretty;")}>
            {err || "Se usa el nombre inscrito en el Registro Civil, sin diminutivos."}
          </div>
          </div>
        </section>

        <aside data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
          <div style={css("background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border:1px solid var(--border);border-radius:var(--r);padding:var(--pad-card-sm);")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:var(--s2);")}>Valor del nombre</div>
            {n.palabras.length === 0 && (
              <p style={css("font-size:16px;line-height:1.5;color:var(--text-4);margin:var(--s3) 0 0;text-wrap:pretty;")}>
                Cada letra tiene un valor. En cuanto escribas el nombre verás aquí su desglose letra a letra.
              </p>
            )}
            <div style={css("display:flex;flex-wrap:wrap;gap:var(--s4);margin:var(--s4) 0 6px;")}>
              {n.palabras.map((w, wi) => (
                <div key={wi} style={css("display:flex;flex-direction:column;gap:7px;")}>
                  <div style={css("display:flex;flex-wrap:wrap;gap:4px;")}>
                    {w.letras.map((l, li) => (
                      <div
                        key={li}
                        style={css(
                          "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:26px;padding:5px 4px;border-radius:var(--r-xs);border:1px solid " +
                            (esVocal(l.g) ? "var(--border-accent)" : "var(--border)") +
                            ";background:" +
                            (esVocal(l.g) ? "var(--gold-soft)" : "rgba(0,0,0,.025)") +
                            ";color:" +
                            (esVocal(l.g) ? "var(--gold-deep)" : "var(--text-3)") +
                            ";"
                        )}
                      >
                        <span style={css("font-family:var(--font-ui);font-size:17px;line-height:1;")}>{l.g}</span>
                        <span style={css("font-size:12px;font-weight:590;opacity:.72;")}>{l.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>
                    {w.palabra} · {w.total}
                  </div>
                </div>
              ))}
            </div>
            <div style={css("display:flex;align-items:baseline;gap:10px;border-top:1px solid var(--border);margin-top:var(--s4);padding-top:var(--s4);")}>
              <span style={css("font-size:12px;font-weight:590;color:var(--text-3);")}>Valor del nombre</span>
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:30px;color:var(--gold);line-height:1;margin-left:auto;")}>{n.total || 0}</span>
            </div>
            <div style={css("display:flex;gap:var(--gap);margin-top:10px;")}>
              <div style={css("display:flex;flex-direction:column;gap:2px;")}>
                <span style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>Esencia</span>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:17px;color:var(--text-3);")}>{n.esencia || 0}</span>
              </div>
              <div style={css("display:flex;flex-direction:column;gap:2px;")}>
                <span style={css("font-size:12px;font-weight:590;color:var(--text-4);")}>Ego</span>
                <span style={css("font-family:var(--font-ui);font-weight:600;font-size:17px;color:var(--text-3);")}>{n.ego || 0}</span>
              </div>
            </div>
          </div>

          <div style={css("background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border:1px solid var(--border);border-radius:var(--r);padding:var(--pad-card-sm);")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:var(--gold);margin-bottom:14px;")}>Estudios guardados</div>
            <div style={css("display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto;")}>
              {hist.map((h) => (
                <div key={h.id} style={css("display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--border);border-radius:var(--r-sm);background:rgba(0,0,0,.025);")}>
                  <button onClick={() => abrir(h)} style={css("flex:1;text-align:left;background:none;border:none;padding:0;cursor:pointer;color:var(--text);")}>
                    <div style={css("font-family:var(--font-ui);font-size:18px;line-height:1.2;color:var(--text);")}>{h.nombre}</div>
                    <div style={css("font-size:12px;font-weight:590;color:var(--text-4);margin-top:2px;")}>
                      {h.fecha} · corazón {h.corazon}
                    </div>
                  </button>
                  <button onClick={() => borrar(h)} title="Eliminar" style={css("background:none;border:1px solid var(--red-border);color:var(--red);border-radius:980px;width:24px;height:24px;cursor:pointer;font-size:15px;line-height:1;")}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={css("font-family:var(--font-ui);font-style:normal;font-size:16px;color:var(--text-4);margin-top:10px;")}>
              {hist.length ? "" : "Todavía no hay estudios guardados."}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
