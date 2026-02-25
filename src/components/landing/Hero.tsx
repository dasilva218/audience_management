import { Building2, FileText, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";


export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.03]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Republique Gabonaise
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance max-w-3xl">
            Plateforme de gestion des audiences ministerielles
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            Soumettez vos demandes d{"'"}audience aupres des ministeres de la Republique Gabonaise
            de maniere simple, securisee et transparente. Suivez l{"'"}avancement de votre dossier
            en temps reel.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/demande">
                <FileText className="mr-2 h-5 w-5" />
                Nouvelle demande
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/suivi">
                <Search className="mr-2 h-5 w-5" />
                Suivre ma demande
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

