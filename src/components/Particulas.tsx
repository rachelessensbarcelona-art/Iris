"use client";
import { useEffect, useRef } from "react";
import { css } from "@/lib/css";

/**
 * Polvo dorado suspendido. Va en canvas y no en decenas de nodos animados por
 * CSS: son partículas que se mueven todas a la vez, y así el navegador pinta
 * un solo elemento en lugar de recalcular la disposición de la página.
 *
 * Se queda quieto si el sistema pide menos movimiento, y también cuando la
 * tarjeta no está a la vista: no tiene sentido gastar cuadros en algo que
 * nadie está mirando.
 */
export default function Particulas({ cantidad = 26, color = "201,168,76" }: { cantidad?: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ancho = 0;
    let alto = 0;
    let visible = true;
    let cuadro = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const motas = Array.from({ length: cantidad }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.7,
      // Deriva muy lenta y hacia arriba: tiene que leerse como suspensión, no
      // como lluvia al revés.
      vx: (Math.random() - 0.5) * 0.00022,
      vy: -(0.00012 + Math.random() * 0.00028),
      fase: Math.random() * Math.PI * 2,
      brillo: 0.22 + Math.random() * 0.4,
    }));

    const medir = () => {
      const c = lienzo.getBoundingClientRect();
      ancho = c.width;
      alto = c.height;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(lienzo);

    const enPantalla = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0 });
    enPantalla.observe(lienzo);

    let t = 0;
    const pintar = () => {
      cuadro = requestAnimationFrame(pintar);
      if (!visible || ancho === 0) return;
      t += 1;
      ctx.clearRect(0, 0, ancho, alto);
      for (const m of motas) {
        m.x += m.vx;
        m.y += m.vy;
        // Al salir por arriba vuelve a entrar por abajo, en otra columna.
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        if (m.x < -0.05) m.x = 1.05;
        if (m.x > 1.05) m.x = -0.05;

        // El titileo es un seno lento y desfasado por partícula, para que no
        // parpadeen todas a la vez.
        const alfa = m.brillo * (0.55 + 0.45 * Math.sin(t * 0.012 + m.fase));
        ctx.beginPath();
        ctx.arc(m.x * ancho, m.y * alto, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alfa.toFixed(3)})`;
        ctx.fill();
      }
    };
    cuadro = requestAnimationFrame(pintar);

    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      enPantalla.disconnect();
    };
  }, [cantidad, color]);

  return <canvas ref={ref} aria-hidden="true" style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;")} />;
}
