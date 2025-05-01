// src/app/api/test-db/route.ts
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`;
    return NextResponse.json({ success: true, time: result[0].now });
  } catch (error: any) {
    console.error("Test DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}