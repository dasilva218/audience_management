import { PublicHeader } from "./components/landing/PublicHeader";


export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans suppressHydrationWarning antialiased">
        <PublicHeader />
        <div className="min-h-screen bg-background">
          <main className="py-8 px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}