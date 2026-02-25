'use client';
import { SignIn } from "@/lib/action";
import { LoginFormData, loginFormSchema } from "@/schema";
// import { SignIn } from "@/action/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import { toast } from "sonner";

export default function useLoginForm() {
  // États locaux pour gérer l'interface utilisateur
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Initialisation du formulaire avec react-hook-form et validation Zod
  const form = useForm<LoginFormData>(
    {
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: ""
      },

    }
  )
  // Fonction de gestion de la soumission du formulaire
  // Cette fonction orchestre tout le processus de connexion
  const onSubmit = async (result: LoginFormData) => {
    setIsLoading(true);
    try {
      // const { message, success } = await SignUp(result as RegisterFormData)
      const { message, success } = await SignIn(result as LoginFormData);
      if (!success) throw new Error(message);
      toast.success(message);
      router.refresh()
    } catch (e) {
      // Gestion des erreurs
      toast.error((e as Error).message);
      form.reset()
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    togglePasswordVisibility,
    showPassword,
    form,
    isLoading,
    onSubmit,
  };
}