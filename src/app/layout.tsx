import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Escuela de Sabiduría 33 · Estudio de Kábala",
  description: "Plataforma de estudio kabalístico: nombre, fecha y el motor calcula el árbol de la vida, la estructura energética, la imagen del alma y el estudio completo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cinzel.variable} ${cormorant.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
