import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const bookings: any[] = [];

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createClient();

  // Get logged-in user if any
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const booking = {
    id: crypto.randomUUID(),
    reference: `BH-${Date.now().toString(36).toUpperCase()}`,
    ...body,
    user_id: user?.id || null,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  // Save to Supabase (if configured)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { error } = await supabase.from("bookings").insert(booking);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    bookings.push(booking);
  }

  // Paystack init (if key present)
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ bookingId: booking.id, reference: booking.reference, authorization_url: null });
  }

  try {
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        amount: body.deposit * 100,
        reference: booking.reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?ref=${booking.reference}`,
        metadata: { bookingId: booking.id, ...body },
      }),
    });

    const paystackData = await paystackRes.json();
    return NextResponse.json({
      bookingId: booking.id,
      reference: booking.reference,
      authorization_url: paystackData.data?.authorization_url ?? null,
    });
  } catch {
    return NextResponse.json({ bookingId: booking.id, reference: booking.reference, authorization_url: null });
  }
}
