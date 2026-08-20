import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function GET(request: NextRequest) {
  try {
    const latitude = request.nextUrl.searchParams.get("latitude");
    const longitude = request.nextUrl.searchParams.get("longitude");

    if (!latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          message: "latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const backendUrl =
      `${BACKEND_URL}/api/nearby` +
      `?latitude=${encodeURIComponent(latitude)}` +
      `&longitude=${encodeURIComponent(longitude)}`;

    console.log("Proxy → Flask:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: false,
        message: text || "Backend returned invalid JSON",
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Next.js proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Cannot connect to Flask backend.",
      },
      { status: 503 }
    );
  }
}
