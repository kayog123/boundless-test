import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = [
      "reservationOption",
      "pickUpDatetime",
      "pickUpLocation",
      "dropOffLocation",
      "firstname",
      "lastname",
      "email",
      "contactNumber",
      "passenger",
    ];

    const missing = required.filter((field) => !body[field]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const booking = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(booking, {
      status: 201
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
