"use client"
import AudienceForm from "../components/AudienceForm";
import MinistryContextProvider from "@/context/ministryContextProvider";

export default function pageDemande() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Demande d{"'"}audience
            </h1>
            <p className="mt-2 text-muted-foreground text-pretty">
              Soumettez votre demande d{"'"}audience aupres d{"'"}un ministere de la Republique Gabonaise.
              Aucun compte n{"'"}est requis.
            </p>
          </div>
          <MinistryContextProvider>
            <AudienceForm />
          </MinistryContextProvider>
        </div>
      </main>
    </div>
  );
}