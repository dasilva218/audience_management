'use client'
import { submitAudienceRequest } from "@/lib/action";
import { AudienceRequestFormData, audienceRequestSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


export default function useDemandeForm() {

  const [isPending, startTransition] = useTransition()
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AudienceRequestFormData>({
    resolver: zodResolver(audienceRequestSchema),
    mode: "onChange",
  })

  async function onSubmit(data: AudienceRequestFormData) {
    setServerErrors({})
    setIsLoading(true)

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value)
    })

    // Get file inputs
    const identityInput = document.getElementById("identityDoc") as HTMLInputElement
    const letterInput = document.getElementById("requestLetter") as HTMLInputElement

    if (identityInput?.files?.[0]) {
      formData.set("identityDoc", identityInput.files[0])
    }
    if (letterInput?.files?.[0]) {
      formData.set("requestLetter", letterInput.files[0])
    }

    startTransition(async () => {
      const result = await submitAudienceRequest(formData)
      if (result.success) {
        setTrackingCode(result.trackingCode)
        toast.success("Demande soumise avec succes !")
        form.reset()
      } else {
        setServerErrors(result.errors ?? {})
        toast.error("Veuillez corriger les erreurs du formulaire.")
      }
    })
  }


  return {
    form,
    onSubmit,
    isPending,
    trackingCode,
    serverErrors,
    isLoading,
    setTrackingCode
  }



}