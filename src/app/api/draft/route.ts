import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const contentType = searchParams.get("content_type");

  // Validate the secret
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to the appropriate page
  const pathMap: Record<string, string> = {
    resource: `/resources/${slug}`,
    partner: `/partners/${slug}`,
    announcement: `/announcements/${slug}`,
    page: `/${slug}`,
  };

  const path = contentType && pathMap[contentType] ? pathMap[contentType] : "/";
  redirect(path);
}
