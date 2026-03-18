import { Card, CardContent } from "@/components/ui/card";
import { Clock, Clock1, Search, Shield, Users } from "lucide-react";


export default function Feature() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            Une plateforme pensee pour les citoyens
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            Moderniser l{"'"}administration publique au service du peuple gabonais.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Clock1}
            title="Aucun compte requis"
            description="Soumettez votre demande sans inscription prealable."
          />
          <FeatureCard
            icon={Shield}
            title="Donnees securisees"
            description="Vos informations sont protegees et accessibles uniquement aux agents autorises."
          />
          <FeatureCard
            icon={Search}
            title="Suivi en temps reel"
            description="Consultez le statut de votre demande a tout moment avec votre code."
          />
          <FeatureCard
            icon={Users}
            title="Transparent"
            description="Chaque etape de votre demande est tracee et consultable."
          />
        </div>
      </div>
    </section>
  );
}


function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Clock
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}