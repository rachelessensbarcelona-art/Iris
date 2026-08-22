"use client";
import { css } from "@/lib/css";
import { useApp, valida } from "@/lib/app-context";
import { KDATA } from "@/lib/kdata";

export default function ParejaScreen() {
  const { r, p, setP, comparar, pr, comp } = useApp();
  if (!r) return null;

  const errP = valida(p);
  const listo = !errP;
  const K = KDATA.parejas;

  const campo = (label: string, key: "nombre" | "ap1" | "ap2" | "dia" | "mes" | "anio", numeric?: boolean) => (
    <label style={css("display:flex;flex-direction:column;gap:6px;min-width:0;")}>
      <span style={css("font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-3);")}>{label}</span>
      <input
        size={4}
        value={p[key]}
        onChange={(e) => setP(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        inputMode={numeric ? "numeric" : undefined}
        style={css("width:100%;min-width:0;background:rgba(255,255,255,.9);border:1px solid var(--border-accent);border-radius:var(--r-sm);padding:10px 12px;color:var(--text);font-family:var(--font-ui);font-size:18px;")}
      />
    </label>
  );

  let comparativa: Array<{ titulo: string; items: Array<{ clave: string | number; texto: string }> }> = [];
  if (comp && pr) {
    const caminos = [{ clave: "Arcano " + comp.caminoConjunto, texto: (comp.cartaConjunta?.nombre || "") + ". " + (comp.cartaConjunta?.pareja || "") }];
    ([
      ["Origen", r.caminos.origen, pr.caminos.origen],
      ["Transformación", r.caminos.transformacion, pr.caminos.transformacion],
      ["Destino", r.caminos.destino, pr.caminos.destino],
    ] as const).forEach(([et, x, y]) => {
      caminos.push({
        clave: et,
        texto: `${x.carta?.nombre} (${x.arcano}) · ${y.carta?.nombre} (${y.arcano})` + (x.arcano === y.arcano ? " — mismo camino: gran comprensión mutua en este plano." : ""),
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
    <main style={css("max-width:1120px;margin:0 auto;padding:clamp(22px,4vw,38px) clamp(14px,3vw,28px) 80px;animation:es33-in .45s ease both;")}>
      <div style={css("text-align:center;margin-bottom:30px;")}>
        <div style={css("font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px;")}>Comparativa</div>
        <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:clamp(21px,3.4vw,30px);letter-spacing:.04em;color:var(--text);margin:0;line-height:1.2;overflow-wrap:anywhere;")}>{r.nombre.texto} &amp; su pareja</h1>
      </div>

      <section style={css("background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(255,255,255,.62));backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border:1px solid var(--border-accent);border-radius:var(--r);padding:clamp(18px,2.4vw,26px) clamp(18px,2.6vw,28px);margin-bottom:22px;")}>
        <div style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.28em;color:var(--gold);text-transform:uppercase;margin-bottom:18px;")}>Datos de la segunda persona</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr));gap:12px;align-items:end;")}>
          {campo("Nombre", "nombre")}
          {campo("1er apellido", "ap1")}
          {campo("2º apellido", "ap2")}
          {campo("Día", "dia", true)}
          {campo("Mes", "mes", true)}
          {campo("Año", "anio", true)}
        </div>
        <button
          onClick={comparar}
          disabled={!listo}
          style={css(
            "margin-top:20px;padding:12px 34px;border-radius:var(--r-sm);cursor:" +
              (listo ? "pointer" : "not-allowed") +
              ";font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase;border:1px solid " +
              (listo ? "var(--gold)" : "var(--border-accent)") +
              ";background:" +
              (listo ? "linear-gradient(180deg,#B9942F,#93711F)" : "rgba(0,0,0,.025)") +
              ";color:" +
              (listo ? "#fff" : "var(--text-4)") +
              ";"
          )}
        >
          Comparar
        </button>
      </section>

      {comp && pr && (
        <div style={css("display:flex;flex-direction:column;gap:18px;")}>
          <div
            style={css(
              "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:18px;align-items:center;justify-items:center;text-align:center;border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);"
            )}
          >
            <div style={css("text-align:right;")}>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:19px;color:var(--text);line-height:1.25;")}>{r.nombre.texto}</div>
              <div style={css("font-size:11px;letter-spacing:.14em;color:var(--text-3);margin-top:4px;")}>
                corazón {r.corazon.valor} · estructura {r.estructura.tipo}
              </div>
            </div>
            <div style={css("text-align:center;padding:0 10px;")}>
              <div style={css("font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);")}>Camino conjunto</div>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:38px;color:var(--gold);line-height:1.1;")}>{comp.caminoConjunto}</div>
              <div style={css("font-family:var(--font-ui);font-style:normal;font-size:16px;color:var(--text-3);")}>{comp.cartaConjunta?.nombre || ""}</div>
            </div>
            <div>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:19px;color:var(--text);line-height:1.25;")}>{pr.nombre.texto}</div>
              <div style={css("font-size:11px;letter-spacing:.14em;color:var(--text-3);margin-top:4px;")}>
                corazón {pr.corazon.valor} · estructura {pr.estructura.tipo}
              </div>
            </div>
          </div>
          {comparativa.map((sec, si) => (
            <article key={si} style={css("border:1px solid var(--border);background:var(--surface);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);box-shadow:var(--shadow);border-radius:var(--r);padding:clamp(15px,2vw,20px) clamp(16px,2.4vw,24px);")}>
              <div style={css("font-family:var(--font-ui);font-weight:600;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;")}>{sec.titulo}</div>
              {sec.items.map((it, ii) => (
                <div key={ii} style={css("display:flex;gap:12px;padding:8px 0;border-top:1px solid var(--border);")}>
                  <span style={css("font-family:var(--font-ui);font-weight:600;font-size:15px;color:var(--gold);min-width:96px;")}>{it.clave}</span>
                  <p style={css("font-family:var(--font-ui);font-size:17px;line-height:1.55;color:var(--text-2);margin:0;flex:1;")}>{it.texto}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
