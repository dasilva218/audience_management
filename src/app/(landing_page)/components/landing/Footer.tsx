import { Link, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">E-Audience Gabon</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Republique Gabonaise - Plateforme officielle de gestion des audiences ministerielles
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Espace Agent
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}