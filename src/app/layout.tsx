import type { Metadata, Viewport } from "next";
import { Inter, Source_Sans_3 } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const _sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
})

export const metadata: Metadata = {
  title: 'E-Audience Gabon - Gestion des Audiences Ministerielles',
  description:
    'Plateforme officielle de gestion des demandes d\'audience aupres des ministeres de la Republique Gabonaise.',
}

export const viewport: Viewport = {
  themeColor: '#2d7a4f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${_inter.variable} ${_sourceSans.variable} font-sans suppressHydrationWarning antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
