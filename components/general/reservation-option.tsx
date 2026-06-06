import { useEffect, useState } from "react"


import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import z from "zod";
import { ChevronLeftCircle, Hourglass } from "lucide-react"
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { formBookingSchema } from "./validations/schema/booking";

interface ReservationOptionProps extends ControllerRenderProps<z.infer<typeof formBookingSchema>, "reservationOption"> {
    fieldState: ControllerFieldState;
    className?: string;
}
export function ReservationOption({ className, value, onChange, onBlur, fieldState }: ReservationOptionProps) {
  const [internalValue, setInternalValue] = useState<string>(value ?? "location")
  
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    const selectedValue = value ?? internalValue

    const handleValueChange = (newValue: string) => {
        if (onChange) {
            onChange(newValue)
        }
        setInternalValue(newValue)
    }
    
  return (
    <Tabs value={selectedValue} onValueChange={handleValueChange} className={cn("w-[400px]", className)}>
     <TabsList className="w-full">
        <TabsTrigger value="one-way">
          <ChevronLeftCircle />
          One-way
        </TabsTrigger>
        <TabsTrigger value="hourly">
          <Hourglass />
          Hourly
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
 
