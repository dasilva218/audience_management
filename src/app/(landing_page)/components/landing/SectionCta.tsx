import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SectionCta() {
  return (
    <section className="border-t bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl text-balance">
          Pret a soumettre votre demande ?
        </h2>
        <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto text-pretty">
          Le processus ne prend que quelques minutes. Commencez maintenant et recevez votre code
          de suivi immediatement.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Link href="/demande">
            Commencer ma demande
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}