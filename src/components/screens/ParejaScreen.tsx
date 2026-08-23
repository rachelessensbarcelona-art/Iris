"use client";
import { css } from "@/lib/css";
import { titulo } from "@/lib/format";
import { useApp, valida } from "@/lib/app-context";
import { KDATA } from "@/lib/kdata";
import Particulas from "../Particulas";

export default function ParejaScreen() {
  const { r, p, setP, comparar, pr, comp } = useApp();
  if (!r) return null;

  const errP = valida(p);
  const listo = !errP;
  const K = KDATA.parejas;

  const campo = (label: string, key: "nombre" | "ap1" | "ap2" | "dia" | "mes" | "anio", numeric?: boolean) => (
    <label style={css("display:flex;flex-direction:column;gap:6px;min-width:0;")}>
      <span style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);")}>{label}</span>
      <input
        size={4}
        value={p[key]}
        onChange={(e) => setP(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        inputMode={numeric ? "numeric" : undefined}
        style={css("width:100%;min-width:0;background:color-mix(in srgb, var(--text) 6%, transparent);border:1px solid transparent;border-radius:var(--r-sm);padding:12px 14px;color:var(--text);font-family:var(--font-ui);font-size:var(--t-read);")}
      />
    </label>
  );

  let comparativa: Array<{ titulo: string; items: Array<{ clave: string | number; texto: string }> }> = [];
  if (comp && pr) {
    const caminos = [{ clave: "Arcano " + comp.caminoConjunto, texto: titulo(comp.cartaConjunta?.nombre) + ". " + (comp.cartaConjunta?.pareja || "") }];
    ([
      ["Origen", r.caminos.origen, pr.caminos.origen],
      ["Transformación", r.caminos.transformacion, pr.caminos.transformacion],
      ["Destino", r.caminos.destino, pr.caminos.destino],
    ] as const).forEach(([et, x, y]) => {
      caminos.push({
        clave: et,
        texto: `${titulo(x.carta?.nombre)} (${x.arcano}) · ${titulo(y.carta?.nombre)} (${y.arcano})` + (x.arcano === y.arcano ? " — mismo camino: gran comprensión mutua en este plano." : ""),
      });
    });

    const estr = [{ clave: `${r.estructura.tipo} · ${pr.estructura.tipo}`, texto: comp.textoEstructura }];
    comp.portalesComunes.forEach((port) => estr.push({ clave: "Portal " + port, texto: K.portales?.[port] || "" }));
    if (comp.portalesComunes.includes(1) && comp.portalesComunes.includes(7)) estr.push({ clave: "Portal 1 + 7", texto: K.combinaciones?.["1+7"] || "" });

    const planos = comp.planosComunes.map((pl) => ({ clave: "Plano " + pl, texto: K.planos?.[pl] || "Bloqueo compartido en el plano " + pl + "." }));

    const cuentas: Array<{ clave: string | number; texto: string }> = [];
    const vistos: Record<string, boolean> = {};
    (comp.coincidencias || []).forEach((x) => {
      const key = x.tipo + x.valor;
      if (vistos[key]) return;
      vistos[key] = true;
      cuentas.push({ clave: x.valor, texto: x.texto });
    });
    if (comp.afinidadIgual) cuentas.push({ clave: "Afinidad", texto: K.cuentas?.afinidad || "" });

    comparativa = [
      { titulo: "Caminos", items: caminos },
      { titulo: "Estructura energética y portales", items: estr },
      { titulo: "Imagen del alma · planos compartidos", items: planos },
      { titulo: "Cuentas abiertas y afinidad", items: cuentas.length ? cuentas : [{ clave: "—", texto: "No hay coincidencias en cuentas abiertas, potenciales arcaicos ni números de afinidad." }] },
    ].filter((s) => s.items.length > 0);
  }

  return (
    <main style={css("max-width:1120px;margin:0 auto;padding:var(--s7) var(--gutter) var(--s8);")}>
      <div style={css("text-align:center;margin-bottom:30px;")}>
        <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);margin-bottom:var(--s3);")}>Comparativa</div>
        <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:clamp(21px,3.4vw,30px);letter-spacing:-.022em;color:var(--text);margin:0;line-height:1.2;overflow-wrap:anywhere;")}>{titulo(r.nombre.texto)} &amp; su pareja</h1>
      </div>

      <section style={css("background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:var(--pad-card-sm);margin-bottom:var(--s5);")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-mini);color:var(--gold);margin-bottom:var(--s5);")}>Datos de la segunda persona</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr));gap:var(--s3);align-items:end;")}>
          {campo("Nombre", "nombre")}
          {campo("Primer apellido", "ap1")}
          {campo("Segundo apellido", "ap2")}
          {campo("Día", "dia", true)}
          {campo("Mes", "mes", true)}
          {campo("Año", "anio", true)}
        </div>
        <button
          onClick={comparar}
          disabled={!listo}
          style={css(
            "margin-top:20px;padding:13px 34px;border-radius:980px;border:none;cursor:" +
              (listo ? "pointer" : "not-allowed") +
              ";font-family:var(--font-ui);font-weight:600;font-size:var(--t-read);letter-spacing:-.01em;background:" +
              (listo ? "linear-gradient(180deg,#B9942F,#8A6A1B)" : "color-mix(in srgb, var(--text) 10%, transparent)") +
              ";box-shadow:" +
              (listo ? "0 1px 2px rgba(0,0,0,.10),0 8px 20px rgba(154,123,46,.26)" : "none") +
              ";color:" +
              (listo ? "#fff" : "var(--text-4)") +
              ";"
          )}
        >
          Comparar
        </button>
      </section>

      {comp && pr && (
        <div data-cascada="" style={css("display:flex;flex-direction:column;gap:var(--gap);")}>
          <div
            style={css(
              "position:relative;overflow:hidden;isolation:isolate;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:var(--gap);align-items:center;justify-items:center;text-align:center;border:1px solid var(--border-accent);background:linear-gradient(155deg,var(--gold-soft),color-mix(in srgb, var(--surface-solid) 70%, transparent));box-shadow:var(--shadow);border-radius:var(--r);padding:var(--pad-card);"
            )}
          >
            <div style={css("position:absolute;inset:0;z-index:0;pointer-events:none;")}>
              <Particulas cantidad={40} />
            </div>
            <div style={css("text-align:right;position:relative;z-index:1;")}>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-title);color:var(--text);line-height:1.25;")}>{titulo(r.nombre.texto)}</div>
              <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);margin-top:4px;")}>
                corazón {r.corazon.valor} · estructura {r.estructura.tipo}
              </div>
            </div>
            <div style={css("text-align:center;padding:0 var(--s3);position:relative;z-index:1;")}>
              <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);")}>Camino conjunto</div>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-hero);color:var(--gold);line-height:1.1;")}>{comp.caminoConjunto}</div>
              <div style={css("font-family:var(--font-ui);font-style:normal;font-size:var(--t-body);color:var(--text-3);")}>{titulo(comp.cartaConjunta?.nombre)}</div>
            </div>
            <div style={css("position:relative;z-index:1;")}>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-title);color:var(--text);line-height:1.25;")}>{titulo(pr.nombre.texto)}</div>
              <div style={css("font-size:var(--t-mini);font-weight:590;color:var(--text-3);margin-top:4px;")}>
                corazón {pr.corazon.valor} · estructura {pr.estructura.tipo}
              </div>
            </div>
          </div>
          {comparativa.map((sec, si) => (
            <article key={si} style={css("background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:var(--pad-card-sm);")}>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-mini);color:var(--gold);margin-bottom:var(--s3);")}>{sec.titulo}</div>
              {sec.items.map((it, ii) => (
                <div key={ii} style={css("display:flex;gap:var(--s3);padding:8px 0;border-top:1px solid var(--border);")}>
                  <span style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-body);color:var(--gold);min-width:96px;")}>{it.clave}</span>
                  <p style={css("font-family:var(--font-ui);font-size:var(--t-read);line-height:1.55;color:var(--text-2);margin:0;text-wrap:pretty;flex:1;")}>{it.texto}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
