"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import Wrapper from "@/components/common/wrapper"
import { BookingConfirmation } from "@/components/general/booking-confirmation"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dataParam = searchParams.get("data")

  if (!dataParam) {
    router.replace("/")
    return null
  }

  const data = JSON.parse(decodeURIComponent(dataParam))

  return (
    <Wrapper>
      <BookingConfirmation data={data} />
    </Wrapper>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}
