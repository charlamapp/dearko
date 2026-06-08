import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = adminClient()
  const { error } = await supabase.from("reservations").insert({
    date:            body.date,
    start_time:      body.startTime,
    duration:        body.duration,
    service:         body.service,
    event_type:      body.eventType,
    location:        body.location,
    guest_count:     body.guestCount,
    notes:           body.notes || null,
    name:            body.name,
    email:           body.email,
    phone:           body.phone,
    company:         body.company || null,
    estimated_price: body.estimatedPrice,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
