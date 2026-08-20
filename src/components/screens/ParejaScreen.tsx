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
      <span style={css("font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#8A7F68;")}>{label}</span>
      <input
        size={4}
        value={p[key]}
        onChange={(e) => setP(key, numeric ? e.target.value.replace(/\D/g, "").slice(0, key === "anio" ? 4 : 2) : e.target.value)}
        inputMode={numeric ? "numeric" : undefined}
        style={css("width:100%;min-width:0;background:rgba(255,255,255,.035);border:1px solid rgba(201,168,76,.22);border-radius:3px;padding:10px 12px;color:#F2E6C6;font-family:'Cormorant Garamond',serif;font-size:18px;")}
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
        <div style={css("font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#8A7F68;margin-bottom:10px;")}>Comparativa</div>
        <h1 style={css("font-family:'Cinzel',serif;font-weight:600;font-size:clamp(21px,3.4vw,30px);letter-spacing:.04em;color:#F2E6C6;margin:0;line-height:1.2;overflow-wrap:anywhere;")}>{r.nombre.texto} &amp; su pareja</h1>
      </div>

      <section style={css("background:linear-gradient(160deg,rgba(201,168,76,.05),rgba(18,20,31,.9));border:1px solid rgba(201,168,76,.2);border-radius:4px;padding:clamp(18px,2.4vw,26px) clamp(18px,2.6vw,28px);margin-bottom:22px;")}>
        <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.28em;color:#C9A84C;text-transform:uppercase;margin-bottom:18px;")}>Datos de la segunda persona</div>
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
            "margin-top:20px;padding:12px 34px;border-radius:3px;cursor:" +
              (listo ? "pointer" : "not-allowed") +
              ";font-family:'Cinzel',serif;font-size:11px;letter-spacing:.26em;text-transform:uppercase;border:1px solid " +
              (listo ? "#C9A84C" : "rgba(201,168,76,.22)") +
              ";background:" +
              (listo ? "linear-gradient(140deg,#2A2210,#3A3018)" : "rgba(255,255,255,.02)") +
              ";color:" +
              (listo ? "#F2E6C6" : "#5C564A") +
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
              "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:18px;align-items:center;justify-items:center;text-align:center;border:1px solid rgba(201,168,76,.18);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(18px,2.4vw,24px) clamp(18px,2.6vw,26px);"
            )}
          >
            <div style={css("text-align:right;")}>
              <div style={css("font-family:'Cinzel',serif;font-size:19px;color:#F2E6C6;line-height:1.25;")}>{r.nombre.texto}</div>
              <div style={css("font-size:11px;letter-spacing:.14em;color:#8A7F68;margin-top:4px;")}>
                corazón {r.corazon.valor} · estructura {r.estructura.tipo}
              </div>
            </div>
            <div style={css("text-align:center;padding:0 10px;")}>
              <div style={css("font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#8A7F68;")}>Camino conjunto</div>
              <div style={css("font-family:'Cinzel',serif;font-size:38px;color:#E9CE84;line-height:1.1;")}>{comp.caminoConjunto}</div>
              <div style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#A99C82;")}>{comp.cartaConjunta?.nombre || ""}</div>
            </div>
            <div>
              <div style={css("font-family:'Cinzel',serif;font-size:19px;color:#F2E6C6;line-height:1.25;")}>{pr.nombre.texto}</div>
              <div style={css("font-size:11px;letter-spacing:.14em;color:#8A7F68;margin-top:4px;")}>
                corazón {pr.corazon.valor} · estructura {pr.estructura.tipo}
              </div>
            </div>
          </div>
          {comparativa.map((sec, si) => (
            <article key={si} style={css("border:1px solid rgba(201,168,76,.16);background:rgba(18,20,31,.72);border-radius:4px;padding:clamp(15px,2vw,20px) clamp(16px,2.4vw,24px);")}>
              <div style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C;margin-bottom:10px;")}>{sec.titulo}</div>
              {sec.items.map((it, ii) => (
                <div key={ii} style={css("display:flex;gap:12px;padding:8px 0;border-top:1px solid rgba(201,168,76,.1);")}>
                  <span style={css("font-family:'Cinzel',serif;font-size:15px;color:#E9CE84;min-width:96px;")}>{it.clave}</span>
                  <p style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.55;color:#C0B69F;margin:0;flex:1;")}>{it.texto}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
