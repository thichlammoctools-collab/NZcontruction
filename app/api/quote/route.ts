import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service, location, details } = body;

    console.log("=== NEW QUOTE REQUEST RECEIVED ===");
    console.log("Client Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Service Required:", service);
    console.log("Location (NZ):", location);
    console.log("Scope / Details:", details);
    console.log("==================================");

    return NextResponse.json({
      success: true,
      message: "Quote request successfully registered.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing quote request." },
      { status: 500 }
    );
  }
}
