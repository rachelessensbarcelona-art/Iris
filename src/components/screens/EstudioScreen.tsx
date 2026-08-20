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
    <div style={css("padding:0 0 40px;")}>
      <div
        data-chrome="1"
        style={css(
          "position:sticky;top:71px;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px clamp(14px,3vw,28px);background:rgba(8,9,15,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(201,168,76,.14);"
        )}
      >
        <span style={css("font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#8A7F68;")}>Estudio · {capitulos.length} capítulos</span>
        <span style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#6E6555;")}>Haz clic en cualquier párrafo para reescribirlo con tus palabras.</span>
        <div style={css("margin-left:auto;display:flex;gap:9px;")}>
          <button
            onClick={restablecer}
            style={css("background:none;border:1px solid rgba(201,168,76,.26);color:#8A7F68;border-radius:3px;padding:9px 16px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;")}
          >
            Restablecer textos
          </button>
          <button
            onClick={imprimir}
            style={css("background:linear-gradient(140deg,#2A2210,#3A3018);border:1px solid #C9A84C;color:#F2E6C6;border-radius:3px;padding:9px 20px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;")}
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className={styles.desk}>
        <section className={`${styles.page} ${styles.portada}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="" style={css("width:210px;height:210px;border-radius:50%;object-fit:cover;margin-bottom:34px;")} />
          <div style={css("font-family:'Cinzel',serif;font-size:13px;letter-spacing:.42em;color:#9A7F32;text-transform:uppercase;")}>{marca}</div>
          <div style={css("width:78px;height:1px;background:#C9A84C;margin:26px 0;")} />
          <div style={css("font-family:'Cinzel',serif;font-size:19px;letter-spacing:.28em;color:#6B6478;text-transform:uppercase;")}>Estudio de Kábala personal</div>
          <h1 style={css("font-family:'Cinzel',serif;font-weight:600;font-size:40px;line-height:1.22;letter-spacing:.03em;color:#241F2E;margin:30px 0 0;max-width:560px;")}>{r.nombre.texto}</h1>
          <div style={css("font-family:'Cormorant Garamond',serif;font-size:21px;font-style:italic;color:#7A7288;margin-top:14px;")}>{fechaLarga(r.fecha.dia, r.fecha.mes, r.fecha.anio)}</div>
        </section>

        {capitulos.map((cap) => (
          <section key={cap.id} className={`${styles.page} ${styles.interior}`}>
            <header className={styles.header}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="" style={css("width:26px;height:26px;border-radius:50%;object-fit:cover;")} />
              <span style={css("font-family:'Cinzel',serif;font-size:9px;letter-spacing:.3em;color:#9A7F32;text-transform:uppercase;")}>{marca}</span>
              <span style={css("margin-left:auto;font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.22em;color:#9B93A8;text-transform:uppercase;")}>{cap.seccion}</span>
            </header>
            <div className={styles.cuerpo}>
              {cap.kicker && (
                <div>
                  <div style={css("font-family:'Karla',sans-serif;font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:#B08A2E;margin-bottom:5px;")}>{cap.kicker}</div>
                  <h2 style={css("font-family:'Cinzel',serif;font-weight:600;font-size:25px;line-height:1.2;letter-spacing:.02em;color:#241F2E;margin:0;")}>{cap.titulo}</h2>
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
        ))}
      </div>
    </div>
  );
}
