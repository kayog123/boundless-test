"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { formBookingSchema } from "@/components/general/validations/schema/booking"
import { MapboxDirectionsResponse } from "@/lib/type"
import customers from "@/data/dummy.json"

type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
}

export type BookingFormValues = z.infer<typeof formBookingSchema>

export function useBookingForm() {
  const router = useRouter()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formBookingSchema),
    defaultValues: {
      reservationOption: "one-way",
      pickUpOption: "location",
      dropOffOption: "location",
      firstname: "",
      lastname: "",
      email: "",
      passenger: 1,
      contactNumber: "",
    },
  })

  const pickUpOption = form.watch("pickUpOption")
  const dropOffOption = form.watch("dropOffOption")
  const pickUpLocation = form.watch("pickUpLocation")
  const dropOffLocation = form.watch("dropOffLocation")

  useEffect(() => {
    form.resetField("pickUpLocation")
  }, [pickUpOption])

  useEffect(() => {
    form.resetField("dropOffLocation")
  }, [dropOffOption])

  // Travel info
  const [travelInfo, setTravelInfo] = useState<MapboxDirectionsResponse | null>(null)
  const [travelError, setTravelError] = useState<string | null>(null)

  useEffect(() => {
    if (!pickUpLocation?.value || !dropOffLocation?.value) {
      setTravelInfo(null)
      setTravelError(null)
      return
    }

    const controller = new AbortController()
    setTravelError(null)

    const params = new URLSearchParams({
      origin: pickUpLocation.value,
      destination: dropOffLocation.value,
    })

    fetch(`/api/mapbox-distance?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setTravelInfo(null)
          setTravelError(data.error)
        } else {
          setTravelInfo(data)
          setTravelError(null)
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setTravelInfo(null)
          setTravelError("Failed to calculate distance")
        }
      })

    return () => controller.abort()
  }, [pickUpLocation?.value, dropOffLocation?.value])

  // Customer matching
  const [matchedCustomer, setMatchedCustomer] = useState<Customer | null>(null)

  const handlePhoneChange = (phone: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(phone)

    const digits = phone.replace(/\D/g, "")
    if (digits.length >= 10) {
      const found = (customers as Customer[]).find(
        (c) => c.phone_number.replace(/\D/g, "") === digits
      )
      if (found) {
        setMatchedCustomer(found)
        form.setValue("firstname", found.firstname)
        form.setValue("lastname", found.lastname)
        form.setValue("email", found.email)
      } else {
        setMatchedCustomer(null)
      }
    } else {
      setMatchedCustomer(null)
    }
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function onSubmit(data: BookingFormValues) {
    setSubmitting(true)
    setSubmitError(null)

    const payload = { ...data, travelInfo }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        setSubmitError(result.error ?? "Something went wrong")
        return
      }

      const encoded = encodeURIComponent(JSON.stringify(result))
      router.push(`/booking/confirmation?data=${encoded}`)
    } catch {
      setSubmitError("Failed to submit booking. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    form.reset()
    setMatchedCustomer(null)
    setSubmitError(null)
  }

  return {
    form,
    pickUpOption,
    dropOffOption,
    matchedCustomer,
    travelInfo,
    travelError,
    submitting,
    submitError,
    handlePhoneChange,
    onSubmit,
    resetForm,
  }
}
