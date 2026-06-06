"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { formBookingSchema } from "../validations/schema/booking"
import { ReservationOption } from "../reservation-option"
import { DateTimePicker } from "../datetime-picker"
import SearchLocation from "../search-location"
import ChooseLocation from "../choose-location"
import PhoneIntlInput from "../phone-intl-input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { User2, Mail, Hash, CircleCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import customers from "@/data/dummy.json"
import { MapboxDirectionsResponse } from "@/lib/type"

type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
}

export function BookingForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formBookingSchema>>({
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

  const pickUpOption = form.watch("pickUpOption");
  const dropOffOption = form.watch("dropOffOption");

  useEffect(() => {
    form.resetField("pickUpLocation");
  }, [pickUpOption]);

  useEffect(() => {
    form.resetField("dropOffLocation");
  }, [dropOffOption]);

  const [matchedCustomer, setMatchedCustomer] = useState<Customer | null>(null);
  const [travelInfo, setTravelInfo] = useState<MapboxDirectionsResponse | null>(null);
  const [travelError, setTravelError] = useState<string | null>(null);

  const pickUpLocation = form.watch("pickUpLocation");
  const dropOffLocation = form.watch("dropOffLocation");

  useEffect(() => {
    if (!pickUpLocation?.value || !dropOffLocation?.value) {
      setTravelInfo(null);
      setTravelError(null);
      return;
    }

    const controller = new AbortController();
    setTravelError(null);

    const params = new URLSearchParams({
      origin: pickUpLocation.value,
      destination: dropOffLocation.value,
    });

    fetch(`/api/mapbox-distance?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setTravelInfo(null);
          setTravelError(data.error);
        } else {
          setTravelInfo(data);
          setTravelError(null);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setTravelInfo(null);
          setTravelError("Failed to calculate distance");
        }
      });

    return () => controller.abort();
  }, [pickUpLocation?.value, dropOffLocation?.value]);

  const handlePhoneChange = (phone: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(phone);

    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      const found = (customers as Customer[]).find(
        (c) => c.phone_number.replace(/\D/g, '') === digits
      );
      if (found) {
        setMatchedCustomer(found);
        form.setValue("firstname", found.firstname);
        form.setValue("lastname", found.lastname);
        form.setValue("email", found.email);
      } else {
        setMatchedCustomer(null);
      }
    } else {
      setMatchedCustomer(null);
    }
  };

  function onSubmit(data: z.infer<typeof formBookingSchema>) {
    const payload = { ...data, travelInfo }
    const encoded = encodeURIComponent(JSON.stringify(payload))
    router.push(`/booking/confirmation?data=${encoded}`)
  }

  return (
        <div className="w-full">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="reservationOption"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Let's get on our way
                  </FieldLabel>
                  <ReservationOption {...field} fieldState={fieldState} className="w-full" />
                </Field>
              )}
            />

            <FieldGroup className="gap-y-2">
              <FieldLabel htmlFor="form-rhf-demo-title">
                Pick Up
              </FieldLabel>
              <Controller
                name="pickUpDatetime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <DateTimePicker field={field} fieldState={fieldState} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="pickUpOption"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ChooseLocation {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="pickUpLocation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <SearchLocation
                      {...field}
                      placeholder="Search pick up location..."
                      className="rounded-md"
                      locationType={pickUpOption}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="gap-y-2">
              <FieldLabel htmlFor="form-rhf-demo-title">
                Drop off
              </FieldLabel>
              <Controller
                name="dropOffOption"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ChooseLocation {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="dropOffLocation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <SearchLocation
                      {...field}
                      placeholder="Search drop off location..."
                      className="rounded-md"
                      locationType={dropOffOption}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="gap-y-2">
              <FieldLabel htmlFor="form-rhf-demo-title">
                Contact Information
              </FieldLabel>
              <Controller
                name="contactNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <PhoneIntlInput
                          name={field.name}
                          value={field.value}
                          onChange={(phone) => handlePhoneChange(phone, field.onChange)}
                          onBlur={field.onBlur}
                          className="w-full"
                        />
                      </div>
                      {matchedCustomer && (
                        <CircleCheck className="size-5 text-green-500 shrink-0" />
                      )}
                    </div>
                    {!fieldState.invalid && !matchedCustomer && (
                      <FieldDescription>We don&apos;t have that phone number on file. Please provide additional contact information.</FieldDescription>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* ====== USER INFORMATION ====== */}
            {!matchedCustomer && (
            <FieldGroup>
              <Field className="flex flex-row space-x-2">
                <Controller
                  name="firstname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroup>
                        <InputGroupInput {...field} id="input-group-firstname" type="text" placeholder="Firstname" />
                        <InputGroupAddon align="inline-start">
                          <User2 />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroup>
                        <InputGroupInput {...field} id="input-group-lastname" type="text" placeholder="Lastname" />
                        <InputGroupAddon align="inline-start">
                          <User2 />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupInput {...field} id="input-group-url" placeholder="Email address" type="email" />
                      <InputGroupAddon align="inline-start">
                        <Mail />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            )}

              <Field>
                <FieldDescription>How many passengers are expected for the trip?</FieldDescription>
                <Controller
                  name="passenger"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroup>
                        <InputGroupInput {...field} id="input-group-passenger" type="number" placeholder="passengers" />
                        <InputGroupAddon align="inline-start">
                          <Hash />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>
          </FieldGroup>
          <Field orientation="horizontal" className="mt-5">
            <Button type="button" variant="outline" onClick={() => { form.reset(); setMatchedCustomer(null); }}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Continue
            </Button>
          </Field>
        </form>
        </div>
  )
}
