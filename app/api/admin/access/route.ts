import { NextResponse } from "next/server";

import { isAdminEmail } from "@/features/auth/admin";

type AccessRequestBody = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AccessRequestBody;
  const email = typeof body.email === "string" ? body.email : null;

  return NextResponse.json(
    {
      isAdmin: isAdminEmail(email),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
