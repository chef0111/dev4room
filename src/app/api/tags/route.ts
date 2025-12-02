import { NextRequest, NextResponse } from "next/server";
import { getTags } from "@/data-access/repositories/tag.repository";
import { TagSchemaDTO, TagDTO } from "@/data-access/dto/tag.dto";
import { db } from "@/database/drizzle";
import { tag } from "@/database/schema";
import { eq } from "drizzle-orm";

// GET: Fetch tags
export async function GET(request: NextRequest) {
  try {
    // get the query parameters from the URL (e.g., http://localhost:3000/api/tags?page=2&pageSize=20&searchQuery=React)
    const { searchParams } = request.nextUrl;

    // get the parameters from the URL 
    // [ || "1" : if "page" does not exist, use 1 as default]
    // [parseInt(..., 10) : convert string to number (base 10)]
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const searchQuery = searchParams.get("searchQuery") || "";

    // call repositories
    const { tags, total } = await getTags({ page, pageSize, searchQuery });

    // return response
    return NextResponse.json({ success: true, data: { tags, total } });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags." },
      { status: 500 },
    );
  }
}

