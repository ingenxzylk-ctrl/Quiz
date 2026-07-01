import { NextRequest, NextResponse } from "next/server";
import { moderateImage } from "@/lib/moderation";

export async function POST(request: NextRequest) {
  const { image } = await request.json();

  if (!image) {
    return NextResponse.json({ passed: false, reason: "No image provided" }, { status: 400 });
  }

  const result = await moderateImage(image);
  return NextResponse.json(result);
}
