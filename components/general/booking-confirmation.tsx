"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { CircleCheck, MapPin, Plane, Calendar, Clock, User2, Mail, Phone, Users } from "lucide-react"
import Link from "next/link"

interface BookingData {
  reservationOption: string
  pickUpDatetime: string
  pickUpOption: string
  pickUpLocation: { label: string; value: string }
  dropOffOption: string
  dropOffLocation: { label: string; value: string }
  firstname: string
  lastname: string
  email: string
  contactNumber: string
  passenger: number
}

export function BookingConfirmation({ data }: { data: BookingData }) {
  const pickUpDate = new Date(data.pickUpDatetime)
  const isAirportPickUp = data.pickUpOption === "airport"
  const isAirportDropOff = data.dropOffOption === "airport"

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex flex-col items-center gap-3 py-4">
        <CircleCheck className="size-12 text-green-500" />
        <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {data.firstname}! Your reservation has been submitted.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm font-medium text-muted-foreground">Reservation Type</span>
          <span className="text-sm font-semibold capitalize">{data.reservationOption}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Pick Up</h3>
          <div className="flex items-start gap-3">
            {isAirportPickUp ? <Plane className="size-4 mt-0.5 text-muted-foreground" /> : <MapPin className="size-4 mt-0.5 text-muted-foreground" />}
            <div>
              <p className="text-sm">{data.pickUpLocation.label}</p>
              <p className="text-xs text-muted-foreground capitalize">{data.pickUpOption}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm">{format(pickUpDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm">{format(pickUpDate, "h:mm a")}</span>
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <h3 className="text-sm font-semibold">Drop Off</h3>
          <div className="flex items-start gap-3">
            {isAirportDropOff ? <Plane className="size-4 mt-0.5 text-muted-foreground" /> : <MapPin className="size-4 mt-0.5 text-muted-foreground" />}
            <div>
              <p className="text-sm">{data.dropOffLocation.label}</p>
              <p className="text-xs text-muted-foreground capitalize">{data.dropOffOption}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <h3 className="text-sm font-semibold">Contact Information</h3>
          <div className="flex items-center gap-3">
            <User2 className="size-4 text-muted-foreground" />
            <span className="text-sm">{data.firstname} {data.lastname}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-sm">{data.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground" />
            <span className="text-sm">{data.contactNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-sm">{data.passenger} passenger{data.passenger > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button asChild variant="outline">
          <Link href="/">Book Another Ride</Link>
        </Button>
      </div>
    </div>
  )
}
