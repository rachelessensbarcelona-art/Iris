"use client";
import { css } from "@/lib/css";
import { useApp, valida } from "@/lib/app-context";
import { analizaNombre, esVocal } from "@/lib/engine";

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
      <span style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8A7F68;")}>{label}</span>
      <input
        size={4}
        value={f[key]}
        onChange={(e) => set(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        placeholder={placeholder}
        inputMode={numeric ? "numeric" : undefined}
        style={css(
          "width:100%;min-width:0;background:rgba(255,255,255,.035);border:1px solid rgba(201,168,76,.22);border-radius:3px;padding:12px 14px;color:#F2E6C6;font-family:'Cormorant Garamond',serif;font-size:20px;transition:border-color .25s,box-shadow .25s;"
        )}
      />
    </label>
  );

  return (
    <main style={css("max-width:1120px;margin:0 auto;padding:clamp(26px,5vw,48px) clamp(14px,3vw,28px) 80px;animation:es33-in .5s ease both;")}>
      <div style={css("text-align:center;margin-bottom:40px;")}>
        <div style={css("font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#8A7F68;margin-bottom:14px;")}>Nueva consulta</div>
        <h1 style={css("font-family:'Cinzel',serif;font-weight:600;font-size:clamp(25px,4.6vw,38px);line-height:1.16;letter-spacing:.03em;color:#F2E6C6;margin:0 0 12px;")}>
          El nombre es la contraseña del alma
        </h1>
        <p style={css("font-family:'Cormorant Garamond',serif;font-size:clamp(16px,2vw,19px);line-height:1.55;color:#A99C82;max-width:620px;margin:0 auto;")}>
          Escribe el nombre tal y como figura en la partida de nacimiento y la fecha exacta. Todo lo demás se calcula solo.
        </p>
      </div>

      <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:26px;align-items:start;")}>
        <section
          style={css(
            "background:linear-gradient(160deg,rgba(201,168,76,.055),rgba(18,20,31,.9));border:1px solid rgba(201,168,76,.2);border-radius:4px;padding:clamp(20px,3vw,30px);position:relative;"
          )}
        >
          <div style={css("position:absolute;top:-1px;left:44px;right:44px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);")} />
          <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:22px;")}>Datos de nacimiento</div>

          <div style={css("display:flex;flex-direction:column;gap:14px;")}>
            {campo("Nombre", "nombre", "")}
            <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;")}>
              {campo("1er apellido", "ap1", "")}
              {campo("2º apellido", "ap2", "")}
            </div>
            <div style={css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;")}>
              {campo("Día", "dia", "", true)}
              {campo("Mes", "mes", "", true)}
              {campo("Año", "anio", "", true)}
            </div>
          </div>

          <button
            onClick={calcular}
            disabled={!listo}
            style={css(
              "width:100%;margin-top:26px;padding:14px 0;border-radius:3px;cursor:" +
                (listo ? "pointer" : "not-allowed") +
                ";font-family:'Cinzel',serif;font-size:12px;letter-spacing:.28em;text-transform:uppercase;border:1px solid " +
                (listo ? "#C9A84C" : "rgba(201,168,76,.22)") +
                ";background:" +
                (listo ? "linear-gradient(140deg,#2A2210,#3A3018)" : "rgba(255,255,255,.02)") +
                ";color:" +
                (listo ? "#F2E6C6" : "#5C564A") +
                ";transition:all .25s;"
            )}
          >
            Generar el estudio
          </button>
          <div style={css("margin-top:14px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#7E7461;line-height:1.45;text-align:center;")}>
            {err || "Se usa el nombre inscrito en el Registro Civil, sin diminutivos."}
          </div>
        </section>

        <aside style={css("display:flex;flex-direction:column;gap:18px;")}>
          <div style={css("background:rgba(18,20,31,.75);border:1px solid rgba(201,168,76,.14);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
            <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.28em;color:#C9A84C;text-transform:uppercase;margin-bottom:8px;")}>Valor del nombre</div>
            <div style={css("display:flex;flex-wrap:wrap;gap:14px;margin:16px 0 6px;")}>
              {n.palabras.map((w, wi) => (
                <div key={wi} style={css("display:flex;flex-direction:column;gap:7px;")}>
                  <div style={css("display:flex;flex-wrap:wrap;gap:4px;")}>
                    {w.letras.map((l, li) => (
                      <div
                        key={li}
                        style={css(
                          "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:26px;padding:5px 4px;border-radius:2px;border:1px solid " +
                            (esVocal(l.g) ? "rgba(232,185,60,.42)" : "rgba(201,168,76,.14)") +
                            ";background:" +
                            (esVocal(l.g) ? "rgba(232,185,60,.11)" : "rgba(255,255,255,.025)") +
                            ";color:" +
                            (esVocal(l.g) ? "#EFD79A" : "#B9AE94") +
                            ";"
                        )}
                      >
                        <span style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1;")}>{l.g}</span>
                        <span style={css("font-size:9px;letter-spacing:.06em;opacity:.72;")}>{l.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={css("font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;")}>
                    {w.palabra} · {w.total}
                  </div>
                </div>
              ))}
            </div>
            <div style={css("display:flex;align-items:baseline;gap:10px;border-top:1px solid rgba(201,168,76,.14);margin-top:14px;padding-top:14px;")}>
              <span style={css("font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8A7F68;")}>Nº de corazón</span>
              <span style={css("font-family:'Cinzel',serif;font-size:30px;color:#E9CE84;line-height:1;margin-left:auto;")}>{n.total || 0}</span>
            </div>
            <div style={css("display:flex;gap:18px;margin-top:10px;")}>
              <div style={css("display:flex;flex-direction:column;gap:2px;")}>
                <span style={css("font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;")}>Esencia</span>
                <span style={css("font-family:'Cinzel',serif;font-size:17px;color:#B7A57C;")}>{n.esencia || 0}</span>
              </div>
              <div style={css("display:flex;flex-direction:column;gap:2px;")}>
                <span style={css("font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7E7461;")}>Ego</span>
                <span style={css("font-family:'Cinzel',serif;font-size:17px;color:#B7A57C;")}>{n.ego || 0}</span>
              </div>
            </div>
          </div>

          <div style={css("background:rgba(18,20,31,.75);border:1px solid rgba(201,168,76,.14);border-radius:4px;padding:clamp(16px,2.2vw,22px) clamp(16px,2.4vw,24px);")}>
            <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.28em;color:#C9A84C;text-transform:uppercase;margin-bottom:14px;")}>Estudios guardados</div>
            <div style={css("display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto;")}>
              {hist.map((h) => (
                <div key={h.id} style={css("display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid rgba(201,168,76,.1);border-radius:3px;background:rgba(255,255,255,.02);")}>
                  <button onClick={() => abrir(h)} style={css("flex:1;text-align:left;background:none;border:none;padding:0;cursor:pointer;color:#E8E0CE;")}>
                    <div style={css("font-family:'Cormorant Garamond',serif;font-size:18px;line-height:1.2;color:#EFE3C4;")}>{h.nombre}</div>
                    <div style={css("font-size:10px;letter-spacing:.12em;color:#7E7461;margin-top:2px;")}>
                      {h.fecha} · corazón {h.corazon}
                    </div>
                  </button>
                  <button onClick={() => borrar(h)} title="Eliminar" style={css("background:none;border:1px solid rgba(226,87,76,.28);color:#C8695F;border-radius:3px;width:24px;height:24px;cursor:pointer;font-size:13px;line-height:1;")}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#6E6555;margin-top:10px;")}>
              {hist.length ? "" : "Todavía no hay estudios guardados."}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
