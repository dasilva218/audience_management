import { CheckCircle2, FileText, Shield } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function Work() {
  return (
    <section className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            Comment ca fonctionne
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            Un processus simple en trois etapes pour soumettre et suivre votre demande
            d{"'"}audience.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <StepCard
            number="1"
            title="Soumettez votre demande"
            description="Remplissez le formulaire avec vos informations personnelles, selectionnez le ministere concerne et joignez vos documents."
            icon={FileText}
          />
          <StepCard
            number="2"
            title="Recevez un code de suivi"
            description="Un code de suivi unique vous est attribue immediatement. Conservez-le precieusement pour consulter l'etat de votre demande."
            icon={Shield}
          />
          <StepCard
            number="3"
            title="Suivez l'avancement"
            description="Utilisez votre code de suivi a tout moment pour verifier le statut de votre demande : en attente, acceptee ou terminee."
            icon={CheckCircle2}
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string
  title: string
  description: string
  icon: typeof FileText
}) {
  return (
    <Card className="relative">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            {number}
          </div>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}