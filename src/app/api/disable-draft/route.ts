import { draftMode } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  draftMode().disable();
  const url = request.nextUrl.searchParams.get("redirect") ?? "/";
  return Response.redirect(new URL(url, request.url));
}
