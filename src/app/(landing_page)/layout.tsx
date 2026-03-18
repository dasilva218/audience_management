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
        {children}
      </body>
    </html>
  );
}