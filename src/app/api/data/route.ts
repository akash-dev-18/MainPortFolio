import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

// Fallback: read from local data.json if Supabase has no data yet
const localDataPath = path.join(process.cwd(), "data.json");

async function getLocalData() {
  try {
    const raw = await fs.readFile(localDataPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", 1)
      .single();

    if (!error && data?.data) {
      return NextResponse.json(data.data);
    }

    // Fallback to local file
    const localData = await getLocalData();
    if (localData) {
      // Seed Supabase with local data on first access
      await supabase.from("site_data").upsert({ id: 1, data: localData, updated_at: new Date().toISOString() });
      return NextResponse.json(localData);
    }

    return NextResponse.json({ error: "No data found" }, { status: 404 });
  } catch (err) {
    console.error("GET /api/data error:", err);
    // Last resort fallback
    const localData = await getLocalData();
    if (localData) return NextResponse.json(localData);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    if (password !== "akash.45") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Save to Supabase
    const { error } = await supabase
      .from("site_data")
      .upsert({ id: 1, data, updated_at: new Date().toISOString() });

    if (error) {
      console.error("Supabase write error:", error);
      // Fallback: try local file
      await fs.writeFile(localDataPath, JSON.stringify(data, null, 2), "utf8");
      return NextResponse.json({ success: true, source: "local" });
    }

    return NextResponse.json({ success: true, source: "supabase" });
  } catch (err) {
    console.error("POST /api/data error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
