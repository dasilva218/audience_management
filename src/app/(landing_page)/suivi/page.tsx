import TrackingSearch from "./components/TrackingSearch";




export default function SuiviPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                    Suivi de demande
                </h1>
                <p className="mt-2 text-muted-foreground text-pretty">
                    Consultez l{"'"}etat d{"'"}avancement de votre demande d{"'"}audience en utilisant votre code de suivi.
                </p>
            </div>
            <TrackingSearch />
        </div>
    )
}