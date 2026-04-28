import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import useLoginForm from "@/hooks/loginForm"
import { cn } from "@/lib/utils"
import { Eye, EyeOffIcon, Lock, LogInIcon } from "lucide-react"
import { Controller } from "react-hook-form"

export default function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const { form, isLoading, onSubmit, showPassword, togglePasswordVisibility } = useLoginForm()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                {/* champ email */}
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input {...field} aria-invalid={fieldState.invalid} id="email" type="email" placeholder="m@example.com" required />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                {/* champ mot de passe  */}
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Votre mot de passe"
                                    className="pl-10 pr-10"
                                    autoComplete="current-password"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1} // Évite la navigation clavier sur ce bouton
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </Field>
                    )}
                />
                {/* boutton de soumission  */}
                <Field>
                    <Button type="submit">
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                {/* Spinner de chargement animé */}
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Connexion en cours...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <LogInIcon className="w-4 h-4" />
                                <span>Se connecter</span>
                            </div>
                        )}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}