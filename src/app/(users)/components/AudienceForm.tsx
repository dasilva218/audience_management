'use client'
import { Controller } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function AudienceForm() {
    return (
        <Card>

            <CardHeader>
                <CardTitle className="text-xl text-foreground">Formulaire de demande d{"'"}audience</CardTitle>
                <CardDescription>
                    Remplissez ce formulaire pour soumettre votre demande. Tous les champs marques d{"'"}un{" "}
                    <span className="text-destructive">*</span> sont obligatoires.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="flex flex-col gap-6" >
                    {/* Identity Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Informations personnelles
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Controller
                                name="lastName"
                                control={"control"}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <Field>
                                            <FieldLabel htmlFor="lastName">
                                                Nom <span className="text-destructive">*</span>
                                            </FieldLabel>

                                            <Input id="lastName" placeholder="Ex: Moussavou" {...field} />

                                        </Field>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="firstName">
                                    Prenom <span className="text-destructive">*</span>
                                </Label>
                                <Input id="firstName" placeholder="Ex: Jean-Pierre" {...register("firstName")} />
                                {errors.firstName && (
                                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input id="email" type="email" placeholder="exemple@email.ga" {...register("email")} />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="phone">
                                    Telephone <span className="text-destructive">*</span>
                                </Label>
                                <Input id="phone" placeholder="+241 77 12 34 56" {...register("phone")} />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="nationalId">
                                Numero de piece d{"'"}identite (CNI/Passeport) <span className="text-destructive">*</span>
                            </Label>
                            <Input id="nationalId" placeholder="Ex: GA-001-2345-678" {...register("nationalId")} />
                            {errors.nationalId && (
                                <p className="text-sm text-destructive">{errors.nationalId.message}</p>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>

        </Card>
    );
}