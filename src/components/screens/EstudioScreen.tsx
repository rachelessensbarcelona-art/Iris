"use client";
import { useMemo, useState } from "react";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { construyeCapitulos } from "@/lib/estudio";
import { fechaLarga, titulo } from "@/lib/format";
import BloqueView from "../estudio/BloqueView";
import HojaCliente from "../estudio/HojaCliente";
import styles from "../estudio/Estudio.module.css";

export default function EstudioScreen() {
  const { r, marca, txt, guardaEdit, restablecer } = useApp();
  const capitulos = useMemo(() => (r ? construyeCapitulos(r) : []), [r]);
  // Dos documentos distintos con el mismo botón de imprimir: el estudio
  // entero, que es la herramienta de Iris, y la hoja que se lleva el cliente.
  const [modo, setModo] = useState<"estudio" | "hoja">("estudio");
  if (!r) return null;

  const imprimir = () => window.print();
  const hoja = modo === "hoja";

  return (
    <div className={styles.wrap}>
      <div data-chrome="1" className={styles.toolbar}>
        <div style={css("display:flex;gap:2px;background:color-mix(in srgb, var(--text) 9%, transparent);border-radius:980px;padding:3px;flex:none;")}>
          {([
            ["estudio", `Estudio · ${capitulos.length} capítulos`],
            ["hoja", "Hoja para el cliente"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setModo(k)}
              style={css(
                "padding:7px 15px;border-radius:980px;border:none;cursor:pointer;font-size:var(--t-body);font-weight:590;letter-spacing:-.01em;white-space:nowrap;transition:all .2s;background:" +
                  (modo === k ? "var(--surface-solid)" : "transparent") +
                  ";box-shadow:" +
                  (modo === k ? "0 3px 8px rgba(0,0,0,.1),0 1px 1px rgba(0,0,0,.06)" : "none") +
                  ";color:" +
                  (modo === k ? "var(--text)" : "var(--text-3)") +
                  ";"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <span className={styles.hint} style={css("font-size:var(--t-body);color:var(--text-4);")}>
          {hoja ? "Una página, sin fórmulas ni claves: lo que se lleva la persona." : "Haz clic en cualquier párrafo para reescribirlo con tus palabras."}
        </span>
        <div style={css("margin-left:auto;display:flex;gap:9px;")}>
          {!hoja && (
            <button
              onClick={restablecer}
              style={css("background:none;border:1px solid var(--border-accent);color:var(--text-3);border-radius:980px;padding:9px 16px;font-size:var(--t-body);font-weight:590;cursor:pointer;")}
            >
              Restablecer textos
            </button>
          )}
          <button
            onClick={imprimir}
            style={css("background:linear-gradient(180deg,#B9942F,#93711F);border:1px solid var(--gold);color:#fff;border-radius:999px;padding:10px 22px;font-family:var(--font-ui);font-weight:600;font-size:var(--t-body);cursor:pointer;")}
          >
            {hoja ? "Exportar la hoja" : "Exportar PDF"}
          </button>
        </div>
      </div>

      <div className={styles.desk}>
        {hoja && <HojaCliente r={r} marca={marca} />}
        {!hoja && <section className={`${styles.page} ${styles.portada}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="" style={css("width:210px;height:210px;border-radius:50%;object-fit:cover;margin-bottom:34px;")} />
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-mini);color:#9A7F32;")}>{marca}</div>
          <div style={css("width:78px;height:1px;background:var(--gold);margin:26px 0;")} />
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-title);color:#6B6478;")}>Estudio de Kábala personal</div>
          <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:var(--t-hero);line-height:1.22;letter-spacing:-.022em;color:#241F2E;margin:30px 0 0;max-width:560px;")}>{titulo(r.nombre.texto)}</h1>
          <div style={css("font-family:var(--font-ui);font-size:var(--t-title);font-style:italic;color:#7A7288;margin-top:var(--s4);")}>{fechaLarga(r.fecha.dia, r.fecha.mes, r.fecha.anio)}</div>
        </section>}

        {!hoja && capitulos.map((cap, i) => {
          // En papel, solo abre hoja nueva el capítulo que estrena sección.
          // Los que continúan una sección ya abierta fluyen a continuación,
          // que es lo que evita las páginas con cuatro líneas sueltas.
          const abreSeccion = i === 0 || cap.seccion !== capitulos[i - 1].seccion;
          return (
          <section key={cap.id} className={`${styles.page} ${styles.interior} ${abreSeccion ? styles.abreSeccion : styles.continua}`}>
            <header className={styles.header}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="" style={css("width:26px;height:26px;border-radius:50%;object-fit:cover;")} />
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:var(--t-mini);color:#9A7F32;")}>{marca}</span>
              <span style={css("margin-left:auto;font-family:var(--font-ui);font-size:var(--t-mini);font-weight:590;color:#9B93A8;")}>{cap.seccion}</span>
            </header>
            <div className={styles.cuerpo}>
              {cap.kicker && (
                <div>
                  <div style={css("font-family:var(--font-ui);font-size:9.5px;color:#B08A2E;margin-bottom:5px;")}>{cap.kicker}</div>
                  <h2 style={css("font-family:var(--font-ui);font-weight:700;font-size:var(--t-head);line-height:1.2;letter-spacing:-.022em;color:#241F2E;margin:0;")}>{cap.titulo}</h2>
                </div>
              )}
              {cap.bloques.map((b, bi) => (
                <BloqueView key={bi} b={b} r={r} txt={txt} guardaEdit={guardaEdit} />
              ))}
            </div>
            <footer className={styles.footer}>
              <span>{r.nombre.texto}</span>
              <span style={css("margin-left:auto;")}>{marca}</span>
            </footer>
          </section>
          );
        })}
      </div>
    </div>
  );
}
