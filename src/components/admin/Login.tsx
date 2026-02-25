'use client'
import { Eye, EyeOffIcon, Lock, LogInIcon, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import useLoginForm from "@/hooks/loginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4"  >
      <Card className="w-full max-w-md" >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl text-foreground">Espace Administration</CardTitle>
          <CardDescription>
            Connectez-vous pour acceder au tableau de bord de gestion des audiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* formulaire */}
          <LoginForm />
          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Comptes de demonstration :
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <p>
                <span className="font-mono text-foreground">agent.mba@interieur.gouv.ga</span>
                {" - "}Min. Interieur
              </p>
              <p>
                <span className="font-mono text-foreground">agent.nguema@sante.gouv.ga</span>
                {" - "}Min. Sante
              </p>
              <p className="text-xs mt-1 italic">Mot de passe: n{"'"}importe quelle valeur</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm({
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
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id="email" type="email" placeholder="m@example.com" required />
            </Field>
          )}
        />
        {/* champ mot de passe  */}
        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field {...field} >
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