import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema Municipal",
  description: "Gerenciamento integrado de secretarias municipais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <nav>
            <a href="/">Início</a> | <a href="/dashboard">Dashboard</a> |{" "}
            <a href="/metas">Metas</a> |{" "}
            <a href="/notificacoes">Notificações</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2025 Sistema Municipal</p>
        </footer>
      </body>
    </html>
  );
}
