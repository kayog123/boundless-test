import z from "zod";

export const formBookingSchema = z.object({
    reservationOption: z.enum(["one-way", "hourly"] as const, {
        error: "Please select a reservation option.",
    }),
    pickUpDatetime: z.date({
        message: "Please select a pick-up date and time.",
    }),
    dropOffOption: z.enum(["location", "airport"] as const, {
        error: "Please select a drop-off option.",
    }),
    pickUpOption: z.enum(["location", "airport"] as const, {
        error: "Please select a pick-up option.",
    }),
    pickUpLocation: z.object({
        label: z.string().min(1, "Pick-up location is required."),
        value: z.string().min(1, "Pick-up location is required."),
        description: z.string().optional(),
    }, { message: "Please select a pick-up location." }),
    dropOffLocation: z.object({
        label: z.string().min(1, "Drop-off location is required."),
        value: z.string().min(1, "Drop-off location is required."),
        description: z.string().optional(),
    }, { message: "Please select a drop-off location." }),
    passenger: z.number().min(1, "There must be at least 1 passenger.").max(100, "There can be at most 100 passengers."),
    email: z.string().email("Invalid email address."),
    firstname: z.string().min(2, "Firstname must be at least 2 characters.").max(50, "Firstname must be at most 50 characters."),
    lastname: z.string().min(2, "Lastname must be at least 2 characters.").max(50, "Lastname must be at most 50 characters."),
    contactNumber: z.string().min(7, "Contact number must be at least 7 characters."),
})
