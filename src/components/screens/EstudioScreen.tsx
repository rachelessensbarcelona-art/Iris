"use client";
import { useMemo } from "react";
import { css } from "@/lib/css";
import { useApp } from "@/lib/app-context";
import { construyeCapitulos } from "@/lib/estudio";
import { fechaLarga } from "@/lib/format";
import BloqueView from "../estudio/BloqueView";
import styles from "../estudio/Estudio.module.css";

export default function EstudioScreen() {
  const { r, marca, txt, guardaEdit, restablecer } = useApp();
  const capitulos = useMemo(() => (r ? construyeCapitulos(r) : []), [r]);
  if (!r) return null;

  const imprimir = () => window.print();

  return (
    <div className={styles.wrap}>
      <div data-chrome="1" className={styles.toolbar}>
        <span style={css("font-size:12px;font-weight:590;color:var(--text-3);")}>Estudio · {capitulos.length} capítulos</span>
        <span className={styles.hint} style={css("font-family:var(--font-ui);font-style:normal;font-size:16px;color:var(--text-4);")}>
          Haz clic en cualquier párrafo para reescribirlo con tus palabras.
        </span>
        <div style={css("margin-left:auto;display:flex;gap:9px;")}>
          <button
            onClick={restablecer}
            style={css("background:none;border:1px solid var(--border-accent);color:var(--text-3);border-radius:980px;padding:9px 16px;font-size:15px;font-weight:590;cursor:pointer;")}
          >
            Restablecer textos
          </button>
          <button
            onClick={imprimir}
            style={css("background:linear-gradient(180deg,#B9942F,#93711F);border:1px solid var(--gold);color:#fff;border-radius:999px;padding:10px 22px;font-family:var(--font-ui);font-weight:600;font-size:15px;cursor:pointer;")}
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className={styles.desk}>
        <section className={`${styles.page} ${styles.portada}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="" style={css("width:210px;height:210px;border-radius:50%;object-fit:cover;margin-bottom:34px;")} />
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:13px;color:#9A7F32;")}>{marca}</div>
          <div style={css("width:78px;height:1px;background:var(--gold);margin:26px 0;")} />
          <div style={css("font-family:var(--font-ui);font-weight:600;font-size:19px;color:#6B6478;")}>Estudio de Kábala personal</div>
          <h1 style={css("font-family:var(--font-ui);font-weight:700;font-size:40px;line-height:1.22;letter-spacing:-.022em;color:#241F2E;margin:30px 0 0;max-width:560px;")}>{r.nombre.texto}</h1>
          <div style={css("font-family:var(--font-ui);font-size:21px;font-style:italic;color:#7A7288;margin-top:14px;")}>{fechaLarga(r.fecha.dia, r.fecha.mes, r.fecha.anio)}</div>
        </section>

        {capitulos.map((cap, i) => {
          // En papel, solo abre hoja nueva el capítulo que estrena sección.
          // Los que continúan una sección ya abierta fluyen a continuación,
          // que es lo que evita las páginas con cuatro líneas sueltas.
          const abreSeccion = i === 0 || cap.seccion !== capitulos[i - 1].seccion;
          return (
          <section key={cap.id} className={`${styles.page} ${styles.interior} ${abreSeccion ? styles.abreSeccion : styles.continua}`}>
            <header className={styles.header}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="" style={css("width:26px;height:26px;border-radius:50%;object-fit:cover;")} />
              <span style={css("font-family:var(--font-ui);font-weight:600;font-size:12px;color:#9A7F32;")}>{marca}</span>
              <span style={css("margin-left:auto;font-family:var(--font-ui);font-size:12px;font-weight:590;color:#9B93A8;")}>{cap.seccion}</span>
            </header>
            <div className={styles.cuerpo}>
              {cap.kicker && (
                <div>
                  <div style={css("font-family:var(--font-ui);font-size:9.5px;color:#B08A2E;margin-bottom:5px;")}>{cap.kicker}</div>
                  <h2 style={css("font-family:var(--font-ui);font-weight:700;font-size:25px;line-height:1.2;letter-spacing:-.022em;color:#241F2E;margin:0;")}>{cap.titulo}</h2>
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
