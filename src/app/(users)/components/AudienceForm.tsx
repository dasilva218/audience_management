'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileTextIcon, Loader2, Upload } from "lucide-react";
import { Controller } from "react-hook-form";

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
                        {/**------------- */}
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
                            <Controller
                                name="firstName"
                                control={"control"}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <Field>
                                            <FieldLabel htmlFor="firstName">
                                                Prenom <span className="text-destructive">*</span>
                                            </FieldLabel>

                                            <Input id="firstName" placeholder="Ex: Jean-Pierre" {...field} />

                                        </Field>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="birthDate"
                                control={"control"}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <Field>
                                            <FieldLabel htmlFor="birthDate">
                                                Date de naissance <span className="text-destructive">*</span>
                                            </FieldLabel>

                                            <Input id="birthDate" type="date" {...field} />

                                        </Field>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        {/**------------- */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Controller
                                name="email"
                                control={"control"}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <Field>
                                            <FieldLabel htmlFor="email">
                                                Email <span className="text-destructive">*</span>
                                            </FieldLabel>

                                            <Input id="email" type="email" placeholder="exemple@email.ga" {...field} />

                                        </Field>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />

                            <Controller
                                name="phone"
                                control={"control"}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <Field>
                                            <FieldLabel htmlFor="phone">
                                                Telephone <span className="text-destructive">*</span>
                                            </FieldLabel>

                                            <Input id="phone" placeholder="+241 77 12 34 56" {...field} />

                                        </Field>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        {/**------------- */}
                    </div>
                    <Controller
                        name="nationalId"
                        control={"control"}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1.5">
                                <Field>
                                    <FieldLabel htmlFor="nationalId">
                                        Numero de piece d{"'"}identite (CNI/Passeport) <span className="text-destructive">*</span>
                                    </FieldLabel>

                                    <Input id="nationalId" placeholder="Ex: GA-001-2345-678" {...field} />

                                </Field>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </div>
                        )}
                    />

                    {/* Request Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Details de la demande
                        </h3>

                        <Controller
                            name="ministryId"
                            control={"control"}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1.5">
                                    <Field>
                                        <FieldLabel htmlFor="ministryId" >
                                            Ministere <span className="text-destructive">*</span>
                                        </FieldLabel>

                                        <Select onValueChange={(value) => setValue("ministryId", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selectionner un ministere" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MINISTRIES.map((ministry) => (
                                                    <SelectItem key={ministry.id} value={ministry.id}>
                                                        {ministry.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </Field>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}



                                </div>
                            )}
                        />


                        <Controller
                            name="subject"
                            control={""}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1.5">
                                    <Field>
                                        <FieldLabel htmlFor="subject">
                                            Objet de la demande <span className="text-destructive">*</span>
                                        </FieldLabel>

                                        <Input id="subject" placeholder="Ex: Demande de regularisation..." {...register("subject")} />
                                    </Field>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}

                                </div>
                            )}

                        />

                        <Controller
                            name="description"
                            control={""}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1.5">
                                    <Field>
                                        <FieldLabel htmlFor="description">
                                            Description detaillee <span className="text-destructive">*</span>
                                        </FieldLabel>

                                        <textarea
                                            id="description"
                                            rows={5}
                                            placeholder="Decrivez votre demande en detail..."
                                            {...field}
                                        />
                                    </Field>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}

                                </div>
                            )}

                        />

                    </div>

                    {/* File Upload Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Documents
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="identityDoc">
                                    Piece d{"'"}identite <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="identityDoc"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:text-primary"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">PDF, JPEG ou PNG - Max 5 Mo</p>
                                {serverErrors.identityDoc && (
                                    <p className="text-sm text-destructive">{serverErrors.identityDoc[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="requestLetter">
                                    Lettre de demande <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="requestLetter"
                                        type="file"
                                        accept=".pdf"
                                        className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:text-primary"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">PDF uniquement - Max 5 Mo</p>
                                {serverErrors.requestLetter && (
                                    <p className="text-sm text-destructive">{serverErrors.requestLetter[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start gap-3">
                            <FileTextIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-foreground">Securite des donnees</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Vos informations personnelles et documents sont traites de maniere confidentielle
                                    conformement a la legislation gabonaise en vigueur. Les fichiers sont stockes de
                                    maniere securisee et ne sont accessibles qu{"'"}aux agents autorises du ministere
                                    concerne.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Soumettre la demande
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card >
    );
}