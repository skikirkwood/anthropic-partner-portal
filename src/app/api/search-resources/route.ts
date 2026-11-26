import { NextRequest, NextResponse } from "next/server";
import { searchResources } from "@/lib/contentful";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const resources = await searchResources(q);
    return NextResponse.json({
      results: resources.map((r) => ({
        title: r.title,
        slug: r.slug,
        description: r.description || "",
        resourceType: r.resourceType,
      })),
    });
  } catch (err) {
    console.error("Resource search failed:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
