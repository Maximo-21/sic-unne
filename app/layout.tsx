import type { Metadata } from "next";
// 💡 Importamos las fuentes que elegiste para el diseño de Stitch
import { Inter, Manrope } from "next/font/google"; 
import "./globals.css";

// Configuración de Manrope para títulos (Headline)
const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope', 
});

// Configuración de Inter para el cuerpo de texto (Body)
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

// Metadatos personalizados para tu proyecto de la UNNE
export const metadata: Metadata = {
  title: "SIC-UNNE | Scholastic Atelier",
  description: "Sistema de Intercambio de Comisiones - Universidad Nacional del Nordeste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"> 
      <body
        className={`${manrope.variable} ${inter.variable} font-body antialiased bg-[#fbf8ff] text-[#1b1b21] min-h-screen relative overflow-x-hidden`}
      >
        {/* 🎨 Fondos decorativos estilo Stitch (los círculos de color difuminados) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-150 h-150 rounded-full bg-[#eddcff]/40 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 rounded-full bg-[#e0e0ff]/30 blur-[100px]"></div>
        </div>

        {/* Contenido de la aplicación */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Script para los iconos de Google que usa el diseño */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </body>
    </html>
  );
}