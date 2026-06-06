"use client"

import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
import { useBookingForm } from "@/app/booking/useBookingForm"

export function BookingForm() {
  const {
    form,
    pickUpOption,
    dropOffOption,
    matchedCustomer,
    submitting,
    submitError,
    handlePhoneChange,
    onSubmit,
    resetForm,
  } = useBookingForm()

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
        {submitError && (
          <p className="text-sm text-destructive mt-2">{submitError}</p>
        )}
        <Field orientation="horizontal" className="mt-5">
          <Button type="button" variant="outline" disabled={submitting} onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo" disabled={submitting}>
            {submitting ? "Submitting..." : "Continue"}
          </Button>
        </Field>
      </form>
    </div>
  )
}
