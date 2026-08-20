"use client";
import { css } from "@/lib/css";
import type { Bloque } from "@/lib/estudio";
import type { Resultado } from "@/lib/engine";
import { DocArbol, DocEstructura, DocAlma, DocCuentas, DocCiclos } from "./DocDiagramas";
import styles from "./Estudio.module.css";

export default function BloqueView({
  b,
  r,
  txt,
  guardaEdit,
}: {
  b: Bloque;
  r: Resultado;
  txt: (id: string, def: string) => string;
  guardaEdit: (id: string, texto: string) => void;
}) {
  const onBlur = (id: string) => (e: React.FocusEvent<HTMLParagraphElement>) => guardaEdit(id, (e.target.textContent || "").trim());

  switch (b.tipo) {
    case "h":
      return <div style={css("font-family:'Cinzel',serif;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#9A7F32;border-top:1px solid rgba(201,168,76,.3);padding-top:9px;")}>{b.texto}</div>;
    case "lead":
      return (
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={onBlur(b.editId)}
          style={css("font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.5;color:#5E5670;margin:0;text-wrap:pretty;")}
        >
          {txt(b.editId, b.textoDef)}
        </p>
      );
    case "p":
      return (
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={onBlur(b.editId)}
          style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.56;color:#37323F;margin:0;text-align:justify;text-wrap:pretty;white-space:pre-line;")}
        >
          {txt(b.editId, b.textoDef)}
        </p>
      );
    case "dato":
      return (
        <div style={css("display:flex;gap:16px;align-items:flex-start;border-left:2px solid #C9A84C;padding-left:14px;")}>
          <div style={css("min-width:78px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#9B93A8;")}>{b.label}</div>
            <div style={css("font-family:'Cinzel',serif;font-size:30px;line-height:1.1;color:#241F2E;")}>{b.valor}</div>
          </div>
          <p contentEditable suppressContentEditableWarning onBlur={onBlur(b.editId)} style={css("font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.55;color:#37323F;margin:0;flex:1;text-wrap:pretty;")}>
            {txt(b.editId, b.textoDef)}
          </p>
        </div>
      );
    case "polos":
      return (
        <div className={styles.duo}>
          <div style={css("border-left:2px solid #C0574C;padding-left:12px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#B0564C;margin-bottom:3px;")}>En negativo</div>
            <p contentEditable suppressContentEditableWarning onBlur={onBlur(b.editIdNeg)} style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#413B4B;margin:0;")}>
              {txt(b.editIdNeg, b.negDef)}
            </p>
          </div>
          <div style={css("border-left:2px solid #4C8A5A;padding-left:12px;")}>
            <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#40794F;margin-bottom:3px;")}>En positivo</div>
            <p contentEditable suppressContentEditableWarning onBlur={onBlur(b.editIdPos)} style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#413B4B;margin:0;")}>
              {txt(b.editIdPos, b.posDef)}
            </p>
          </div>
        </div>
      );
    case "refs":
      return (
        <div style={css("display:flex;flex-direction:column;gap:8px;")}>
          {b.items.map((i, ii) => (
            <div key={ii} style={css(i.style)}>
              <div style={css("font-family:'Karla',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:" + i.color + ";margin-bottom:3px;")}>{i.label}</div>
              <p style={css("font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.5;color:#413B4B;margin:0;")}>{i.texto}</p>
            </div>
          ))}
        </div>
      );
    case "arbol":
      return <DocArbol r={r} />;
    case "estructura":
      return <DocEstructura r={r} />;
    case "alma":
      return <DocAlma r={r} />;
    case "cuentas":
      return <DocCuentas r={r} />;
    case "ciclos":
      return <DocCiclos r={r} />;
    case "cita":
      return (
        <p
          style={css(
            "font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.5;color:#6B6478;text-align:center;border-top:1px solid rgba(201,168,76,.3);border-bottom:1px solid rgba(201,168,76,.3);padding:16px 30px;margin:0;"
          )}
        >
          {b.texto}
        </p>
      );
    default:
      return null;
  }
}
