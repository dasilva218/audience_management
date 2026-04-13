'use client'
import { submitAudienceRequest } from "@/lib/action";
import { AudienceRequestFormData, audienceRequestSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";


export default function useDemandeForm() {

  const [isPending, startTransition] = useTransition()
  const [trackingCode, setTrackingCode] = useState<string | null>(null)

  const form = useForm<AudienceRequestFormData>({
    resolver: zodResolver(audienceRequestSchema),
    mode: "onChange",
  })

  async function onSubmit(data: AudienceRequestFormData) {

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    startTransition(async () => {
      const result = await submitAudienceRequest(formData)
      // if (result.success) {
      //   setTrackingCode(result.trackingCode)
      //   toast.success("Demande soumise avec succes !")
      //   form.reset()
      // } else {
      //   // setServerErrors(result.errors ?? {})
      //   toast.error("Veuillez corriger les erreurs du formulaire.")
      // }
    })

  }

  return {
    form,
    onSubmit,
    isPending,
    trackingCode,
    setTrackingCode
  }
}