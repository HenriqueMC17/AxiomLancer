import { NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";

export const GET = withAuth(async () => {
  const state = Database.getState();
  return NextResponse.json({ rules: state.rules });
});