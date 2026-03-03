import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action, id } = body;
    
    if (password !== "akash.45") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "get") {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase messages read error:", error);
        return NextResponse.json({ messages: [] });
      }

      return NextResponse.json({ messages: messages || [] });

    } else if (action === "delete" && id) {
      const { error } = await supabase.from("messages").delete().eq("id", id);

      if (error) {
        console.error("Supabase message delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
      }

      // Return updated list
      const { data: remaining } = await supabase
        .from("messages")
        .select("*")
        .order("date", { ascending: false });

      return NextResponse.json({ success: true, messages: remaining || [] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
