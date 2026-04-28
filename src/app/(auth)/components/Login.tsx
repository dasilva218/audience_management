'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useLoginForm from "@/hooks/loginForm";
import { usersData } from "@/lib/data/index_data";
import { cn } from "@/lib/utils";
import { Eye, EyeOffIcon, Lock, LogInIcon, Shield } from "lucide-react";
import { Controller } from "react-hook-form";
import LoginForm from "./LoginForm";


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

            {
              usersData.map(ministry => {
                return (
                  <div key={ministry.slug} className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <p>
                      <span className="font-mono text-foreground">{ministry.users[1].email}</span>
                      {" - "}{ministry.users[1].password}
                    </p>
                  </div>
                )
              })
            }

          </div>
        </CardContent>
      </Card>
    </div >
  );
}


