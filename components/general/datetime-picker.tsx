"use client"

import * as React from "react"
import { format, setHours, setMinutes, startOfDay, isToday, isBefore } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import z from "zod"
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formBookingSchema } from "./validations/schema/booking"

interface DateTimePickerProps{
    field: ControllerRenderProps<z.infer<typeof formBookingSchema> , "pickUpDatetime">;
    fieldState: ControllerFieldState;
    className?: string;
}

export function DateTimePicker({ field, fieldState, className }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const raw = field.value;
  const selectedDate = raw instanceof Date && !isNaN(raw.getTime()) ? raw : undefined;
  const timeValue = selectedDate
    ? format(selectedDate, "HH:mm")
    : "10:30";

  const clampToNow = (date: Date) => {
    if (isToday(date) && isBefore(date, new Date())) {
      return new Date();
    }
    return date;
  };

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;
    const current = selectedDate ?? new Date();
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const merged = clampToNow(setMinutes(setHours(day, hours), minutes));
    field.onChange(merged);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const current = selectedDate ?? new Date();
    const merged = clampToNow(setMinutes(setHours(current, hours), minutes));
    field.onChange(merged);
  };

  const today = startOfDay(new Date())

  return (
    <FieldGroup className="max-w-md flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-optional"
              className="w-32 justify-between font-normal"
            >
              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              defaultMonth={selectedDate}
              onSelect={handleDateSelect}
              disabled={{ before: today }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          value={timeValue}
          min={selectedDate && isToday(selectedDate) ? format(new Date(), "HH:mm") : undefined}
          onChange={handleTimeChange}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
